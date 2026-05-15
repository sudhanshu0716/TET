const mongoose = require('mongoose');

const globalSettingsSchema = new mongoose.Schema({
  premium_service_enabled: { type: Boolean, default: false },
  system_message: { type: String, default: '' },
  is_maintenance_mode: { type: Boolean, default: false },
  last_updated: { type: Date, default: Date.now }
});

module.exports = mongoose.model('GlobalSettings', globalSettingsSchema);
