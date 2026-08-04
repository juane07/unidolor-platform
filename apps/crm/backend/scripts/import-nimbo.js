/**
 * Importador de pacientes desde el export de Nimbo X.
 *
 * Uso:
 *   node scripts/import-nimbo.js <ruta.csv>
 *
 * El CSV debe tener un header. Mapea por defecto estas columnas (configurable
 * vía argumento --map "origen:destino;..."):
 *   nombre, telefono, cedula, email, direccion, fecha_nacimiento, seguro,
 *   afiliado, fecha_consulta, diagnostico
 *
 * El destino es un Cliente (paciente). Si el paciente ya existe por teléfono
 * o cédula, se omite (sin duplicar).
 *
 * Cuando Nimbo X entregue la extracción completa (Pacientes, Consultas,
 * Antecedentes, Diagnósticos), se extiende este script para crear también
 * ClinicalRecord y Appointment.
 */
const mongoose = require('mongoose');
const fs = require('fs');

const DATABASE = process.env.DATABASE;

function parseCsv(content) {
  const lines = content.replace(/\r/g, '').split('\n').filter((l) => l.trim() !== '');
  if (lines.length === 0) throw new Error('Archivo vacío');
  const header = lines[0].split(';').map((h) => h.trim().toLowerCase());
  return lines.slice(1).map((line) => {
    const values = line.split(';');
    const obj = {};
    header.forEach((h, i) => {
      obj[h] = (values[i] || '').trim();
    });
    return obj;
  });
}

function buildMap(argMap) {
  const map = {
    name: 'nombre',
    phone: 'telefono',
    identity_number: 'cedula',
    email: 'email',
    address: 'direccion',
  };
  if (!argMap) return map;
  argMap.split(';').forEach((pair) => {
    const [from, to] = pair.split(':');
    if (from && to) map[to.trim()] = from.trim();
  });
  return map;
}

async function main() {
  const filePath = process.argv[2];
  const argMap = process.argv.find((a) => a.startsWith('--map='));
  if (!filePath) {
    console.error('Uso: node scripts/import-nimbo.js <ruta.csv> [--map="origen:destino;..."]');
    process.exit(1);
  }
  const map = buildMap(argMap ? argMap.split('=')[1] : undefined);

  const content = fs.readFileSync(filePath, 'utf8');
  const rows = parseCsv(content);
  console.log(`Registros a procesar: ${rows.length}`);

  await mongoose.connect(DATABASE);
  const db = mongoose.connection.db;
  const clients = db.collection('clients');

  let created = 0;
  let skipped = 0;
  let errors = 0;

  for (const row of rows) {
    try {
      const name = (row[map.name] || '').trim();
      if (!name) {
        skipped++;
        continue;
      }
      const phone = (row[map.phone] || '').trim();
      const identity = (row[map.identity_number] || '').trim();
      const email = (row[map.email] || '').trim();
      const address = (row[map.address] || '').trim();

      const existing = phone
        ? await clients.findOne({ phone, removed: false })
        : identity
          ? await clients.findOne({ identity_number: identity, removed: false })
          : null;
      if (existing) {
        skipped++;
        continue;
      }

      const client = {
        name,
        type: 'cliente',
        phone: phone || undefined,
        address: address || undefined,
        email: email || undefined,
        identity_number: identity || undefined,
        metadata: {
          source: 'nimbo-x',
          fecha_nacimiento: row[map.fecha_nacimiento] || undefined,
          seguro: row[map.seguro] || undefined,
          afiliado: row[map.afiliado] || undefined,
        },
        enabled: true,
        removed: false,
        created: new Date(),
        updated: new Date(),
      };
      await clients.insertOne(client);
      created++;
    } catch (err) {
      errors++;
      console.error('Error en fila:', err.message);
    }
  }

  console.log(`Creados: ${created} | Omitidos: ${skipped} | Errores: ${errors}`);
  await mongoose.disconnect();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
