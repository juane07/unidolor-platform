const mongoose = require('mongoose');

const schema = new mongoose.Schema({
  removed: { type: Boolean, default: false },
  enabled: { type: Boolean, default: true },
  name: { type: String, required: true },
  code: { type: String },
  contact: { type: String },
  phone: { type: String },
  email: { type: String },
  paymentTerms: { type: Number, default: 30 },
  isActive: { type: Boolean, default: true },
  created: { type: Date, default: Date.now },
  updated: { type: Date, default: Date.now },
});

module.exports = mongoose.model('InsuranceCompany', schema);
