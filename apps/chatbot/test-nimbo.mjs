import { searchPatient, getPatient, createPatient, updatePatient, createConsultation, createAppointment, listAvailableHours, searchPatientByPhone } from './src/nimbo.js';

const env = {
  NIMBO_BASE_URL: 'https://api.nimbo.app',
  NIMBO_ACCESS_TOKEN: 'test-token',
};

let passed = 0;
let failed = 0;

function assert(condition, label) {
  if (condition) { passed++; console.log(`  ✅ ${label}`); }
  else { failed++; console.log(`  ❌ ${label}`); }
}

function mockFetch(status, body) {
  const bodyStr = JSON.stringify(body);
  return globalThis.fetch = async (url, options) => {
    const res = {
      ok: status >= 200 && status < 300,
      status,
      text: () => Promise.resolve(bodyStr),
      json: () => Promise.resolve(body),
    };
    res.url = url;
    res.options = options;
    return res;
  };
}

let lastFetchUrl = '';
let lastFetchOptions = null;
function mockFetchCapture(status, body) {
  const bodyStr = JSON.stringify(body);
  return globalThis.fetch = async (url, options) => {
    lastFetchUrl = url;
    lastFetchOptions = options;
    const res = {
      ok: status >= 200 && status < 300,
      status,
      text: () => Promise.resolve(bodyStr),
      json: () => Promise.resolve(body),
    };
    return res;
  };
}

console.log('=== searchPatient ===');

mockFetch(200, { people: [{ id: 1, first_name: 'Juan', last_name: 'Pérez' }] });
let r = await searchPatient(env, 'Juan');
assert(r.ok === true, 'ok en búsqueda exitosa');
assert(r.patients.length === 1, 'retorna pacientes encontrados');
assert(r.count === 1, 'count correcto');

mockFetch(200, { people: [] });
r = await searchPatient(env, 'NoExiste');
assert(r.ok === true, 'ok aunque no haya resultados');
assert(r.count === 0, 'count 0 sin resultados');

r = await searchPatient(env, '');
assert(r.ok === false, 'falla sin query');
assert(r.error !== undefined, 'mensaje de error');

console.log('\n=== getPatient ===');

mockFetch(200, { person: { id: 42, first_name: 'María' } });
r = await getPatient(env, 42);
assert(r.ok === true, 'ok en get exitoso');
assert(r.patient.id === 42, 'retorna el paciente');

r = await getPatient(env, null);
assert(r.ok === false, 'falla sin personId');

console.log('\n=== createPatient ===');

let captured = null;
globalThis.fetch = async (url, options) => {
  captured = { url, body: JSON.parse(options.body), headers: options.headers };
  return { ok: true, status: 201, text: () => Promise.resolve('{}'), json: () => Promise.resolve({ person: { id: 100 } }) };
};
r = await createPatient(env, { first_name: 'Ana', last_name: 'López', telefono: '8095550100' });
assert(r.ok === true, 'ok en creación');
assert(r.person_id === 100, 'retorna person_id');
assert(captured.body.person.first_name === 'Ana', 'body tiene first_name');
assert(captured.body.person.last_name === 'López', 'body tiene last_name');
assert(captured.body.person.telephone2 === '8095550100', 'body tiene telephone2');
assert(captured.body.person.without_cellphone === false, 'without_cellphone false porque hay teléfono');

r = await createPatient(env, { first_name: '', last_name: '' });
assert(r.ok === false, 'falla sin nombre');

globalThis.fetch = async (url, options) => {
  captured = { url, body: JSON.parse(options.body), headers: options.headers };
  return { ok: true, status: 201, text: () => Promise.resolve('{}'), json: () => Promise.resolve({ person: { id: 101 } }) };
};
r = await createPatient(env, { first_name: 'Carlos', last_name: 'García', genero: 'Masculino', email: 'c@x.com', cedula: '001-0000000-0', fecha_nacimiento: '1990-01-15' });
assert(r.ok === true, 'creación con todos los campos');
assert(captured.body.person.gender === 'm', 'gender m para Masculino');
assert(captured.body.person.email === 'c@x.com', 'email incluido');
assert(captured.body.person.born_at === '1990-01-15', 'born_at incluido');
assert(captured.body.person.person_attributes.identity_number === '001-0000000-0', 'identity_number desde cédula');

console.log('\n=== updatePatient ===');

