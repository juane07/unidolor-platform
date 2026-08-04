import { createBot } from './src/bot.js';
import 'dotenv/config';

const env = {
  GEMINI_API_KEY: process.env.GEMINI_API_KEY,
  GROQ_API_KEY: process.env.GROQ_API_KEY,
  TEST_MODE: process.env.TEST_MODE === undefined || process.env.TEST_MODE === '' || process.env.TEST_MODE === '1' ? '1' : '0',
};

const isTest = env.TEST_MODE === '1' || env.TEST_MODE === true;
console.log('MODO:', isTest ? '🧪 PRUEBA (sin Gemini)' : '🤖 PRODUCCIÓN (con Gemini)');
if (env.GEMINI_API_KEY) console.log('Gemini API key:', 'configurada');
if (!env.TEST_MODE && !env.GEMINI_API_KEY) {
  console.log('\nERROR: Sin TEST_MODE y sin GEMINI_API_KEY');
  process.exit(1);
}

const bot = createBot(env);

const testMessages = [
  'Buenos días',
  '¿Cuánto cuesta una consulta?',
  '¿Trabajan con seguros?',
  'Tengo seguro Humano',
  'Quiero una visita a domicilio para mi mamá',
  'Tengo un dolor muy fuerte en la espalda',
  'Gracias, perfecto',
];

async function runTests() {
  for (const msg of testMessages) {
    console.log('\n' + '='.repeat(50));
    console.log('PACIENTE:', msg);
    console.log('-'.repeat(50));
    try {
      const result = await bot.handleMessage('+18090000000', msg);
      console.log('UNIDOLOR:', result.reply);
      console.log('Tipo:', result.type);
      if (result.requiresEscalation) console.log('⚠️  REQUIERE ESCALACIÓN');
    } catch (err) {
      console.log('ERROR:', err.message);
    }
    await new Promise(r => setTimeout(r, 500));
  }
  console.log('\n' + '='.repeat(50));
  console.log('PRUEBAS COMPLETADAS');
}

runTests();
