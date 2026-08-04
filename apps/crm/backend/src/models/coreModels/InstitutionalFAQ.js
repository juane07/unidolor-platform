const mongoose = require('mongoose');

const schema = new mongoose.Schema({
  removed: { type: Boolean, default: false },
  enabled: { type: Boolean, default: true },
  
  // Categorización
  categoria: { type: String, required: true, index: true }, // PACIENTES, FAMILIARES, MÉDICOS REFERIDORES, EMPRESAS, ARS, ENFERMERÍA, SECRETARIAS, FACTURACIÓN, GERENCIA, TECNOLOGÍA, INTELIGENCIA ARTIFICIAL
  subcategoria: { type: String, index: true }, // Información General, Consultas, Procedimientos, Medicina Domiciliaria, Hemohogar, Oncomejórate, Programa Adulto Mayor, Cuidados Paliativos, Facturación
  
  // Pregunta y respuesta
  pregunta: { type: String, required: true },
  respuesta: { type: String, required: true },
  
  // Metadatos
  audiencia: [{ type: String, enum: ['paciente', 'familiar', 'medico_referidor', 'empresa', 'ars', 'enfermeria', 'secretaria', 'facturacion', 'gerencia', 'tecnologia', 'ia'], index: true }],
  tags: [{ type: String, index: true }], // seguros, cotización, domicilio, procedimientos, etc.
  prioridad: { type: Number, default: 0 }, // para ordenar
  
  // Trazabilidad
  fuente: { type: String, default: 'Cerebro/09_FAQ.md' },
  version: { type: String, default: '1.0' },
  validadoEnConversaciones: { type: Number, default: 0 }, // nº mensajes que respaldan
  ultimaActualizacion: { type: Date, default: Date.now },
  actualizadoPor: { type: String, default: 'sistema' },
  
  created: { type: Date, default: Date.now },
  updated: { type: Date, default: Date.now },
});

// Índices compuestos para búsquedas frecuentes
schema.index({ categoria: 1, subcategoria: 1, prioridad: 1 });
schema.index({ audiencia: 1, enabled: 1, removed: 1 });
schema.index({ tags: 1, enabled: 1, removed: 1 });

// Text search index (idioma español para evitar stopwords)
schema.index(
  { pregunta: 'text', respuesta: 'text', tags: 'text' },
  { default_language: 'spanish', name: 'faq_text_es' }
);

module.exports = mongoose.model('InstitutionalFAQ', schema);