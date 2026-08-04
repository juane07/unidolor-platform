const mongoose = require('mongoose');

const schema = new mongoose.Schema({
  removed: { type: Boolean, default: false },
  enabled: { type: Boolean, default: true },
  invoice: { type: mongoose.Schema.ObjectId, ref: 'Invoice', required: true, autopopulate: true },
  ncf: { type: String },
  ncfTipo: { type: String },
  regimen: { type: String, enum: ['RST', 'RDL', 'RGN'] },
  xmlContent: { type: String },
  signedXml: { type: String },
  dgiiStatus: {
    type: String,
    enum: ['pending', 'submitted', 'approved', 'rejected'],
    default: 'pending',
  },
  dgiiCode: { type: String },
  dgiiResponse: { type: mongoose.Schema.Types.Mixed },
  errorMessage: { type: String },
  attempts: { type: Number, default: 0 },
  submittedAt: { type: Date },
  approvedAt: { type: Date },
  created: { type: Date, default: Date.now },
  updated: { type: Date, default: Date.now },
});

schema.plugin(require('mongoose-autopopulate'));
module.exports = mongoose.model('ECF', schema);
