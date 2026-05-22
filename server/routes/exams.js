const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');
const Exam = require('../models/Exam');
const Question = require('../models/Question');
const User = require('../models/User');
const auth = require('../middleware/auth');
const GlobalSettings = require('../models/GlobalSettings');
const axios = require('axios');

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
    const qCount = parseInt(req.query.count) || 50;
    const duration = parseInt(req.query.duration) || 50;

    const hasAccess = await checkAccess(req.user.id);
    if (!hasAccess) {
      return res.status(403).json({ message: 'Trial expired. Please upgrade to Premium to continue practicing.' });
    }

    const user = await User.findOne({ user_id: req.user.id });
    if (!user) return res.status(404).json({ msg: 'User not found' });

    const size = Math.floor(qCount / 5) || 6;

    const lang = (req.query.lang || 'hindi').toLowerCase();
    const l1Subject = (user.language1 || 'hindi').toLowerCase();
    const l2Subject = (user.language2 || 'english').toLowerCase();

    // Separate aggregates for each section (Following 647e588 pattern)
    // Filter by language parameter
    const cdp = await Question.aggregate([{ $match: { subject: 'pedagogy', level: user.level, language: lang } }, { $sample: { size: size } }]);
    const l1 = await Question.aggregate([{ $match: { subject: l1Subject, level: user.level, language: l1Subject } }, { $sample: { size: size } }]);
    const l2 = await Question.aggregate([{ $match: { subject: l2Subject, level: user.level, language: l2Subject } }, { $sample: { size: size } }]);
    
    let subQ = [];
    if (user.level === 'primary') {
      const math = await Question.aggregate([{ $match: { subject: 'math', level: 'primary', language: lang } }, { $sample: { size: size } }]);
      const evs = await Question.aggregate([{ $match: { subject: 'evs', level: 'primary', language: lang } }, { $sample: { size: size } }]);
      subQ = [...math, ...evs];
    } else {
      const subject = user.subject_preference === 'science' ? 'science' : 'social';
      subQ = await Question.aggregate([{ $match: { subject, level: 'junior', language: lang } }, { $sample: { size: size * 2 } }]);
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
    
    const lang = (req.query.lang || 'hindi').toLowerCase();
    const l1Subject = (user.language1 || 'hindi').toLowerCase();
    const l2Subject = (user.language2 || 'english').toLowerCase();
    
    const cdp = await Question.aggregate([{ $match: { subject: 'pedagogy', level: user.level, language: lang } }, { $sample: { size: 30 } }]);
    const l1 = await Question.aggregate([{ $match: { subject: l1Subject, level: user.level, language: l1Subject } }, { $sample: { size: 30 } }]);
    const l2 = await Question.aggregate([{ $match: { subject: l2Subject, level: user.level, language: l2Subject } }, { $sample: { size: 30 } }]);
    
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

    const qCount = parseInt(req.query.count) || 50;
    const duration = parseInt(req.query.duration) || 50;
    const user = await User.findOne({ user_id: req.user.id });
    if (!user) return res.status(404).json({ msg: 'User not found' });

    const lang = (req.query.lang || 'hindi').toLowerCase();
    const targetSubject = req.params.subject.toLowerCase();
    const targetLang = (targetSubject === 'hindi' || targetSubject === 'english') ? targetSubject : lang;

    const questions = await Question.aggregate([
      { $match: { subject: targetSubject, level: user.level, language: targetLang } },
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


router.post(['/submit', '/submit/:examId'], auth, async (req, res) => {
  try {
    const examId = req.params.examId || req.body.exam_id;
    const { answers, score: bodyScore } = req.body;

    let exam = await Exam.findOne({ exam_id: examId, user_id: req.user.id });
    if (!exam) return res.status(404).json({ message: 'Exam not found' });

    if (exam.completed) {
      return res.json({ exam, message: 'Exam already submitted' });
    }

    let score = 0;
    const graded = [];
    if (Array.isArray(answers) && answers.length > 0) {
      const questionIds = answers.map(ans => ans.question_id);
      const questionsList = await Question.find({ question_id: { $in: questionIds } });
      const questionsMap = new Map(questionsList.map(q => [q.question_id, q]));

      for (const ans of answers) {
        const q = questionsMap.get(ans.question_id);
        const is_correct = q ? (q.correct_answer === ans.selected_option) : false;
        if (is_correct) score++;
        graded.push({
          question_id: ans.question_id,
          selected_option: ans.selected_option,
          is_correct
        });
      }
    } else {
      score = bodyScore || 0;
    }

    exam.score = score;
    exam.answers = graded.length ? graded : (answers || []);
    exam.completed = true;

    await exam.save();

    // Update User Stats for Ranking
    const user = await User.findOne({ user_id: req.user.id });
    if (user) {
      user.questions_solved = (user.questions_solved || 0) + (answers ? answers.length : 0);
      user.rank_points = (user.rank_points || 0) + (score * 10);
      await user.save();
    }

    res.json({
      exam,
      user_stats: user ? { questions_solved: user.questions_solved, rank_points: user.rank_points } : {}
    });
  } catch (err) {
    console.error(err);
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
    
    const lang = (req.query.lang || 'hindi').toLowerCase();
    const l1Subject = (user.language1 || 'hindi').toLowerCase();
    const l2Subject = (user.language2 || 'english').toLowerCase();

    // Build general subjects based on user level
    const generalSubjects = ['pedagogy'];
    if (user.level === 'primary') {
      generalSubjects.push('math', 'evs');
    } else {
      generalSubjects.push(user.subject_preference === 'science' ? 'science' : 'social');
    }

    let questions = await Question.aggregate([
      { $match: { 
        level: user.level,
        $or: [
          { subject: { $in: generalSubjects }, language: lang },
          { subject: l1Subject, language: l1Subject },
          { subject: l2Subject, language: l2Subject }
        ],
        year: { $exists: true, $ne: null } 
      } },
      { $sample: { size: 50 } }
    ]);

    if (!questions || questions.length === 0) {
      questions = await Question.aggregate([
        { $match: { 
          level: user.level,
          $or: [
            { subject: { $in: generalSubjects }, language: lang },
            { subject: l1Subject, language: l1Subject },
            { subject: l2Subject, language: l2Subject }
          ]
        } },
        { $sample: { size: 50 } }
      ]);
    }

    const exam = new Exam({
      exam_id: uuidv4(),
      user_id: req.user.id,
      exam_type: 'important',
      questions: questions.map(q => q.question_id),
      duration: 50,
      date: new Date()
    });

    await exam.save();
    res.json({ exam, questions });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

// @route   GET api/exams/year/:year
// @desc    Get/Create a year-wise exam based on level & year
router.get('/year/:year', auth, async (req, res) => {
  try {
    const hasAccess = await checkAccess(req.user.id);
    if (!hasAccess) return res.status(403).json({ message: 'Trial expired.' });

    const targetYear = parseInt(req.params.year);
    const user = await User.findOne({ user_id: req.user.id });
    if (!user) return res.status(404).json({ msg: 'User not found' });

    const lang = (req.query.lang || 'hindi').toLowerCase();
    const l1Subject = (user.language1 || 'hindi').toLowerCase();
    const l2Subject = (user.language2 || 'english').toLowerCase();

    // Build general subjects based on user level
    const generalSubjects = ['pedagogy'];
    if (user.level === 'primary') {
      generalSubjects.push('math', 'evs');
    } else {
      generalSubjects.push(user.subject_preference === 'science' ? 'science' : 'social');
    }

    let questions = await Question.aggregate([
      { $match: { 
        level: user.level,
        $or: [
          { subject: { $in: generalSubjects }, language: lang },
          { subject: l1Subject, language: l1Subject },
          { subject: l2Subject, language: l2Subject }
        ],
        year: targetYear
      } },
      { $sample: { size: 50 } }
    ]);

    // Fallback: if we don't have enough questions for this specific year + level + subjects combination,
    // let's relax the subject filter or just search by year and level
    if (!questions || questions.length === 0) {
      questions = await Question.aggregate([
        { $match: { 
          level: user.level,
          language: lang,
          year: targetYear
        } },
        { $sample: { size: 50 } }
      ]);
    }

    // Secondary fallback: if still 0, just get any 50 questions from that year
    if (!questions || questions.length === 0) {
      questions = await Question.aggregate([
        { $match: { 
          year: targetYear
        } },
        { $sample: { size: 50 } }
      ]);
    }

    if (!questions || questions.length === 0) {
      return res.status(404).json({ message: `No questions found for the year ${targetYear}.` });
    }

    const exam = new Exam({
      exam_id: uuidv4(),
      user_id: req.user.id,
      exam_type: 'year-wise',
      questions: questions.map(q => q.question_id),
      duration: 50,
      date: new Date()
    });

    await exam.save();
    res.json({ exam, questions });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

// @route   GET api/exams/tts
// @desc    TTS proxy to fetch audio stream from Google Translate TTS
router.get('/tts', async (req, res) => {
  try {
    const { text, lang } = req.query;
    if (!text) return res.status(400).send('Text is required');
    const targetLang = (lang || 'hi').toLowerCase();
    const url = `https://translate.googleapis.com/translate_tts?client=gtx&sl=auto&tl=${targetLang}&dt=t&q=${encodeURIComponent(text)}&ie=UTF-8`;

    const response = await axios({
      method: 'get',
      url: url,
      responseType: 'stream'
    });

    res.set({
      'Content-Type': 'audio/mpeg',
      'Transfer-Encoding': 'chunked'
    });
    response.data.pipe(res);
  } catch (err) {
    console.error('TTS Proxy Error:', err.message);
    res.status(500).send('TTS Proxy Error');
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
