import { detectarIntencion } from './knowledge-data.js';

const URGENT_KEYWORDS = [
  'urgencia', 'emergencia', 'grave', 'intenso', 'dolor fuerte',
  'sangrado', 'dificultad para respirar', 'no respira', 'desmayo',
  'convulsion', 'infarto', 'accidente', 'ambulancia', '911',
  'muriendo', 'muerte', 'perdio el conocimiento', 'inconsciente',
  'ataque', 'derrame', 'hemorragia'
];

export function detectUrgency(text) {
  const lower = text.toLowerCase();
  return URGENT_KEYWORDS.some(k => lower.includes(k));
}

export { detectarIntencion };
