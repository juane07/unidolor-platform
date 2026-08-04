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
  doctor: {
    type: mongoose.Schema.ObjectId,
    ref: 'Doctor',
    required: true,
    autopopulate: true,
  },
  branch: {
    type: mongoose.Schema.ObjectId,
    ref: 'Branch',
    required: true,
    autopopulate: true,
  },
  dayOfWeek: {
    type: Number,
    min: 0,
    max: 6,
    required: true,
  },
  startTime: {
    type: String,
    required: true,
    match: /^([01]\d|2[0-3]):([0-5]\d)$/,
  },
  endTime: {
    type: String,
    required: true,
    match: /^([01]\d|2[0-3]):([0-5]\d)$/,
  },
  slotDuration: {
    type: Number,
    default: 30,
    min: 15,
    max: 120,
  },
  appointmentTypes: [{
    type: String,
    enum: ['primera_vez', 'seguimiento', 'urgencia'],
  }],
  priority: {
    type: Number,
    default: 10,
  },
  validFrom: {
    type: Date,
  },
  validUntil: {
    type: Date,
  },
  exceptions: [{
    date: {
      type: Date,
      required: true,
    },
    isAvailable: {
      type: Boolean,
      default: false,
    },
    reason: String,
  }],
  created: {
    type: Date,
    default: Date.now,
  },
  updated: {
    type: Date,
    default: Date.now,
  },
});

schema.index({ doctor: 1, dayOfWeek: 1, startTime: 1 });
schema.index({ branch: 1, dayOfWeek: 1 });

schema.plugin(require('mongoose-autopopulate'));

module.exports = mongoose.model('DoctorSchedule', schema);