const mongoose = require('mongoose');

const schema = new mongoose.Schema({
  removed: { type: Boolean, default: false },
  enabled: { type: Boolean, default: true },
  client: {
    type: mongoose.Schema.ObjectId,
    ref: 'Client',
    required: true,
    autopopulate: true,
  },
  plan: {
    type: mongoose.Schema.ObjectId,
    ref: 'InsurancePlan',
    required: true,
    autopopulate: true,
  },
  service: { type: String },
  amount: { type: Number, default: 0 },
  authorizedAmount: { type: Number, default: 0 },
  authorizationNumber: { type: String },
  status: {
    type: String,
    enum: ['pendiente', 'aprobada', 'rechazada', 'vencida'],
    default: 'pendiente',
  },
  validUntil: { type: Date },
  notes: { type: String },
  createdBy: { type: mongoose.Schema.ObjectId, ref: 'Admin' },
  created: { type: Date, default: Date.now },
  updated: { type: Date, default: Date.now },
});

schema.plugin(require('mongoose-autopopulate'));

schema.index({ client: 1, removed: 1, created: -1 });
schema.index({ plan: 1, removed: 1 });
schema.index({ status: 1, removed: 1 });

module.exports = mongoose.model('ArsAuthorization', schema);
