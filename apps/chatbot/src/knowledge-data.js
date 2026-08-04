/*
 * ============================================================
 *  UNIDOLOR — Base de Conocimiento
 *  Fuente de verdad: knowledge/conocimiento-unidolor.md
 *  Config interna (keywords, intents): knowledge/chatbot-config.md
 * ============================================================
 *
 *  Categorías de servicio (findService() busca por keywords):
 *  ─────────────────────────────────────────────────────
 *    CON  — Consultas Médicas
 *    DOL  — Medicina del Dolor
 *    PROC — Procedimientos Intervencionistas
 *    PAL  — Cuidados Paliativos
 *    ENF  — Enfermería
 *    RX   — Rayos X
 *    SONO — Sonografía / Ecografía
 *    DOP  — Doppler Vascular
 *    CAR  — Estudios Cardíacos (ECG, Holter, MAPA, Eco)
 *    LAB  — Laboratorio Clínico
 *    HOS  — Hospitalización Domiciliaria
 *    HEMO — Hemohogar (Transfusiones)
 *    QMA  — Oncomejórate (Quimioterapia)
 *    TER  — Terapias
 *    ESP  — Programas Especiales
 *    EMP  — Programas Empresariales
 * ============================================================
 */

import { SITE_URL } from './knowledge.js';

import { servicios } from './knowledge-base.js';
import { faq, politicas, horarios, CATALOGO_COMPLETO } from './knowledge-generated.js';

export { servicios, faq, politicas, horarios, CATALOGO_COMPLETO };

export const CHUNKS_EJEMPLOS = [
  'Cliente: Buenas tardes, ¿hacen visita a domicilio?\nAsistente: Sí, en Santo Domingo, Nagua, Terrenas y Santiago. ¿Su dirección?',
  'Cliente: ¿Cuánto cuesta una consulta?\nAsistente: Se cotiza de forma personalizada. Tiene 2 opciones: 1) llenar el formulario web aquí ${SITE_URL}/solicitud (más rápido), o 2) le tomo los datos por aquí con un asesor. ¿Cómo prefiere?',
  'Cliente: Tengo seguro Humano\nAsistente: Tenemos convenio con Bupa, La Colonial, Meta Salud, APS, Monumental y Aetna. Para otros emitimos carta de reembolso. ¿Su número de afiliado?',
  'Cliente: ¿Necesito orden médica?\nAsistente: Para Rayos X, sonografía y laboratorio sí. Para consulta no.',
  'Cliente: Mi mamá está encamada y necesita enfermería\nAsistente: Entendido. ¿Qué atención necesita y cuántas horas al día? ¿Tiene indicación médica?',
  'Cliente: ¿Duele?\nAsistente: Son procedimientos mínimamente invasivos con anestesia local. El médico le explicará.',
  'Cliente: ¿Diferencia entre cuidados paliativos y curativos?\nAsistente: Los paliativos enfocan calidad de vida y control de síntomas, no curar la enfermedad.',
  'Cliente: Hola\nAsistente: Bienvenido a UNIDOLOR. ¿En qué puedo ayudarle?',
  'Cliente: Quiero una visita para mi mamá\nAsistente: Claro. ¿Nombre completo y cédula de su mamá?',
];

