const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const ContestRegistration = require('../models/ContestRegistration');
const Exam = require('../models/Exam');
const Question = require('../models/Question');
const User = require('../models/User');
const ContestSettings = require('../models/ContestSettings');
const { v4: uuidv4 } = require('uuid');
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

// Helper to get today's contest date in IST (at 00:00:00 for uniqueness)
const getContestDate = () => {
  const d = new Date();
  const istOffset = 5.5 * 60 * 60 * 1000; // IST is UTC + 5:30
  const istDate = new Date(d.getTime() + (d.getTimezoneOffset() * 60000) + istOffset);
  istDate.setHours(0, 0, 0, 0);
  return istDate;
};

// Helper to get or create today's contest settings (consistent questions for all)
const getOrUpdateContestSettings = async () => {
  const contestDate = getContestDate();
  let settings = await ContestSettings.findOne({ contest_date: contestDate });
  if (!settings) {
    // Pick 50 random questions to fix for the day, prioritizing the main language
    const questions = await Question.aggregate([
      { $match: { language: 'hindi' } },
      { $sample: { size: 50 } }
    ]);
    settings = new ContestSettings({
      contest_date: contestDate,
      duration: 50,
      questions: questions.map(q => q.question_id)
    });
    await settings.save();
  }
  return settings;
};

// @desc    Register for today's contest
router.post('/register', auth, async (req, res) => {
  try {
    const hasAccess = await checkAccess(req.user.id);
    if (!hasAccess) {
      return res.status(403).json({ message: 'Trial expired. Please upgrade to Premium to participate in Contests.' });
    }

    const contestDate = getContestDate();
    const existing = await ContestRegistration.findOne({ user_id: req.user.id, contest_date: contestDate });
    if (existing) return res.status(400).json({ message: 'Already registered for today.' });

    const registration = new ContestRegistration({ user_id: req.user.id, contest_date: contestDate });
    await registration.save();
    res.json({ message: 'Successfully registered!' });
  } catch (err) { res.status(500).send('Server Error'); }
});

// @desc    Get contest status (Is it live? Am I registered?)
router.get('/status', auth, async (req, res) => {
  try {
    const contestDate = getContestDate();
    const registered = await ContestRegistration.findOne({ user_id: req.user.id, contest_date: contestDate });
    
    // Get settings (times and questions)
    const settings = await getOrUpdateContestSettings();

    // Get current time in IST
    const d = new Date();
    const istOffset = 5.5 * 60 * 60 * 1000;
    const nowIST = new Date(d.getTime() + (d.getTimezoneOffset() * 60000) + istOffset);

    // Parse start time HH:mm
    const [startH, startM] = settings.start_time.split(':').map(Number);
    const start = new Date(nowIST); start.setHours(startH, startM, 0, 0);
    const end = new Date(start.getTime() + settings.duration * 60000);

    let status = 'upcoming'; 
    if (nowIST >= start && nowIST <= end) status = 'live';
    else if (nowIST > end) status = 'ended';

    // Check for previous attempt
    const attempted = await Exam.exists({ 
      user_id: req.user.id, 
      exam_type: 'contest', 
      date: { $gte: contestDate } 
    });

    // Get total registered count for today
    const registrationCount = await ContestRegistration.countDocuments({ contest_date: contestDate });

    res.json({ 
      status, 
      registered: !!registered,
      attempted: !!attempted,
      startTime: start,
      endTime: end,
      duration: settings.duration,
      registrationCount
    });
  } catch (err) { res.status(500).send('Server Error'); }
});

