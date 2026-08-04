const mongoose = require('mongoose');

const schema = new mongoose.Schema({
  removed: { type: Boolean, default: false },
  enabled: { type: Boolean, default: true },
  company: {
    type: mongoose.Schema.ObjectId,
    ref: 'InsuranceCompany',
    required: true,
    autopopulate: true,
  },
  name: { type: String, required: true },
  coveragePercent: { type: Number, default: 80 },
  copayPercent: { type: Number, default: 20 },
  isActive: { type: Boolean, default: true },
  created: { type: Date, default: Date.now },
  updated: { type: Date, default: Date.now },
});

schema.plugin(require('mongoose-autopopulate'));
module.exports = mongoose.model('InsurancePlan', schema);
