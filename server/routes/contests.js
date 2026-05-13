const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const ContestRegistration = require('../models/ContestRegistration');
const Exam = require('../models/Exam');
const Question = require('../models/Question');
const User = require('../models/User');
const { v4: uuidv4 } = require('uuid');

// Helper to get today's contest date (at 00:00:00 for uniqueness)
const getContestDate = () => {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d;
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
    
    const now = new Date();
    const start = new Date(); start.setHours(20, 30, 0, 0); // 8:30 PM
    const end = new Date(); end.setHours(21, 0, 0, 0);   // 9:00 PM

    let status = 'upcoming'; // upcoming, live, ended
    if (now >= start && now <= end) status = 'live';
    else if (now > end) status = 'ended';

    res.json({ 
      status, 
      registered: !!registered,
      startTime: start,
      endTime: end
    });
  } catch (err) { res.status(500).send('Server Error'); }
});

// @desc    Start/Join the live contest (Only 8:30-9:00 PM)
router.get('/join', auth, async (req, res) => {
  try {
    const now = new Date();
    const start = new Date(); start.setHours(20, 30, 0, 0);
    const end = new Date(); end.setHours(21, 0, 0, 0);

    if (now < start || now > end) return res.status(403).json({ message: 'Contest is only live between 8:30 PM and 9:00 PM.' });

    const contestDate = getContestDate();
    const registered = await ContestRegistration.findOne({ user_id: req.user.id, contest_date: contestDate });
    if (!registered) return res.status(403).json({ message: 'You must register before the contest starts.' });

    // Same logic as today's exam but fixed 20 questions
    const questions = await Question.aggregate([{ $sample: { size: 20 } }]);
    
    const exam = new Exam({
      exam_id: uuidv4(),
      user_id: req.user.id,
      type: 'contest',
      duration: 30,
      questions: questions.map(q => ({ question_id: q.question_id, correct_option: q.correct_option }))
    });

    await exam.save();
    res.json({ exam_id: exam.exam_id, questions: questions.map(q => ({ ...q, correct_option: undefined })) });
  } catch (err) { res.status(500).send('Server Error'); }
});

// @desc    Get Contest Insights / Leaderboard
router.get('/leaderboard', auth, async (req, res) => {
  try {
    const today = getContestDate();
    const results = await Exam.find({ type: 'contest', date: { $gte: today } })
      .sort({ score: -1, completed_at: 1 })
      .limit(10);

    // Fetch user names for results
    const leaderboard = await Promise.all(results.map(async (r) => {
      const u = await User.findOne({ user_id: r.user_id });
      return { name: u?.name || 'User', score: r.score, time: r.completed_at };
    }));

    res.json(leaderboard);
  } catch (err) { res.status(500).send('Server Error'); }
});

module.exports = router;
