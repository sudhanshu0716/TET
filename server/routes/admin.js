const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const Question = require('../models/Question');
const ContestSettings = require('../models/ContestSettings');
const Exam = require('../models/Exam');
const ContestRegistration = require('../models/ContestRegistration');

// Middleware to check if user is admin
const adminAuth = async (req, res, next) => {
  try {
    const user = await User.findOne({ user_id: req.user.id });
    if (user.role !== 'admin') return res.status(403).json({ message: 'Admin access denied' });
    next();
  } catch (err) { res.status(500).send('Server Error'); }
};

// @desc    Get Admin Stats
router.get('/stats', [auth, adminAuth], async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalQuestions = await Question.countDocuments();
    
    // Daily active users (users who took an exam today)
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const dailyActive = await Exam.distinct('user_id', { date: { $gte: today } });

    // Contest registrations for today
    const contestRegs = await ContestRegistration.countDocuments({ contest_date: today });

    res.json({
      totalUsers,
      totalQuestions,
      dailyActive: dailyActive.length,
      contestRegs
    });
  } catch (err) { res.status(500).send('Server Error'); }
});

// @desc    Get Question Breakdown by Subject
router.get('/question-breakdown', [auth, adminAuth], async (req, res) => {
  try {
    const subjects = ['pedagogy', 'hindi', 'english', 'math', 'evs', 'science', 'social', 'sanskrit', 'urdu'];
    const breakdown = await Promise.all(
      subjects.map(async (s) => ({
        subject: s,
        count: await Question.countDocuments({ subject: s })
      }))
    );
    res.json(breakdown);
  } catch (err) { res.status(500).send('Server Error'); }
});

// @desc    Get Recent App Activity
router.get('/recent-activity', [auth, adminAuth], async (req, res) => {
  try {
    const recentExams = await Exam.find()
      .sort({ date: -1 })
      .limit(10)
      .populate('user_id', 'name email');
    res.json(recentExams);
  } catch (err) { res.status(500).send('Server Error'); }
});

// @desc    Get Current Contest Settings
router.get('/contest-settings', [auth, adminAuth], async (req, res) => {
  try {
    const today = new Date(); today.setHours(0,0,0,0);
    let settings = await ContestSettings.findOne({ contest_date: today });
    if (!settings) {
      settings = { start_time: "20:30", duration: 50 };
    }
    res.json(settings);
  } catch (err) { res.status(500).send('Server Error'); }
});

// @desc    Update Contest Time
router.post('/contest-settings', [auth, adminAuth], async (req, res) => {
  const { start_time, duration } = req.body;
  try {
    const today = new Date(); today.setHours(0,0,0,0);
    let settings = await ContestSettings.findOne({ contest_date: today });
    
    if (settings) {
      settings.start_time = start_time;
      settings.duration = duration;
    } else {
      // If no settings exist yet for today, we might need questions too
      const questions = await Question.aggregate([{ $sample: { size: 50 } }]);
      settings = new ContestSettings({
        contest_date: today,
        start_time,
        duration: duration || 50,
        questions: questions.map(q => q.question_id)
      });
    }
    
    await settings.save();
    res.json(settings);
  } catch (err) { res.status(500).send('Server Error'); }
});

const GlobalSettings = require('../models/GlobalSettings');

// @desc    Get Global Premium Toggle
router.get('/premium-status', [auth, adminAuth], async (req, res) => {
  try {
    let settings = await GlobalSettings.findOne();
    if (!settings) {
      settings = new GlobalSettings({ premium_service_enabled: false });
      await settings.save();
    }
    res.json(settings);
  } catch (err) { res.status(500).send('Server Error'); }
});

// @desc    Update Global System Message
router.post('/set-system-message', [auth, adminAuth], async (req, res) => {
  const { message } = req.body;
  try {
    let settings = await GlobalSettings.findOne();
    if (!settings) settings = new GlobalSettings();
    
    settings.system_message = message || '';
    settings.last_updated = new Date();
    await settings.save();
    res.json(settings);
  } catch (err) { res.status(500).send('Server Error'); }
});

