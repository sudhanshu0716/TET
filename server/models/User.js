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
  last_active: { type: Date, default: Date.now },
  is_premium: { type: Boolean, default: false },
  subscription_end_date: { type: Date, default: null },
  trial_end_date: { 
    type: Date, 
    default: () => new Date(+new Date() + 3 * 24 * 60 * 60 * 1000) 
  },
  created_at: { type: Date, default: Date.now },
  bookmarks: [{ type: String }],
  wrong_answers: [{
    question_id: { type: String, required: true },
    count: { type: Number, default: 1 },
    status: { type: String, enum: ['active', 'corrected'], default: 'active' },
    added_at: { type: Date, default: Date.now },
    corrected_at: { type: Date }
  }],
  scenarios_completed: [{
    scenario_id: { type: String, required: true },
    selected_choices: [{ type: Number }],
    score: { type: Number, default: 0 },
    completed_at: { type: Date, default: Date.now }
  }]
});

userSchema.index({ last_active: -1 });
userSchema.index({ questions_solved: -1 });
userSchema.index({ rank_points: -1 });

module.exports = mongoose.model('User', userSchema);