export function findService(text) {
  const t = text.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  const keywords = {
    'rayos x': 'RX', 'radiografia': 'RX', 'rx': 'RX', 'placa': 'RX',
    'sonografia': 'SONO', 'ecografia': 'SONO', 'ultrasonido': 'SONO', 'eco': 'SONO',
    'doppler': 'DOP',
    'holter': 'HOL', 'ritmo cardiaco': 'HOL',
    'mapa': 'MAPA', 'presion arterial': 'MAPA', 'monitoreo presion': 'MAPA',
    'bomba intratecal': 'BOM', 'medtronic': 'BOM', 'recarga bomba': 'BOM',
    'bomba elastomerica': 'BEL', 'infusion continua': 'BEL',
    'transfusion': 'HEMO', 'hemohogar': 'HEMO', 'hemoglobina': 'HEMO', 'sangre': 'HEMO',
    'pie diabetico': 'PD', 'ulcera diabetico': 'PD',
    'terapia fisica': 'TF', 'rehabilitacion': 'TF', 'fisioterapia': 'TF',
    'enfermeria': 'ENF', 'enfermero': 'ENF', 'enfermera': 'ENF',
    'curaciones': 'CUR', 'cura': 'CUR', 'herida': 'CUR', 'ulcera': 'CUR', 'aposito': 'CUR',
    'inyeccion': 'MED', 'inyectable': 'MED', 'aplicar medicamento': 'MED',
    'nebulizacion': 'NEB', 'nebulizar': 'NEB', 'oxigeno': 'NEB', 'inhalacion': 'NEB',
    'sondas': 'SON', 'sonda': 'SON', 'sonda vesical': 'SON', 'foley': 'SON', 'nasogastrica': 'SON',
    'sueros': 'SUE', 'suero': 'SUE', 'venoclisis': 'SUE', 'intravenoso': 'SUE',
    'laboratorio': 'LAB', 'analisis': 'LAB', 'examen sangre': 'MUES', 'muestra': 'MUES',
    'consulta': 'CMD', 'medico a domicilio': 'CMD', 'medico domicilio': 'CMD',
    'consulta clinica': 'CMC', 'consultorio': 'CMC', 'presencial': 'CMC',
    'especialista': 'CE', 'ortopedia': 'CE', 'neurologia': 'CE',
    'dolor': 'DOL', 'paliativos': 'DOL', 'cuidados paliativos': 'DOL',
    'adulto mayor': 'AM', 'programa adulto': 'AM', 'anciano': 'AM',
    'paquete': 'PAQ', 'combo': 'PAQ', 'integral': 'PAQ',
    'cirugia': 'PD',
    'signos vitales': 'SV', 'tomar signos': 'SV',
    'electrocardiograma': 'ECG', 'ecg': 'ECG',
    'ecocardiograma': 'ECO', 'eco cardiaco': 'ECO',
    'internamiento': 'HOS', 'hospitalizacion': 'HOS', 'ingreso': 'HOS',
    'quimioterapia': 'QUIMIO', 'oncomejorate': 'QUIMIO', 'inmunoterapia': 'QUIMIO',
    'antibiotico': 'ANT', 'antibioterapia': 'ANT',
    'dialisis': 'DP', 'dialisis peritoneal': 'DP',
    'nutricion': 'NUTRI', 'nutricional': 'NUTRI', 'dieta': 'NUTRI',
    'odontologia': 'ODONTO', 'dentista': 'ODONTO', 'dientes': 'ODONTO', 'muela': 'ODONTO',
    'postquirurgico': 'POST', 'post operatorio': 'POST', 'post cirugia': 'POST',
    'cuidadora': 'CUIDA', 'cuidador': 'CUIDA',
    'acompanamiento': 'ACOMP', 'traslado': 'ACOMP', 'acompanante': 'ACOMP',
    'receta': 'RECETA', 'receta controlada': 'RECETA',
  };
  for (const [kw, code] of Object.entries(keywords)) {
    if (t.includes(kw)) return code;
  }
  return null;
}

// Etiqueta legible para cada código de findService() (usada en el checklist de datos)
export const SERVICE_CODE_LABEL = {
  CMD: 'consulta médica', CMC: 'consulta en consultorio', CE: 'especialista (neurología, ortopedia, etc.)',
  CI: 'consulta infantil', PROC: 'procedimiento', DOL: 'manejo del dolor', BOM: 'bomba intratecal',
  BEL: 'bomba elastomérica', PAL: 'cuidados paliativos', QUIMIO: 'quimioterapia', ENF: 'enfermería',
  SV: 'signos vitales', MED: 'aplicación de medicamento', NEB: 'nebulización', CUR: 'curaciones',
  SON: 'sondas', SUE: 'sueros/venoclisis', MUES: 'toma de muestras', HOS: 'internamiento',
  ANT: 'antibioticoterapia', RX: 'rayos X', SONO: 'sonografía', DOP: 'doppler',
  ECG: 'electrocardiograma', ECO: 'ecocardiograma', HOL: 'holter', MAPA: 'MAPA',
  LAB: 'laboratorio clínico', HEMO: 'transfusión (Hemohogar)', TF: 'terapia física',
  PD: 'pie diabético', AM: 'programa adulto mayor', PAQ: 'paquete integral', DP: 'diálisis',
  POST: 'cuidado postquirúrgico', CUIDA: 'cuidadora', ACOMP: 'acompañamiento',
  NUTRI: 'nutrición', ODONTO: 'odontología', RECETA: 'receta',
};

