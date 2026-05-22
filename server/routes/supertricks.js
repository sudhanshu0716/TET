const express = require('express');
const router = express.Router();
const SuperTrick = require('../models/SuperTrick');
const auth = require('../middleware/auth');

const GlobalSettings = require('../models/GlobalSettings');
const User = require('../models/User');

const checkAccess = async (userId) => {
  const settings = await GlobalSettings.findOne();
  if (!settings || !settings.premium_service_enabled) return true;

  const user = await User.findOne({ user_id: userId });
  if (!user || user.role === 'admin') return true;

  const isTrialValid = new Date(user.trial_end_date) > new Date();
  const isSubValid = user.subscription_end_date && new Date(user.subscription_end_date) > new Date();
  
  return user.is_premium || isTrialValid || isSubValid;
};

// Get all super tricks
router.get('/', auth, async (req, res) => {
  try {
    const hasAccess = await checkAccess(req.user.id);
    if (!hasAccess) {
      return res.status(403).json({ message: 'Trial expired. Please upgrade to Premium to view Super Tricks.' });
    }
    const tricks = await SuperTrick.find().sort({ created_at: 1 });
    res.json(tricks);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Get super tricks by subject
router.get('/subject/:subject', auth, async (req, res) => {
  try {
    const hasAccess = await checkAccess(req.user.id);
    if (!hasAccess) {
      return res.status(403).json({ message: 'Trial expired. Please upgrade to Premium to view Super Tricks.' });
    }
    const tricks = await SuperTrick.find({ subject: req.params.subject }).sort({ created_at: 1 });
    res.json(tricks);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;
