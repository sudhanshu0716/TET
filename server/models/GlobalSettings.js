const mongoose = require('mongoose');

const globalSettingsSchema = new mongoose.Schema({
  premium_service_enabled: { type: Boolean, default: false },
  system_message: { type: String, default: '' },
  is_maintenance_mode: { type: Boolean, default: false },
  github_token: { type: String, default: '' },
  github_owner: { type: String, default: '' },
  github_repo: { type: String, default: '' },
  default_ui_version: { type: String, enum: ['v1', 'v2', 'v3'], default: 'v1' },
  last_updated: { type: Date, default: Date.now }
});

module.exports = mongoose.model('GlobalSettings', globalSettingsSchema);
