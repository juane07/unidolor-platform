import { modelState } from './state.js';

export async function fetchWithTimeout(url, options, timeoutMs = 15000) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    return await fetch(url, { ...options, signal: controller.signal });
  } finally {
    clearTimeout(timer);
  }
}

const GEMINI_MODELS = [
  'gemini-3.6-flash',
  'gemini-3.5-flash',
  'gemini-3.5-flash-lite',
  'gemini-3.1-flash-lite',
];
const GROQ_MODEL = 'llama-3.1-8b-instant';
const RETRY_AFTER = 5 * 60 * 1000;
const CACHE_VERSION = 'v5';

const SYNONYM_MAP = [
  // Precio / costo
  [/(?:cuanto|qu[eé]|c[oó]mo).{0,10}(?:cuesta|cuestan|vale|valen|es el precio|son los precios|precio)/g, ' precio '],
  [/cobran|cobran?|costo|costos|tarifa|tarifas|presupuesto|cotizaci[oó]n|valor\b/g, ' precio '],
  // Horarios
  [/qu[eé] horario|horario|horarios|a qu[eé] hora|a qu[eé] horas|qu[eé] hora(?:s)?\b(?!rio)|cu[aá]ndo abren|cu[aá]ndo atienden|qu[eé] d[ií]as|qu[eé] d[ií]a|est[aá]n abiertos/g, ' horario '],
  // Dirección / ubicación
  [/d[oó]nde (?:est[aá]n|est[aá]|quedan|queda)|ubicaci[oó]n|direcci[oó]n|direccion|sucursal|oficina\b/g, ' direccion '],
  // Teléfono / contacto
  [/tel[eé]fono|tel[eé]fonos|n[úu]mero de (?:contacto|tel[eé]fono)|c[oó]mo (?:puedo )?(?:comunicarme|contactarlos|contactar)|qu[eé] (?:número|numero)|whatsapp/g, ' telefono '],
  // Servicios
  [/servicios?|qu[eé] (?:ofrecen|hacen|realizan|tienen)|qu[eé] servicios/g, ' servicios '],
  // Seguros / ARS
  [/seguros?|ars\b|aseguradoras?|trabajan con (?:seguros?|ars)/g, ' seguro '],
  // Emergencia / urgencia (agrupa variantes)
  [/emergencias?|urgencias?|emergencia[\/-]urgencia/g, ' urgencia '],
  // Agradecimientos
  [/\b(?:gracias|perfecto|ok\b|okay|de acuerdo|excelente|listo|bueno)\b/g, ' gracias '],
];

const STOP_WORDS = new Set([
  'un', 'una', 'unos', 'unas', 'el', 'la', 'los', 'las', 'de', 'del', 'al',
  'es', 'son', 'tiene', 'tienen', 'tener', 'para', 'por', 'que', 'cual',
  'cuales', 'me', 'te', 'se', 'le', 'su', 'mi', 'tu', 'y', 'o', 'en', 'con',
  'si', 'no', 'a', 'e', 'i', 'u', 'hay', 'puedo', 'puede', 'quiero', 'necesito',
  'atienden', 'atiende', 'abren', 'abre', 'ubicados', 'ubicado', 'ubican', 'ubica',
  'aceptan', 'acepta', 'trabajan', 'trabaja', 'muchas', 'muchos', 'mucho', 'muy',
  'estan', 'esta', 'quedan', 'queda', 'llaman', 'llama', 'tengo', 'quisiera',
]);

function canonicalize(text) {
  let t = ' ' + text.toLowerCase() + ' ';
  for (const [re, rep] of SYNONYM_MAP) {
    t = t.replace(re, rep);
  }
  return t;
}

function normalizedHash(text) {
  const n = canonicalize(text)
    .replace(/[^a-z0-9\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .split(' ')
    .filter(w => w && !STOP_WORDS.has(w))
    .join(' ');
  let hash = 0;
  for (let i = 0; i < n.length; i++) {
    hash = ((hash << 5) - hash) + n.charCodeAt(i);
    hash |= 0;
  }
  return hash.toString();
}

export async function getCachedReply(text, kv) {
  if (!kv) return null;
  try {
    const data = await kv.get(`cache:${CACHE_VERSION}:${normalizedHash(text)}`, 'json');
    if (data && Date.now() - data.ts < 86400000) return data.reply;
  } catch {}
  return null;
}

export async function setCachedReply(text, reply, kv) {
  if (!kv || !reply) return;
  try {
    await kv.put(`cache:${CACHE_VERSION}:${normalizedHash(text)}`, JSON.stringify({ reply, ts: Date.now() }), { expirationTtl: 86400 });
  } catch {}
}

export async function callGroq(apiKey, prompt) {
  const url = 'https://api.groq.com/openai/v1/chat/completions';
  const response = await fetchWithTimeout(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: GROQ_MODEL,
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.7,
      max_tokens: 1024,
    }),
  }, 20000);

  if (!response.ok) {
    const err = await response.text();
    throw new Error(`Groq API error ${response.status}: ${err}`);
  }

  const data = await response.json();
  const text = data?.choices?.[0]?.message?.content || '';
  if (!text) throw new Error('Empty response from Groq');
  return text;
}

export async function callGemini(apiKey, prompt, kv, groqApiKey) {
  if (!apiKey) throw new Error('GEMINI_API_KEY not configured');

  const now = Date.now();

  for (let i = 0; i < GEMINI_MODELS.length; i++) {
    const idx = (modelState.current + i) % GEMINI_MODELS.length;
    const model = GEMINI_MODELS[idx];

    if (modelState.exhausted[model] && now - modelState.exhausted[model] < RETRY_AFTER) {
      continue;
    }

    const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

    try {
      const response = await fetchWithTimeout(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ role: 'user', parts: [{ text: prompt }] }],
          generationConfig: { temperature: 0.7, topP: 0.9, maxOutputTokens: 1024 },
          safetySettings: [
            { category: 'HARM_CATEGORY_HARASSMENT', threshold: 'BLOCK_ONLY_HIGH' },
            { category: 'HARM_CATEGORY_HATE_SPEECH', threshold: 'BLOCK_ONLY_HIGH' },
            { category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT', threshold: 'BLOCK_ONLY_HIGH' },
            { category: 'HARM_CATEGORY_DANGEROUS_CONTENT', threshold: 'BLOCK_ONLY_HIGH' },
          ],
        }),
      });

      if (!response.ok) {
        const err = await response.text();
        if (response.status === 429) {
          modelState.exhausted[model] = now;
          console.error(`Model ${model} quota exceeded (429), cooling down`);
        } else if (response.status >= 400 && response.status < 500) {
          console.error(`Model ${model} unrecoverable (${response.status}), skipping`);
        } else {
          modelState.exhausted[model] = now;
          console.error(`Model ${model} failed (${response.status}), trying next`);
        }
        continue;
      }

      const data = await response.json();
      const text = data?.candidates?.[0]?.content?.parts?.[0]?.text || '';
      if (!text) throw new Error('Empty response from Gemini');

      modelState.current = idx;
      delete modelState.exhausted[model];
      return text;
    } catch (err) {
      modelState.exhausted[model] = now;
      console.error(`Model ${model} failed, trying next`);
      continue;
    }
  }

  if (groqApiKey) {
    console.error('All Gemini models exhausted, falling back to Groq');
    try {
      return await callGroq(groqApiKey, prompt);
    } catch (groqErr) {
      console.error('Groq fallback also failed:', groqErr.message);
      throw new Error(`All Gemini models exhausted and Groq fallback failed: ${groqErr.message}`);
    }
  }

  throw new Error('All Gemini models exhausted');
}
