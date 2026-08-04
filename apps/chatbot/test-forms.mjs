import { detectUrgency } from './src/intent.js';

// inline buildReply (misma lógica que prompt.js, evita error de import JSON en Node local)
function buildReply(text) {
  const formMatch = text.match(/FORMDATA:({[^}]+})/);
  const escMatch = text.match(/ESCALACION:(.+)/);
  const clean = text.replace(/FORMDATA:({[^}]+})/g, '').replace(/ESCALACION:.+/g, '').trim();
  return { reply: clean, formData: formMatch ? formMatch[1] : null, escalation: escMatch ? escMatch[1].trim() : null };
}

let passed = 0;
let failed = 0;

function assert(condition, label) {
  if (condition) { passed++; console.log(`  ✅ ${label}`); }
  else { failed++; console.log(`  ❌ ${label}`); }
}

console.log('=== buildReply (parsing markers) ===');

let r1 = buildReply('Claro, le tomo sus datos.\nFORMDATA:{"servicio":"Consulta","nombre":"Juan"}');
assert(r1.reply === 'Claro, le tomo sus datos.', 'FORMDATA se quita del reply');
assert(r1.formData === '{"servicio":"Consulta","nombre":"Juan"}', 'FORMDATA se captura');

let r2 = buildReply('Necesito cotización.\nESCALACION:cotización para varios servicios');
assert(r2.reply === 'Necesito cotización.', 'ESCALACION se quita del reply');
assert(r2.escalation === 'cotización para varios servicios', 'ESCALACION se captura');

let r3 = buildReply('Todo listo.\nFORMDATA:{"servicio":"RX"}\nESCALACION:aprobación');
assert(r3.formData !== null && r3.escalation !== null, 'Ambos marcadores');

let r4 = buildReply('Hola, ¿cómo está?');
assert(r4.reply === 'Hola, ¿cómo está?', 'Sin marcadores, reply intacto');
assert(r4.formData === null, 'Sin marcadores, formData null');

console.log('\n=== detectUrgency ===');
assert(detectUrgency('Tengo una emergencia'), 'emergencia');
assert(detectUrgency('dificultad para respirar'), 'dificultad para respirar');
assert(!detectUrgency('Buenos días'), 'Buenos días no es urgencia');
assert(!detectUrgency('¿Cuánto cuesta?'), 'Precio no es urgencia');

console.log(`\nResultados: ${passed} pasaron, ${failed} fallaron`);
process.exit(failed > 0 ? 1 : 0);
