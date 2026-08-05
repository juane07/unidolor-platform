import { detectFields, SERVICE_CODE_LABEL } from './knowledge-data.js';
import { callGroq } from './ai.js';

const EXTRACTION_FIELDS = [
  'nombre', 'cedula', 'telefono', 'direccion', 'servicio', 'servicioLabel',
  'seguro', 'afiliado', 'email', 'fecha_nacimiento', 'genero', 'sucursal', 'notas',
  'relationship', 'patient_name', 'caller_name', 'caller_phone', 'patient_phone',
  'motivo', 'requisitos'
];

const EXTRACTION_PROMPT = `Eres un extractor de datos de pacientes para UNIDOLOR. Extrae de esta conversación de WhatsApp:
Campos (JSON): nombre (quien es paciente o quien habla), cedula, telefono, direccion, servicio, seguro, afiliado, email, fecha_nacimiento, genero, sucursal, notas, relationship (relacion del que habla con el paciente: esposo/esposa/hijo/etc), patient_name (nombre del paciente si es para otra persona), motivo.
REGLAS: IGNORA direcciones, calles, torres, edificios, sectores y nombres de seguros como si fueran nombre de persona. IGNORA telefonos y cedulas como nombre. Si dice "es para mi esposa que se llama X", el patient_name es X. Si no hay dato, pon null.
Responde SOLO con JSON valido, sin texto adicional.`;

export function emptyExtraction() {
  const e = {};
  for (const f of EXTRACTION_FIELDS) e[f] = null;
  e.confidence = 0;
  return e;
}

function looksLikeGarbage(value) {
  if (!value) return true;
  const v = String(value).trim();
  if (!v || v.length < 3 || v.length > 60) return true;
  if (/^\d+$/.test(v)) return true;
  if (/^\d{3}-\d{7}-\d$/.test(v)) return true;
  return false;
}

