/**
 * Backfill de clasificación multi-atributo para servicios existentes (SISALRIL).
 * Infiere modalidad, tipoServicio, clasificación y atributos operativos desde
 * el nombre y la categoría ya cargada. No toca precios ni elimina datos.
 *
 * Uso:
 *   node scripts/backfill-service-classification.js --dry   # solo reporte
 *   node scripts/backfill-service-classification.js         # escribe
 */
require('module-alias/register');
require('dotenv').config();
const mongoose = require('mongoose');

const MONGODB_URI = process.env.MONGODB_URI || process.env.DATABASE;
if (!MONGODB_URI) {
  console.error('Falta MONGODB_URI o DATABASE en backend/.env');
  process.exit(1);
}

const isDry = process.argv.includes('--dry');

const Service = require('@/models/appModels/Service');

const norm = (s) => String(s || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();

const RULES = [
  // Reglas: [match, modalidad, tipoServicio, [clasificacion], requiereConsentimiento, requiereIndicacionMedica]
  { m: /domiciliaria|a domicilio|domicilio/i, modalidad: 'domicilio', clasif: ['domiciliario'] },
  { m: /telemedicina|teleconsulta|consulta telefonica|telefonic/i, modalidad: 'telemedicina', clasif: ['telemedicina'], tipoServicio: 'consulta' },
  { m: /consulta|interconsulta/i, tipoServicio: 'consulta', clasif: ['clinico', 'ambulatorio'] },
  { m: /rayos x|radiografia|radiolog|tomografia|tac |resonancia|mamograf|densitometri|ecografia|ecocardiograma|electrocardiograma|holter|mapa|doppler|ultrasonograf|imagen/i, tipoServicio: 'diagnostico', clasif: ['diagnostico', 'ambulatorio'] },
  { m: /laboratorio|hemograma|glicemia|quimica|orina|heces|perfil|serolog|pcr|biopsia/i, tipoServicio: 'diagnostico', clasif: ['diagnostico', 'ambulatorio'] },
  { m: /hemoterapia|transfusion|plasma|plaquetas|globulos|exanguinotransfusion|hemocomponente/i, tipoServicio: 'procedimiento', clasif: ['terapeutico', 'hospitalario', 'domiciliario'], requiereIndicacion: true },
  { m: /quimioterapia|inmunoterapia|biológica|infusion|oncology|citostatico|tratamiento/i, tipoServicio: 'procedimiento', clasif: ['terapeutico', 'hospitalario'], requiereIndicacion: true },
  { m: /cuidados paliativos/i, tipoServicio: 'programa_especial', clasif: ['clinico', 'domiciliario'], requiereIndicacion: true },
  { m: /enfermeria|curacion|inyeccion|sueroterapia|nebulizacion|sonda|canalizacion|vendaje|cuidador/i, tipoServicio: 'enfermeria', clasif: ['clinico', 'domiciliario'] },
  { m: /infiltracion|bloqueo|radiofrecuencia|rizolisis|epidural|facetario|sacroil|peng|piriforme|neurolisis|plexo|bomba|cateter|procedimiento/i, tipoServicio: 'procedimiento', clasif: ['clinico', 'terapeutico'], requiereConsentimiento: true, requiereIndicacion: true },
  { m: /fisioterapia|rehabilitacion|terapia fisica|terapia respiratoria|kinesio|ejercicio/i, tipoServicio: 'programa_especial', clasif: ['terapeutico', 'ambulatorio'] },
  { m: /empresa|ocupacional|corporativ|jornada|preventivo|vaccination|vacunacion/i, tipoServicio: 'programa_especial', clasif: ['empresarial', 'preventivo'] },
];

function classify(name, category) {
  const n = norm(name);
  let modalidad = 'clinica';
  let tipoServicio = 'consulta';
  let clasificacion = [];
  let requiereConsentimiento = false;
  let requiereIndicacionMedica = false;
  let prioridadDefault = 'programado';

  for (const r of RULES) {
    if (r.m.test(n)) {
      if (r.modalidad) modalidad = r.modalidad;
      if (r.tipoServicio) tipoServicio = r.tipoServicio;
      if (r.clasif) clasificacion = r.clasif;
      if (r.requiereConsentimiento) requiereConsentimiento = true;
      if (r.requiereIndicacion) requiereIndicacionMedica = true;
      break;
    }
  }

  if (category === 'estudio') {
    if (tipoServicio === 'consulta') tipoServicio = 'diagnostico';
    if (!clasificacion.includes('diagnostico')) clasificacion.push('diagnostico');
    if (!clasificacion.includes('ambulatorio')) clasificacion.push('ambulatorio');
  }
  if (category === 'procedimiento' && tipoServicio === 'consulta') {
    tipoServicio = 'procedimiento';
    if (!clasificacion.includes('terapeutico')) clasificacion.push('terapeutico');
  }
  if (category === 'visita_domicilio') {
    modalidad = 'domicilio';
    if (!clasificacion.includes('domiciliario')) clasificacion.push('domiciliario');
  }
  if (/urgenc|emergencia|urgente/i.test(n)) prioridadDefault = 'urgente';

  if (clasificacion.length === 0) {
    clasificacion = tipoServicio === 'diagnostico' ? ['diagnostico', 'ambulatorio'] : ['clinico', 'ambulatorio'];
  }
  if (!clasificacion.includes('clinico') && ['consulta', 'procedimiento', 'enfermeria', 'diagnostico'].includes(tipoServicio)) {
    clasificacion.push('clinico');
  }
  if (modalidad === 'domicilio' && !clasificacion.includes('domiciliario')) clasificacion.push('domiciliario');
  if (modalidad === 'telemedicina' && !clasificacion.includes('telemedicina')) clasificacion.push('telemedicina');

  return {
    modalidad,
    tipoServicio,
    clasificacion: [...new Set(clasificacion)],
    requiereConsentimiento,
    requiereIndicacionMedica,
    prioridadDefault,
  };
}

async function main() {
  const all = await Service.find({ removed: false });
  let updated = 0;
  const byTipo = {};
  const byModalidad = {};
  const skipped = [];

  for (const svc of all) {
    const result = classify(svc.name, svc.category);
    const hasChange =
      svc.modalidad !== result.modalidad ||
      svc.tipoServicio !== result.tipoServicio ||
      JSON.stringify(svc.clasificacion || []) !== JSON.stringify(result.clasificacion) ||
      svc.prioridadDefault !== result.prioridadDefault ||
      svc.requiereConsentimiento !== result.requiereConsentimiento ||
      svc.requiereIndicacionMedica !== result.requiereIndicacionMedica;

    byTipo[result.tipoServicio] = (byTipo[result.tipoServicio] || 0) + 1;
    byModalidad[result.modalidad] = (byModalidad[result.modalidad] || 0) + 1;

    if (!hasChange) continue;
    updated++;
    if (!isDry) {
      await Service.updateOne(
        { _id: svc._id },
        {
          $set: {
            modalidad: result.modalidad,
            tipoServicio: result.tipoServicio,
            clasificacion: result.clasificacion,
            requiereConsentimiento: result.requiereConsentimiento,
            requiereIndicacionMedica: result.requiereIndicacionMedica,
            prioridadDefault: result.prioridadDefault,
            updated: Date.now(),
          },
        }
      );
    }
  }

  console.log(isDry ? '=== DRY-RUN (no escribe) ===' : '=== BACKFILL REAL ===');
  console.log(`Total servicios: ${all.length}`);
  console.log(`Servicios a actualizar: ${updated}`);
  console.log('\nPor tipoServicio:', byTipo);
  console.log('\nPor modalidad:', byModalidad);

  const sinClasif = all.filter((s) => !s.clasificacion || s.clasificacion.length === 0);
  console.log(`\nSin clasificación previa: ${sinClasif.length}`);
  await mongoose.disconnect();
}

(async () => {
  await mongoose.connect(MONGODB_URI);
  await main();
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
