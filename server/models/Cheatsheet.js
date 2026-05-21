const mongoose = require('mongoose');

const cheatsheetSchema = new mongoose.Schema({
  topic_id: { type: String, required: true, unique: true },
  title_hi: { type: String, required: true },
  title_en: { type: String, required: true },
  subject: { type: String, required: true },
  category_hi: { type: String },
  category_en: { type: String },
  level: { type: String, enum: ['primary', 'junior', 'both'], default: 'both' },
  content_hi: { type: String, required: true }, // Markdown content in Hindi (with flowcharts/tricks)
  content_en: { type: String, required: true }, // Markdown content in English (with flowcharts/tricks)
  linked_questions: [{ type: String }], 
  created_at: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Cheatsheet', cheatsheetSchema);
