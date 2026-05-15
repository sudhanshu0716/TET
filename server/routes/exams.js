const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');
const Exam = require('../models/Exam');
const Question = require('../models/Question');
const User = require('../models/User');
const auth = require('../middleware/auth');

const GlobalSettings = require('../models/GlobalSettings');

// Helper to check if user has access
const checkAccess = async (userId) => {
  const settings = await GlobalSettings.findOne();
  if (!settings || !settings.premium_service_enabled) return true;

  const user = await User.findOne({ user_id: userId });
  if (!user || user.role === 'admin') return true;

  const isTrialValid = new Date(user.trial_end_date) > new Date();
  const isSubValid = user.subscription_end_date && new Date(user.subscription_end_date) > new Date();
  
  return user.is_premium || isTrialValid || isSubValid;
};

// @route   GET api/exams/today
// @desc    Get/Create a daily exam based on profile settings (Level, L1, L2)
router.get('/today', auth, async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // 5 Exam Limit Check
    const examCount = await Exam.countDocuments({
      user_id: req.user.id,
      date: { $gte: today }
    });

    if (examCount >= 5) {
      return res.status(403).json({ message: 'Daily limit reached. You can take max 5 exams per day.' });
    }

    const qCount = parseInt(req.query.count) || 30;
    const duration = parseInt(req.query.duration) || 30;

    const hasAccess = await checkAccess(req.user.id);
    if (!hasAccess) {
      return res.status(403).json({ message: 'Trial expired. Please upgrade to Premium to continue practicing.' });
    }

    const user = await User.findOne({ user_id: req.user.id });
    if (!user) return res.status(404).json({ msg: 'User not found' });

    // Build subject list based on user's profile
    const userSubjects = ['pedagogy', user.language1.toLowerCase(), user.language2.toLowerCase()];
    if (user.level === 'primary') {
      userSubjects.push('math', 'evs');
    } else {
      userSubjects.push(user.subject_preference === 'science' ? 'science' : 'social');
    }

    // Fetch questions ONLY from user's relevant subjects and matching language
    const lang = req.query.lang || 'hindi';
    const questions = await Question.aggregate([
      { 
        $match: { 
          level: user.level, 
          subject: { $in: userSubjects },
          $or: [
            { subject: 'english', language: 'english' },
            { subject: 'hindi', language: 'hindi' },
            { subject: { $nin: ['english', 'hindi'] }, language: lang }
          ]
        } 
      },
      { $sample: { size: qCount } }
    ]);

    let exam = new Exam({
      exam_id: uuidv4(),
      user_id: req.user.id,
      exam_type: 'daily',
      questions: questions.map(q => q.question_id),
      duration: duration,
      date: new Date()
    });

    await exam.save();
    res.json({ exam, questions });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

// @route   GET api/exams/full-mock
// @desc    Create a full 150-question mock exam (3 hours duration)
router.get('/full-mock', auth, async (req, res) => {
  try {
    const hasAccess = await checkAccess(req.user.id);
    if (!hasAccess) {
      return res.status(403).json({ message: 'Trial expired. Please upgrade to Premium to continue practicing.' });
    }

    const user = await User.findOne({ user_id: req.user.id });
    
    // Distribution: 30 CDP, 30 L1, 30 L2, 60 Subject/EVS-Math
    const lang = req.query.lang || 'hindi';
    const cdp = await Question.aggregate([{ $match: { subject: 'pedagogy', level: user.level, language: lang } }, { $sample: { size: 30 } }]);
    
    // For languages (L1/L2), we want to match the subject specifically
    // Hindi subject questions are always 'hindi' language, English always 'english'
    const l1 = await Question.aggregate([
      { $match: { 
        subject: user.language1.toLowerCase(), 
        level: user.level,
        $or: [
          { subject: 'english', language: 'english' },
          { subject: 'hindi', language: 'hindi' },
          { subject: { $nin: ['english', 'hindi'] }, language: lang }
        ]
      } }, 
      { $sample: { size: 30 } }
    ]);
    const l2 = await Question.aggregate([
      { $match: { 
        subject: user.language2.toLowerCase(), 
        level: user.level,
        $or: [
          { subject: 'english', language: 'english' },
          { subject: 'hindi', language: 'hindi' },
          { subject: { $nin: ['english', 'hindi'] }, language: lang }
        ]
      } }, 
      { $sample: { size: 30 } }
    ]);
    
    let subQ = [];
    if (user.level === 'primary') {
      const math = await Question.aggregate([{ $match: { subject: 'math', level: 'primary', language: lang } }, { $sample: { size: 30 } }]);
      const evs = await Question.aggregate([{ $match: { subject: 'evs', level: 'primary', language: lang } }, { $sample: { size: 30 } }]);
      subQ = [...math, ...evs];
    } else {
      const subject = user.subject_preference === 'science' ? 'science' : 'social';
      subQ = await Question.aggregate([{ $match: { subject, level: 'junior', language: lang } }, { $sample: { size: 60 } }]);
    }

    const questions = [...cdp, ...l1, ...l2, ...subQ];

    const exam = new Exam({
      exam_id: uuidv4(),
      user_id: req.user.id,
      exam_type: 'full-mock',
      questions: questions.map(q => q.question_id),
      duration: 150, // 150 minutes
      date: new Date()
    });

    await exam.save();
    res.json({ exam, questions });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

router.get('/subject/:subject', auth, async (req, res) => {
  try {
    const hasAccess = await checkAccess(req.user.id);
    if (!hasAccess) {
      return res.status(403).json({ message: 'Trial expired. Please upgrade to Premium to continue practicing.' });
    }

    const qCount = parseInt(req.query.count) || 30;
    const duration = parseInt(req.query.duration) || 30;

    const user = await User.findOne({ user_id: req.user.id });
    const lang = req.query.lang || 'hindi';
    const questions = await Question.aggregate([
      { $match: { subject: req.params.subject.toLowerCase(), level: user.level, language: lang } },
      { $sample: { size: qCount } }
    ]);

    const exam = new Exam({
      exam_id: uuidv4(),
      user_id: req.user.id,
      exam_type: 'subject-wise',
      questions: questions.map(q => q.question_id),
      duration: duration,
      date: new Date()
    });

    await exam.save();
    res.json({ exam, questions });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

// @route   GET api/exams/important
// @desc    Get most important questions (Asked in multiple years)
router.get('/important', auth, async (req, res) => {
  try {
    const hasAccess = await checkAccess(req.user.id);
    if (!hasAccess) {
      return res.status(403).json({ message: 'Trial expired. Please upgrade to Premium to continue practicing.' });
    }

    const user = await User.findOne({ user_id: req.user.id });
    
    // Build subject list based on user's profile
    const userSubjects = ['pedagogy', user.language1.toLowerCase(), user.language2.toLowerCase()];
    if (user.level === 'primary') {
      userSubjects.push('math', 'evs');
    } else {
      userSubjects.push(user.subject_preference === 'science' ? 'science' : 'social');
    }

    const lang = req.query.lang || 'hindi';
    const questions = await Question.aggregate([
      { $match: { 
        level: user.level,
        subject: { $in: userSubjects },
        year: { $exists: true, $ne: null },
        $or: [
          { subject: 'english', language: 'english' },
          { subject: 'hindi', language: 'hindi' },
          { subject: { $nin: ['english', 'hindi'] }, language: lang }
        ]
      }},
      { $sample: { size: 30 } }
    ]);

    if (questions.length === 0) {
      // Fallback to random from user's subjects with language filter
      const fallback = await Question.aggregate([
        { $match: { 
          level: user.level, 
          subject: { $in: userSubjects },
          $or: [
            { subject: 'english', language: 'english' },
            { subject: 'hindi', language: 'hindi' },
            { subject: { $nin: ['english', 'hindi'] }, language: lang }
          ]
        } },
        { $sample: { size: 30 } }
      ]);
      questions.push(...fallback);
    }

    const exam = new Exam({
      exam_id: uuidv4(),
      user_id: req.user.id,
      exam_type: 'important',
      questions: questions.map(q => q.question_id),
      duration: 30,
      date: new Date()
    });

    await exam.save();
    res.json({ exam, questions });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

// @route   POST api/exams/submit/:examId
// @desc    Submit exam and update user ranking stats
router.post('/submit/:examId', auth, async (req, res) => {
  try {
    const { answers } = req.body;
    const exam = await Exam.findOne({ exam_id: req.params.examId, user_id: req.user.id });

    if (!exam || exam.completed) return res.status(404).json({ msg: 'Exam not found or already submitted' });

    let score = 0;
    const graded = [];
    for (const ans of answers) {
      const q = await Question.findOne({ question_id: ans.question_id });
      if (!q) continue; // Skip if question not found
      const is_correct = q.correct_answer === ans.selected_option;
      if (is_correct) score++;
      graded.push({ ...ans, is_correct });
    }

    exam.score = score;
    exam.answers = graded;
    exam.completed = true;
    await exam.save();

    // Update User Stats for Ranking
    const user = await User.findOne({ user_id: req.user.id });
    user.questions_solved += answers.length;
    user.rank_points += (score * 10); // 10 points per correct answer
    await user.save();

    res.json({ exam, user_stats: { questions_solved: user.questions_solved, rank_points: user.rank_points } });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

// @route   GET api/exams/history
// @desc    Get user's previous exam results
router.get('/history', auth, async (req, res) => {
  try {
    const exams = await Exam.find({ user_id: req.user.id, completed: true })
      .sort({ date: -1 })
      .limit(20);
    res.json(exams);
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

// @route   GET api/exams/:examId
router.get('/:examId', auth, async (req, res) => {
  try {
    const exam = await Exam.findOne({ exam_id: req.params.examId, user_id: req.user.id });
    const questions = await Question.find({ question_id: { $in: exam.questions } });
    res.json({ exam, questions });
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

// @route   GET api/exams/insights
// @desc    Get performance insights by subject
router.get('/insights', auth, async (req, res) => {
  try {
    const insights = await Exam.aggregate([
      { $match: { user_id: req.user.id, completed: true } },
      { $unwind: "$answers" },
      {
        $lookup: {
          from: "questions",
          localField: "answers.question_id",
          foreignField: "question_id",
          as: "question"
        }
      },
      { $unwind: "$question" },
      {
        $group: {
          _id: "$question.subject",
          total: { $sum: 1 },
          correct: { $sum: { $cond: ["$answers.is_correct", 1, 0] } }
        }
      }
    ]);
    res.json(insights);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
