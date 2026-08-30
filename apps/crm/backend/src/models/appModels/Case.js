const mongoose = require('mongoose');

/**
 * Case (Caso / Episodio)
 * Contenedor de todo el ciclo de atención del paciente.
 * Un Case agrupa: motivo de contacto → evaluación → servicio → plan médico → procedimiento → resultado → seguimiento.
 */
const schema = new mongoose.Schema({
  removed: { type: Boolean, default: false },
  enabled: { type: Boolean, default: true },

  // ── Identificación ──
  caseNumber: { type: String, unique: true, sparse: true }, // Auto-generado: CASO-YYYY-NNNN
  title: { type: String }, // Resumen breve del caso

  // ── Referencias principales ──
  client: { type: mongoose.Schema.Types.ObjectId, ref: 'Client', required: true },
  opportunity: { type: mongoose.Schema.Types.ObjectId, ref: 'Opportunity' },
  doctor: { type: mongoose.Schema.Types.ObjectId, ref: 'Doctor' },

  // ── Motivo de contacto (lo que el paciente expresa) ──
  motivoContacto: {
    tipo: {
      type: String,
      enum: ['dolor', 'consulta', 'domicilio', 'estudios', 'enfermeria', 'rehab', 'paliativos', 'orientacion', 'otro'],
    },
    descripcion: { type: String }, // Texto libre del paciente
    ubicacionDolor: { type: String }, // Zona del cuerpo si aplica
    intensidadDolor: { type: Number, min: 0, max: 10 },
  },

  // ── Servicio ofrecido (lo que Unidolor determina) ──
  servicio: { type: mongoose.Schema.Types.ObjectId, ref: 'Service' },
  servicioCodigo: { type: String }, // Código del catálogo (CMD, DOL, PROC, etc.)
  servicioLabel: { type: String },

  // ── Plan médico ──
  planMedico: {
    diagnostico: { type: String },
    tratamiento: { type: String },
    observaciones: { type: String },
    medicoTratante: { type: String },
  },

  // ── Procedimiento / Estudio ──
  procedimiento: { type: mongoose.Schema.Types.ObjectId, ref: 'Procedure' },
  procedimientoCodigo: { type: String },
  procedimientoLabel: { type: String },

  // ── Consentimientos ──
  consentimientos: [{
    template: { type: mongoose.Schema.Types.ObjectId, ref: 'ConsentTemplate' },
    instance: { type: mongoose.Schema.Types.ObjectId, ref: 'ConsentInstance' },
    requerido: { type: Boolean, default: false },
    firmado: { type: Boolean, default: false },
    fechaFirma: { type: Date },
  }],

  // ── Requisitos ──
  requisitos: {
    indicacionMedica: { type: Boolean, default: false },
    ordenMedica: { type: Boolean, default: false },
    fotosRequeridas: { type: Boolean, default: false },
    documentosAdicionales: [{ type: String }],
  },

  // ── Seguimiento ──
  seguimiento: {
    proximaVisita: { type: Date },
    frecuencia: { type: String },
    observaciones: { type: String },
  },

  // ── Estado del caso ──
  status: {
    type: String,
    enum: ['abierto', 'en_evaluacion', 'planificado', 'en_proceso', 'completado', 'cancelado', 'seguimiento'],
    default: 'abierto',
  },

  // ── Fuente ──
  source: {
    type: String,
    enum: ['whatsapp', 'telefono', 'web', 'referido', 'otro'],
    default: 'whatsapp',
  },
  canalContacto: { type: String }, // Ej: "whatsapp_bot", "formulario_web", "llamada"

  // ── Notas ──
  notes: [{ type: String }],

  // ── Metadatos ──
  created: { type: Date, default: Date.now },
  updated: { type: Date, default: Date.now },
});

// Auto-generar caseNumber antes de guardar
schema.pre('save', async function(next) {
  if (!this.caseNumber) {
    const year = new Date().getFullYear();
    const count = await mongoose.model('Case').countDocuments({ created: { $gte: new Date(year, 0, 1) } });
    this.caseNumber = `CASO-${year}-${String(count + 1).padStart(4, '0')}`;
  }
  this.updated = new Date();
  next();
});

schema.index({ client: 1, status: 1, removed: 1 });
schema.index({ caseNumber: 1 });
schema.index({ servicioCodigo: 1, removed: 1 });
schema.index({ status: 1, created: -1, removed: 1 });

module.exports = mongoose.model('Case', schema);
