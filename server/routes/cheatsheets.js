const express = require('express');
const router = express.Router();
const Cheatsheet = require('../models/Cheatsheet');
const auth = require('../middleware/auth');

// Get all cheatsheets
router.get('/', auth, async (req, res) => {
  try {
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
    const cheatsheets = await Cheatsheet.find({ subject: req.params.subject });
    res.json(cheatsheets);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;
