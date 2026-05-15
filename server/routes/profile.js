const express = require('express');
const router = express.Router();
const User = require('../models/User');
const auth = require('../middleware/auth');
const GlobalSettings = require('../models/GlobalSettings');

const Exam = require('../models/Exam');

// Helper to calculate streak
const calculateStreak = (exams) => {
  if (!exams.length) return 0;
  const uniqueDays = [...new Set(exams.map(e => new Date(e.date).toDateString()))]
    .map(d => new Date(d))
    .sort((a, b) => b - a);

  let streak = 0;
  let current = new Date();
  current.setHours(0, 0, 0, 0);

  // If didn't play today, check if played yesterday to continue streak
  const lastPlayed = uniqueDays[0];
  if (current - lastPlayed > 86400000) return 0; 

  for (let i = 0; i < uniqueDays.length; i++) {
    const diff = (current - uniqueDays[i]) / 86400000;
    if (diff === streak || diff === streak - 1) {
      streak++;
    } else {
      break;
    }
  }
  return streak;
};

// @route   GET api/profile
// @desc    Get current user profile
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    let user = await User.findOneAndUpdate(
      { user_id: req.user.id },
      { last_active: new Date() },
      { new: true }
    );

    // Fix for older users: If trial_end_date is missing, set it based on created_at
    if (user && !user.trial_end_date) {
      user.trial_end_date = new Date(new Date(user.created_at).getTime() + 3 * 24 * 60 * 60 * 1000);
      await user.save();
    }

    const settings = await GlobalSettings.findOne();
    
    // Calculate Stats
    const allExams = await Exam.find({ user_id: req.user.id, completed: true });
    const examsTaken = allExams.length;
    const avgScore = examsTaken > 0 
      ? Math.round(allExams.reduce((acc, curr) => acc + (curr.score / curr.questions.length), 0) / examsTaken * 100) 
      : 0;
    
    const streak = calculateStreak(allExams);

    const userData = user ? user._doc : {};
    if (userData.password_hash) delete userData.password_hash;

    res.json({
      ...userData,
      premium_service_enabled: settings ? settings.premium_service_enabled : false,
      examsTaken,
      avgScore,
      streak
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   PUT api/profile/settings
// @desc    Update level and language preferences
// @access  Private
router.put('/settings', auth, async (req, res) => {
  const { level, language1, language2, subject_preference } = req.body;
  try {
    let user = await User.findOne({ user_id: req.user.id });
    if (user) {
      if (level) user.level = level;
      if (language1) user.language1 = language1;
      if (language2) user.language2 = language2;
      if (subject_preference) user.subject_preference = subject_preference;
      
      await user.save();
      return res.json(user);
    }
    res.status(404).json({ msg: 'User not found' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET api/profile/ranking
// @desc    Get global ranking leaderboard
// @access  Public
router.get('/ranking', async (req, res) => {
  try {
    const topUsers = await User.find()
      .sort({ questions_solved: -1 })
      .limit(10)
      .select('name questions_solved rank_points level');
    res.json(topUsers);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET api/profile/active-count
// @desc    Get count of active users for dashboard
router.get('/active-count', async (req, res) => {
  try {
    const fifteenMinsAgo = new Date(Date.now() - 15 * 60 * 1000);
    const realCount = await User.countDocuments({ last_active: { $gte: fifteenMinsAgo } });
    
    // Return only the exact number of users active in the last 15 minutes
    res.json({ count: realCount || 1 }); 
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

module.exports = router;
