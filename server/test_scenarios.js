const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });

const User = require('./models/User');
const Scenario = require('./models/Scenario');

async function runTest() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected!');

    // 1. Get or create a test user
    let user = await User.findOne({ email: 'test_scen_user@example.com' });
    if (!user) {
      user = new User({
        user_id: 'test_scen_uid_123',
        name: 'Test Scenario User',
        email: 'test_scen_user@example.com',
        password_hash: 'dummyhash',
        role: 'user',
        level: 'primary'
      });
      await user.save();
      console.log('Created test user:', user.email);
    } else {
      console.log('Found existing test user:', user.email);
      user.scenarios_completed = [];
      user.questions_solved = 0;
      user.rank_points = 0;
      await user.save();
    }

    // 2. Fetch a random scenario matching user's level
    console.log('--- Step 1: Fetching Random Scenario ---');
    const scenarios = await Scenario.find({ level: user.level });
    if (scenarios.length === 0) {
      console.error('FAILED: No seed scenarios found. Did you run the seed script?');
      process.exit(1);
    }

    const testScenario = scenarios[0];
    console.log(`SUCCESS: Fetched scenario: "${testScenario.title_en}"`);
    console.log(`Scenario has ${testScenario.steps.length} storytelling steps.`);

    // Check steps sorting
    const steps = [...testScenario.steps].sort((a, b) => a.step_number - b.step_number);
    console.log('Step sequence numbers:', steps.map(s => s.step_number));

    // 3. Simulate choice submission [1, 0, 0] (Choice 1 at Step 1, Choice 0 at Step 2, Choice 0 at Step 3)
    console.log('--- Step 2: Submitting Scenario Decisions ---');
    const selected_choices = [1, 0, 0]; // Index chosen at each step
    
    let totalScore = 0;
    const evaluations = [];

    for (let i = 0; i < steps.length; i++) {
      const step = steps[i];
      const choiceIdx = selected_choices[i];
      const choice = step.choices.find(c => c.choice_index === choiceIdx);
      
      if (!choice) {
        throw new Error(`Invalid choice index ${choiceIdx} for step ${step.step_number}`);
      }

      totalScore += choice.points || 0;
      evaluations.push({
        step_number: step.step_number,
        choice_text_en: choice.text_en,
        points: choice.points,
        theory_tag: choice.theory_tag,
        explanation_en: choice.explanation_en
      });
    }

    // Determine license
    let license = 'standard';
    if (totalScore >= 25) {
      license = 'gold';
    } else if (totalScore >= 15) {
      license = 'silver';
    } else {
      license = 'bronze';
    }

    console.log(`Calculated Score: ${totalScore}/30`);
    console.log(`Teaching License Awarded: ${license.toUpperCase()}`);

    // Update User completed
    user.scenarios_completed.push({
      scenario_id: testScenario.scenario_id,
      selected_choices,
      score: totalScore,
      completed_at: new Date()
    });

    user.questions_solved += selected_choices.length;
    user.rank_points += (totalScore * 10);
    await user.save();

    console.log('--- Step 3: Verifying User Document Updates ---');
    const updatedUser = await User.findOne({ user_id: user.user_id });
    console.log('User rank_points:', updatedUser.rank_points);
    console.log('User questions_solved:', updatedUser.questions_solved);
    console.log('Completed scenarios logs:', JSON.stringify(updatedUser.scenarios_completed, null, 2));

    if (updatedUser.scenarios_completed.length === 1 && updatedUser.rank_points === (totalScore * 10)) {
      console.log('SUCCESS: Scenario completed logged successfully and rank points awarded!');
    } else {
      console.error('FAILED: User metrics did not update correctly.');
    }

    // Clean up
    await User.deleteOne({ email: 'test_scen_user@example.com' });
    console.log('Test clean up completed successfully!');
    
    process.exit(0);
  } catch (err) {
    console.error('Test script error:', err);
    process.exit(1);
  }
}

runTest();
