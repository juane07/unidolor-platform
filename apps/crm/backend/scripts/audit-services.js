/**
 * Auditar nombres de servicios: detecta truncamientos, fragmentos y typos
 * en el catálogo (colección Service) de UNIDOLOR.
 *
 * Uso:
 *   node scripts/audit-services.js            # solo reporta
 *   node scripts/audit-services.js --fix      # aplica correcciones seguras
 *   node scripts/audit-services.js --dry-fix  # muestra qué corregiría
 */

require('dotenv').config();
const mongoose = require('mongoose');

const MONGODB_URI = process.env.MONGODB_URI || process.env.DATABASE;
if (!MONGODB_URI) {
  console.error('Falta MONGODB_URI o DATABASE en backend/.env');
  process.exit(1);
}

const isFix = process.argv.includes('--fix');
const isDryFix = process.argv.includes('--dry-fix');

const Service = mongoose.model('Service', new mongoose.Schema({}, { strict: false }));

const WORDS = (s) => String(s || '').split(/\s+/).filter(Boolean);

// Palabras que casi nunca cierran un nombre real de servicio.
const TRAILING_STOP = new Set([
  'de', 'del', 'la', 'el', 'los', 'las', 'al', 'a', 'en', 'y', 'o', 'u', 'con', 'por', 'para', 'una', 'un', 'su', 'sus',
]);

// Patrones de truncamiento típicos (ej: "Consulta Telefónica a", "Programada del", "(Paciente NO ingresado)")
const ENDS_UNCLOSED = /[\(\[](?:[^\)\]]*)$/; // paréntesis sin cerrar
const ENDS_PREP = new RegExp(`(${['de', 'del', 'la', 'el', 'al', 'en', 'con', 'para', 'por', 'y', 'a', 'una', 'un'].join('|')})$`, 'i');
const ENDS_CORRUP = /(rafía|programada$|demanda$|seguimiento$|electrocardiograma$|ecocardiograma$|radiograf[íi]a$|tomograf[íi]a$|telef[óo]nica$)$/i;

const TYPO_FIXES = [
  [/electrocardiogram[aá]$/i, 'Electrocardiograma'],
  [/radiograf[íi]a$/i, 'Radiografía'],
];

function detectIssues(name) {
  const issues = [];
  const s = String(name || '').trim();
  if (s.length < 6) issues.push('MUY CORTO');
  if (ENDS_UNCLOSED.test(s)) issues.push('PAREN SIN CERRAR');
  const w = WORDS(s);
  const last = w[w.length - 1] || '';
  if (TRAILING_STOP.has(last.toLowerCase())) issues.push(`TERMINA EN "${last}"`);
  if (ENDS_CORRUP.test(s)) issues.push('POSIBLE TRUNCAMIENTO');
  if (/^\d+$/.test(s)) issues.push('SOLO NUMERICO');
  if (/[a-z]\s{2,}[A-Z]/.test(s) && !/\(.*\)/.test(s)) issues.push('POSIBLE PALABRA PARTIDA');
  return issues;
}

async function main() {
  const all = await Service.find({ removed: false }).lean();
  const rows = [];
  for (const d of all) {
    const issues = detectIssues(d.name);
    if (issues.length) {
      rows.push({ name: d.name, issues, id: d._id });
    }
  }

  console.log(`Total activos: ${all.length}`);
  console.log(`Con problemas detectados: ${rows.length}\n`);

  for (const r of rows) {
    console.log(`- [${r.issues.join(' | ')}] ${r.name}  (${r.id})`);
  }

  if (isDryFix || isFix) {
    console.log('\n=== CORRECCIONES (typos seguros) ===');
    for (const r of rows) {
      let fixed = r.name;
      for (const [re, to] of TYPO_FIXES) {
        if (re.test(fixed)) fixed = fixed.replace(re, to);
      }
      if (fixed !== r.name) {
        console.log(`  ${r.name}\n  -> ${fixed}`);
        if (isFix) {
          await Service.updateOne(
            { _id: r.id },
            { $set: { name: fixed }, $addToSet: { aliases: r.name } }
          );
        }
      }
    }
  }

  await mongoose.disconnect();
}

(async () => {
  await mongoose.connect(MONGODB_URI);
  await main();
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