// @desc    Toggle Global Maintenance Mode
router.post('/toggle-maintenance', [auth, adminAuth], async (req, res) => {
  const { enabled } = req.body;
  try {
    let settings = await GlobalSettings.findOne();
    if (!settings) settings = new GlobalSettings();
    
    settings.is_maintenance_mode = enabled;
    settings.last_updated = new Date();
    await settings.save();
    res.json(settings);
  } catch (err) { res.status(500).send('Server Error'); }
});

// @desc    Toggle Global Premium Status
router.post('/toggle-premium', [auth, adminAuth], async (req, res) => {
  const { enabled } = req.body;
  try {
    let settings = await GlobalSettings.findOne();
    if (!settings) settings = new GlobalSettings();
    
    settings.premium_service_enabled = enabled;
    settings.last_updated = new Date();
    await settings.save();
    res.json(settings);
  } catch (err) { res.status(500).send('Server Error'); }
});

// @desc    Inspect specific user by email
router.get('/inspect-user/:email', [auth, adminAuth], async (req, res) => {
  try {
    const user = await User.findOne({ email: req.params.email.toLowerCase().trim() }).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (err) { res.status(500).send('Server Error'); }
});

// @desc    Manually grant premium to user
router.post('/grant-premium', [auth, adminAuth], async (req, res) => {
  const { email, months } = req.body;
  try {
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) return res.status(404).json({ message: 'User not found' });

    const endDate = new Date();
    endDate.setMonth(endDate.getMonth() + (months || 1));
    
    user.is_premium = true;
    user.subscription_end_date = endDate;
    await user.save();
    
    res.json({ message: `Premium granted to ${user.name} until ${endDate.toLocaleDateString()}`, user });
  } catch (err) { res.status(500).send('Server Error'); }
});

// @desc    Remove duplicate questions from the database
router.post('/remove-duplicates', [auth, adminAuth], async (req, res) => {
  try {
    const duplicates = await Question.aggregate([
      { $group: { _id: '$question_text', count: { $sum: 1 }, docs: { $push: '$_id' } } },
      { $match: { count: { $gt: 1 } } }
    ]);
    
    let idsToDelete = [];
    duplicates.forEach(dup => {
      const [, ...rest] = dup.docs; 
      idsToDelete = idsToDelete.concat(rest);
    });
    
    if (idsToDelete.length > 0) {
      const result = await Question.deleteMany({ _id: { $in: idsToDelete } });
      return res.json({ message: `Successfully deleted ${result.deletedCount} duplicate questions.`, deletedCount: result.deletedCount });
    } else {
      return res.json({ message: 'No duplicate questions found.', deletedCount: 0 });
    }
  } catch (err) { 
    console.error('Duplicate removal error:', err);
    res.status(500).send('Server Error'); 
  }
});

// @desc    Reset Leaderboard (Zero out all points)
router.post('/reset-leaderboard', [auth, adminAuth], async (req, res) => {
  try {
    await User.updateMany({}, { $set: { rank_points: 0, questions_solved: 0 } });
    res.json({ message: 'Leaderboard successfully reset. All user points have been zeroed.' });
  } catch (err) { res.status(500).send('Server Error'); }
});

// @desc    Clear Idle/Abandoned Exams
router.post('/clear-idle-exams', [auth, adminAuth], async (req, res) => {
  try {
    const twoDaysAgo = new Date(Date.now() - 2 * 24 * 60 * 60 * 1000);
    const result = await Exam.deleteMany({ completed: false, date: { $lt: twoDaysAgo } });
    res.json({ message: `Successfully deleted ${result.deletedCount} abandoned exams.` });
  } catch (err) { res.status(500).send('Server Error'); }
});

// @desc    Revoke Premium and Kill Trial
router.post('/revoke-premium', [auth, adminAuth], async (req, res) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email: email.toLowerCase().trim() });
    if (!user) return res.status(404).json({ message: 'User not found' });
    
    user.is_premium = false;
    user.subscription_end_date = null;
    user.trial_end_date = new Date('2020-01-01'); // Force deep into the past
    await user.save();
    
    res.json({ message: `Premium revoked and trial ended for ${user.email}.` });
  } catch (err) { res.status(500).send('Server Error'); }
});

