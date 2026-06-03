const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Scenario = require('../models/Scenario');
const auth = require('../middleware/auth');

// @route   GET api/scenarios/random
// @desc    Get a random scenario that user hasn't completed yet
router.get('/random', auth, async (req, res) => {
  try {
    const user = await User.findOne({ user_id: req.user.id });
    if (!user) return res.status(404).json({ message: 'User not found' });

    const completedIds = (user.scenarios_completed || []).map(s => s.scenario_id);
    
    // Find uncompleted scenarios matching user level
    let scenarios = await Scenario.find({
      level: user.level,
      scenario_id: { $nin: completedIds }
    });

    // Fallback: If all scenarios completed, serve any scenario matching user level
    if (scenarios.length === 0) {
      scenarios = await Scenario.find({ level: user.level });
    }

    if (scenarios.length === 0) {
      // Secondary fallback: serve any scenario
      scenarios = await Scenario.find();
    }

    if (scenarios.length === 0) {
      return res.status(404).json({ message: 'No scenarios found.' });
    }

    // Select a random scenario
    const randomScenario = scenarios[Math.floor(Math.random() * scenarios.length)];
    
    // Sort steps sequentially
    const scenarioObj = randomScenario.toObject();
    if (scenarioObj.steps) {
      scenarioObj.steps.sort((a, b) => a.step_number - b.step_number);
    }

    res.json(scenarioObj);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

// @route   POST api/scenarios/submit/:scenarioId
// @desc    Submit choices for a completed scenario and get evaluation report card
router.post('/submit/:scenarioId', auth, async (req, res) => {
  try {
    const { selected_choices } = req.body; // Array of indices e.g., [1, 0, 2]
    const { scenarioId } = req.params;

    if (!Array.isArray(selected_choices)) {
      return res.status(400).json({ message: 'selected_choices must be an array' });
    }

    const user = await User.findOne({ user_id: req.user.id });
    if (!user) return res.status(404).json({ message: 'User not found' });

    const scenario = await Scenario.findOne({ scenario_id: scenarioId });
    if (!scenario) return res.status(404).json({ message: 'Scenario not found' });

    // Sort steps to ensure matching indices align correctly
    const steps = [...scenario.steps].sort((a, b) => a.step_number - b.step_number);

    let totalScore = 0;
    const evaluations = [];

    for (let i = 0; i < steps.length; i++) {
      const step = steps[i];
      const choiceIdx = selected_choices[i];
      
      // Find the choice detail matching the index
      const choice = step.choices.find(c => c.choice_index === choiceIdx);
      if (!choice) {
        return res.status(400).json({ message: `Invalid choice index ${choiceIdx} for step ${step.step_number}` });
      }

      totalScore += choice.points || 0;

      evaluations.push({
        step_number: step.step_number,
        choice_text_en: choice.text_en,
        choice_text_hi: choice.text_hi,
        points: choice.points,
        theory_tag: choice.theory_tag,
        explanation_en: choice.explanation_en,
        explanation_hi: choice.explanation_hi,
        reaction_modifier_en: choice.reaction_modifier_en,
        reaction_modifier_hi: choice.reaction_modifier_hi
      });
    }

    // Determine license rating
    // 3 steps, max score is 30 points (10 points per step)
    let license = 'standard';
    if (totalScore >= 25) {
      license = 'gold';
    } else if (totalScore >= 15) {
      license = 'silver';
    } else {
      license = 'bronze';
    }

    // Record completion in User profile (avoid duplicates of the same scenario)
    if (!user.scenarios_completed) user.scenarios_completed = [];
    user.scenarios_completed = user.scenarios_completed.filter(s => s.scenario_id !== scenarioId);
    
    user.scenarios_completed.push({
      scenario_id: scenarioId,
      selected_choices,
      score: totalScore,
      completed_at: new Date()
    });

    // Update user learning statistics
    user.questions_solved = (user.questions_solved || 0) + selected_choices.length; // 3 decisions made
    user.rank_points = (user.rank_points || 0) + (totalScore * 10); // Reward rank points based on score
    
    await user.save();

    res.json({
      success: true,
      score: totalScore,
      license,
      evaluations,
      user_stats: {
        questions_solved: user.questions_solved,
        rank_points: user.rank_points
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
