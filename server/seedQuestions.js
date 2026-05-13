const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');
const Question = require('./models/Question');
const dotenv = require('dotenv');

dotenv.config();

const questions = [
  {
    question_id: uuidv4(),
    level: 'primary',
    subject: 'pedagogy',
    question_text: 'Which of the following is the most important trait of a teacher at the primary level?',
    options: ['Competence in methods of teaching', 'Passion for teaching', 'Patience and perseverance', 'Knowledge of subjects'],
    correct_answer: 'Patience and perseverance',
    explanation: 'At the primary level, children are young and require a lot of patience and persistence from the teacher to guide them effectively.',
    source: 'UPTET 2018'
  },
  {
    question_id: uuidv4(),
    level: 'primary',
    subject: 'evs',
    question_text: 'Which of the following is a bio-degradable waste?',
    options: ['Plastic', 'Polythene', 'Glass', 'Paper'],
    correct_answer: 'Paper',
    explanation: 'Paper is made from natural materials (wood pulp) and can be broken down by microorganisms, making it biodegradable.',
    source: 'CTET 2019'
  },
  {
    question_id: uuidv4(),
    level: 'primary',
    subject: 'math',
    question_text: 'The sum of all internal angles of a triangle is:',
    options: ['90 degrees', '180 degrees', '270 degrees', '360 degrees'],
    correct_answer: '180 degrees',
    explanation: 'By the Angle Sum Property of a triangle, the sum of all three internal angles is always 180 degrees.',
    source: 'UPTET 2021'
  }
  // Add more as needed
];

mongoose.connect(process.env.MONGODB_URI)
  .then(async () => {
    console.log('Connected to MongoDB');
    await Question.deleteMany({});
    await Question.insertMany(questions);
    console.log('Seed questions inserted');
    process.exit();
  })
  .catch(err => {
    console.error(err);
    process.exit(1);
  });
