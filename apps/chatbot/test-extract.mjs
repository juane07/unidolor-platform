import { extractData, isExtractionComplete, mergeExtraction, confidenceScore, emptyExtraction, sanitizeFormPayload, looksLikeAddress } from './src/extract.js';

let pass = 0;
let fail = 0;

function assert(name, cond) {
  if (cond) { pass++; console.log(`✅ ${name}`); }
  else { fail++; console.log(`❌ ${name}`); }
}

const env = {
  GROQ_API_KEY: process.env.GROQ_API_KEY,
  GEMINI_API_KEY: process.env.GEMINI_API_KEY,
  SEGUIMIENTO: null,
  TEST_MODE: '1',
};

// Caso problemático: dirección que parecía nombre
const messages = [
  'Buenas tardes',
  'Tienen servicio de consulta medica a domicilio ?',
  'Es para mi esposa que se llama Elda Alba Lopez',
  '001-0089423-7',
  'Calle Central no 4 , Torre Luz 3, apt 901 , sector SERRALLÉS',
  '809-817-2412',
];

const r1 = await extractData(env, messages, null);
const nombreFinal = r1.extraction?.nombre || r1.extraction?.patient_name || '';
assert('Caso 1: nombre correcto = Elda Alba Lopez', nombreFinal === 'Elda Alba Lopez');
assert('Caso 1: nombre NO es la dirección', !/Calle Central/i.test(nombreFinal) && !/Torre Luz/i.test(nombreFinal));
assert('Caso 1: teléfono extraído', (r1.extraction?.telefono || '').replace(/\D/g, '').includes('8098172412'));
assert('Caso 1: cédula extraída', (r1.extraction?.cedula || '').includes('001'));
assert('Caso 1: dirección extraída', (r1.extraction?.direccion || '').toLowerCase().includes('calle central'));
assert('Caso 1: acción export', r1.action === 'export');

// Caso 2: saludo sin datos → no exporta
const r2 = await extractData(env, ['Hola, buenas tardes'], null);
assert('Caso 2: saludo no exporta', r2.action !== 'export');

// Caso 3: datos completos normales
const r3 = await extractData(env, ['Soy Juan Perez, mi teléfono es 809-123-4567, vivo en la Av. Lincoln #45 y necesito una consulta'], null);
assert('Caso 3: nombre Juan Perez', (r3.extraction?.nombre || '').toLowerCase().includes('juan') || (r3.extraction?.nombre || '').toLowerCase().includes('juan perez'));
assert('Caso 3: export', r3.action === 'export');

// Caso 4: no sobrescribe buen nombre con dirección (extraction actual con buen nombre)
const r4 = await extractData(env, ['Calle Central no 4 , Torre Luz 3, apt 901'], { nombre: 'Elda Alba Lopez', telefono: '809-817-2412', direccion: 'Calle Central', servicio: 'consulta' });
assert('Caso 4: no sobrescribe nombre bueno', r4.extraction?.nombre === 'Elda Alba Lopez' || r4.extraction?.patient_name === 'Elda Alba Lopez');

// Caso 5: mergeExtraction no deja basura
const merged = mergeExtraction(null, { nombre: 'Calle Central Torre Luz', telefono: '809-817-2412' });
assert('Caso 5: merge descarta nombre-address', merged.merged.nombre === null || merged.merged.nombre === undefined);

// Caso 6: isExtractionComplete
assert('Caso 6: complete con nombre+tel+dir', isExtractionComplete({ nombre: 'Ana Martinez', telefono: '8091234567', direccion: 'X' }));
assert('Caso 6: incomplete sin teléfono', !isExtractionComplete({ nombre: 'Ana Martinez', direccion: 'X' }));

// Caso 7: confidenceScore
assert('Caso 7: confidence 0.75 con 3 campos', confidenceScore({ nombre: 'A', telefono: '1', direccion: 'X' }) === 0.75);
assert('Caso 7: confidence 0 sin campos', confidenceScore(emptyExtraction()) === 0);

// Caso 8: sanitizeFormPayload
const bad = sanitizeFormPayload({ nombre: 'Calle Central Torre Luz SERRALLÉS', patient_name: 'Elda Alba Lopez', first_name: 'Calle', last_name: 'Central Torre Luz SERRALLÉS' });
assert('Caso 8: sanitize corrige nombre dirección → patient_name', bad.nombre === 'Elda Alba Lopez');
assert('Caso 8: first_name recalculado', bad.first_name === 'Elda');
assert('Caso 8: last_name recalculado', bad.last_name === 'Alba Lopez');
assert('Caso 8: looksLikeAddress detecta dirección', looksLikeAddress('Calle Central #4 Torre Luz') === true);
assert('Caso 8: looksLikeAddress NO detecta nombre', looksLikeAddress('Elda Alba Lopez') === false);

console.log(`\n${pass} passed, ${fail} failed`);
process.exit(fail > 0 ? 1 : 0);