// @desc    Start/Join the live contest
router.get('/join', auth, async (req, res) => {
  try {
    const hasAccess = await checkAccess(req.user.id);
    if (!hasAccess) {
      return res.status(403).json({ message: 'Trial expired. Please upgrade to Premium to join the contest.' });
    }

    const settings = await getOrUpdateContestSettings();
    const d = new Date();
    const istOffset = 5.5 * 60 * 60 * 1000;
    const nowIST = new Date(d.getTime() + (d.getTimezoneOffset() * 60000) + istOffset);

    const [startH, startM] = settings.start_time.split(':').map(Number);
    const start = new Date(nowIST); start.setHours(startH, startM, 0, 0);
    const end = new Date(start.getTime() + settings.duration * 60000);

    if (nowIST < start || nowIST > end) return res.status(403).json({ message: 'Contest is not live.' });

    const contestDate = getContestDate();
    let registered = await ContestRegistration.findOne({ user_id: req.user.id, contest_date: contestDate });
    if (!registered) {
      registered = new ContestRegistration({ user_id: req.user.id, contest_date: contestDate });
      await registered.save();
      await ContestSettings.updateOne(
        { contest_date: contestDate },
        { $inc: { registrationCount: 1 } }
      );
    }

    // Single Attempt Check
    const existingAttempt = await Exam.findOne({ 
      user_id: req.user.id, 
      exam_type: 'contest', 
      date: { $gte: contestDate } 
    });
    if (existingAttempt) return res.status(403).json({ message: 'You have already attempted today\'s contest. Only one attempt is allowed.' });

    // Use fixed questions for today
    let questions = await Question.find({ question_id: { $in: settings.questions } });
    
    // If stored question_ids are stale (e.g. DB was reseeded), regenerate
    if (!questions || questions.length === 0 || questions.length < settings.questions.length) {
      await ContestSettings.deleteOne({ contest_date: getContestDate() });
      const freshSettings = await getOrUpdateContestSettings();
      questions = await Question.find({ question_id: { $in: freshSettings.questions } });
      
      const exam = new Exam({
        exam_id: uuidv4(),
        user_id: req.user.id,
        exam_type: 'contest',
        duration: freshSettings.duration,
        questions: freshSettings.questions
      });

      await exam.save();
      return res.json({ exam, questions });
    }
    
    const exam = new Exam({
      exam_id: uuidv4(),
      user_id: req.user.id,
      exam_type: 'contest',
      duration: settings.duration,
      questions: settings.questions
    });

    await exam.save();
    res.json({ exam, questions });
  } catch (err) { res.status(500).send('Server Error'); }
});

// @desc    Get Contest Leaderboard
router.get('/leaderboard', auth, async (req, res) => {
  try {
    const today = getContestDate();
    const results = await Exam.find({ 
      exam_type: 'contest', 
      date: { $gte: today },
      completed: true 
    })
      .sort({ score: -1, date: 1 })
      .limit(20);

    const userIds = results.map(r => r.user_id);
    const users = await User.find({ user_id: { $in: userIds } });
    const userMap = new Map(users.map(u => [u.user_id, u]));

    const examsToday = await Exam.find({
      user_id: { $in: userIds },
      completed: true,
      date: { $gte: today }
    });

    const solvedTodayMap = new Map();
    for (const ex of examsToday) {
      const count = ex.answers ? ex.answers.length : 0;
      solvedTodayMap.set(ex.user_id, (solvedTodayMap.get(ex.user_id) || 0) + count);
    }

    const leaderboard = results.map((r) => {
      const u = userMap.get(r.user_id);
      return { 
        name: u?.name || 'User', 
        level: u?.level || 'primary',
        score: r.score, 
        timeSpent: r.duration, // Optional: show duration
        date: r.date,
        last_active: u?.last_active || null,
        solvedToday: solvedTodayMap.get(r.user_id) || 0
      };
    });

    res.json(leaderboard);
  } catch (err) { res.status(500).send('Server Error'); }
});

// @desc    Get list of participants registered for today
router.get('/participants', auth, async (req, res) => {
  try {
    const today = getContestDate();
    const regs = await ContestRegistration.find({ contest_date: today });
    const userIds = regs.map(r => r.user_id);
    const users = await User.find({ user_id: { $in: userIds } }).select('name role');
    
    // Sort so admins don't always appear at top, but preserve anonymity if needed
    // For now just names
    res.json(users.map(u => ({ name: u.name, isAdmin: u.role === 'admin' })));
  } catch (err) { res.status(500).send('Server Error'); }
});

module.exports = router;
