const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
  question_id: { type: String, required: true, unique: true },
  level: { type: String, enum: ['primary', 'junior'], required: true },
  subject: { 
    type: String, 
    enum: ['pedagogy', 'hindi', 'english', 'urdu', 'sanskrit', 'math', 'evs', 'science', 'social'],
    required: true 
  },
  question_text: { type: String, required: true },
  language: { type: String, enum: ['hindi', 'english'], default: 'hindi' },
  options: [{ type: String, required: true }],
  correct_answer: { type: String, required: true },
  explanation: { type: String },
  source: { type: String },
  year: { type: Number },
  created_at: { type: Date, default: Date.now }
});

questionSchema.index({ subject: 1 });
questionSchema.index({ level: 1, subject: 1, language: 1 });

module.exports = mongoose.model('Question', questionSchema);