// @desc    Delete all load test users and their exam/contest records
router.post('/clean-loadtest-users', [auth, adminAuth], async (req, res) => {
  try {
    // Find all users with email matching /loadtest_/ or ending in @tetload.com
    const testUsers = await User.find({
      $or: [
        { email: /loadtest_/i },
        { email: /@tetload\.com$/i }
      ]
    }).select('user_id');

    if (testUsers.length === 0) {
      return res.json({
        message: 'No load test users found in the database.',
        deletedUsersCount: 0,
        deletedExamsCount: 0,
        deletedRegsCount: 0
      });
    }

    const testUserIds = testUsers.map(u => u.user_id);
    const mongoIds = testUsers.map(u => u._id);

    // Cascade delete
    const examResult = await Exam.deleteMany({ user_id: { $in: testUserIds } });
    const regResult = await ContestRegistration.deleteMany({ user_id: { $in: testUserIds } });
    const userResult = await User.deleteMany({ _id: { $in: mongoIds } });

    res.json({
      message: `Successfully cleaned up ${userResult.deletedCount} load test users and their related data.`,
      deletedUsersCount: userResult.deletedCount,
      deletedExamsCount: examResult.deletedCount,
      deletedRegsCount: regResult.deletedCount
    });
  } catch (err) {
    console.error('Error cleaning loadtest users:', err);
    res.status(500).send('Server Error');
  }
});

// @desc    Reset a user's password (Admin) — returns a one-time temp password
router.post('/reset-user-password', [auth, adminAuth], async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ message: 'Email is required' });

  try {
    const user = await User.findOne({ email: email.toLowerCase().trim() });
    if (!user) return res.status(404).json({ message: 'No user found with this email' });

    // Generate a readable temporary password: TET@ + 6 random digits
    const tempPassword = 'TET@' + Math.floor(100000 + Math.random() * 900000).toString();

    // Hash and save it
    const salt = await bcrypt.genSalt(10);
    user.password_hash = await bcrypt.hash(tempPassword, salt);
    await user.save();

    res.json({
      message: `Password reset successfully for ${user.name} (${user.email})`,
      tempPassword,
      note: 'Share this temporary password with the user. They should change it after logging in.'
    });
  } catch (err) {
    console.error('Reset password error:', err);
    res.status(500).send('Server Error');
  }
});

// @desc    Get All Users with Stats (Admin)
router.get('/users', [auth, adminAuth], async (req, res) => {
  try {
    const users = await User.find().sort({ created_at: -1 }).select('-password_hash');
    
    // Efficiently aggregate exam counts and average score per user
    const examStats = await Exam.aggregate([
      { $match: { completed: true } },
      { $group: {
          _id: "$user_id",
          examsTaken: { $sum: 1 },
          avgScore: { $avg: { $cond: [ { $gt: [ { $size: "$questions" }, 0 ] }, { $divide: [ "$score", { $size: "$questions" } ] }, 0 ] } }
        }
      }
    ]);
    
    const statsMap = {};
    examStats.forEach(stat => {
      statsMap[stat._id] = {
        examsTaken: stat.examsTaken,
        avgScore: Math.round((stat.avgScore || 0) * 100)
      };
    });

    const usersWithStats = users.map(user => {
      const stats = statsMap[user.user_id] || { examsTaken: 0, avgScore: 0 };
      return {
        ...user._doc,
        examsTaken: stats.examsTaken,
        avgScore: stats.avgScore
      };
    });

    res.json(usersWithStats);
  } catch (err) {
    console.error('Error fetching users:', err);
    res.status(500).send('Server Error');
  }
});

