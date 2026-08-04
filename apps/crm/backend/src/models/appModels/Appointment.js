const mongoose = require('mongoose');

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
  doctor: {
    type: mongoose.Schema.ObjectId,
    ref: 'Doctor',
    required: true,
    autopopulate: true,
  },
  branch: {
    type: mongoose.Schema.ObjectId,
    ref: 'Branch',
    autopopulate: true,
  },
  opportunity: {
    type: mongoose.Schema.ObjectId,
    ref: 'Opportunity',
    autopopulate: true,
  },
  date: {
    type: Date,
    required: true,
  },
  startTime: {
    type: String,
  },
  endTime: {
    type: String,
  },
  duration: {
    type: Number,
    default: 30,
  },
  type: {
    type: String,
    enum: ['primera_vez', 'seguimiento', 'urgencia', 'visita_domiciliaria'],
    default: 'primera_vez',
  },
  serviceName: {
    type: String,
  },
  policyNumber: {
    type: String,
  },
  sector: {
    type: String,
  },
  familyName: {
    type: String,
  },
  familyIdNumber: {
    type: String,
  },
  familyPhone: {
    type: String,
  },
  familyDomicile: {
    type: String,
  },
  familyEmail: {
    type: String,
  },
  pdf: {
    type: String,
  },
  status: {
    type: String,
    enum: ['programada', 'realizada', 'cancelada', 'no_asistio'],
    default: 'programada',
  },
  notes: {
    type: String,
  },
  createdBy: {
    type: mongoose.Schema.ObjectId,
    ref: 'Admin',
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

schema.index({ client: 1, removed: 1, date: -1 });
schema.index({ doctor: 1, date: 1, removed: 1 });
schema.index({ 'opportunity.service': 1, removed: 1 });

module.exports = mongoose.model('Appointment', schema);
