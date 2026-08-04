const mongoose = require('mongoose');

const schema = new mongoose.Schema({
  removed: { type: Boolean, default: false },
  enabled: { type: Boolean, default: true },
  invoice: { type: mongoose.Schema.ObjectId, ref: 'Invoice', autopopulate: true },
  client: { type: mongoose.Schema.ObjectId, ref: 'Client', autopopulate: true },
  tipo: {
    type: String,
    required: true,
    enum: ['ITBIS', 'ISR'],
  },
  percentage: { type: Number, required: true },
  baseAmount: { type: Number, required: true },
  amount: { type: Number, required: true },
  ncf: { type: String },
  date: { type: Date, default: Date.now },
  status: {
    type: String,
    enum: ['active', 'cancelled'],
    default: 'active',
  },
  created: { type: Date, default: Date.now },
  updated: { type: Date, default: Date.now },
});

schema.plugin(require('mongoose-autopopulate'));

schema.index({ client: 1, removed: 1, date: -1 });
schema.index({ invoice: 1, removed: 1 });
schema.index({ tipo: 1, removed: 1 });

module.exports = mongoose.model('Withholding', schema);
