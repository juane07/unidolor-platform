/**
 * Pruebas T1/T2 — Cierre fiscal (Iteración 17, R16-A1)
 *
 * - T1: concurrencia de reserva atómica de NCF (nextNcf) + índice único parcial.
 * - T2: bloqueo de edición/borrado de facturas emitidas (RN-023).
 *
 * Usa UNA BD desechable (`idurar_test_cierre_fiscal`) derivada de DATABASE,
 * nunca toca los datos reales. Al finalizar se elimina la BD.
 *
 * Uso: node scripts/test-cierre-fiscal.js
 */
require('dotenv').config({ path: '.env' });
require('module-alias/register');

const mongoose = require('mongoose');

const baseUri = process.env.DATABASE;
if (!baseUri) {
  console.error('Falta la variable DATABASE en .env');
  process.exit(1);
}

const testUri = baseUri.replace(/\/([^/?]+)(\?|$)/, '/idurar_test_cierre_fiscal$2');

function mockRes() {
  return {
    statusCode: 0,
    payload: null,
    status(c) {
      this.statusCode = c;
      return this;
    },
    json(p) {
      this.payload = p;
      return this;
    },
  };
}

async function main() {
  await mongoose.connect(testUri, { useNewUrlParser: true, useUnifiedTopology: true });
  await mongoose.connection.dropDatabase();
  console.log('[setup] BD de prueba limpia:', mongoose.connection.name);

  require('../src/models/appModels/NcfSequence');
  require('../src/models/appModels/Invoice');
  require('../src/models/appModels/Payment');
  require('../src/models/appModels/Client');
  require('../src/models/coreModels/Setting');

  const { nextNcf } = require('../src/helpers/ncf');
  const updateInvoice = require('../src/controllers/appControllers/invoiceController/update');
  const removeInvoice = require('../src/controllers/appControllers/invoiceController/remove');

  const NcfSequence = mongoose.model('NcfSequence');
  const Invoice = mongoose.model('Invoice');

  const dummy = new mongoose.Types.ObjectId();

  // ---------- T1: concurrencia NCF ----------
  await NcfSequence.create({
    tipo: '01',
    nombre: 'test',
    rangoDesde: 1,
    rangoHasta: 100000,
    secuenciaActual: 0,
    isActive: true,
    enabled: true,
    regimen: 'RST',
  });

  const results = await Promise.all(Array.from({ length: 25 }, () => nextNcf('01')));
  const distinct = new Set(results.map((r) => r.ncf)).size;
  const maxSeq = Math.max(...results.map((r) => r.secuenciaActual));

  if (distinct !== 25) throw new Error(`T1 FAIL: NCFs duplicados en concurrencia (${distinct}/25)`);
  if (maxSeq !== 25) throw new Error(`T1 FAIL: secuencia no avanzó (máx ${maxSeq})`);
  console.log(`[T1 PASS] 25 reservas concurrentes únicas (secuencia llegó a ${maxSeq})`);

  await Invoice.init();
  const baseInvoice = {
    createdBy: dummy,
    client: dummy,
    number: 1,
    year: 2026,
    date: new Date(),
    expiredDate: new Date(),
    items: [{ itemName: 'x', quantity: 1, price: 100, total: 100 }],
    taxRate: 0,
    status: 'sent',
    currency: 'DOP',
  };
  await Invoice.create([
    { ...baseInvoice, ncf: results[0].ncf, estadoFiscal: 'emitida' },
    { ...baseInvoice, ncf: results[1].ncf, estadoFiscal: 'emitida' },
  ]);

  let dupBlocked = false;
  try {
    await Invoice.create({ ...baseInvoice, ncf: results[0].ncf, estadoFiscal: 'emitida' });
  } catch (e) {
    if (e.code === 11000) dupBlocked = true;
  }
  if (!dupBlocked) throw new Error('T1 FAIL: índice único parcial de ncf no bloqueó duplicado');
  console.log('[T1 PASS] índice único parcial bloquea NCF duplicado');

  // ---------- T2: bloqueos RN-023 ----------
  const emitida = await Invoice.create({
    ...baseInvoice,
    ncf: results[2].ncf,
    estadoFiscal: 'emitida',
  });
  const borrador = await Invoice.create({
    ...baseInvoice,
    ncf: undefined,
    estadoFiscal: 'borrador',
  });

  const bodyEditable = {
    client: dummy,
    number: 1,
    year: 2026,
    status: 'sent',
    date: new Date(),
    expiredDate: new Date(),
    items: [{ itemName: 'z', quantity: 2, price: 50, total: 100 }],
    taxRate: 0,
  };

  const resUpdEmitida = mockRes();
  await updateInvoice({ params: { id: emitida._id }, body: bodyEditable, admin: { _id: dummy } }, resUpdEmitida);
  if (resUpdEmitida.statusCode !== 400) throw new Error(`T2 FAIL: update emitida respondió ${resUpdEmitida.statusCode}`);
  console.log('[T2 PASS] update de emitida bloqueado (400)');

  const resUpdBorrador = mockRes();
  await updateInvoice({ params: { id: borrador._id }, body: bodyEditable, admin: { _id: dummy } }, resUpdBorrador);
  if (resUpdBorrador.statusCode !== 200) throw new Error(`T2 FAIL: update borrador respondió ${resUpdBorrador.statusCode}`);
  console.log('[T2 PASS] update de borrador permitido (200)');

  const resDelEmitida = mockRes();
  await removeInvoice({ params: { id: emitida._id } }, resDelEmitida);
  if (resDelEmitida.statusCode !== 400) throw new Error(`T2 FAIL: remove emitida respondió ${resDelEmitida.statusCode}`);
  console.log('[T2 PASS] remove de emitida bloqueado (400)');

  const resDelBorrador = mockRes();
  await removeInvoice({ params: { id: borrador._id } }, resDelBorrador);
  if (resDelBorrador.statusCode !== 200) throw new Error(`T2 FAIL: remove borrador respondió ${resDelBorrador.statusCode}`);
  console.log('[T2 PASS] remove de borrador permitido (200)');

  console.log('\n[RESULTADO] T1 + T2 OK (cierre fiscal RN-023, R16-A1)');
}

main()
  .then(async () => {
    try {
      await mongoose.connection.dropDatabase();
    } catch (_) {}
    await mongoose.disconnect();
  })
  .catch(async (e) => {
    console.error('\n[FALLO]', e.message);
    try {
      await mongoose.connection.dropDatabase();
    } catch (_) {}
    await mongoose.disconnect();
    process.exit(1);
  });