// @desc    Edit user name, level, and languages (Admin)
router.put('/users/:id', [auth, adminAuth], async (req, res) => {
  const { name, level, language1, language2 } = req.body;
  if (!name || name.trim() === '') {
    return res.status(400).json({ message: 'Name is required' });
  }
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    
    user.name = name.trim();
    if (level && (level === 'primary' || level === 'junior')) {
      user.level = level;
    }
    if (language1) user.language1 = language1;
    if (language2) user.language2 = language2;
    await user.save();
    
    res.json({ message: 'User updated successfully', user });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

// @desc    Delete user (Admin)
router.delete('/users/:id', [auth, adminAuth], async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    
    // Cascade deletion
    await Exam.deleteMany({ user_id: user.user_id });
    await ContestRegistration.deleteMany({ user_id: user.user_id });
    await User.deleteOne({ _id: req.params.id });
    
    res.json({ message: 'User deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

// @route   POST api/admin/reset-subject-stats
// @desc    Remove stats for specific subjects for a user
// @access  Private (Admin only)
router.post('/reset-subject-stats', [auth, adminAuth], async (req, res) => {
  const { email, subjects } = req.body;
  if (!email || !subjects || !Array.isArray(subjects) || subjects.length === 0) {
    return res.status(400).json({ message: 'Email and subjects array are required' });
  }

  try {
    const normalizedEmail = email.toLowerCase().trim();
    const user = await User.findOne({ email: normalizedEmail });
    if (!user) {
      return res.status(404).json({ message: `User with email ${email} not found` });
    }

    const normalizedSubjects = subjects.map(s => s.toLowerCase().trim());

    // 1. Find all question IDs belonging to the target subjects
    const targetQuestions = await Question.find({ subject: { $in: normalizedSubjects } }).select('question_id');
    const targetQuestionIds = new Set(targetQuestions.map(q => q.question_id));

    if (targetQuestionIds.size === 0) {
      return res.status(400).json({ message: `No questions found for the specified subjects: ${subjects.join(', ')}` });
    }

    // 2. Fetch all exams for this user
    const exams = await Exam.find({ user_id: user.user_id });
    
    let examsUpdatedCount = 0;
    let examsDeletedCount = 0;
    let answersRemovedCount = 0;

    for (let exam of exams) {
      const originalAnswersCount = exam.answers ? exam.answers.length : 0;
      
      // Filter out target questions from exam questions and answers
      if (exam.questions && exam.questions.length > 0) {
        exam.questions = exam.questions.filter(qid => !targetQuestionIds.has(qid));
      }
      
      if (exam.answers && exam.answers.length > 0) {
        const remainingAnswers = exam.answers.filter(ans => !targetQuestionIds.has(ans.question_id));
        answersRemovedCount += (originalAnswersCount - remainingAnswers.length);
        exam.answers = remainingAnswers;
      }

      // If the exam has no remaining questions/answers, delete it
      if (!exam.questions || exam.questions.length === 0 || !exam.answers || exam.answers.length === 0) {
        await Exam.deleteOne({ _id: exam._id });
        examsDeletedCount++;
      } else {
        // If the exam is completed, we must recalculate its score
        if (exam.completed) {
          exam.score = exam.answers.filter(ans => ans.is_correct).length;
        }
        await exam.save();
        examsUpdatedCount++;
      }
    }

    // 3. Recalculate user statistics
    const remainingCompletedExams = await Exam.find({ user_id: user.user_id, completed: true });
    
    let newQuestionsSolved = 0;
    let newRankPoints = 0;

    remainingCompletedExams.forEach(exam => {
      newQuestionsSolved += (exam.answers ? exam.answers.length : 0);
      newRankPoints += (exam.score || 0) * 10;
    });

    const oldQuestionsSolved = user.questions_solved;
    const oldRankPoints = user.rank_points;

    user.questions_solved = newQuestionsSolved;
    user.rank_points = newRankPoints;
    await user.save();

    res.json({
      message: `Successfully reset stats for subjects: ${subjects.join(', ')}`,
      user: {
        name: user.name,
        email: user.email,
        old_questions_solved: oldQuestionsSolved,
        new_questions_solved: newQuestionsSolved,
        old_rank_points: oldRankPoints,
        new_rank_points: newRankPoints
      },
      stats: {
        examsUpdated: examsUpdatedCount,
        examsDeleted: examsDeletedCount,
        answersRemoved: answersRemovedCount
      }
    });

  } catch (err) {
    console.error('Reset subject stats error:', err);
    res.status(500).send('Server Error');
  }
});

// Helper to get GitHub Axios Client
const getGithubClient = async () => {
  let token = process.env.GITHUB_TOKEN;
  let owner = process.env.GITHUB_OWNER;
  let repo = process.env.GITHUB_REPO;

  const settings = await GlobalSettings.findOne();
  if (settings) {
    if (!token && settings.github_token) token = settings.github_token;
    if (!owner && settings.github_owner) owner = settings.github_owner;
    if (!repo && settings.github_repo) repo = settings.github_repo;
  }

  if (!token || !owner || !repo) {
    throw new Error('GitHub integration is not fully configured. Please set GITHUB_TOKEN, GITHUB_OWNER, and GITHUB_REPO.');
  }

  const axios = require('axios');
  return {
    token,
    owner,
    repo,
    client: axios.create({
      baseURL: `https://api.github.com/repos/${owner}/${repo}`,
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/vnd.github+json',
        'X-GitHub-Api-Version': '2022-11-28',
        'User-Agent': 'TET-Prep-App-Automation-Panel'
      }
    })
  };
};

// @route   GET api/admin/automation/config
// @desc    Get GitHub integration status
router.get('/automation/config', [auth, adminAuth], async (req, res) => {
  try {
    let token = process.env.GITHUB_TOKEN || '';
    let owner = process.env.GITHUB_OWNER || '';
    let repo = process.env.GITHUB_REPO || '';

    const settings = await GlobalSettings.findOne();
    if (settings) {
      if (!token && settings.github_token) token = settings.github_token;
      if (!owner && settings.github_owner) owner = settings.github_owner;
      if (!repo && settings.github_repo) repo = settings.github_repo;
    }

    res.json({
      is_configured: !!(token && owner && repo),
      owner,
      repo,
      has_token: !!token
    });
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

// @route   POST api/admin/automation/config
// @desc    Save GitHub integration settings
router.post('/automation/config', [auth, adminAuth], async (req, res) => {
  const { token, owner, repo } = req.body;
  try {
    let settings = await GlobalSettings.findOne();
    if (!settings) settings = new GlobalSettings();

    if (token) settings.github_token = token;
    if (owner) settings.github_owner = owner;
    if (repo) settings.github_repo = repo;
    settings.last_updated = new Date();
    
    await settings.save();
    res.json({ message: 'GitHub configuration updated successfully!' });
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

// @route   GET api/admin/automation/workflows
// @desc    Get GitHub action workflows and runs
router.get('/automation/workflows', [auth, adminAuth], async (req, res) => {
  try {
    const { client } = await getGithubClient();
    const workflowsRes = await client.get('/actions/workflows');
    const runsRes = await client.get('/actions/runs?per_page=15');
    res.json({
      workflows: workflowsRes.data.workflows || [],
      runs: runsRes.data.workflow_runs || []
    });
  } catch (err) {
    console.error('Workflows Fetch Error:', err.message);
    res.status(400).json({ message: err.message });
  }
});

// @route   POST api/admin/automation/workflows/:workflowId/trigger
// @desc    Trigger GitHub workflow dispatch
router.post('/automation/workflows/:workflowId/trigger', [auth, adminAuth], async (req, res) => {
  const { ref } = req.body;
  try {
    const { client } = await getGithubClient();
    await client.post(`/actions/workflows/${req.params.workflowId}/dispatches`, {
      ref: ref || 'main'
    });
    res.json({ message: 'Workflow trigger request sent successfully!' });
  } catch (err) {
    console.error('Workflow Trigger Error:', err.message);
    res.status(400).json({ message: err.response?.data?.message || err.message });
  }
});

// @route   GET api/admin/automation/runs/:runId/details
// @desc    Get detailed jobs and steps for a workflow run
router.get('/automation/runs/:runId/details', [auth, adminAuth], async (req, res) => {
  try {
    const { client } = await getGithubClient();
    const runRes = await client.get(`/actions/runs/${req.params.runId}`);
    const jobsRes = await client.get(`/actions/runs/${req.params.runId}/jobs`);
    res.json({
      run: runRes.data,
      jobs: jobsRes.data.jobs || []
    });
  } catch (err) {
    console.error('Run Details Error:', err.message);
    res.status(400).json({ message: err.message });
  }
});

// @route   GET api/admin/automation/branches
// @desc    Get repository branches
router.get('/automation/branches', [auth, adminAuth], async (req, res) => {
  try {
    const { client } = await getGithubClient();
    const branchesRes = await client.get('/branches');
    res.json(branchesRes.data.map(b => b.name));
  } catch (err) {
    console.error('Branches Fetch Error:', err.message);
    res.status(400).json({ message: err.message });
  }
});

// @route   GET api/admin/automation/runs/:runId/artifacts
// @desc    Get artifacts list for a workflow run (load test reports etc.)
router.get('/automation/runs/:runId/artifacts', [auth, adminAuth], async (req, res) => {
  try {
    const { client } = await getGithubClient();
    const artifactsRes = await client.get(`/actions/runs/${req.params.runId}/artifacts`);
    res.json(artifactsRes.data.artifacts || []);
  } catch (err) {
    console.error('Artifacts Fetch Error:', err.message);
    res.status(400).json({ message: err.message });
  }
});

// @route   GET api/admin/automation/artifacts/:artifactId/download
// @desc    Download an artifact zip, extract load-test-report.html and return its HTML content
router.get('/automation/artifacts/:artifactId/download', [auth, adminAuth], async (req, res) => {
  try {
    const { client } = await getGithubClient();
    const response = await client.get(`/actions/artifacts/${req.params.artifactId}/zip`, {
      responseType: 'arraybuffer'
    });

    // Use adm-zip to extract HTML from the zip buffer
    const AdmZip = require('adm-zip');
    const zip = new AdmZip(Buffer.from(response.data));
    const entries = zip.getEntries();

    // Look for load-test-report.html or any .html file
    let htmlContent = null;
    let summaryJson = null;
    for (const entry of entries) {
      if (entry.entryName.endsWith('.html')) {
        htmlContent = entry.getData().toString('utf8');
      }
      if (entry.entryName === 'summary.json') {
        summaryJson = entry.getData().toString('utf8');
      }
    }

    if (!htmlContent) {
      return res.status(404).json({ message: 'No HTML report found in artifact.' });
    }

    res.json({
      html: htmlContent,
      summary: summaryJson ? JSON.parse(summaryJson) : null
    });
  } catch (err) {
    console.error('Artifact Download Error:', err.message);
    res.status(400).json({ message: err.response?.data?.message || err.message });
  }
});

// @route   POST api/admin/set-default-ui
// @desc    Set the default UI version (v1/v2/v3) globally for all users
router.post('/set-default-ui', [auth, adminAuth], async (req, res) => {
  const { ui_version } = req.body;
  if (!['v1', 'v2', 'v3'].includes(ui_version)) {
    return res.status(400).json({ message: 'Invalid UI version. Must be v1, v2, or v3.' });
  }
  try {
    let settings = await GlobalSettings.findOne();
    if (!settings) settings = new GlobalSettings();

    settings.default_ui_version = ui_version;
    settings.last_updated = new Date();
    await settings.save();
    res.json({ message: `Default UI version set to ${ui_version} for all users.`, default_ui_version: ui_version });
  } catch (err) {
    console.error('Set Default UI Error:', err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET api/admin/global-settings-public
// @desc    Get public global settings (default UI version) — accessible by any authenticated user
router.get('/global-settings-public', auth, async (req, res) => {
  try {
    const settings = await GlobalSettings.findOne();
    res.json({
      default_ui_version: settings?.default_ui_version || 'v1'
    });
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

module.exports = router;


