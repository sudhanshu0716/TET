const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');
const User = require('../models/User');
const Question = require('../models/Question');
const Exam = require('../models/Exam');
const auth = require('../middleware/auth');

// @route   GET api/revision/stats
// @desc    Get user stats for incorrect questions and bookmarks
router.get('/stats', auth, async (req, res) => {
  try {
    const user = await User.findOne({ user_id: req.user.id });
    if (!user) return res.status(404).json({ message: 'User not found' });

    const wrongAnswers = user.wrong_answers || [];
    const activeCount = wrongAnswers.filter(w => w.status === 'active').length;
    const correctedCount = wrongAnswers.filter(w => w.status === 'corrected').length;
    const totalBookmarks = (user.bookmarks || []).length;

    const totalMistakes = activeCount + correctedCount;
    const progress = totalMistakes > 0 ? Math.round((correctedCount / totalMistakes) * 100) : 0;

    res.json({
      active_mistakes: activeCount,
      corrected_mistakes: correctedCount,
      total_bookmarks: totalBookmarks,
      progress
    });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

// @route   GET api/revision/wrong-questions
// @desc    Get active incorrect questions with metadata (frequency count, added_at)
router.get('/wrong-questions', auth, async (req, res) => {
  try {
    const user = await User.findOne({ user_id: req.user.id });
    if (!user) return res.status(404).json({ message: 'User not found' });

    const activeWrong = (user.wrong_answers || []).filter(w => w.status === 'active');
    if (activeWrong.length === 0) {
      return res.json([]);
    }

    const qids = activeWrong.map(w => w.question_id);
    const questions = await Question.find({ question_id: { $in: qids } });
    const questionsMap = new Map(questions.map(q => [q.question_id, q]));

    const result = activeWrong
      .map(w => {
        const q = questionsMap.get(w.question_id);
        if (!q) return null;
        return {
          question: q,
          count: w.count,
          added_at: w.added_at
        };
      })
      .filter(item => item !== null)
      .sort((a, b) => new Date(b.added_at) - new Date(a.added_at)); // Latest mistakes first

    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

// @route   GET api/revision/bookmarked-questions
// @desc    Get populated list of bookmarked questions
router.get('/bookmarked-questions', auth, async (req, res) => {
  try {
    const user = await User.findOne({ user_id: req.user.id });
    if (!user) return res.status(404).json({ message: 'User not found' });

    const bookmarkIds = user.bookmarks || [];
    if (bookmarkIds.length === 0) {
      return res.json([]);
    }

    const questions = await Question.find({ question_id: { $in: bookmarkIds } });
    
    // Sort in reverse order of bookmarking (assuming last pushed is latest)
    const sortedQuestions = bookmarkIds
      .map(qid => questions.find(q => q.question_id === qid))
      .filter(q => q !== undefined)
      .reverse();

    res.json(sortedQuestions);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

// @route   GET api/revision/bookmarked-ids
// @desc    Get list of bookmarked question IDs (for fast lookup in exam views)
router.get('/bookmarked-ids', auth, async (req, res) => {
  try {
    const user = await User.findOne({ user_id: req.user.id });
    if (!user) return res.status(404).json({ message: 'User not found' });

    res.json({ bookmarked_ids: user.bookmarks || [] });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

// @route   POST api/revision/bookmark/toggle
// @desc    Add or remove a question from bookmarks
router.post('/bookmark/toggle', auth, async (req, res) => {
  try {
    const { question_id } = req.body;
    if (!question_id) {
      return res.status(400).json({ message: 'Question ID is required' });
    }

    const user = await User.findOne({ user_id: req.user.id });
    if (!user) return res.status(404).json({ message: 'User not found' });

    if (!user.bookmarks) user.bookmarks = [];

    const index = user.bookmarks.indexOf(question_id);
    let bookmarked = false;

    if (index !== -1) {
      user.bookmarks.splice(index, 1);
    } else {
      user.bookmarks.push(question_id);
      bookmarked = true;
    }

    await user.save();
    res.json({ bookmarked, bookmarksCount: user.bookmarks.length });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

// @route   POST api/revision/generate-remedial
// @desc    Generate a custom quiz of 10, 20, or 50 questions from active incorrect questions
router.post('/generate-remedial', auth, async (req, res) => {
  try {
    const count = parseInt(req.body.count) || 10;
    
    const user = await User.findOne({ user_id: req.user.id });
    if (!user) return res.status(404).json({ message: 'User not found' });

    const activeWrong = (user.wrong_answers || []).filter(w => w.status === 'active');
    if (activeWrong.length === 0) {
      return res.status(400).json({ message: 'No incorrect questions available in your queue.' });
    }

    // Shuffle active incorrect question IDs
    const shuffled = activeWrong
      .map(w => w.question_id)
      .sort(() => 0.5 - Math.random());
    
    // Select up to `count` questions
    const selectedQids = shuffled.slice(0, count);

    // Fetch question details
    const questions = await Question.find({ question_id: { $in: selectedQids } });
    
    // Maintain the random ordering from `selectedQids`
    const questionsMap = new Map(questions.map(q => [q.question_id, q]));
    const orderedQuestions = selectedQids
      .map(qid => questionsMap.get(qid))
      .filter(q => q !== undefined);

    if (orderedQuestions.length === 0) {
      return res.status(404).json({ message: 'No valid questions could be fetched.' });
    }

    // Create a new remedial exam
    const exam = new Exam({
      exam_id: uuidv4(),
      user_id: req.user.id,
      exam_type: 'remedial',
      questions: orderedQuestions.map(q => q.question_id),
      duration: orderedQuestions.length, // 1 minute per question
      date: new Date()
    });

    await exam.save();
    res.json({ exam, questions: orderedQuestions });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
