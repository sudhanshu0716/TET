const mongoose = require('mongoose');

const scenarioSchema = new mongoose.Schema({
  scenario_id: { type: String, required: true, unique: true },
  subject: { type: String, default: 'pedagogy' },
  level: { type: String, enum: ['primary', 'junior'], default: 'primary' },
  title_en: { type: String, required: true },
  title_hi: { type: String, required: true },
  steps: [{
    step_number: { type: Number, required: true },
    description_en: { type: String, required: true },
    description_hi: { type: String, required: true },
    choices: [{
      choice_index: { type: Number, required: true },
      text_en: { type: String, required: true },
      text_hi: { type: String, required: true },
      points: { type: Number, default: 0 },
      theory_tag: { type: String },
      explanation_en: { type: String },
      explanation_hi: { type: String },
      reaction_modifier_en: { type: String },
      reaction_modifier_hi: { type: String }
    }]
  }],
  created_at: { type: Date, default: Date.now }
});

scenarioSchema.index({ level: 1 });

module.exports = mongoose.model('Scenario', scenarioSchema);
