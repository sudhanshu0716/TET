const cron = require('node-cron');
const { seed } = require('../seeds/seed');
const Question = require('../models/Question');

const initAutomation = async () => {
  console.log('🤖 Initializing Automation Service...');

  try {
    const questionCount = await Question.countDocuments();
    if (questionCount === 0) {
      console.log('📉 Question bank is empty. Seeding database...');
      await seed();
      const newCount = await Question.countDocuments();
      console.log(`✅ Database seeded with ${newCount} questions!`);
    } else {
      console.log(`📈 Question bank has ${questionCount} questions. Ready to go!`);
    }
  } catch (err) {
    console.error('Failed during seeding:', err);
  }

  // Schedule daily check at midnight
  cron.schedule('0 0 * * *', async () => {
    console.log('🌙 Midnight check: Re-seeding if new questions available...');
    try {
      await seed();
    } catch (err) {
      console.error('❌ Midnight seed failed:', err);
    }
  });

  console.log('📅 Daily question check scheduled at midnight.');
};

module.exports = { initAutomation };
