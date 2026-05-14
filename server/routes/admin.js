const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const User = require('../models/User');
const Question = require('../models/Question');
const ContestSettings = require('../models/ContestSettings');
const Exam = require('../models/Exam');

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

module.exports = router;
