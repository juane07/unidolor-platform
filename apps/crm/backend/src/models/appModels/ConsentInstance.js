const mongoose = require('mongoose');

/**
 * ConsentInstance (Instancia de Consentimiento Firmado)
 * Cada registro es inmutable: captura la versión exacta del template en el momento de la firma.
 */
const schema = new mongoose.Schema({
  removed: { type: Boolean, default: false },

  // ── Referencias ──
  template: { type: mongoose.Schema.Types.ObjectId, ref: 'ConsentTemplate', required: true },
  client: { type: mongoose.Schema.Types.ObjectId, ref: 'Client', required: true },
  case: { type: mongoose.Schema.Types.ObjectId, ref: 'Case' },
  procedimiento: { type: mongoose.Schema.Types.ObjectId, ref: 'Procedure' },

  // ── Snapshot del template (inmutable) ──
  templateId: { type: String, required: true }, // Ej: CONSENT_INFILTRACION
  templateVersion: { type: String, required: true }, // Ej: '3.0'
  htmlFirmado: { type: String, required: true }, // HTML con campos rellenados

  // ── Datos del firmante ──
  firmante: {
    nombre: { type: String },
    cedula: { type: String },
    parentesco: { type: String }, // Si firma un familiar
  },

  // ── Estado ──
  status: {
    type: String,
    enum: ['pendiente', 'firmado', 'rechazado', 'vencido'],
    default: 'pendiente',
  },
  fechaFirma: { type: Date },
  fechaVencimiento: { type: Date },

  // ── Metadata ──
  metodoFirma: {
    type: String,
    enum: ['whatsapp', 'web', 'presencial', 'otro'],
    default: 'whatsapp',
  },
  ipAddress: { type: String },
  userAgent: { type: String },

  // ── Metadatos ──
  created: { type: Date, default: Date.now },
  updated: { type: Date, default: Date.now },
});

schema.index({ client: 1, templateId: 1, removed: 1 });
schema.index({ case: 1, removed: 1 });
schema.index({ status: 1, created: -1, removed: 1 });

module.exports = mongoose.model('ConsentInstance', schema);
