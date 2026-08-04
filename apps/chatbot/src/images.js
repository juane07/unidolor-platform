import { fetchWithTimeout } from './ai.js';

const ALLOWED_MIME_TYPES = [
  'image/jpeg',
  'image/png',
  'image/webp',
  'application/pdf'
];
const MAX_FILE_SIZE = 10 * 1024 * 1024;

export async function downloadMedia(env, mediaId) {
  const metaUrl = `https://graph.facebook.com/v20.0/${mediaId}`;
  const response = await fetchWithTimeout(metaUrl, {
    headers: { 'Authorization': `Bearer ${env.META_ACCESS_TOKEN}` }
  }, 10000);

  if (!response.ok) {
    const err = await response.text();
    throw new Error(`Meta media info failed ${response.status}: ${err}`);
  }

  const data = await response.json();
  const mediaUrl = data.url;
  if (!mediaUrl) throw new Error('No media URL in Meta response');

  const mediaResponse = await fetchWithTimeout(mediaUrl, {
    headers: { 'Authorization': `Bearer ${env.META_ACCESS_TOKEN}` }
  }, 15000);

  if (!mediaResponse.ok) {
    const err = await mediaResponse.text();
    throw new Error(`Media download failed ${mediaResponse.status}: ${err}`);
  }

  const contentLength = mediaResponse.headers.get('content-length');
  if (contentLength && parseInt(contentLength) > MAX_FILE_SIZE) {
    throw new Error(`File too large: ${contentLength} bytes (max ${MAX_FILE_SIZE})`);
  }

  const bytes = await mediaResponse.arrayBuffer();
  const mimeType = mediaResponse.headers.get('content-type') || data.mime_type || 'application/octet-stream';

  if (!ALLOWED_MIME_TYPES.includes(mimeType)) {
    throw new Error(`Unsupported mime type: ${mimeType}`);
  }

  return { bytes: new Uint8Array(bytes), mimeType };
}

const VISION_PROMPT = `Extrae de esta imagen la siguiente información. Responde SOLO con JSON válido:
{
  "cedula": "número de cédula (formato XXX-XXXXXXX-X o solo números)",
  "nombre": "nombre completo",
  "fecha_nacimiento": "YYYY-MM-DD",
  "seguro": "nombre del seguro/ARS",
  "afiliado": "número de afiliado",
  "tipoDocumento": "cedula|seguro|ambos"
}

Si la imagen contiene cédula y carnet de seguro juntos, usa "ambos" y rellena ambos campos.
Si solo hay cédula, usa "cedula". Si solo carnet de seguro, usa "seguro".
Campos no visibles déjalos como null.`;

export async function callGeminiVision(apiKey, base64, mimeType) {
  if (!apiKey) throw new Error('GEMINI_API_KEY not configured');

  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.6-flash:generateContent?key=${apiKey}`;

  const response = await fetchWithTimeout(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{
        role: 'user',
        parts: [
          { text: VISION_PROMPT },
          { inline_data: { mime_type: mimeType, data: base64 } }
        ]
      }],
      generationConfig: { temperature: 0.1, topP: 0.9, maxOutputTokens: 1024 },
      safetySettings: [
        { category: 'HARM_CATEGORY_HARASSMENT', threshold: 'BLOCK_ONLY_HIGH' },
        { category: 'HARM_CATEGORY_HATE_SPEECH', threshold: 'BLOCK_ONLY_HIGH' },
        { category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT', threshold: 'BLOCK_ONLY_HIGH' },
        { category: 'HARM_CATEGORY_DANGEROUS_CONTENT', threshold: 'BLOCK_ONLY_HIGH' }
      ]
    })
  }, 30000);

  if (!response.ok) {
    const err = await response.text();
    if (response.status === 429) throw new Error('Gemini Vision quota exceeded (429)');
    throw new Error(`Gemini Vision API error ${response.status}: ${err}`);
  }

  const data = await response.json();
  const text = data?.candidates?.[0]?.content?.parts?.[0]?.text || '';
  if (!text) throw new Error('Empty response from Gemini Vision');

  try {
    const jsonStart = text.indexOf('{');
    const jsonEnd = text.lastIndexOf('}') + 1;
    const jsonText = text.slice(jsonStart, jsonEnd);
    return JSON.parse(jsonText);
  } catch (e) {
    console.error('Vision parse error:', text);
    throw new Error('Failed to parse Vision response as JSON');
  }
}

export function arrayBufferToBase64(buffer) {
  const bytes = new Uint8Array(buffer);
  let binary = '';
  for (let i = 0; i < bytes.length; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

export function inferDocumentType(extracted) {
  const hasCedula = extracted.cedula && extracted.cedula.trim();
  const hasSeguro = (extracted.seguro && extracted.seguro.trim()) || (extracted.afiliado && extracted.afiliado.trim());

  if (hasCedula && hasSeguro) return 'ambos';
  if (hasCedula) return 'cedula';
  if (hasSeguro) return 'seguro';
  return 'desconocido';
}

export function mergeExtractedData(formData, extracted, tipo) {
  const merged = { ...formData };
  if (extracted.cedula && !merged.cedula) merged.cedula = extracted.cedula.trim();
  if (extracted.nombre && !merged.nombre) merged.nombre = extracted.nombre.trim();
  if (extracted.fecha_nacimiento && !merged.fecha_nacimiento) merged.fecha_nacimiento = extracted.fecha_nacimiento.trim();
  if (extracted.seguro && !merged.seguro) merged.seguro = extracted.seguro.trim();
  if (extracted.afiliado && !merged.afiliado) merged.afiliado = extracted.afiliado.trim();
  return merged;
}