let updates = null;
globalThis.fetch = async (url, options) => {
  updates = { url, body: JSON.parse(options.body) };
  return { ok: true, status: 200, text: () => Promise.resolve('{}'), json: () => Promise.resolve({ person: { id: 42 } }) };
};
r = await updatePatient(env, 42, { email: 'nuevo@x.com', notas: 'cambio de teléfono' });
assert(r.ok === true, 'ok en update');
assert(updates.body.person.email === 'nuevo@x.com', 'email actualizado');
assert(updates.body.person.notes === 'cambio de teléfono', 'notas actualizado');

r = await updatePatient(env, null, {});
assert(r.ok === false, 'falla sin personId');

console.log('\n=== createConsultation ===');

let consultBody = null;
globalThis.fetch = async (url, options) => {
  consultBody = { url, body: JSON.parse(options.body) };
  return { ok: true, status: 201, text: () => Promise.resolve('{}'), json: () => Promise.resolve({ consultation: { id: 500 } }) };
};
r = await createConsultation(env, 42, { servicio: 'consulta', account_id: '17067' });
assert(r.ok === true, 'ok en creación de consulta');
assert(r.consultation_id === 500, 'retorna consultation_id');
assert(consultBody.body.consultation.cause === 'consulta', 'cause en body');
assert(consultBody.body.consultation.person_id === '42', 'person_id en body');
assert(consultBody.body.consultation.account_id === '17067', 'account_id en body');
assert(consultBody.url.includes('/consultations'), 'url apunta a /consultations');

r = await createConsultation(env, 42, { servicio: 'consulta' });
assert(r.ok === false, 'falla sin account_id');

r = await createConsultation(env, null, {});
assert(r.ok === false, 'falla sin personId');

console.log('\n=== createAppointment ===');

let aptBody = null;
globalThis.fetch = async (url, options) => {
  aptBody = { url, body: JSON.parse(options.body) };
  return { ok: true, status: 201, text: () => Promise.resolve('{}'), json: () => Promise.resolve({ consultation_schedule: { id: 600 } }) };
};
r = await createAppointment(env, 42, { servicio: 'consulta', account_id: '17067', starts_at: '2026-07-28T10:00:00Z', ends_at: '2026-07-28T11:00:00Z' });
assert(r.ok === true, 'ok en creación de appointment');
assert(r.schedule_id === 600, 'retorna schedule_id');
assert(aptBody.body.consultation_schedule.schedule_type === 'appointment', 'schedule_type appointment');
assert(aptBody.body.consultation_schedule.starts_at === '2026-07-28T10:00:00Z', 'starts_at');
assert(aptBody.body.consultation_schedule.ends_at === '2026-07-28T11:00:00Z', 'ends_at');
assert(aptBody.url.includes('/consultation_schedules'), 'url apunta a /consultation_schedules');

r = await createAppointment(env, 42, {});
assert(r.ok === false, 'falla sin account_id');

r = await createAppointment(env, null, {});
assert(r.ok === false, 'falla sin personId');

console.log('\n=== listAvailableHours ===');

mockFetchCapture(200, { hours: [{ time: '10:00' }, { time: '11:00' }] });
r = await listAvailableHours(env, 'unidolor-slug', '2026-07-28', '2026-07-29');
assert(r.ok === true, 'ok en available hours');
assert(r.hours.length === 2, 'retorna horas');
assert(lastFetchUrl.includes('account=unidolor-slug'), 'url incluye account slug');
assert(lastFetchUrl.includes('from=2026-07-28'), 'url incluye from');

r = await listAvailableHours(env, '', '', '');
assert(r.ok === false, 'falla sin slug');

console.log('\n=== searchPatientByPhone ===');

mockFetchCapture(200, { accounts: [{ id: 1, person: { id: 100, first_name: 'Juan' } }] });
r = await searchPatientByPhone(env, '17067', '8095550100', '1990-01-15');
assert(r.ok === true, 'ok en búsqueda por teléfono');
assert(lastFetchUrl.includes('/accounts/17067/people'), 'url incluye account');
assert(lastFetchUrl.includes('telephone2=8095550100'), 'url incluye teléfono');
assert(lastFetchUrl.includes('born_at=1990-01-15'), 'url incluye born_at');

r = await searchPatientByPhone(env, '', '');
assert(r.ok === false, 'falla sin accountId y telephone2');

console.log(`\nResultados: ${passed} pasaron, ${failed} fallaron`);
process.exit(failed > 0 ? 1 : 0);
