const mongoose = require('mongoose');

const examSchema = new mongoose.Schema({
  exam_id: { type: String, required: true, unique: true },
  user_id: { type: String, required: true },
  date: { type: Date, default: Date.now },
  questions: [{ type: String }], // Array of question_ids
  exam_type: { type: String, enum: ['daily', 'full-mock', 'subject-wise', 'important', 'contest', 'year-wise'] },
  duration: { type: Number }, // in minutes
  score: { type: Number, default: 0 },
  answers: [{ 
    question_id: String,
    selected_option: String,
    is_correct: Boolean
  }],
  completed: { type: Boolean, default: false }
});

module.exports = mongoose.model('Exam', examSchema);
