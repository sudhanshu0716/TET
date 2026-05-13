const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  user_id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password_hash: { type: String, required: true },
  level: { type: String, enum: ['primary', 'junior'], default: 'primary' },
  language1: { type: String, default: 'Hindi' },
  language2: { type: String, default: 'English' },
  subject_preference: { type: String, enum: ['science', 'arts', 'none'], default: 'none' },
  role: { type: String, enum: ['user', 'admin'], default: 'user' },
  questions_solved: { type: Number, default: 0 },
  rank_points: { type: Number, default: 0 },
  created_at: { type: Date, default: Date.now }
});

module.exports = mongoose.model('User', userSchema);
