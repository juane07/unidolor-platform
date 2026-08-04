/**
 * Migrar etapas antiguas del pipeline a las nuevas del flujo operativo (13 pasos).
 * Uso: node scripts/migrate-opportunity-stages.js
 */
require('module-alias/register');
require('dotenv').config();
const mongoose = require('mongoose');
const { globSync } = require('glob');
const path = require('path');
for (const f of globSync('./src/models/**/*.js')) {
  require(path.resolve(f));
}

const MONGODB_URI = process.env.MONGODB_URI || process.env.DATABASE;
if (!MONGODB_URI) {
  console.error('Falta MONGODB_URI o DATABASE en backend/.env');
  process.exit(1);
}

const Opportunity = require('@/models/appModels/Opportunity');

const MAPEO = {
  cotizacion: 'cotizacion_autorizacion',
  cita_solicitada: 'recepcion_informacion',
  cita_programada: 'programacion',
  visita: 'ejecucion',
  orden_servicio: 'preparacion',
  factura: 'facturacion',
};

async function main() {
  const all = await Opportunity.find({ removed: false });
  let updated = 0;
  const resumen = {};
  for (const opp of all) {
    const target = MAPEO[opp.stage];
    if (!target || target === opp.stage) {
      resumen[opp.stage] = (resumen[opp.stage] || 0) + 1;
      continue;
    }
    const history = opp.stageHistory || [];
    history.push({ from: opp.stage, to: target, at: new Date(), by: null });
    await Opportunity.updateOne(
      { _id: opp._id },
      { $set: { stage: target, stageHistory: history, updated: Date.now() } }
    );
    updated++;
    resumen[target] = (resumen[target] || 0) + 1;
  }
  console.log('Oportunidades migradas:', updated);
  console.log('Etapas resultantes:', JSON.stringify(resumen));
  await mongoose.disconnect();
}

(async () => {
  await mongoose.connect(MONGODB_URI);
  await main();
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
