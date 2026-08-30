const mongoose = require('mongoose');

/**
 * Procedure (Procedimiento / Estudio)
 * Catálogo de hojas de procedimientos realizados por Unidolor.
 * Cada procedure es una unidad de trabajo concreta (infiltración epidural, ecografía abdominal, etc.)
 */
const schema = new mongoose.Schema({
  removed: { type: Boolean, default: false },
  enabled: { type: Boolean, default: true },

  // ── Identificación ──
  codigo: { type: String, required: true, unique: true }, // Ej: INF-EPIDURAL, SONO-ABDOMINAL
  nombre: { type: String, required: true },
  descripcion: { type: String },

  // ── Referencia al servicio padre ──
  servicioRef: { type: String, required: true }, // Código del servicio (PROC, SONO, RX, ENF, etc.)

  // ── Configuración ──
  duracionMin: { type: Number, default: 15 },
  requiereConsent: { type: String }, // ID del template de consentimiento (o null)
  requiereIndicacion: { type: Boolean, default: true },
  material: [{ type: String }],

  // ── Clasificación ──
  grupoCatalogo: {
    type: String,
    enum: [
      'medicina_dolor', 'procedimientos_intervencionistas',
      'rayos_x', 'sonografia', 'doppler_vascular', 'estudios_cardiacos',
      'laboratorio', 'enfermeria',
    ],
  },
  modalidad: {
    type: String,
    enum: ['clinica', 'domicilio'],
    default: 'clinica',
  },

  // ── Consentimiento asociado ──
  consentTemplate: { type: mongoose.Schema.Types.ObjectId, ref: 'ConsentTemplate' },

  // ── Metadatos ──
  basePrice: { type: Number, default: 0 },
  isActive: { type: Boolean, default: true },
  created: { type: Date, default: Date.now },
  updated: { type: Date, default: Date.now },
});

schema.index({ codigo: 1 });
schema.index({ servicioRef: 1, enabled: 1, removed: 1 });
schema.index({ grupoCatalogo: 1, enabled: 1, removed: 1 });

module.exports = mongoose.model('Procedure', schema);
