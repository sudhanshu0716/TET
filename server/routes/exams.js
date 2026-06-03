const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');
const Exam = require('../models/Exam');
const Question = require('../models/Question');
const User = require('../models/User');
const auth = require('../middleware/auth');
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

// @route   GET api/exams/today
// @desc    Get/Create a daily exam based on profile settings (Level, L1, L2)
router.get('/today', auth, async (req, res) => {
  try {
    const qCount = parseInt(req.query.count) || 50;
    const duration = parseInt(req.query.duration) || 50;

    const hasAccess = await checkAccess(req.user.id);
    if (!hasAccess) {
      return res.status(403).json({ message: 'Trial expired. Please upgrade to Premium to continue practicing.' });
    }

    const user = await User.findOne({ user_id: req.user.id });
    if (!user) return res.status(404).json({ msg: 'User not found' });

    const size = Math.floor(qCount / 5) || 6;

    const l1Subject = (user.language1 || 'hindi').toLowerCase();
    const l2Subject = (user.language2 || 'english').toLowerCase();

    // Separate aggregates for each section (Following 647e588 pattern)
    // Filter by language: 'hindi' to only serve Hindi-text questions
    const cdp = await Question.aggregate([{ $match: { subject: 'pedagogy', level: user.level, language: 'hindi' } }, { $sample: { size: size } }]);
    const l1 = await Question.aggregate([{ $match: { subject: l1Subject, level: user.level, language: 'hindi' } }, { $sample: { size: size } }]);
    const l2 = await Question.aggregate([{ $match: { subject: l2Subject, level: user.level, language: 'hindi' } }, { $sample: { size: size } }]);
    
    let subQ = [];
    if (user.level === 'primary') {
      const math = await Question.aggregate([{ $match: { subject: 'math', level: 'primary', language: 'hindi' } }, { $sample: { size: size } }]);
      const evs = await Question.aggregate([{ $match: { subject: 'evs', level: 'primary', language: 'hindi' } }, { $sample: { size: size } }]);
      subQ = [...math, ...evs];
    } else {
      const subject = user.subject_preference === 'science' ? 'science' : 'social';
      subQ = await Question.aggregate([{ $match: { subject, level: 'junior', language: 'hindi' } }, { $sample: { size: size * 2 } }]);
    }

    const questions = [...cdp, ...l1, ...l2, ...subQ];

    const exam = new Exam({
      exam_id: uuidv4(),
      user_id: req.user.id,
      exam_type: 'daily',
      questions: questions.map(q => q.question_id),
      duration: duration,
      date: new Date()
    });

    await exam.save();
    res.json({ exam, questions });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

// @route   GET api/exams/full-mock
router.get('/full-mock', auth, async (req, res) => {
  try {
    const hasAccess = await checkAccess(req.user.id);
    if (!hasAccess) return res.status(403).json({ message: 'Trial expired.' });

    const user = await User.findOne({ user_id: req.user.id });
    
    const l1Subject = (user.language1 || 'hindi').toLowerCase();
    const l2Subject = (user.language2 || 'english').toLowerCase();
    
    const cdp = await Question.aggregate([{ $match: { subject: 'pedagogy', level: user.level, language: 'hindi' } }, { $sample: { size: 30 } }]);
    const l1 = await Question.aggregate([{ $match: { subject: l1Subject, level: user.level, language: 'hindi' } }, { $sample: { size: 30 } }]);
    const l2 = await Question.aggregate([{ $match: { subject: l2Subject, level: user.level, language: 'hindi' } }, { $sample: { size: 30 } }]);
    
    let subQ = [];
    if (user.level === 'primary') {
      const math = await Question.aggregate([{ $match: { subject: 'math', level: 'primary', language: 'hindi' } }, { $sample: { size: 30 } }]);
      const evs = await Question.aggregate([{ $match: { subject: 'evs', level: 'primary', language: 'hindi' } }, { $sample: { size: 30 } }]);
      subQ = [...math, ...evs];
    } else {
      const subject = user.subject_preference === 'science' ? 'science' : 'social';
      subQ = await Question.aggregate([{ $match: { subject, level: 'junior', language: 'hindi' } }, { $sample: { size: 60 } }]);
    }

    const questions = [...cdp, ...l1, ...l2, ...subQ];

    const exam = new Exam({
      exam_id: uuidv4(),
      user_id: req.user.id,
      exam_type: 'full-mock',
      questions: questions.map(q => q.question_id),
      duration: 150,
      date: new Date()
    });

    await exam.save();
    res.json({ exam, questions });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

router.get('/subject/:subject', auth, async (req, res) => {
  try {
    const hasAccess = await checkAccess(req.user.id);
    if (!hasAccess) return res.status(403).json({ message: 'Trial expired.' });

    const qCount = parseInt(req.query.count) || 50;
    const duration = parseInt(req.query.duration) || 50;
    const user = await User.findOne({ user_id: req.user.id });

    const questions = await Question.aggregate([
      { $match: { subject: req.params.subject.toLowerCase(), level: user.level, language: 'hindi' } },
      { $sample: { size: qCount } }
    ]);

    const exam = new Exam({
      exam_id: uuidv4(),
      user_id: req.user.id,
      exam_type: 'subject-wise',
      questions: questions.map(q => q.question_id),
      duration: duration,
      date: new Date()
    });

    await exam.save();
    res.json({ exam, questions });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

router.get('/history', auth, async (req, res) => {
  try {
    const exams = await Exam.find({ user_id: req.user.id, completed: true })
      .sort({ date: -1 })
      .limit(20);
    res.json(exams);
  } catch (err) {
    res.status(500).send('Server Error');
  }
});


router.post(['/submit', '/submit/:examId'], auth, async (req, res) => {
  try {
    const examId = req.params.examId || req.body.exam_id;
    const { answers, score: bodyScore } = req.body;

    let exam = await Exam.findOne({ exam_id: examId, user_id: req.user.id });
    if (!exam) return res.status(404).json({ message: 'Exam not found' });

    if (exam.completed) {
      return res.json({ exam, message: 'Exam already submitted' });
    }

    let score = 0;
    const graded = [];
    if (Array.isArray(answers) && answers.length > 0) {
      const questionIds = answers.map(ans => ans.question_id);
      const questionsList = await Question.find({ question_id: { $in: questionIds } });
      const questionsMap = new Map(questionsList.map(q => [q.question_id, q]));

      for (const ans of answers) {
        const q = questionsMap.get(ans.question_id);
        const is_correct = q ? (q.correct_answer === ans.selected_option) : false;
        if (is_correct) score++;
        graded.push({
          question_id: ans.question_id,
          selected_option: ans.selected_option,
          is_correct
        });
      }
    } else {
      score = bodyScore || 0;
    }

    exam.score = score;
    exam.answers = graded.length ? graded : (answers || []);
    exam.completed = true;

    await exam.save();

    // Update User Stats for Ranking
    const user = await User.findOne({ user_id: req.user.id });
    if (user) {
      user.questions_solved = (user.questions_solved || 0) + (answers ? answers.length : 0);
      user.rank_points = (user.rank_points || 0) + (score * 10);
      
      // Update mistakes/wrong answers tracking
      if (graded.length > 0) {
        if (!user.wrong_answers) user.wrong_answers = [];
        
        for (const item of graded) {
          const existingIndex = user.wrong_answers.findIndex(w => w.question_id === item.question_id);
          if (item.is_correct) {
            // Correct answer: if active, set status to corrected
            if (existingIndex !== -1 && user.wrong_answers[existingIndex].status === 'active') {
              user.wrong_answers[existingIndex].status = 'corrected';
              user.wrong_answers[existingIndex].corrected_at = new Date();
            }
          } else {
            // Incorrect answer: increment count and ensure status is active
            if (existingIndex !== -1) {
              user.wrong_answers[existingIndex].count = (user.wrong_answers[existingIndex].count || 0) + 1;
              user.wrong_answers[existingIndex].status = 'active';
              user.wrong_answers[existingIndex].added_at = new Date();
            } else {
              user.wrong_answers.push({
                question_id: item.question_id,
                count: 1,
                status: 'active',
                added_at: new Date()
              });
            }
          }
        }
      }
      
      await user.save();
    }

    res.json({
      exam,
      user_stats: user ? { questions_solved: user.questions_solved, rank_points: user.rank_points } : {}
    });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

// @route   GET api/exams/insights
// @desc    Get performance insights by subject
router.get('/insights', auth, async (req, res) => {
  try {
    const insights = await Exam.aggregate([
      { $match: { user_id: req.user.id, completed: true } },
      { $unwind: "$answers" },
      {
        $lookup: {
          from: "questions",
          localField: "answers.question_id",
          foreignField: "question_id",
          as: "question"
        }
      },
      { $unwind: "$question" },
      {
        $group: {
          _id: "$question.subject",
          total: { $sum: 1 },
          correct: { $sum: { $cond: ["$answers.is_correct", 1, 0] } }
        }
      }
    ]);
    res.json(insights);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

// @route   GET api/exams/subtopic-insights
// @desc    Get performance insights grouped by subtopics (cheatsheets)
router.get('/subtopic-insights', auth, async (req, res) => {
  try {
    const subtopicInsights = await Exam.aggregate([
      { $match: { user_id: req.user.id, completed: true } },
      { $unwind: "$answers" },
      {
        $lookup: {
          from: "cheatsheets",
          localField: "answers.question_id",
          foreignField: "linked_questions",
          as: "cheatsheet"
        }
      },
      { $unwind: "$cheatsheet" },
      {
        $group: {
          _id: "$cheatsheet.topic_id",
          topic_id: { $first: "$cheatsheet.topic_id" },
          title_hi: { $first: "$cheatsheet.title_hi" },
          title_en: { $first: "$cheatsheet.title_en" },
          subject: { $first: "$cheatsheet.subject" },
          category_hi: { $first: "$cheatsheet.category_hi" },
          category_en: { $first: "$cheatsheet.category_en" },
          total: { $sum: 1 },
          correct: { $sum: { $cond: ["$answers.is_correct", 1, 0] } }
        }
      },
      {
        $project: {
          _id: 0,
          topic_id: 1,
          title_hi: 1,
          title_en: 1,
          subject: 1,
          category_hi: 1,
          category_en: 1,
          total: 1,
          correct: 1,
          accuracy: {
            $cond: [
              { $eq: ["$total", 0] },
              0,
              { $round: [{ $multiply: [{ $divide: ["$correct", "$total"] }, 100] }, 1] }
            ]
          }
        }
      }
    ]);

    const adviceMap = {
      "cdp-theory-01": {
        en: "Focus on Piaget's 4 stages (Sensorimotor, Pre-operational, Concrete, Formal). Pay attention to conservation & schema adaptation.",
        hi: "जीन पियाजे के 4 चरणों (संवेदी-पेशीय, पूर्व-संक्रियात्मक, मूर्त, अमूर्त) पर ध्यान दें। संरक्षण और स्कीमा चक्र को समझें।"
      },
      "hin-grammar-01": {
        en: "Practice Swar Sandhi identification. Look for key vowel combinations (single/double मात्राs) to instantly recognize Guna/Vriddhi Sandhi.",
        hi: "स्वर संधि की पहचान का अभ्यास करें। गुण और वृद्धि संधि को पहचानने के लिए शब्द के मध्य में एक या दो मात्राओं को देखें।"
      },
      "eng-lit-01": {
        en: "Revise Figures of Speech triggers. Remember: 'like/as' indicates Simile, while direct comparison is Metaphor.",
        hi: "Figures of Speech (अलंकार) पहचान ट्रिगर्स दोहराएं। याद रखें: 'like/as' उपमा (Simile) दर्शाता है, जबकि सीधा रूपक (Metaphor) है।"
      },
      "evs-eco-01": {
        en: "Master Lindeman's 10% law and distinguish between Biotic/Abiotic factors. Pyramid of energy flows bottom-up.",
        hi: "लिंडमैन के 10% ऊर्जा नियम को कंठस्थ करें। जैविक (सजीव) और अजैविक (निर्जीव) घटकों के अंतर को स्पष्ट रूप से समझें।"
      },
      "mat-geom-01": {
        en: "Review Van Hiele levels of geometric thought. Level 0 is visualization (appearance) and Level 1 is analysis (properties).",
        hi: "वैन हीले के ज्यामितीय चिंतन स्तरों को याद करें। स्तर 0 दृश्यीकरण (दिखावट) है और स्तर 1 विश्लेषण (आकृतियों के गुण) है।"
      },
      "san-grammar-01": {
        en: "Understand Maheshwar Sutras and how to construct Pratyaharas. Remember: Ach represents vowels, Hal represents consonants.",
        hi: "माहेश्वर सूत्रों और प्रत्याहार निर्माण की विधि को समझें। याद रखें: अच् में सभी स्वर और हल् में सभी व्यंजन आते हैं।"
      },
      "sci-bio-01": {
        en: "Study human digestion organs and their enzymes. Remember: Pepsin targets proteins, Amylase targets starch, and Lipase targets fats.",
        hi: "मानव पाचन तंत्र के अंगों और उनके एंजाइमों का अध्ययन करें। याद रखें: पेप्सिन प्रोटीन को, एमाइलेज स्टार्च को, और लाइपेज वसा को पचाता है।"
      },
      "soc-polity-01": {
        en: "Memorize Articles 12-35 for Fundamental Rights. Pay special attention to Right to Equality (14-18) and Constitutional Remedies (32).",
        hi: "भारतीय संविधान के भाग III (अनुच्छेद 12-35) मौलिक अधिकारों को याद करें। संवैधानिक उपचारों का अधिकार (अनुच्छेद 32) अति महत्वपूर्ण है।"
      }
    };

    const insightsWithAdvice = subtopicInsights.map(item => {
      const advice = adviceMap[item.topic_id] || {
        en: "Review this sub-topic notes to clarify key concepts and practice related mock questions.",
        hi: "प्रमुख अवधारणाओं को स्पष्ट करने और प्रासंगिक प्रश्नों का अभ्यास करने के लिए इस विषय के नोट्स देखें।"
      };
      return {
        ...item,
        advice_en: advice.en,
        advice_hi: advice.hi
      };
    });

    res.json(insightsWithAdvice);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});


// @route   GET api/exams/important
// @desc    Get most important questions (Asked in multiple years)
router.get('/important', auth, async (req, res) => {
  try {
    const user = await User.findOne({ user_id: req.user.id });
    
    // Build subject list based on user's profile
    const userSubjects = ['pedagogy', (user.language1 || 'hindi').toLowerCase(), (user.language2 || 'english').toLowerCase()];
    if (user.level === 'primary') {
      userSubjects.push('math', 'evs');
    } else {
      userSubjects.push(user.subject_preference === 'science' ? 'science' : 'social');
    }

    let questions = await Question.aggregate([
      { $match: { 
        level: user.level,
        subject: { $in: userSubjects },
        language: 'hindi',
        year: { $exists: true, $ne: null } 
      } },
      { $sample: { size: 50 } }
    ]);

    if (!questions || questions.length === 0) {
      questions = await Question.aggregate([
        { $match: { 
          level: user.level,
          subject: { $in: userSubjects },
          language: 'hindi'
        } },
        { $sample: { size: 50 } }
      ]);
    }

    const exam = new Exam({
      exam_id: uuidv4(),
      user_id: req.user.id,
      exam_type: 'important',
      questions: questions.map(q => q.question_id),
      duration: 50,
      date: new Date()
    });

    await exam.save();
    res.json({ exam, questions });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

// @route   GET api/exams/year/:year
// @desc    Get/Create a year-wise exam based on level & year
router.get('/year/:year', auth, async (req, res) => {
  try {
    const hasAccess = await checkAccess(req.user.id);
    if (!hasAccess) return res.status(403).json({ message: 'Trial expired.' });

    const targetYear = parseInt(req.params.year);
    const user = await User.findOne({ user_id: req.user.id });
    if (!user) return res.status(404).json({ msg: 'User not found' });

    // Build subject list based on user's profile
    const userSubjects = ['pedagogy', (user.language1 || 'hindi').toLowerCase(), (user.language2 || 'english').toLowerCase()];
    if (user.level === 'primary') {
      userSubjects.push('math', 'evs');
    } else {
      userSubjects.push(user.subject_preference === 'science' ? 'science' : 'social');
    }

    let questions = await Question.aggregate([
      { $match: { 
        level: user.level,
        subject: { $in: userSubjects },
        language: 'hindi',
        year: targetYear
      } },
      { $sample: { size: 50 } }
    ]);

    // Fallback: if we don't have enough questions for this specific year + level + subjects combination,
    // let's relax the subject filter or just search by year and level
    if (!questions || questions.length === 0) {
      questions = await Question.aggregate([
        { $match: { 
          level: user.level,
          language: 'hindi',
          year: targetYear
        } },
        { $sample: { size: 50 } }
      ]);
    }

    // Secondary fallback: if still 0, just get any 50 questions from that year
    if (!questions || questions.length === 0) {
      questions = await Question.aggregate([
        { $match: { 
          year: targetYear
        } },
        { $sample: { size: 50 } }
      ]);
    }

    if (!questions || questions.length === 0) {
      return res.status(404).json({ message: `No questions found for the year ${targetYear}.` });
    }

    const exam = new Exam({
      exam_id: uuidv4(),
      user_id: req.user.id,
      exam_type: 'year-wise',
      questions: questions.map(q => q.question_id),
      duration: 50,
      date: new Date()
    });

    await exam.save();
    res.json({ exam, questions });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

router.get('/:examId', auth, async (req, res) => {
  try {
    const exam = await Exam.findOne({ exam_id: req.params.examId, user_id: req.user.id });
    if (!exam) return res.status(404).json({ message: 'Exam not found' });
    const questions = await Question.find({ question_id: { $in: exam.questions } });
    res.json({ exam, questions });
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

module.exports = router; 
