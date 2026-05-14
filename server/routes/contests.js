const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const ContestRegistration = require('../models/ContestRegistration');
const Exam = require('../models/Exam');
const Question = require('../models/Question');
const User = require('../models/User');
const ContestSettings = require('../models/ContestSettings');
const { v4: uuidv4 } = require('uuid');

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
    // Pick 20 random questions to fix for the day
    const questions = await Question.aggregate([{ $sample: { size: 20 } }]);
    settings = new ContestSettings({
      contest_date: contestDate,
      questions: questions.map(q => q.question_id)
    });
    await settings.save();
  }
  return settings;
};

// @desc    Register for today's contest
router.post('/register', auth, async (req, res) => {
  try {
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

    res.json({ 
      status, 
      registered: !!registered,
      attempted: !!attempted,
      startTime: start,
      endTime: end,
      duration: settings.duration
    });
  } catch (err) { res.status(500).send('Server Error'); }
});

// @desc    Start/Join the live contest
router.get('/join', auth, async (req, res) => {
  try {
    const settings = await getOrUpdateContestSettings();
    const d = new Date();
    const istOffset = 5.5 * 60 * 60 * 1000;
    const nowIST = new Date(d.getTime() + (d.getTimezoneOffset() * 60000) + istOffset);

    const [startH, startM] = settings.start_time.split(':').map(Number);
    const start = new Date(nowIST); start.setHours(startH, startM, 0, 0);
    const end = new Date(start.getTime() + settings.duration * 60000);

    if (nowIST < start || nowIST > end) return res.status(403).json({ message: 'Contest is not live.' });

    const contestDate = getContestDate();
    const registered = await ContestRegistration.findOne({ user_id: req.user.id, contest_date: contestDate });
    if (!registered) return res.status(403).json({ message: 'You must register before the contest starts.' });

    // Single Attempt Check
    const existingAttempt = await Exam.findOne({ 
      user_id: req.user.id, 
      exam_type: 'contest', 
      date: { $gte: contestDate } 
    });
    if (existingAttempt) return res.status(403).json({ message: 'You have already attempted today\'s contest. Only one attempt is allowed.' });

    // Use fixed questions for today
    const questions = await Question.find({ question_id: { $in: settings.questions } });
    
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

    const leaderboard = await Promise.all(results.map(async (r) => {
      const u = await User.findOne({ user_id: r.user_id });
      return { 
        name: u?.name || 'User', 
        score: r.score, 
        timeSpent: r.duration, // Optional: show duration
        date: r.date 
      };
    }));

    res.json(leaderboard);
  } catch (err) { res.status(500).send('Server Error'); }
});

module.exports = router;
