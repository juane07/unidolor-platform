import { missingPhotos, missingNumbers, hasAllPhotos, hasAllNumbers, buildRequirementsMessage } from './src/requirements.js';

let passed = 0;
let failed = 0;
function assert(condition, label) {
  if (condition) { passed++; console.log(`  ✅ ${label}`); }
  else { failed++; console.log(`  ❌ ${label}`); }
}

console.log('=== missingPhotos ===');
assert(missingPhotos({}).includes('cedula'), 'vacío → falta cédula');
assert(missingPhotos({}).includes('seguro'), 'vacío → falta seguro');
assert(missingPhotos({ cedula: 'x' }).length === 1, 'solo cédula → falta seguro');
assert(missingPhotos({ seguro: 'x' }).length === 1, 'solo seguro → falta cédula');
assert(missingPhotos({ cedula: 'x', seguro: 'y' }).length === 0, 'ambas → completo');
assert(missingPhotos({ ambos: 'x' }).length === 0, 'ambos cubre cédula y seguro');
assert(hasAllPhotos({ cedula: 'x', seguro: 'y' }), 'hasAllPhotos true');
assert(!hasAllPhotos({ cedula: 'x' }), 'hasAllPhotos false');

console.log('\n=== missingNumbers ===');
assert(missingNumbers({}).includes('cedula'), 'vacío → falta cédula');
assert(missingNumbers({}).includes('afiliado'), 'vacío → falta afiliado');
assert(missingNumbers({ cedula: '1', afiliado: '2' }).length === 0, 'ambos → completo');
assert(missingNumbers({ cedula: '1' }).includes('afiliado'), 'falta afiliado');
assert(hasAllNumbers({ cedula: '1', afiliado: '2' }), 'hasAllNumbers true');

console.log('\n=== buildRequirementsMessage ===');
const m1 = buildRequirementsMessage({}, {});
assert(m1.includes('cédula') && m1.includes('seguro'), 'mensaje pide fotos de cédula y seguro');
assert(m1.includes('afiliado'), 'mensaje pide número de afiliado');
const m2 = buildRequirementsMessage({ cedula: '1', afiliado: '2' }, { cedula: 'x', seguro: 'y' });
assert(m2 === '', 'completo → sin mensaje');

console.log(`\nResultados: ${passed} pasaron, ${failed} fallaron`);
process.exit(failed > 0 ? 1 : 0);