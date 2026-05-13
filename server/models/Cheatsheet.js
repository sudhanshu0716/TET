const mongoose = require('mongoose');

const cheatsheetSchema = new mongoose.Schema({
  topic_id: { type: String, required: true, unique: true },
  title: { type: String, required: true },
  subject: { type: String, required: true },
  category: { type: String }, // e.g. "Theory", "Grammar", "Formulas"
  level: { type: String, enum: ['primary', 'junior', 'both'], default: 'both' },
  content: { type: String, required: true }, // Markdown content
  linked_questions: [{ type: String }], 
  created_at: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Cheatsheet', cheatsheetSchema);
