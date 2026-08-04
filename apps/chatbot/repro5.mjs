import { detectFields, findService } from './src/knowledge-data.js';

const userTexts = [
  'Hola quiero cotizar un neurologo a domicilio',
  'prefiero que me ayudes por aqui',
  'Me llamo Laura Perez y mi cedula es 001-1234567-8',
  'Mi telefono es 809 555 0101',
];
const f = detectFields(userTexts);
console.log('findService msg1:', findService(userTexts[0]));
console.log('detectFields:', JSON.stringify(f, null, 2));
const present = ['nombre', 'cedula', 'servicio', 'direccion'].filter(k => f[k]);
console.log('present:', present, 'length:', present.length);
