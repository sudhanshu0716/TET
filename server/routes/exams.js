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

    const size = Math.floor(qCount / 5) || 6;

    const l1Subject = (user.language1 || 'hindi').toLowerCase();
    const l2Subject = (user.language2 || 'english').toLowerCase();

    // Separate aggregates for each section (Following 647e588 pattern)
    const cdp = await Question.aggregate([{ $match: { subject: 'pedagogy', level: user.level } }, { $sample: { size: size } }]);
    const l1 = await Question.aggregate([{ $match: { subject: l1Subject, level: user.level } }, { $sample: { size: size } }]);
    const l2 = await Question.aggregate([{ $match: { subject: l2Subject, level: user.level } }, { $sample: { size: size } }]);
    
    let subQ = [];
    if (user.level === 'primary') {
      const math = await Question.aggregate([{ $match: { subject: 'math', level: 'primary' } }, { $sample: { size: size } }]);
      const evs = await Question.aggregate([{ $match: { subject: 'evs', level: 'primary' } }, { $sample: { size: size } }]);
      subQ = [...math, ...evs];
    } else {
      const subject = user.subject_preference === 'science' ? 'science' : 'social';
      subQ = await Question.aggregate([{ $match: { subject, level: 'junior' } }, { $sample: { size: size * 2 } }]);
    }

    const questions = [...cdp, ...l1, ...l2, ...subQ];

    const exam = new Exam({
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
router.get('/full-mock', auth, async (req, res) => {
  try {
    const hasAccess = await checkAccess(req.user.id);
    if (!hasAccess) return res.status(403).json({ message: 'Trial expired.' });

    const user = await User.findOne({ user_id: req.user.id });
    
    const l1Subject = (user.language1 || 'hindi').toLowerCase();
    const l2Subject = (user.language2 || 'english').toLowerCase();
    
    const cdp = await Question.aggregate([{ $match: { subject: 'pedagogy', level: user.level } }, { $sample: { size: 30 } }]);
    const l1 = await Question.aggregate([{ $match: { subject: l1Subject, level: user.level } }, { $sample: { size: 30 } }]);
    const l2 = await Question.aggregate([{ $match: { subject: l2Subject, level: user.level } }, { $sample: { size: 30 } }]);
    
    let subQ = [];
    if (user.level === 'primary') {
      const math = await Question.aggregate([{ $match: { subject: 'math', level: 'primary' } }, { $sample: { size: 30 } }]);
      const evs = await Question.aggregate([{ $match: { subject: 'evs', level: 'primary' } }, { $sample: { size: 30 } }]);
      subQ = [...math, ...evs];
    } else {
      const subject = user.subject_preference === 'science' ? 'science' : 'social';
      subQ = await Question.aggregate([{ $match: { subject, level: 'junior' } }, { $sample: { size: 60 } }]);
    }

    const questions = [...cdp, ...l1, ...l2, ...subQ];

    const exam = new Exam({
      exam_id: uuidv4(),
      user_id: req.user.id,
      exam_type: 'full-mock',
      questions: questions.map(q => q.question_id),
      duration: 150,
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
    if (!hasAccess) return res.status(403).json({ message: 'Trial expired.' });

    const qCount = parseInt(req.query.count) || 30;
    const duration = parseInt(req.query.duration) || 30;
    const user = await User.findOne({ user_id: req.user.id });

    const questions = await Question.aggregate([
      { $match: { subject: req.params.subject.toLowerCase(), level: user.level } },
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


router.post('/submit', auth, async (req, res) => {
  const { exam_id, answers, score } = req.body;
  try {
    let exam = await Exam.findOne({ exam_id, user_id: req.user.id });
    if (!exam) return res.status(404).json({ message: 'Exam not found' });

    exam.answers = answers;
    exam.score = score;
    exam.completed = true;

    await exam.save();
    res.json(exam);
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

// @route   GET api/exams/important
// @desc    Get most important questions (Asked in multiple years)
router.get('/important', auth, async (req, res) => {
  try {
    const user = await User.findOne({ user_id: req.user.id });
    
    // Build subject list based on user's profile
    const userSubjects = ['pedagogy', (user.language1 || 'hindi').toLowerCase(), (user.language2 || 'english').toLowerCase()];
    if (user.level === 'primary') {
      userSubjects.push('math', 'evs');
    } else {
      userSubjects.push(user.subject_preference === 'science' ? 'science' : 'social');
    }

    let questions = await Question.aggregate([
      { $match: { 
        level: user.level,
        subject: { $in: userSubjects },
        year: { $exists: true, $ne: null } 
      } },
      { $sample: { size: 30 } }
    ]);

    if (!questions || questions.length === 0) {
      questions = await Question.aggregate([
        { $match: { 
          level: user.level,
          subject: { $in: userSubjects }
        } },
        { $sample: { size: 30 } }
      ]);
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

router.get('/:examId', auth, async (req, res) => {
  try {
    const exam = await Exam.findOne({ exam_id: req.params.examId, user_id: req.user.id });
    if (!exam) return res.status(404).json({ message: 'Exam not found' });
    const questions = await Question.find({ question_id: { $in: exam.questions } });
    res.json({ exam, questions });
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

module.exports = router; 
