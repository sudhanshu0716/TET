const mongoose = require('mongoose');
require('dotenv').config({ path: './server/.env' });

async function createIndexes() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB.');

    const db = mongoose.connection.db;

    console.log('Creating indexes on questions collection...');
    const questions = db.collection('questions');
    await questions.createIndex({ question_id: 1 }, { unique: true });
    await questions.createIndex({ subject: 1 });
    await questions.createIndex({ level: 1, subject: 1, language: 1 });
    console.log('Questions indexes created.');

    console.log('Creating indexes on exams collection...');
    const exams = db.collection('exams');
    await exams.createIndex({ exam_id: 1 }, { unique: true });
    await exams.createIndex({ user_id: 1 });
    await exams.createIndex({ completed: 1 });
    await exams.createIndex({ date: -1 });
    await exams.createIndex({ user_id: 1, completed: 1, date: -1 });
    console.log('Exams indexes created.');

    console.log('Creating indexes on users collection...');
    const users = db.collection('users');
    await users.createIndex({ user_id: 1 }, { unique: true });
    await users.createIndex({ email: 1 }, { unique: true });
    await users.createIndex({ questions_solved: -1 });
    await users.createIndex({ rank_points: -1 });
    await users.createIndex({ last_active: -1 });
    console.log('Users indexes created.');

    console.log('All indexes created/verified successfully!');
    process.exit(0);
  } catch (err) {
    console.error('Index creation failed:', err);
    process.exit(1);
  }
}

createIndexes();
