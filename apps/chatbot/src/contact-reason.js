/*
 * ============================================================
 *  UNIDOLOR — Contact Reason Module
 *  Flujo: Motivo de Contacto → Ubicación → Texto libre → Case
 * ============================================================
 */

// Motivos de contacto (debe coincidir con services-catalog.js MOTIVOS_CONTACTO)
export const MOTIVOS_CONTACTO = [
  {
    id: 'dolor',
    label: 'Dolor o molestia',
    keywords: ['dolor', 'duele', 'molestia', 'molesto', 'ardor', 'hormigueo', 'inflamacion', 'inchazon'],
    preguntasIniciales: [
      '¿Qué zona del cuerpo le duele?',
      '¿Desde cuándo tiene el dolor?',
      '¿El dolor es continuo o intermitente?',
    ],
  },
  {
    id: 'consulta',
    label: 'Consulta médica',
    keywords: ['consulta', 'medico', 'doctor', 'doctora', 'dra', 'dr', 'revisar', 'chequeo', 'valoracion'],
    preguntasIniciales: [
      '¿Es la primera vez que nos consulta?',
      '¿Qué motivo le trae?',
    ],
  },
  {
    id: 'domicilio',
    label: 'Servicio a domicilio',
    keywords: ['domicilio', 'casa', 'encamado', 'no puede movilizarse', 'hogar', 'vivir'],
    preguntasIniciales: [
      '¿Qué tipo de atención necesita en casa?',
      '¿El paciente puede movilizarse?',
    ],
  },
  {
    id: 'estudios',
    label: 'Estudios o exámenes',
    keywords: ['rayos', 'radiografia', 'sonografia', 'ecografia', 'ecg', 'holter', 'doppler', 'laboratorio', 'analisis', 'estudio'],
    preguntasIniciales: [
      '¿Qué estudio necesita?',
      '¿Tiene orden médica para el estudio?',
    ],
  },
  {
    id: 'enfermeria',
    label: 'Enfermería',
    keywords: ['enfermeria', 'enfermera', 'enfermero', 'curacion', 'cura', 'inyeccion', 'suero', 'sonda', 'nebulizacion'],
    preguntasIniciales: [
      '¿Qué tipo de atención de enfermería necesita?',
      '¿Cada cuántos días se realizaría?',
    ],
  },
  {
    id: 'rehab',
    label: 'Terapia o rehabilitación',
    keywords: ['terapia', 'rehabilitacion', 'fisioterapia', 'fisioterapeuta'],
    preguntasIniciales: [
      '¿Qué condición necesita rehabilitar?',
      '¿Ha tenido cirugía reciente?',
    ],
  },
  {
    id: 'paliativos',
    label: 'Cuidados paliativos',
    keywords: ['paliativos', 'cuidados paliativos', 'terminal', 'avanzado'],
    preguntasIniciales: [
      '¿Cuál es el diagnóstico del paciente?',
      '¿Dónde se encuentra actualmente el paciente?',
    ],
  },
  {
    id: 'orientacion',
    label: 'Orientación o información',
    keywords: ['info', 'informacion', 'saber', 'conocer', 'pregunta', 'cuanto', 'precio', 'costo', 'cotizar'],
    preguntasIniciales: [
      '¿Qué le gustaría saber?',
      '¿Sobre cuál de nuestros servicios?',
    ],
  },
  {
    id: 'otro',
    label: 'Otro',
    keywords: [],
    preguntasIniciales: [
      '¿En qué podemos ayudarle?',
    ],
  },
];

/**
 * Clasificar el motivo de contacto desde el texto del usuario.
 * @param {string} text - Texto del usuario
 * @returns {object} Motivo detectado
 */
export function classifyMotivo(text) {
  const t = text.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  for (const motivo of MOTIVOS_CONTACTO) {
    if (motivo.keywords.some(kw => t.includes(kw))) return motivo;
  }
  return MOTIVOS_CONTACTO.find(m => m.id === 'otro');
}

/**
 * Obtener lista de motivos para el menú del chatbot.
 * @returns {string} Lista numerada de motivos
 */
export function formatMotivosMenu() {
  return MOTIVOS_CONTACTO
    .filter(m => m.id !== 'otro')
    .map((m, i) => `${i + 1}. ${m.label}`)
    .join('\n');
}

/**
 * Obtener motivo por número de selección.
 * @param {string} selection - Texto del usuario (número o texto)
 * @returns {object|null} Motivo seleccionado o null
 */
export function getMotivoBySelection(selection) {
  const num = parseInt(selection.trim());
  const filtered = MOTIVOS_CONTACTO.filter(m => m.id !== 'otro');
  if (!isNaN(num) && num >= 1 && num <= filtered.length) {
    return filtered[num - 1];
  }
  // Intentar clasificar por texto
  return classifyMotivo(selection);
}

/**
 * Formatear preguntas iniciales del motivo para el chatbot.
 * @param {object} motivo - Objeto motivo
 * @returns {string} Preguntas formateadas
 */
export function formatMotivoPreguntas(motivo) {
  if (!motivo || !motivo.preguntasIniciales) return '';
  return motivo.preguntasIniciales.join('\n');
}

/**
 * Detectar si una ubicación es "domicilio" o "clínica" desde el texto.
 * @param {string} text - Texto del usuario
 * @returns {string|null} 'domicilio', 'clinica', o null
 */
export function detectUbicacion(text) {
  const t = text.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  if (/domicilio|casa|hogar|encamado|no puede movilizarse/.test(t)) return 'domicilio';
  if (/clinica|consultorio|oficina|sucursal/.test(t)) return 'clinica';
  return null;
}

/**
 * Construir el payload del motivo de contacto para enviar al CRM.
 * @param {object} params
 * @returns {object} Payload para Case.motivoContacto
 */
export function buildMotivoPayload({ motivoId, descripcion, ubicacionDolor, intensidadDolor }) {
  return {
    tipo: motivoId || 'otro',
    descripcion: descripcion || '',
    ubicacionDolor: ubicacionDolor || '',
    intensidadDolor: typeof intensidadDolor === 'number' ? intensidadDolor : null,
  };
}
