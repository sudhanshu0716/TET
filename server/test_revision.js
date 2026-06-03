const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });

const User = require('./models/User');
const Question = require('./models/Question');
const Exam = require('./models/Exam');

async function runTest() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected!');

    // 1. Get or create a test user
    let user = await User.findOne({ email: 'test_revision_user@example.com' });
    if (!user) {
      user = new User({
        user_id: 'test_revision_uid_123',
        name: 'Test Revision User',
        email: 'test_revision_user@example.com',
        password_hash: 'dummyhash',
        role: 'user'
      });
      await user.save();
      console.log('Created test user:', user.email);
    } else {
      console.log('Found existing test user:', user.email);
      // Clean up previous runs
      user.wrong_answers = [];
      user.bookmarks = [];
      await user.save();
    }

    // 2. Ensure we have at least 2 questions in the database
    let questions = await Question.find().limit(2);
    if (questions.length < 2) {
      console.log('Not enough questions found, seeding 2 dummy questions...');
      const q1 = new Question({
        question_id: 'test_q_1',
        level: 'primary',
        subject: 'pedagogy',
        question_text: 'What is 2 + 2?',
        options: ['3', '4', '5', '6'],
        correct_answer: '4',
        language: 'hindi'
      });
      const q2 = new Question({
        question_id: 'test_q_2',
        level: 'primary',
        subject: 'pedagogy',
        question_text: 'What is child development?',
        options: ['Growth', 'Learning', 'Both', 'None'],
        correct_answer: 'Both',
        language: 'hindi'
      });
      await q1.save();
      await q2.save();
      questions = [q1, q2];
    }

    console.log('Using questions:', questions.map(q => q.question_id));

    // 3. Simulate an exam submission where we get Q1 wrong and Q2 correct
    const mockExamId = 'mock_exam_123';
    await Exam.deleteOne({ exam_id: mockExamId });

    const exam = new Exam({
      exam_id: mockExamId,
      user_id: user.user_id,
      exam_type: 'daily',
      questions: questions.map(q => q.question_id),
      duration: 10,
      answers: [],
      completed: false
    });
    await exam.save();
    console.log('Created mock exam:', mockExamId);

    // Call submit logic programmatically to verify (simulating exams.js submit)
    const submittedAnswers = [
      { question_id: questions[0].question_id, selected_option: 'incorrect_value' }, // wrong
      { question_id: questions[1].question_id, selected_option: questions[1].correct_answer } // correct
    ];

    let score = 0;
    const graded = [];
    for (const ans of submittedAnswers) {
      const q = questions.find(qi => qi.question_id === ans.question_id);
      const is_correct = q ? (q.correct_answer === ans.selected_option) : false;
      if (is_correct) score++;
      graded.push({
        question_id: ans.question_id,
        selected_option: ans.selected_option,
        is_correct
      });
    }

    exam.score = score;
    exam.answers = graded;
    exam.completed = true;
    await exam.save();
    console.log('Mock exam submitted with score:', score);

    // Update User wrong_answers (simulating exams.js update)
    user.questions_solved = (user.questions_solved || 0) + submittedAnswers.length;
    user.rank_points = (user.rank_points || 0) + (score * 10);
    
    if (graded.length > 0) {
      if (!user.wrong_answers) user.wrong_answers = [];
      for (const item of graded) {
        const existingIndex = user.wrong_answers.findIndex(w => w.question_id === item.question_id);
        if (item.is_correct) {
          if (existingIndex !== -1 && user.wrong_answers[existingIndex].status === 'active') {
            user.wrong_answers[existingIndex].status = 'corrected';
            user.wrong_answers[existingIndex].corrected_at = new Date();
          }
        } else {
          if (existingIndex !== -1) {
            user.wrong_answers[existingIndex].count += 1;
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
    console.log('User stats and wrong answers updated!');

    // 4. Verify wrong answers status
    let updatedUser = await User.findOne({ user_id: user.user_id });
    console.log('--- Verification Step 1: Incorrect Answer Logged ---');
    console.log('Wrong Answers in DB:', JSON.stringify(updatedUser.wrong_answers, null, 2));
    
    const activeWrong = updatedUser.wrong_answers.find(w => w.question_id === questions[0].question_id && w.status === 'active');
    if (activeWrong) {
      console.log('SUCCESS: Active wrong answer found as expected!');
    } else {
      console.error('FAILED: Active wrong answer not found.');
    }

    // 5. Test bookmark toggle
    console.log('--- Verification Step 2: Bookmark Toggle ---');
    const qidToBookmark = questions[0].question_id;
    
    // Toggle ON
    let isBookmarked = false;
    let bIndex = updatedUser.bookmarks.indexOf(qidToBookmark);
    if (bIndex !== -1) {
      updatedUser.bookmarks.splice(bIndex, 1);
    } else {
      updatedUser.bookmarks.push(qidToBookmark);
      isBookmarked = true;
    }
    await updatedUser.save();
    console.log(`Toggled ON: isBookmarked = ${isBookmarked}, count = ${updatedUser.bookmarks.length}`);

    updatedUser = await User.findOne({ user_id: user.user_id });
    if (updatedUser.bookmarks.includes(qidToBookmark)) {
      console.log('SUCCESS: Bookmarked successfully!');
    } else {
      console.error('FAILED: Bookmark did not save.');
    }

    // 6. Simulate getting the wrong question CORRECT in a later test
    console.log('--- Verification Step 3: Answering Wrong Question Correctly later ---');
    const gradedLater = [
      { question_id: questions[0].question_id, is_correct: true } // Now got it right!
    ];

    for (const item of gradedLater) {
      const existingIndex = updatedUser.wrong_answers.findIndex(w => w.question_id === item.question_id);
      if (item.is_correct) {
        if (existingIndex !== -1 && updatedUser.wrong_answers[existingIndex].status === 'active') {
          updatedUser.wrong_answers[existingIndex].status = 'corrected';
          updatedUser.wrong_answers[existingIndex].corrected_at = new Date();
        }
      }
    }
    await updatedUser.save();
    console.log('Simulated subsequent correct answer saved.');

    updatedUser = await User.findOne({ user_id: user.user_id });
    const correctedWrong = updatedUser.wrong_answers.find(w => w.question_id === questions[0].question_id && w.status === 'corrected');
    if (correctedWrong) {
      console.log('SUCCESS: Active mistake was correctly archived/marked corrected!');
    } else {
      console.error('FAILED: Active mistake was not corrected.');
    }

    // Clean up test user & mock exam
    await User.deleteOne({ email: 'test_revision_user@example.com' });
    await Exam.deleteOne({ exam_id: mockExamId });
    console.log('Test clean up completed successfully!');
    
    process.exit(0);
  } catch (err) {
    console.error('Test script error:', err);
    process.exit(1);
  }
}

runTest();
