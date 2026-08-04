const mongoose = require('mongoose');

const schema = new mongoose.Schema({
  removed: { type: Boolean, default: false },
  enabled: { type: Boolean, default: true },
  tipo: {
    type: String,
    required: true,
    enum: [
      '01', '02', '03', '04', '05',
      '06', '07', '08', '09', '10', '11',
      '12', '13', '14', '15',
    ],
  },
  nombre: { type: String, required: true },
  branch: {
    type: mongoose.Schema.ObjectId,
    ref: 'Branch',
    autopopulate: true,
  },
  regimen: {
    type: String,
    enum: ['RST', 'RDL', 'RGN'],
    default: 'RST',
  },
  secuenciaActual: { type: Number, default: 0 },
  rangoDesde: { type: Number, required: true },
  rangoHasta: { type: Number, required: true },
  vigenciaDesde: { type: Date },
  vigenciaHasta: { type: Date },
  isActive: { type: Boolean, default: true },
  created: { type: Date, default: Date.now },
  updated: { type: Date, default: Date.now },
});

module.exports = mongoose.model('NcfSequence', schema);
