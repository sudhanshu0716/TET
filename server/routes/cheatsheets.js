const express = require('express');
const router = express.Router();
const Cheatsheet = require('../models/Cheatsheet');
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

// Get all cheatsheets
router.get('/', auth, async (req, res) => {
  try {
    const hasAccess = await checkAccess(req.user.id);
    if (!hasAccess) {
      return res.status(403).json({ message: 'Trial expired. Please upgrade to Premium to view cheatsheets.' });
    }
    const cheatsheets = await Cheatsheet.find();
    res.json(cheatsheets);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Get cheatsheets by subject
router.get('/subject/:subject', auth, async (req, res) => {
  try {
    const hasAccess = await checkAccess(req.user.id);
    if (!hasAccess) {
      return res.status(403).json({ message: 'Trial expired. Please upgrade to Premium to view cheatsheets.' });
    }
    const cheatsheets = await Cheatsheet.find({ subject: req.params.subject });
    res.json(cheatsheets);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;
