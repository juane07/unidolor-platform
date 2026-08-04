import { createBot } from './src/bot.js';
import { cleanup } from './src/state.js';

const env = {
  TEST_MODE: '1',
  GEMINI_API_KEY: '',
  GROQ_API_KEY: '',
  CRM_BASE_URL: 'http://mock-crm',
  CRM_WEBHOOK_URL: 'http://mock-crm/api/webhook/bot',
  CRM_API_KEY: 'test-key',
};

const kvStore = new Map();
const kv = {
  async get(k, type) {
    const v = kvStore.get(k);
    if (v === undefined) return null;
    return type === 'json' ? JSON.parse(v) : v;
  },
  async put(k, v, opts) { kvStore.set(k, typeof v === 'string' ? v : JSON.stringify(v)); },
  async delete(k) { kvStore.delete(k); },
  async list() { return { keys: [...kvStore.keys()].map(name => ({ name })) }; },
};
env.SEGUIMIENTO = kv;

const availabilityResponse = {
  success: true,
  result: [
    { start: '08:00', end: '09:00', doctor: { _id: 'doc1', name: 'Dra. Bethania Martínez' }, branch: { _id: 'br1', name: 'Santo Domingo - Torre Solazar' }, date: '2026-08-12' },
    { start: '09:00', end: '10:00', doctor: { _id: 'doc1', name: 'Dra. Bethania Martínez' }, branch: { _id: 'br1', name: 'Santo Domingo - Torre Solazar' }, date: '2026-08-12' },
  ],
};

const mockCalls = [];
const originalFetch = globalThis.fetch;
globalThis.fetch = async (url, opts = {}) => {
  const u = String(url);
  const body = opts.body ? JSON.parse(opts.body) : null;
  if (u.includes('/public/schedule/available')) {
    mockCalls.push({ kind: 'availability', query: new URL(u).searchParams.toString() });
    return { ok: true, status: 200, json: async () => availabilityResponse };
  }
  if (u.includes('/public/appointment/create')) {
    mockCalls.push({ kind: 'appointment', body });
    return { ok: true, status: 201, json: async () => ({ success: true, result: { _id: 'appt1' } }) };
  }
  if (u.includes('/api/webhook/bot')) {
    mockCalls.push({ kind: 'webhook', body });
    return { ok: true, status: 201, json: async () => ({ success: true, contactId: 'client1', opportunityId: 'opp1' }) };
  }
  return { ok: false, status: 404, text: async () => 'not found' };
};

const sleep = ms => new Promise(r => setTimeout(r, ms));

async function run() {
  const from = '+18095559999';
  const bot = createBot(env);

  let pass = 0, fail = 0;
  const check = (name, cond) => {
    if (cond) { pass++; console.log(`  ✅ ${name}`); }
    else { fail++; console.log(`  ❌ ${name}`); }
  };

  const r1 = await bot.handleMessage(from, 'Hola, me llamo Ana Gómez, teléfono 8097778888, quiero agendar una cita');
  check('1. intent de cita → pide fecha', r1.type === 'awaiting_appointment_date' && r1.reply.includes('fecha'));
  await sleep(300);

  const r2 = await bot.handleMessage(from, 'el 12/08');
  check('2. fecha → muestra slots', r2.type === 'awaiting_appointment_slot' && r2.reply.includes('Bethania') && r2.reply.includes('1. 08:00'));
  check('   slots priorizan Dra. Bethania', r2.reply.indexOf('Bethania') < r2.reply.indexOf('1.') || r2.reply.includes('Bethania'));
  await sleep(300);

  const r3 = await bot.handleMessage(from, '1');
  check('3. slot → cita confirmada', r3.type === 'appointment_confirmed' && r3.reply.includes('08:00'));
  check('   cliente sincronizado vía webhook', mockCalls.some(c => c.kind === 'webhook'));
  check('   cita creada en CRM', mockCalls.some(c => c.kind === 'appointment'));

  const webhookCall = mockCalls.find(c => c.kind === 'webhook');
  check('   webhook con nombre/telefono', webhookCall && webhookCall.body.nombre === 'Ana Gómez' && webhookCall.body.telefono === '8097778888');

  const apptCall = mockCalls.find(c => c.kind === 'appointment');
  check('   cita con contactId y doctor', apptCall && apptCall.body.client === 'client1' && apptCall.body.doctor === 'doc1');

  const r4 = await bot.handleMessage(from, 'quiero agendar una cita');
  check('4. flujo reinicia (estado limpiado)', r4.type === 'awaiting_data' || r4.type === 'awaiting_appointment_date');

  console.log(`\nResultados: ${pass} pasaron, ${fail} fallaron`);
  cleanup();
  globalThis.fetch = originalFetch;
  process.exit(fail === 0 ? 0 : 1);
}

run().catch(e => { console.error('ERROR:', e); cleanup(); globalThis.fetch = originalFetch; process.exit(1); });
