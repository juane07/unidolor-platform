import { detectFields } from './src/knowledge-data.js';

let pass = 0;
let fail = 0;
function assert(name, cond) {
  if (cond) { pass++; console.log(`✅ ${name}`); }
  else { fail++; console.log(`❌ ${name}`); }
}

// Caso Elda: dirección NO debe convertirse en nombre
const messages = [
  'Buenas tardes',
  'Tienen servicio de consulta medica a domicilio ?',
  'Es para mi esposa que se llama Elda Alba Lopez',
  '001-0089423-7',
  'Calle Central no 4 , Torre Luz 3, apt 901 , sector SERRALLÉS',
  '809-817-2412',
];
const f = detectFields(messages);
assert('detectFields: nombre correcto = Elda Alba Lopez', f.nombre === 'Elda Alba Lopez');
assert('detectFields: nombre NO es la dirección', !/Calle Central/i.test(f.nombre || '') && !/Torre Luz/i.test(f.nombre || ''));
assert('detectFields: telefono', (f.telefono || '').replace(/\D/g, '').includes('8098172412'));
assert('detectFields: cedula', (f.cedula || '').includes('001'));
assert('detectFields: direccion', (f.direccion || '').toLowerCase().includes('calle central'));
assert('detectFields: relationship=esposa', f.relationship === 'esposa');

// Caso: mensaje con dirección y cédula en el MISMO mensaje (el bug original)
const f2 = detectFields(['001-0089423-7', 'Calle Central no 4, Torre Luz 3, apt 901, sector SERRALLÉS']);
assert('detectFields2: dirección+cedula NO produce nombre-address', f2.nombre === null || !/Calle/i.test(f2.nombre));
assert('detectFields2: direccion capturada', (f2.direccion || '').toLowerCase().includes('calle central'));

// Caso: nombre normal con cédula
const f3 = detectFields(['Juan Perez, mi cédula es 001-1234567-8']);
assert('detectFields3: nombre normal = Juan Perez', f3.nombre === 'Juan Perez' || (f3.nombre || '').toLowerCase().includes('juan'));

// Caso: "me llamo" con nombre normal
const f4 = detectFields(['Me llamo Maria Rodriguez']);
assert('detectFields4: me llamo = Maria Rodriguez', (f4.nombre || '').toLowerCase().includes('maria'));

// Caso: seguros no deben ser nombre
const f5 = detectFields(['Tengo seguro Humano']);
assert('detectFields5: "Humano" (seguro) NO es nombre', f5.nombre === null);

console.log(`\n${pass} passed, ${fail} failed`);
process.exit(fail > 0 ? 1 : 0);