// Detección determinística (a nivel de código) de los datos que el cliente ya entregó.
// Escanea los mensajes del cliente y devuelve un objeto con los campos encontrados.
// Se inyecta en el prompt para que el LLM NUNCA vuelva a pedir un dato ya dado.
export function detectFields(userMessages) {
  const fields = { nombre: null, cedula: null, servicio: null, servicioLabel: null, direccion: null, telefono: null, seguro: null, afiliado: null, email: null, fecha_nacimiento: null, genero: null, sucursal: null, notas: null, requisitos: null, caller_name: null, caller_phone: null, patient_name: null, patient_phone: null, relationship: null };
  if (!userMessages) return fields;

  for (const msg of userMessages) {
    if (!msg) continue;
    const t = msg.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');

    if (!fields.telefono) {
      const m = msg.match(/(?:\(?\+?1?\)?[\s-]?)?\(?8\d{2}\)?[\s-]?\d{3}[\s-]?\d{4}/);
      if (m) {
        const clean = m[0].replace(/\D/g, '');
        // Intercambio = dígitos 4-6 (con código país) o 3-5 (sin él). Rechazar 555.
        const body = clean.startsWith('1') && clean.length === 11 ? clean.slice(1) : clean;
        const exchange = body.slice(3, 6);
        const validLen = body.length === 10;
        if (validLen && exchange !== '555' && !/5555/.test(body)) {
          fields.telefono = m[0].trim();
        }
      }
    }
    if (!fields.cedula) {
      const c = msg.match(/\b\d{3}[\s.-]?\d{7}[\s.-]?\d\b/) || msg.match(/\b\d{11}\b/);
      if (c) fields.cedula = c[0];
    }
    if (!fields.direccion && (
      /(?:vivo en|vive en|direccion|domicilio en|calle|avenida|avda|carretera|sector|ensanche|residencial|urbanizaci|edificio|torre|apto|apartamento|km|#)/i.test(msg)
      || (/(?:santo domingo|sto dgo|nagua|santiago|terrenas|bonao|san pedro|la romana|boca chica|los alcarrizos|haina|san cristobal)/i.test(t) && /\d/.test(msg))
    )) {
      fields.direccion = msg
        .trim()
        .replace(/^(?:mi\s+)?(?:direcci[oó]n(?:\s+es)?|domicilio\s+en|vivo\s+en|vive\s+en|yo\s+vivo\s+en|resido\s+en)\s*(?:en\s+|en\s+la\s+|en\s+el\s+|la\s+|el\s+)?[:\-]?\s*/i, '')
        .replace(/\s+[A-ZÁÉÍÓÚÑ]{2,}$/, '')
        .replace(/[.!;]*$/, '')
        .trim();
    }
    if (!fields.nombre) {
      const intro = msg.match(/(?:me llamo|mi nombre es|soy|llámame|me dicen)\s+([A-ZÁÉÍÓÚÑ][a-záéíóúñ]+(?:\s+[A-ZÁÉÍÓÚÑ][a-záéíóúñ]+)+)/i);
      if (intro) {
        fields.nombre = intro[1];
      } else if (fields.cedula) {
        const antes = msg.replace(new RegExp(fields.cedula.replace(/[-.]/g, '\\$&'), 'g'), '').trim();
        const caps = antes.split(/\s+/).filter(w => /^[A-ZÁÉÍÓÚÑ]/.test(w));
        if (caps.length >= 2) fields.nombre = caps.join(' ');
      }
    }
    // Catch "Le habla la Sra/Nombre", "Y quien le habla...", "Nombre tel X", etc.
    if (!fields.nombre) {
      // Pattern: "Le habla la Sra Magaly Díaz", "Y quien le habla su esposa Sra Magaly Díaz"
      const spoken = msg.match(/(?:le\s+habla|y\s+quien\s+le\s+habla|es|soy)\s+(?:la\s+)?(?:su\s+(?:esposa|esposo)\s+)?(?:sra?\.?|sr?\.?|don|doña)\s+([A-ZÁÉÍÓÚÑ][a-záéíóúñ]+\s+[A-ZÁÉÍÓÚÑ][a-záéíóúñ]+)(?:\s+[A-ZÁÉÍÓÚÑ][a-záéíóúñ]+)?(?:\s|$|,|\.|;)/i);
      if (spoken) {
        fields.nombre = spoken[1];
      } else {
        const relative = msg.match(/(?:mi\s+(?:esposa|esposo|madre|padre|hijo|hija|familiar)\s+(?:es|se\s+llama))\s+([A-ZÁÉÍÓÚÑ][a-záéíóúñ]+\s+[A-ZÁÉÍÓÚÑ][a-záéíóúñ]+)(?:\s+[A-ZÁÉÍÓÚÑ][a-záéíóúñ]+)?(?:\s|$|,|\.|;)/i);
        if (relative) fields.nombre = relative[1];
      }
    }
    // Pattern: "Magaly Díaz 809-7080241" - name followed by phone at start of message
    if (!fields.nombre && fields.telefono) {
      const namePhone = msg.match(/^([A-ZÁÉÍÓÚÑ][a-záéíóúñ]+\s+[A-ZÁÉÍÓÚÑ][a-záéíóúñ]+)(?:\s+[A-ZÁÉÍÓÚÑ][a-záéíóúñ]+)?\s+\d/);
      if (namePhone) fields.nombre = namePhone[1];
    }
    if (!fields.seguro && /(?:seguro|ars\b|universal|humano|mapfre|palic|senasa|banco central|futuro|renacer|simag|metal salud|sib\b|monumental|bupa|colonial|aetna|aps\b)/i.test(msg)) {
      const seg = msg.match(/(?:seguro|ars)\s*(?:de\s+)?\s*[:\-]?\s*([A-Za-zÁÉÍÓÚÑáéíóúñ][A-Za-zÁÉÍÓÚÑáéíóúñ\s]*?)(?:\s*(?:afiliado|nro|numero|con\s+afiliado|,\s*afiliado)|$)/i);
      const cleaned = seg ? seg[1].trim() : msg.replace(/^tengo\s+/i, '').trim();
      if (cleaned.length <= 40) {
        fields.seguro = cleaned.replace(/[.,;]+$/,'');
      }
    }
    if (!fields.afiliado && /(?:afiliado|numero de afiliado|número de afiliado|nro\.?\s*afiliado)/i.test(msg)) {
      const af = msg.match(/(?:afiliado|nro\.?\s*afiliado|numero de afiliado|número de afiliado)\s*:?\s*([A-Z0-9-]+)/i);
      if (af) fields.afiliado = af[1].trim();
    }
    if (!fields.email) {
      const em = msg.match(/[\w.+-]+@[\w-]+\.[\w.-]+/);
      if (em) fields.email = em[0].trim();
    }
    if (!fields.fecha_nacimiento) {
      const fn = msg.match(/\b(\d{1,2}[\/\-]\d{1,2}[\/\-]\d{4})\b/);
      if (fn) fields.fecha_nacimiento = fn[1].trim();
    }
    if (!fields.genero && /(?:sexo|genero|género)\s*:?\s*(masculino|femenino|m|f)/i.test(msg)) {
      const g = msg.match(/(?:sexo|genero|género)\s*:?\s*(masculino|femenino|m|f)/i);
      if (g) fields.genero = g[1].charAt(0).toUpperCase() + g[1].slice(1).toLowerCase();
    }
    if (!fields.sucursal && /(?:sucursal|sede|clinica|clínica)\s*:?\s*(santo domingo|terrenas|mejorate)/i.test(msg)) {
      const s = msg.match(/(?:sucursal|sede|clinica|clínica)\s*:?\s*(santo domingo|terrenas|mejorate)/i);
      if (s) fields.sucursal = s[1].charAt(0).toUpperCase() + s[1].slice(1).toLowerCase();
    }
    // Detectar si agendan PARA OTRA PERSONA: "para mi esposo Sr X", "es para mi madre", "para su hijo"
    if (!fields.relationship && /(?:para\s+mi|es\s+para|es\s+mi|para\s+su|de\s+mi|de\s+su|por\s+mi)\s+(?:esposo|esposa|madre|padre|hijo|hija|abuela|abuelo|hermano|hermana|t[ií]o|t[ií]a|familiar|paciente|nieto|nieta|sobrino|sobrina)/i.test(msg)) {
      const rel = msg.match(/(?:para\s+mi|es\s+para|es\s+mi|para\s+su|de\s+mi|de\s+su|por\s+mi)\s+(esposo|esposa|madre|padre|hijo|hija|abuela|abuelo|hermano|hermana|t[ií]o|t[ií]a|familiar|paciente|nieto|nieta|sobrino|sobrina)/i);
      if (rel) fields.relationship = rel[1].toLowerCase();
      if (!fields.patient_name) {
        // Nombre del paciente tras el parentesco (captura sensible a mayúsculas)
        const afterRel = msg.match(new RegExp('(?:esposo|esposa|madre|padre|hijo|hija|abuela|abuelo|hermano|hermana|t[ií]o|t[ií]a|familiar|paciente|nieto|nieta|sobrino|sobrina)(?:\\s+(?:que\\s+)?(?:se\\s+llama|llamado|llamada))?\\s+(?:(?:el|la)\\s+)?(?:(?:sr\\.?|sra\\.?|don|do[ñn]a|lic\\.?|dr\\.?|dra\\.?)\\s+)?([A-ZÁÉÍÓÚÑ][a-záéíóúñ]+(?:\\s+[A-ZÁÉÍÓÚÑ][a-záéíóúñ]+){0,3})'));
        if (afterRel) {
          fields.patient_name = afterRel[1]
            .replace(/^(?:el|la|sr\.?|sra\.?|don|do[ñn]a|lic\.?|dr\.?|dra\.?)\s+/i, '')
            .trim();
        }
      }
    }
    if (!fields.notas && msg.length > 20 && !fields.servicio) {
      // If message is long and not a service request, might be notes
      fields.notas = msg.trim();
    }
    if (!fields.servicio) {
      const code = findService(msg);
      if (code) {
        fields.servicio = code;
        fields.servicioLabel = SERVICE_CODE_LABEL[code] || code;
      }
    }
  }
  return fields;
}

// Mapea código de servicio (findService) → valor del <select> del formulario web /solicitud
export const FORM_SERVICIO_MAP = {
  'CMD': 'consulta', 'CMC': 'consulta', 'CE': 'consulta', 'CI': 'consulta',
  'PROC': 'manejo-dolor', 'DOL': 'manejo-dolor', 'BOM': 'manejo-dolor', 'BEL': 'manejo-dolor',
  'PAL': 'cuidados-paliativos', 'QUIMIO': 'cuidados-paliativos',
  'ENF': 'enfermeria', 'SV': 'enfermeria', 'MED': 'enfermeria', 'NEB': 'enfermeria',
  'CUR': 'curacion', 'SON': 'curacion', 'SUE': 'curacion', 'MUES': 'curacion',
  'HOS': 'enfermeria', 'ANT': 'enfermeria',
  'RX': 'rayos-x',
  'SONO': 'sonografia',
  'DOP': 'doppler', 'ECG': 'doppler', 'ECO': 'doppler', 'HOL': 'doppler', 'MAPA': 'doppler',
  'LAB': 'laboratorio',
  'HEMO': 'transfusion',
  'TF': 'terapia',
  'PD': 'pie-diabetico',
  'AM': 'otro', 'PAQ': 'otro', 'DP': 'otro', 'POST': 'otro', 'CUIDA': 'otro',
  'ACOMP': 'otro', 'RECETA': 'otro', 'NUTRI': 'otro', 'ODONTO': 'otro',
};

export const FORM_SERVICIO_LABELS = {
  consulta: 'Consulta médica a domicilio',
  'rayos-x': 'Rayos X a domicilio',
  sonografia: 'Sonografía / Eco',
  doppler: 'Doppler / Holter / MAPA',
  enfermeria: 'Enfermería a domicilio',
  terapia: 'Terapia física',
  laboratorio: 'Laboratorio clínico',
  transfusion: 'Transfusiones (Hemohogar)',
  curacion: 'Curaciones / Nebulizaciones',
  'manejo-dolor': 'Manejo del dolor / Bomba intratecal',
  'cuidados-paliativos': 'Cuidados paliativos',
  'pie-diabetico': 'Cirugía de pie diabético',
};

export function getFormServicioValue(code) {
  return code ? (FORM_SERVICIO_MAP[code] || null) : null;
}

export function getFormServicioLabel(value) {
  return value ? (FORM_SERVICIO_LABELS[value] || value) : '';
}

// Campos adicionales que el formulario /solicitud muestra según el servicio seleccionado.
// `requiere_orden: true` → se pregunta por la indicación/orden médica (obligatoria para
// Rayos X, sonografía, EKG/Doppler/Holter/MAPA, laboratorio, transfusiones, pie diabético).
export const FORM_REQUISITOS = {
  consulta: {
    titulo: 'Información para su consulta',
    campos: [
      { id: 'motivo', label: 'Motivo de la consulta', placeholder: 'Síntomas o razón de la visita' },
      { id: 'estudios_previos', label: '¿Tiene estudios previos?', placeholder: 'Radiografías, laboratorios, etc.' },
    ],
  },
  'rayos-x': {
    titulo: 'Requisitos para Rayos X',
    requiere_orden: true,
    campos: [
      { id: 'area', label: '¿Qué área del cuerpo necesita?', placeholder: 'Tórax, columna, extremidad, abdomen...' },
      { id: 'movilidad', label: 'Movilidad del paciente', tipo: 'select', opciones: ['Encamado', 'Se moviliza con ayuda', 'Se moviliza solo'] },
    ],
  },
  sonografia: {
    titulo: 'Requisitos para Sonografía',
    requiere_orden: true,
    campos: [
      { id: 'tipo', label: '¿Qué tipo de sonografía necesita?', placeholder: 'Abdominal, pélvica, renal, partes blandas...' },
      { id: 'preparacion', label: '¿Requirió preparación (ayuno, vejiga llena)?', tipo: 'select', opciones: ['Sí, ya está preparado', 'No, no lo sabía'] },
    ],
  },
  doppler: {
    titulo: 'Requisitos para estudios cardíacos / Doppler',
    requiere_orden: true,
    campos: [
      { id: 'tipo_estudio', label: '¿Qué estudio necesita?', placeholder: 'ECG, Ecocardiograma, Doppler, Holter, MAPA...' },
      { id: 'sintomas', label: '¿Presenta síntomas?', placeholder: 'Dolor en el pecho, palpitaciones, mareos...' },
    ],
  },
  enfermeria: {
    titulo: 'Información para enfermería',
    campos: [
      { id: 'tipo_atencion', label: '¿Qué atención necesita?', placeholder: 'Curación, inyección, nebulización, sondas, sueros...' },
      { id: 'horas', label: '¿Horas al día y por cuántos días?', placeholder: 'Ej: turno 4h, 8h, 12h, 24h' },
      { id: 'encamado', label: '¿El paciente está encamado?', tipo: 'select', opciones: ['Sí', 'No'] },
    ],
  },
  terapia: {
    titulo: 'Información para terapia física',
    campos: [
      { id: 'condicion', label: '¿Condición o diagnóstico?', placeholder: 'Ej: post cirugía, dolor lumbar...' },
      { id: 'frecuencia', label: '¿Frecuencia deseada?', placeholder: 'Ej: 3 veces por semana' },
    ],
  },
  laboratorio: {
    titulo: 'Requisitos para laboratorio',
    requiere_orden: true,
    campos: [
      { id: 'examenes', label: '¿Qué exámenes necesita?', placeholder: 'Hemograma, glicemia, perfil lipídico...' },
      { id: 'ayuno', label: '¿Requirió ayuno?', tipo: 'select', opciones: ['Sí', 'No', 'No sé'] },
    ],
  },
  transfusion: {
    titulo: 'Requisitos para transfusión (Hemohogar)',
    requiere_orden: true,
    campos: [
      { id: 'sangre_autorizada', label: '¿La sangre está autorizada por el Banco de Sangre?', tipo: 'select', opciones: ['Sí', 'No', 'No sé'] },
      { id: 'pruebas_cruzadas', label: '¿Tiene pruebas cruzadas realizadas?', tipo: 'select', opciones: ['Sí', 'No'] },
      { id: 'cuidador', label: '¿Contará con un cuidador responsable presente?', tipo: 'select', opciones: ['Sí', 'No'] },
    ],
  },
  curacion: {
    titulo: 'Información para curaciones',
    campos: [
      { id: 'tipo_herida', label: '¿Qué tipo de herida?', placeholder: 'Herida quirúrgica, úlcera por presión, quemadura...' },
      { id: 'frecuencia', label: '¿Cada cuántos días se realiza la curación?', placeholder: 'Ej: cada 2 días' },
    ],
  },
  'manejo-dolor': {
    titulo: 'Información para manejo del dolor',
    campos: [
      { id: 'tipo_dolor', label: '¿Tipo de dolor?', placeholder: 'Localización, intensidad, frecuencia' },
      { id: 'diagnostico', label: '¿Diagnóstico de base?', placeholder: 'Enfermedad o condición que causa el dolor' },
      { id: 'medico', label: '¿Médico tratante?', placeholder: 'Nombre del médico' },
    ],
  },
  'cuidados-paliativos': {
    titulo: 'Información para cuidados paliativos',
    campos: [
      { id: 'diagnostico', label: '¿Diagnóstico de base y médico tratante?', placeholder: 'Diagnóstico y médico' },
      { id: 'estado', label: '¿Estado actual del paciente?', placeholder: 'Breve descripción' },
      { id: 'lugar', label: '¿Dónde se requiere la atención?', tipo: 'select', opciones: ['Domicilio', 'Clínica'] },
    ],
  },
  'pie-diabetico': {
    titulo: 'Requisitos para cirugía de pie diabético',
    requiere_orden: true,
    campos: [
      { id: 'evolucion', label: '¿Tiempo de evolución de la herida?', placeholder: 'Días o meses' },
      { id: 'diagnostico', label: '¿Tiene diagnóstico de diabetes?', tipo: 'select', opciones: ['Sí', 'No'] },
    ],
  },
};

export function getFormLink(servicioCode, phone) {
  const params = new URLSearchParams();
  const value = getFormServicioValue(servicioCode);
  if (value) params.set('servicio', value);
  if (phone && /^\d{7,15}$/.test(phone)) params.set('phone', phone);
  const qs = params.toString();
  return qs ? `${SITE_URL}/solicitud?${qs}` : `${SITE_URL}/solicitud`;
}

export function getServiceInfo(code) {
  for (const cat of servicios) {
    for (const s of cat.servicios) {
      if (s.codigo === code) return { ...s, categoria: cat.categoria };
    }
  }
  return null;
}

export function formatServicios() {
  return servicios.map(c => `${c.categoria}: ${c.servicios.map(s => s.nombre).join(', ')}`).join('\n');
}

export function formatFAQSobre(intencion) {
  return faq.filter(f => f.intencion === intencion).map(f => `P: ${f.pregunta}\nR: ${f.respuesta}`).join('\n\n');
}

export function formatPoliticas() {
  const p = politicas;
  return `PAGO: ${p.pago.metodo} | Cuenta ${p.pago.cuenta} (${p.pago.banco}, ${p.pago.titular}, RNC ${p.pago.rnc})
PROGRAMACIÓN: ${p.programacion.plazo}. Corte ${p.programacion.corte_diario}
RESULTADOS: ${p.resultados.plazo}. Envío: ${p.resultados.envio}`;
}

export function formatHorarios() {
  const h = horarios;
  return `Clínica: ${h.clinica.lunes_a_viernes} | Sáb: ${h.clinica.sabado} | Dom: ${h.clinica.domingo} | Domicilio: ${h.domicilio.lunes_a_viernes} | Sáb: ${h.domicilio.sabado} | Dom: ${h.domicilio.domingo}
Zonas: ${h.zonas_cobertura.join(', ')}`;
}

export function detectarIntencion(text, history) {
  const t = text.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  const h = history.map(x => x.content.toLowerCase()).join(' ');

  if (t.includes('gracias') || t.includes('perfecto') || t.includes('ok') || t.includes('de acuerdo') || t.includes('chao') || t.includes('adios') || t.includes('nos vemos')) return 'cierre';
  if (t.includes('precio') || t.includes('cuanto cuesta') || t.includes('costo') || t.includes('cotiz') || t.includes('cuanto vale') || t.includes('tarifa') || t.includes('valor') || t.includes('presupuesto')) return 'precio';
  if (t.includes('agendar') || t.includes('cita') || t.includes('visita') || t.includes('domicilio') || t.includes('quiero') || t.includes('necesito') || t.includes('programar')) return 'agendar';
  if (t.includes('seguro') || t.includes('ars') || t.includes('aseguradora') || t.includes('cobertura') || t.includes('humano') || t.includes('mapfre') || t.includes('universal') || t.includes('palic') || t.includes('senasa') || t.includes('banco central')) return 'seguro';
  if (t.includes('horario') || t.includes('hora') || t.includes('atienden') || t.includes('abierto') || t.includes('domingo') || t.includes('sabado') || t.includes('abren') || t.includes('disponibilidad')) return 'horario';
  if (t.includes('donde') || t.includes('ubicacion') || t.includes('direccion') || t.includes('oficina') || t.includes('estan')) return 'ubicacion';
  if (t.includes('cancelar') || t.includes('reprogramar') || t.includes('cambiar') || t.includes('modificar') || t.includes('cancelacion')) return 'cancelacion';
  if (t.includes('reembolso') || t.includes('devolver') || t.includes('devolución') || t.includes('dinero') || t.includes('reembolsar') || t.includes('reintegro') || t.includes('devuelvan') || t.includes('me devuelven') || t.includes('devuelven')) return 'reembolso';
  if (t.includes('balance a favor') || t.includes('dejar en fondo') || t.includes('crédito') || t.includes('credito') || t.includes('fondo') || t.includes('balance')) return 'balance_favor';
  if (t.includes('pago') || t.includes('pagar') || t.includes('transferencia') || t.includes('cuenta') || t.includes('banco') || t.includes('deposito') || t.includes('efectivo') || t.includes('tarjeta')) return 'pago';
  if (t.includes('resultado') || t.includes('entrega') || (t.includes('cuando') && (t.includes('listo') || t.includes('sale') || t.includes('estar')))) return 'resultados';
  if (t.includes('preparacion') || t.includes('ayuno') || t.includes('preparar') || t.includes('necesito hacer')) return 'preparacion';
  if (t.includes('orden medica') || t.includes('indicacion') || t.includes('receta') || t.includes('referimiento') || t.includes('necesito orden')) return 'orden_medica';
  if (t.includes('empresa') || t.includes('empleado') || t.includes('corporativo') || t.includes('trabajadore')) return 'empresarial';
  if (t.includes('internamiento') || t.includes('hospitalizacion') || t.includes('ingreso')) return 'hospitalizacion';

  const serviceCode = findService(text);
  if (serviceCode) return 'servicio';

  if (t.includes('hola') || t.includes('bueno') || t.includes('saludos') || t.includes('buenas') || t.includes('que tal')) return 'saludo';

  return 'general';
}

export function getSectionForIntent(intent, userText) {
  const servFAQs = faq.filter(f => ['enfermeria', 'terapia', 'rayosx', 'transfusion', 'paliativos', 'sonografia_prep', 'quimioterapia', 'hospitalizacion'].includes(f.intencion));

  switch (intent) {
    case 'precio':
      return `=== POLÍTICA DE PRECIOS ===\nCada servicio se cotiza de forma personalizada según ubicación, materiales y personal requerido. Un asesor se comunicará para dar la cotización. Recopilar datos del paciente y escalar.\n\n=== OFERTA DE CANAL ===\nAl detectar que el cliente quiere cotizar, ofrécele DOS opciones claras y espera su elección:\n(A) "Puede llenar el formulario web (más rápido): ${SITE_URL}/solicitud" — el enlace ya trae el servicio que mencionó.\n(B) "O si prefiere, le tomo los datos por aquí (manual/asistido) y un asesor lo contacta."\nNO recojas datos hasta que el cliente elija una opción.\n\n${faq.filter(f => f.intencion === 'precio').map(f => `FAQ: ${f.pregunta} → ${f.respuesta}`).join('\n')}`;

    case 'agendar':
      return `=== AGENDAMIENTO ===\nRecopilar datos de a uno por vez. Cuando tengas 3+ datos (nombre, cédula, servicio, dirección, seguro, teléfono), marcar FORMDATA + ESCALACION.\n\nSi el servicio requiere orden médica (Rayos X, sonografía, EKG/Doppler/Holter/MAPA, laboratorio, transfusiones, pie diabético), pregunta si el paciente tiene la indicación médica y anótala en los datos.\n\n=== OFERTA DE CANAL ===\nAl detectar que el cliente quiere agendar, ofrécele DOS opciones claras y espera su elección:\n(A) "Puede llenar el formulario web (más rápido): ${SITE_URL}/solicitud" — el enlace ya trae el servicio que mencionó.\n(B) "O si prefiere, le tomo los datos por aquí (manual/asistido) y un asesor lo contacta."\nNO recojas datos hasta que el cliente elija una opción.\n\nHORARIOS:\nLunes a viernes 8:00am-6:00pm. Sábados disponibilidad limitada. Domingos no laboramos.\n\n${faq.filter(f => ['agendar_cita', 'requisitos', 'duracion'].includes(f.intencion)).map(f => `FAQ: ${f.pregunta} → ${f.respuesta}`).join('\n')}`;

     case 'seguro':
       return `=== SEGUROS ===\nConvenio directo: Bupa, Meta Salud, APS, Monumental, Aetna La Colonia.\nPara otros seguros: ofrecer carta de reembolso si el plan lo admite, o atención como privado.\n\n${faq.filter(f => f.intencion === 'seguro').map(f => `FAQ: ${f.pregunta} → ${f.respuesta}`).join('\n')}\n\nPreguntar: nombre del seguro, número de afiliado, y si necesita autorización.`;

    case 'horario':
      return `=== HORARIOS Y COBERTURA ===\n${formatHorarios()}\n\n${faq.filter(f => ['horario', 'cobertura', 'domicilio'].includes(f.intencion)).map(f => `FAQ: ${f.pregunta} → ${f.respuesta}`).join('\n')}`;

    case 'servicio': {
      const code = findService(userText);
      const info = code ? getServiceInfo(code) : null;
      let section = `=== SERVICIOS ===\n${formatServicios()}\n`;
      if (info) {
        section += `\n--- ${info.nombre} ---\n${info.descripcion || ''}\n`;
        if (info.incluye) section += `\nIncluye: ${info.incluye.join(', ')}\n`;
        if (info.preparacion) section += `Preparación: ${info.preparacion}\n`;
        section += '\n';
      }
      section += servFAQs.map(f => `FAQ: ${f.pregunta} → ${f.respuesta}`).join('\n');
      return section;
    }

    case 'ubicacion':
      return `=== UBICACIÓN ===\nOficinas: ${politicas.oficinas.join(' | ')}\nTeléfono: 809-636-3656\n\nHorario clínica: ${horarios.clinica.lunes_a_viernes}`;

    case 'pago':
      return `=== PAGO ===\n${formatPoliticas()}\n\n${faq.filter(f => f.intencion === 'pago').map(f => `FAQ: ${f.pregunta} → ${f.respuesta}`).join('\n')}`;

    case 'resultados':
      return `=== RESULTADOS ===\n${faq.filter(f => f.intencion === 'resultados').map(f => `FAQ: ${f.pregunta} → ${f.respuesta}`).join('\n')}`;

      case 'cancelacion':
        return `=== CANCELACIÓN ===\n${faq.filter(f => f.intencion === 'cancelacion').map(f => `FAQ: ${f.pregunta} → ${f.respuesta}`).join('\n')}\n\n${faq.filter(f => f.intencion === 'reembolso').map(f => `FAQ: ${f.pregunta} → ${f.respuesta}`).join('\n')}\n\n${faq.filter(f => f.intencion === 'balance_favor').map(f => `FAQ: ${f.pregunta} → ${f.respuesta}`).join('\n')}`;

      case 'reembolso':
        return `=== REEMBOLSO ===\n${faq.filter(f => f.intencion === 'reembolso').map(f => `FAQ: ${f.pregunta} → ${f.respuesta}`).join('\n')}`;

      case 'balance_favor':
        return `=== BALANCE A FAVOR ===\n${faq.filter(f => f.intencion === 'balance_favor').map(f => `FAQ: ${f.pregunta} → ${f.respuesta}`).join('\n')}`;

      case 'reprogramacion':
        return `=== REPROGRAMACIÓN ===\n${faq.filter(f => f.intencion === 'reprogramacion').map(f => `FAQ: ${f.pregunta} → ${f.respuesta}`).join('\n')}`;

      case 'orden_medica':
       return `=== REQUISITOS MÉDICOS ===\n${faq.filter(f => ['rayosx', 'transfusion', 'receta'].includes(f.intencion)).map(f => `FAQ: ${f.pregunta} → ${f.respuesta}`).join('\n')}\n\nPara consulta médica NO se necesita orden. Para Rayos X, sonografía, laboratorio y transfusiones SÍ.`;

     case 'empresarial':
       return `=== PROGRAMAS EMPRESARIALES ===\n${faq.filter(f => f.intencion === 'empresarial').map(f => `FAQ: ${f.pregunta} → ${f.respuesta}`).join('\n')}`;

     case 'hospitalizacion':
       return `=== HOSPITALIZACIÓN DOMICILIARIA ===\n${faq.filter(f => f.intencion === 'hospitalizacion').map(f => `FAQ: ${f.pregunta} → ${f.respuesta}`).join('\n')}`;

     case 'factura':
       return `=== FACTURACIÓN ===\nLa facturación y emisión de recibos es gestionada por el departamento de Contabilidad. Un asesor se comunicará con usted para enviar la factura o recibo correspondiente.\n\n${faq.filter(f => f.intencion === 'factura').map(f => `FAQ: ${f.pregunta} → ${f.respuesta}`).join('\n')}`;

     case 'nimbo':
       return `=== CITAS VÍA NIMBO ===\nLas citas se gestionan a través del chatbot o un asesor humano. No es necesario acceder directamente a la plataforma Nimbo. Si necesita agendar, le podemos ayudar aquí.\n\n${faq.filter(f => f.intencion === 'nimbo').map(f => `FAQ: ${f.pregunta} → ${f.respuesta}`).join('\n')}`;

     case 'contabilidad':
       return `=== DEPARTAMENTOS INTERNOS ===\nContabilidad, RRHH y Facturación son gestionados por equipos internos de UNIDOLOR. Un asesor derivará su consulta al área correspondiente.\n\n${faq.filter(f => ['contabilidad', 'rrhh'].includes(f.intencion)).map(f => `FAQ: ${f.pregunta} → ${f.respuesta}`).join('\n')}`;

     case 'doctor':
       return `=== DOCTORES ===\nDra. Bethania Martínez — medicina del dolor y cuidados paliativos. Atiende miércoles y jueves 8:00am-6:00pm en Santo Domingo (Torre Solazar).\nDra. Ximena Almanzar — ortopedia.\nDr. Mármol — consulta general.\n\n${faq.filter(f => f.intencion === 'doctor').map(f => `FAQ: ${f.pregunta} → ${f.respuesta}`).join('\n')}`;

     case 'emergencia':
       return faq.filter(f => f.intencion === 'emergencia').map(f => `FAQ: ${f.pregunta} → ${f.respuesta}`).join('\n');

     case 'saludo':
       return 'El cliente acaba de saludar. No ha especificado ningún servicio ni paciente. PRESÉNTATE brevemente y pregúntale genéricamente cómo puedes ayudarle. NO menciones familiares (mamá, papá, etc.) ni servicios específicos.';

     default:
       return `${formatServicios()}\n\nPREGUNTAS FRECUENTES:\n${faq.slice(0, 8).map(f => `• ${f.pregunta}`).join('\n')}`;
  }
}
