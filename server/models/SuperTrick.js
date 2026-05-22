const mongoose = require('mongoose');

const superTrickSchema = new mongoose.Schema({
  trick_id: { type: String, required: true, unique: true },
  subject: { type: String, required: true },
  title_en: { type: String, required: true },
  title_hi: { type: String, required: true },
  mnemonic_en: { type: String },
  mnemonic_hi: { type: String },
  trick_en: { type: String, required: true },
  trick_hi: { type: String, required: true },
  explanation_en: { type: String },
  explanation_hi: { type: String },
  category_en: { type: String },
  category_hi: { type: String },
  created_at: { type: Date, default: Date.now }
});

module.exports = mongoose.model('SuperTrick', superTrickSchema);