export function looksLikeAddress(value) {
  const v = String(value || '').trim();
  return /\b(calle|avenida|av\.|torre|torres|edificio|edif\.|sector|ensanche|apartamento|apt\.|residencial|urbanizaci[oó]n|plaza|centro|no\s*\d|#\d)\b/i.test(v)
    || /^\d/.test(v);
}

export function looksLikeCompany(value) {
  return /\b(banco|seguro|ars|humano|universal|popular|reservas|central|humana|mapfre|palic|senasa|bupa|monumental|metasalud)\b/i.test(String(value || ''));
}

export function cleanName(value) {
  if (!value) return null;
  const v = String(value).trim();
  if (looksLikeGarbage(v) || looksLikeAddress(v) || looksLikeCompany(v)) return null;
  return v;
}

export function sanitizeFormPayload(payload) {
  if (!payload) return payload;
  const p = { ...payload };
  const badName = looksLikeAddress(p.nombre) || looksLikeCompany(p.nombre) || /^\d{3}-\d{7}-\d$/.test((p.nombre || '').trim());
  if (badName) {
    const fallback = cleanName(p.patient_name) || cleanName(p.paciente) || p.patient_name || p.paciente || '';
    if (fallback && fallback !== p.nombre) {
      p.nombre = fallback.trim();
      p.paciente = p.paciente === payload.nombre ? p.nombre : p.paciente;
    }
  }
  if (p.first_name && p.nombre !== payload.nombre) {
    const parts = p.nombre.trim().split(' ');
    p.first_name = parts[0] || '';
    p.last_name = parts.slice(1).join(' ') || '';
  }
  return p;
}

export function mergeExtraction(current, incoming) {
  const merged = { ...(current || emptyExtraction()) };
  let newData = false;

  for (const f of EXTRACTION_FIELDS) {
    let val = incoming && incoming[f] ? String(incoming[f]).trim() : null;
    if (!val || val === 'null') continue;

    // Validación específica por campo
    if (f === 'nombre' || f === 'patient_name' || f === 'caller_name') {
      val = cleanName(val);
      if (!val) continue;
    } else if (f === 'cedula') {
      if (!/[\d-]{6,}/.test(val)) continue;
    } else if (f === 'telefono' || f === 'patient_phone' || f === 'caller_phone') {
      if (!/\d{7,}/.test(val.replace(/[^\d]/g, ''))) continue;
    } else if (f === 'email') {
      if (!/^[\w.+-]+@[\w-]+\.[\w.-]+$/.test(val)) continue;
    } else if (f === 'servicio') {
      // Normalizar a label si es código conocido
      if (SERVICE_CODE_LABEL[val]) {
        merged.servicioLabel = merged.servicioLabel || SERVICE_CODE_LABEL[val];
      }
    }

    // No sobrescribir un valor bueno con basura: solo asignar si el nuevo es distinto
    if (!merged[f]) {
      merged[f] = val;
      newData = true;
    } else if (merged[f] !== val) {
      // Solo sobrescribir si el existente parece basura y el nuevo es válido
      const existingLooksBad = looksLikeAddress(merged[f]) || looksLikeCompany(merged[f]);
      const incomingGood = f === 'nombre' || f === 'patient_name' || f === 'caller_name'
        ? !!cleanName(val)
        : true;
      if (existingLooksBad && incomingGood) {
        merged[f] = val;
        newData = true;
      }
    }
  }

  // Si hay un nombre de paciente y no hay nombre principal, usar patient_name
  if (!merged.nombre && merged.patient_name) {
    merged.nombre = merged.patient_name;
  }

  return { merged, newData };
}

export function isExtractionComplete(extraction) {
  if (!extraction) return false;
  const nombre = cleanName(extraction.nombre) || cleanName(extraction.patient_name) || cleanName(extraction.caller_name);
  const direccion = extraction.direccion;
  const telefono = extraction.telefono || extraction.patient_phone || extraction.caller_phone;
  const servicio = extraction.servicio || extraction.motivo;
  return !!(nombre && telefono && (servicio || direccion));
}

export function confidenceScore(extraction) {
  let score = 0;
  const fields = ['nombre', 'telefono', 'direccion', 'servicio'];
  for (const f of fields) {
    if (extraction && extraction[f]) score += 0.25;
  }
  return Math.min(1, score);
}

function hasDataSignal(text) {
  if (!text) return false;
  const t = text.toLowerCase();
  const signals = [
    /\b\d{3}[-.\s]?\d{7}[-.\s]?\d\b/,       // cédula
    /\(?\b\d{3}\b\)?[-.\s]?\d{3}[-.\s]?\d{4}/, // teléfono
    /@[\w.-]+/,                               // email
    /\b\d{1,2}[\/-]\d{1,2}[\/-]\d{2,4}\b/,   // fecha
    /(?:me llamo|mi nombre|soy|es para|se llama|le habla|llamame)/i,
    /(?:vivo en|vive en|calle|avenida|avda|sector|ensanche|residencial|torre|edificio|apt|apartamento|domicilio)/i,
    /(?:seguro|ars|afiliado|humano|universal|mapfre|palic|senasa|bupa|monumental|metasalud)/i,
    /(?:consulta|rayos|sonografia|doppler|enfermeria|terapia|laboratorio|transfusion|curacion|dolor|paliativ|domicilio|visita|inyeccion|suero)/i,
    /\d{7,}/,
  ];
  return signals.some((re) => re.test(t));
}

export async function extractData(env, userTexts, currentExtraction) {
  if (!userTexts || !userTexts.length) {
    return { extraction: currentExtraction || emptyExtraction(), action: 'continue', confidence: confidenceScore(currentExtraction), source: 'none' };
  }

  const allTexts = Array.isArray(userTexts) ? userTexts : [userTexts];

  // Paso 1: regex sobre TODO el historial (gratis, instantáneo)
  const regexFields = detectFields(allTexts);
  const regexMerge = mergeExtraction(currentExtraction, regexFields);

  // ¿El regex ya capturó un nombre válido?
  const regexHasGoodName = !!(cleanName(regexMerge.merged.nombre) || cleanName(regexMerge.merged.patient_name) || cleanName(regexMerge.merged.caller_name));
  const regexComplete = regexHasGoodName && regexMerge.merged.telefono && (regexMerge.merged.servicio || regexMerge.merged.direccion);

  if (regexComplete) {
    return {
      extraction: regexMerge.merged,
      action: 'export',
      confidence: confidenceScore(regexMerge.merged),
      source: 'regex',
    };
  }

  // Si la extracción actual ya está completa con nombre válido, no llamar a la IA
  const currentHasGoodName = !!(cleanName(currentExtraction?.nombre) || cleanName(currentExtraction?.patient_name) || cleanName(currentExtraction?.caller_name));
  if (currentHasGoodName && (currentExtraction?.telefono || currentExtraction?.patient_phone || currentExtraction?.caller_phone) && (currentExtraction?.servicio || currentExtraction?.direccion)) {
    return {
      extraction: regexMerge.merged,
      action: 'export',
      confidence: confidenceScore(regexMerge.merged),
      source: 'regex-existing',
    };
  }

  // Si el mensaje no tiene señales de datos (saludo, gracias), no llamar a la IA
  if (!allTexts.some(hasDataSignal)) {
    return {
      extraction: regexMerge.merged,
      action: 'continue',
      confidence: confidenceScore(regexMerge.merged),
      source: 'regex-nosignal',
    };
  }

  // Paso 2: IA con contexto ampliado (últimos 10 mensajes del usuario)
  let aiJson = null;
  try {
    const forAI = allTexts.slice(-10);
    const conversationText = forAI.join('\n---\n');
    const prompt = `${EXTRACTION_PROMPT}\n\nConversación:\n${conversationText}`;
    let raw;
    if (env.GROQ_API_KEY) {
      raw = await callGroq(env.GROQ_API_KEY, prompt);
    } else if (env.GEMINI_API_KEY) {
      const { callGemini } = await import('./ai.js');
      raw = await callGemini(env.GEMINI_API_KEY, prompt, env.SEGUIMIENTO, env.GROQ_API_KEY);
    } else {
      throw new Error('No AI keys configured');
    }
    const jsonStart = raw.indexOf('{');
    const jsonEnd = raw.lastIndexOf('}') + 1;
    if (jsonStart >= 0 && jsonEnd > jsonStart) {
      aiJson = JSON.parse(raw.slice(jsonStart, jsonEnd));
    }
  } catch (err) {
    console.error('AI extraction error:', err.message);
  }

  if (aiJson) {
    const aiMerge = mergeExtraction(regexMerge.merged, aiJson);
    const aiName = cleanName(aiMerge.merged.nombre) || cleanName(aiMerge.merged.patient_name) || cleanName(aiMerge.merged.caller_name);
    const aiComplete = !!aiName && (aiMerge.merged.telefono || aiMerge.merged.patient_phone || aiMerge.merged.caller_phone) && (aiMerge.merged.servicio || aiMerge.merged.direccion);
    return {
      extraction: aiMerge.merged,
      action: aiComplete ? 'export' : 'continue',
      confidence: confidenceScore(aiMerge.merged),
      source: 'ai',
    };
  }

  // Paso 3: fallback — devolver lo que el regex encontró
  return {
    extraction: regexMerge.merged,
    action: 'continue',
    confidence: confidenceScore(regexMerge.merged),
    source: 'regex-fallback',
  };
}
