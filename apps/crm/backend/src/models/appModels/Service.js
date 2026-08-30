const mongoose = require('mongoose');

const schema = new mongoose.Schema({
  removed: { type: Boolean, default: false },
  enabled: { type: Boolean, default: true },
  name: { type: String, required: true },
  cupsCode: { type: String },
  simonLevel: { type: String, default: '' },
  aliases: [{ type: String }],
  description: { type: String },
  category: {
    type: String,
    enum: ['consulta', 'procedimiento', 'visita_domicilio', 'estudio', 'otro'],
    default: 'consulta',
  },
  type: {
    type: String,
    enum: ['primera_vez', 'seguimiento', 'urgencia', 'visita_domicilio', 'procedimiento', 'otro'],
    default: 'primera_vez',
  },
  // Clasificación multi-atributo (Cerebro 02_SERVICES.md + 04_OPERATIONS.md)
  grupoCatalogo: {
    type: String,
    enum: [
      'consultas_medicas', 'medicina_dolor', 'procedimientos_intervencionistas',
      'cuidados_paliativos', 'enfermeria', 'rayos_x', 'sonografia',
      'doppler_vascular', 'estudios_cardiacos', 'laboratorio',
      'hospitalizacion_domiciliaria', 'hemohogar', 'oncomejorate', 'terapias',
      'programas_especiales', 'programas_empresariales', 'sin_clasificar'
    ],
  },
  modalidad: {
    type: String,
    enum: ['clinica', 'domicilio', 'telemedicina'],
    default: 'clinica',
  },
  tipoServicio: {
    type: String,
    enum: ['consulta', 'procedimiento', 'diagnostico', 'enfermeria', 'hospitalizacion_domiciliaria', 'programa_especial'],
    default: 'consulta',
  },
  clasificacion: [{
    type: String,
    enum: [
      'clinico', 'administrativo', 'diagnostico', 'terapeutico', 'preventivo',
      'domiciliario', 'hospitalario', 'ambulatorio', 'empresarial', 'telemedicina'
    ],
  }],
  prioridadDefault: {
    type: String,
    enum: ['emergente', 'urgente', 'preferente', 'programado'],
    default: 'programado',
  },
  // Atributos operativos (02_SERVICES.md "Reglas institucionales")
  tiempoEstimadoMin: { type: Number, default: 0 },
  requiereConsentimiento: { type: Boolean, default: false },
  requiereIndicacionMedica: { type: Boolean, default: false },
  materiales: [{ type: String }],
  personalRequerido: [{ type: String }],
  preguntasCotizacion: [{ type: String }],
  basePrice: { type: Number, default: 0 },
  isActive: { type: Boolean, default: true },

  // ── Referencias a catálogos del catálogo unificado ──
  procedures: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Procedure' }],
  consentTemplates: [{ type: mongoose.Schema.Types.ObjectId, ref: 'ConsentTemplate' }],
  catalogCodigo: { type: String }, // Código en services-catalog.js (CMD, DOL, PROC, etc.)

  created: { type: Date, default: Date.now },
  updated: { type: Date, default: Date.now },
});

schema.index({ name: 'text', cupsCode: 'text', aliases: 'text' });
schema.index({ modalidad: 1, enabled: 1, removed: 1 });
schema.index({ tipoServicio: 1, enabled: 1, removed: 1 });
schema.index({ clasificacion: 1, enabled: 1, removed: 1 });
schema.index({ grupoCatalogo: 1, enabled: 1, removed: 1 });
schema.index({ catalogCodigo: 1, removed: 1 });

module.exports = mongoose.model('Service', schema);