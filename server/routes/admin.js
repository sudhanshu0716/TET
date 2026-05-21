const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
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
      settings = { start_time: "20:30", duration: 30 };
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
      const questions = await Question.aggregate([{ $sample: { size: 20 } }]);
      settings = new ContestSettings({
        contest_date: today,
        start_time,
        duration,
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

module.exports = router;

