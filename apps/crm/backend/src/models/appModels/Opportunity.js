const mongoose = require('mongoose');
const { stateMachineFlujo } = require('@/config/institutionalConfig');

const schema = new mongoose.Schema({
  removed: {
    type: Boolean,
    default: false,
  },
  enabled: {
    type: Boolean,
    default: true,
  },

  client: {
    type: mongoose.Schema.ObjectId,
    ref: 'Client',
    required: true,
    autopopulate: true,
  },
  stage: {
    type: String,
    enum: stateMachineFlujo.estados,
    default: 'solicitud',
    required: true,
  },
  // Historial de transiciones de etapa (trazabilidad, 04_OPERATIONS.md)
  stageHistory: [
    {
      from: { type: String },
      to: { type: String },
      at: { type: Date, default: Date.now },
      by: { type: mongoose.Schema.ObjectId, ref: 'Admin' },
    },
  ],
  service: {
    type: String,
  },
  source: {
    type: String,
    enum: ['whatsapp', 'manual', 'web', 'referido'],
    default: 'manual',
  },
  assignedTo: {
    type: mongoose.Schema.ObjectId,
    ref: 'Admin',
  },
  notes: {
    type: String,
  },
  amount: {
    type: Number,
    default: 0,
  },
  convertedToInvoice: {
    type: mongoose.Schema.ObjectId,
    ref: 'Invoice',
  },
  createdBy: {
    type: mongoose.Schema.ObjectId,
    ref: 'Admin',
  },
  metadata: {
    type: mongoose.Schema.Types.Mixed,
  },
  created: {
    type: Date,
    default: Date.now,
  },
  updated: {
    type: Date,
    default: Date.now,
  },
});

schema.plugin(require('mongoose-autopopulate'));

schema.index({ client: 1, removed: 1, created: -1 });
schema.index({ stage: 1, removed: 1 });
schema.index({ service: 1, removed: 1 });

module.exports = mongoose.model('Opportunity', schema);
