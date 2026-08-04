const mongoose = require('mongoose');

// --- Sub-schemas basados en Cerebro 03_CLINICAL.md ---

// Manejo del dolor (Cerebro: "Toda evaluación del dolor debe documentar...")
const dolorSchema = new mongoose.Schema(
  {
    localizacion: { type: String },
    intensidad: { type: Number, min: 0, max: 10 },
    duracion: { type: String },
    irradiacion: { type: String },
    calidad: { type: String },
    factoresAgravantes: { type: String },
    factoresAtenuantes: { type: String },
    limitacionFuncional: { type: String },
    impactoEmocional: { type: String },
    tratamientosPrevios: { type: String },
    respuestaPrevia: { type: String },
  },
  { _id: false }
);

// Medicamentos (Cerebro: nombre, indicación, dosis, vía, frecuencia, duración, ajustes, contraindicaciones, interacciones)
const medicamentoSchema = new mongoose.Schema(
  {
    nombre: { type: String },
    indicacion: { type: String },
    dosis: { type: String },
    via: { type: String },
    frecuencia: { type: String },
    duracion: { type: String },
    ajustes: { type: String },
    contraindicaciones: { type: String },
    interaccionesRelevantes: { type: String },
  },
  { _id: false }
);

// Procedimiento (Cerebro: objetivo, indicaciones, contraindicaciones, materiales, equipos,
// medicamentos, preparación, consentimiento, técnica, cuidados posteriores, complicaciones, seguimiento)
const procedimientoSchema = new mongoose.Schema(
  {
    service: { type: mongoose.Schema.ObjectId, ref: 'Service', autopopulate: true },
    serviceName: { type: String },
    objetivo: { type: String },
    indicaciones: { type: String },
    contraindicaciones: { type: String },
    materiales: [{ type: String }],
    equipos: [{ type: String }],
    medicamentos: [medicamentoSchema],
    preparacion: { type: String },
    consentimiento: {
      requerido: { type: Boolean, default: false },
      obtenido: { type: Boolean, default: false },
      fecha: { type: Date },
      riesgos: { type: String },
      beneficios: { type: String },
      alternativas: { type: String },
      preguntasPaciente: { type: String },
      aceptacion: { type: Boolean, default: false },
    },
    tecnica: { type: String },
    cuidadosPosteriores: { type: String },
    complicaciones: { type: String },
    seguimiento: { type: String },
  },
  { _id: false }
);

// Complicación (Cerebro: descripción, fecha, severidad, manejo, resultado, seguimiento, medidas preventivas)
const complicacionSchema = new mongoose.Schema(
  {
    descripcion: { type: String },
    fecha: { type: Date },
    severidad: { type: String, enum: ['leve', 'moderada', 'grave', 'critica'] },
    manejo: { type: String },
    resultado: { type: String },
    seguimiento: { type: String },
    medidasPreventivas: { type: String },
  },
  { _id: false }
);

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
    autopopulate: true,
  },
  appointment: {
    type: mongoose.Schema.ObjectId,
    ref: 'Appointment',
    autopopulate: true,
  },
  service: {
    type: mongoose.Schema.ObjectId,
    ref: 'Service',
    autopopulate: true,
  },
  serviceName: { type: String },
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
  date: {
    type: Date,
    default: Date.now,
  },
  hora: { type: String },

  // --- Evaluación clínica (Cerebro: Historia clínica, EA, Antecedentes, Medicamentos,
  // Alergias, Examen físico, Estudios, Diagnóstico, Diferenciales, Objetivos, Plan, Seguimiento)
  motivoConsulta: { type: String },
  enfermedadActual: { type: String },
  antecedentes: { type: String },
  alergias: [{ type: String }],
  medicamentosActuales: [medicamentoSchema],
  examenFisico: { type: String },
  estudiosDisponibles: { type: String },
  diagnosticosDiferenciales: { type: String },
  objetivosTerapeuticos: { type: String },
  plan: { type: String },
  seguimiento: { type: String },

  // --- Evaluación del dolor (obligatoria en Medicina del Dolor)
  dolor: dolorSchema,

  // --- Diagnóstico / tratamiento (compatibilidad con campos originales)
  diagnosis: {
    type: String,
  },
  treatment: {
    type: String,
  },
  prescription: {
    type: String,
  },
  evolutionNotes: {
    type: String,
  },

  // --- Procedimientos realizados
  procedimientos: [procedimientoSchema],

  // --- Complicaciones registradas
  complicaciones: [complicacionSchema],

  // --- Enfermería (Cerebro: valoración inicial, procedimiento, materiales,
  // medicamentos administrados, educación, observaciones, evolución)
  enfermeria: {
    valoracionInicial: { type: String },
    procedimientoRealizado: { type: String },
    materialesUtilizados: [{ type: String }],
    medicamentosAdministrados: [medicamentoSchema],
    educacionBrindada: { type: String },
    observaciones: { type: String },
    evolucion: { type: String },
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
schema.index({ doctor: 1, date: -1 });
schema.index({ service: 1, removed: 1 });
schema.index({ modalidad: 1, tipoServicio: 1, removed: 1 });
schema.index({ 'dolor.intensidad': 1 });
schema.index({ alergias: 1 });

module.exports = mongoose.model('ClinicalRecord', schema);
