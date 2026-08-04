const mongoose = require('mongoose');

const schema = new mongoose.Schema({
  removed: { type: Boolean, default: false },
  enabled: { type: Boolean, default: true },
  tipo: {
    type: String,
    required: true,
    enum: ['606', '607', '608', '609'],
  },
  mes: { type: Number, required: true, min: 1, max: 12 },
  anno: { type: Number, required: true },
  status: {
    type: String,
    enum: ['draft', 'generated', 'filed'],
    default: 'draft',
  },
  data: { type: mongoose.Schema.Types.Mixed },
  totalRecords: { type: Number, default: 0 },
  totalAmount: { type: Number, default: 0 },
  filename: { type: String },
  filedAt: { type: Date },
  created: { type: Date, default: Date.now },
  updated: { type: Date, default: Date.now },
});

module.exports = mongoose.model('DgiiReport', schema);
