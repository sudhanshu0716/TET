const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');
const Question = require('../models/Question');
const dotenv = require('dotenv');
const fs = require('fs');
const path = require('path');
dotenv.config({ path: path.join(__dirname, '../.env') });

// Auto-discover all question files in this directory
const getAllQuestions = () => {
  const seedDir = __dirname;
  const files = fs.readdirSync(seedDir).filter(f => f.startsWith('questions_') && f.endsWith('.js'));
  let all = [];
  for (const f of files) {
    try {
      const qs = require(path.join(seedDir, f));
      const normalized = qs.map(q => {
        if (!q.language) {
          q.language = q.subject === 'english' ? 'english' : 'hindi';
        }
        return q;
      });
      console.log(`  📄 Loaded ${normalized.length} questions from ${f}`);
      all = all.concat(normalized);
    } catch(e) {
      console.error(`  ❌ Error loading ${f}:`, e.message);
    }
  }
  return all;
};

async function seed() {
  try {
    if (mongoose.connection.readyState === 0) {
      await mongoose.connect(process.env.MONGODB_URI);
      console.log('Connected to DB for seeding');
    }

    const allQ = getAllQuestions();
    const existingTexts = await Question.find().distinct('question_text');
    const existingSet = new Set(existingTexts);

    const newQuestions = allQ.filter(q => !existingSet.has(q.question_text));
    
    console.log(`Current in DB: ${existingTexts.length}`);
    console.log(`New questions to add: ${newQuestions.length}`);

    if (newQuestions.length > 0) {
      // Insert in chunks of 100 to prevent payload limits
      const chunkSize = 100;
      for (let i = 0; i < newQuestions.length; i += chunkSize) {
        const chunk = newQuestions.slice(i, i + chunkSize);
        await Question.insertMany(chunk);
        console.log(`  🚀 Injected chunk ${Math.floor(i/chunkSize) + 1}`);
      }
    }

    const total = await Question.countDocuments();
    console.log(`✅ Seeding complete! Total in DB: ${total}`);
  } catch(e) {
    console.error('Seeding failed:', e);
  }
}

if (require.main === module) {
  seed().then(() => process.exit(0)).catch(() => process.exit(1));
}

module.exports = { seed };
