const mongoose = require('mongoose');

/**
 * ConsentTemplate (Plantilla de Consentimiento)
 * Biblioteca de consentimientos informados con versionado.
 * Cada template es inmutable una vez creado (no se edita, se crea nueva versión).
 */
const schema = new mongoose.Schema({
  removed: { type: Boolean, default: false },
  enabled: { type: Boolean, default: true },

  // ── Identificación ──
  templateId: { type: String, required: true, unique: true }, // Ej: CONSENT_INFILTRACION
  nombre: { type: String, required: true },
  version: { type: String, required: true }, // Ej: '3.0'
  fecha: { type: String }, // Fecha de la versión

  // ── Contenido ──
  html: { type: String, required: true }, // HTML del consentimiento
  camposVariables: [{
    id: { type: String }, // Ej: 'nombre_paciente', 'fecha_procedimiento'
    label: { type: String },
    tipo: { type: String, enum: ['texto', 'fecha', 'firma'], default: 'texto' },
  }],

  // ── Configuración ──
  obligatorio: { type: Boolean, default: false },
  aplicaA: [{ type: String }], // Códigos de procedimiento a los que aplica

  // ── Metadatos ──
  created: { type: Date, default: Date.now },
  updated: { type: Date, default: Date.now },
});

schema.index({ templateId: 1 });
schema.index({ enabled: 1, removed: 1 });

module.exports = mongoose.model('ConsentTemplate', schema);
