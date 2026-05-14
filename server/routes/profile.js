const express = require('express');
const router = express.Router();
const User = require('../models/User');
const auth = require('../middleware/auth');

// @route   GET api/profile
// @desc    Get current user profile
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    const user = await User.findOneAndUpdate(
      { user_id: req.user.id },
      { last_active: new Date() },
      { new: true }
    ).select('-password_hash');
    res.json(user);
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
      .select('name questions_solved rank_points');
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
