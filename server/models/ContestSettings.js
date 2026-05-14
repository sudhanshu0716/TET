const mongoose = require('mongoose');

const ContestSettingsSchema = new mongoose.Schema({
  contest_date: { type: Date, required: true, unique: true }, // 00:00:00 of the day
  start_time: { type: String, default: "20:30" }, // 24h format HH:mm
  duration: { type: Number, default: 30 },       // minutes
  questions: [{ type: String }],                 // question_ids
  created_at: { type: Date, default: Date.now }
});

module.exports = mongoose.model('ContestSettings', ContestSettingsSchema);
