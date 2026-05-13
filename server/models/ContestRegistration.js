const mongoose = require('mongoose');

const ContestRegistrationSchema = new mongoose.Schema({
  user_id: { type: String, required: true },
  contest_date: { type: Date, required: true }, // The date of the contest
  registered_at: { type: Date, default: Date.now }
});

// Compound index to prevent duplicate registration for the same day
ContestRegistrationSchema.index({ user_id: 1, contest_date: 1 }, { unique: true });

module.exports = mongoose.model('ContestRegistration', ContestRegistrationSchema);
