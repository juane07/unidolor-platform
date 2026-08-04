/**
 * Importar servicios del tarifario SISALRIL de UNIDOLOR al CRM.
 *
 * Uso:
 *   node scripts/import-sisalril.js --dry        # solo muestra conteos, no escribe
 *   node scripts/import-sisalril.js              # importa (upsert en Service)
 *
 * Config: usa backend/.env (MONGODB_URI o DATABASE). El archivo Excel por defecto:
 *   C:\Users\nomei\Documents\Unidolor - Alegra\Tarifario Cartera de Servicios
 *   Unidolor CON CUIDADOS PALIATIVOS SISALRIL TERRENAS STO DGO.xlsx
 * (se puede pasar como primer argumento).
 *
 * Hojas importadas: HEMOTERAPIA, TARIFARIO DE IMAGENES, TARIFARIO DE ESTUDIOS,
 * CONSULTAS E INTERCONSULTAS, CUIDADOS PALIATIVOS, HOSPITAL DE DIA.
 * SERVICIOS TIPO PAQUETE se excluye: es desglose de materiales/salas/honorarios
 * repetido por paquete, no un catálogo de servicios.
 */

require('dotenv').config();
const XLSX = require('xlsx');
const mongoose = require('mongoose');

const DEFAULT_FILE =
  'C:\\Users\\nomei\\Documents\\Unidolor - Alegra\\Tarifario Cartera de Servicios Unidolor CON CUIDADOS PALIATIVOS SISALRIL TERRENAS STO DGO.xlsx';

const filePath = process.argv[2] && !process.argv[2].startsWith('--')
  ? process.argv[2]
  : DEFAULT_FILE;
const isDry = process.argv.includes('--dry');

const MONGODB_URI = process.env.MONGODB_URI || process.env.DATABASE;
if (!MONGODB_URI) {
  console.error('Falta MONGODB_URI o DATABASE en backend/.env');
  process.exit(1);
}

const Service = mongoose.model('Service', new mongoose.Schema({}, { strict: false }));

const clean = (v) =>
  String(v == null ? '' : v)
    .replace(/[\r\n\t]+/g, ' ')
    .replace(/\s{2,}/g, ' ')
    .replace(/^[\s•·\-–—]+|[\s•·\-–—]+$/g, '')
    .replace(/\s*\+\s*$/g, '')
    .trim();

const WORD_FIXES = {
  'quimioterapia de inducion': 'quimioterapia de induccion',
  'cuidado paliativos': 'cuidados paliativos',
  'exanguineotransfusion': 'exanguinotransfusion',
  'transfucion': 'transfusion',
  'espesifico': 'especifico',
  'ultrasonog rafia': 'ultrasonografia',
  'consulta telefonica a': 'consulta telefonica',
};

const normKey = (s) => {
  let k = String(s || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/\s+/g, ' ')
    .trim();
  for (const [from, to] of Object.entries(WORD_FIXES)) {
    if (k.includes(from)) k = k.replace(from, to);
  }
  return k;
};

const isCups = (v) => /^\d{1,2}\.\d{1,2}\.\d{2,}$/.test(String(v).trim());
const isSimon = (v) => /^\d{3,6}$/.test(String(v).trim());
const num = (v) => {
  const n = Number(String(v).trim().replace(/[^\d.]/g, ''));
  return Number.isFinite(n) && n > 0 ? n : 0;
};

const COMPONENT_RE = /^(honorarios?|uso de sala|sala de recuperacion|sala de procedimiento|domicilio|sonografo|bandeja|material)$/i;

function detectCodes(a, b) {
  let cups = '';
  let simon = '';
  for (const v of [a, b]) {
    const s = String(v == null ? '' : v).trim();
    if (isCups(s) && !cups) cups = s;
    else if (isSimon(s) && !simon) simon = s;
  }
  return { cups, simon };
}

const SHEETS = [
  {
    sheet: 'HEMOTERAPIA',
    headerRow: 0,
    cols: { simon: 0, cups: 1, name: 2, basico: 3, premium: 4 },
    category: 'procedimiento',
    categoryByRow: (name) => (/CONSULTA/i.test(name) ? 'consulta' : 'procedimiento'),
  },
  {
    sheet: 'TARIFARIO DE IMAGENES',
    headerRow: 5,
    cols: { simon: 0, name: 1, cups: 2, basico: 3, premium: 4 },
    category: 'estudio',
  },
  {
    sheet: 'TARIFARIO DE ESTUDIOS',
    headerRow: 5,
    cols: { simon: 0, name: 1, cups: 2, basico: 3, premium: 4 },
    category: 'estudio',
  },
  {
    sheet: 'CONSULTAS E INTERCONSULTAS',
    headerRow: 5,
    cols: { simon: 0, name: 1, cups: 2, basico: 3, premium: 4 },
    category: 'consulta',
  },
  {
    sheet: 'CUIDADOS PALIATIVOS',
    headerRow: 1,
    cols: { cups: 0, simon: 1, name: 2, basico: 3, premium: 4 },
    category: 'consulta',
    categoryBySection: true,
    materialBlocks: true,
  },
  {
    sheet: 'HOSPITAL DE DIA',
    headerRow: 0,
    cols: { name: 4, simon: 5, cups: 6 },
    category: 'procedimiento',
  },
];

function sectionCategory(section) {
  const s = (section || '').toLowerCase();
  if (s.includes('consulta')) return 'consulta';
  if (s.includes('visita') || s.includes('domicilio')) return 'visita_domicilio';
  if (s.includes('imagen') || s.includes('estudio')) return 'estudio';
  if (s.includes('procedimien') || s.includes('hemoterapia')) return 'procedimiento';
  return null;
}

function findMatch(rec, all) {
  const nk = normKey(rec.name);
  const byName = all.find((d) => !d.removed && normKey(d.name) === nk);
  return byName || null;
}

async function upsert(rec, all, ctx) {
  const existing = findMatch(rec, all);
  if (existing) {
    const set = {};
    if (!existing.cupsCode && rec.cups) set.cupsCode = rec.cups;
    if (!existing.simonLevel && rec.simon) set.simonLevel = rec.simon;
    if (!existing.basePrice && rec.basePrice) set.basePrice = rec.basePrice;
    if (!existing.category && rec.category) set.category = rec.category;
    const patch = {};
    if (Object.keys(set).length) patch.$set = set;
    if (existing.name !== rec.name) patch.$addToSet = { aliases: rec.name };
    if (!isDry && Object.keys(patch).length) {
      await Service.updateOne({ _id: existing._id, removed: false }, patch);
    }
    existing.cupsCode = existing.cupsCode || rec.cups;
    existing.simonLevel = existing.simonLevel || rec.simon;
    existing.basePrice = existing.basePrice || rec.basePrice;
    existing.category = existing.category || rec.category;
    ctx.matched++;
    ctx.lines.push(`[MATCH] ${rec.name}`);
    return;
  }
  if (!isDry) {
    await Service.create({
      name: rec.name,
      cupsCode: rec.cups,
      simonLevel: rec.simon,
      basePrice: rec.basePrice,
      category: rec.category,
      type: rec.type || 'otro',
      aliases: [],
      removed: false,
      enabled: true,
      isActive: true,
    });
  }
  const doc = {
    _id: 'new',
    name: rec.name,
    cupsCode: rec.cups,
    simonLevel: rec.simon,
    basePrice: rec.basePrice,
    category: rec.category,
    removed: false,
  };
  all.push(doc);
  ctx.created++;
  ctx.lines.push(`[NEW] ${rec.name}`);
}

async function main() {
  const wb = XLSX.readFile(filePath);
  const stats = { created: 0, matched: 0, skipped: 0 };
  const lines = [];
  const all = await Service.find({}).lean();

  for (const cfg of SHEETS) {
    if (!wb.SheetNames.includes(cfg.sheet)) {
      console.log('Hoja no encontrada:', cfg.sheet);
      continue;
    }
    const ws = wb.Sheets[cfg.sheet];
    const rows = XLSX.utils.sheet_to_json(ws, { header: 1, defval: '' });
    let section = '';
    let inMaterialBlock = false;
    const seenNames = new Set();
    const ctx = { created: 0, matched: 0, skipped: 0, lines: [] };

    for (let i = cfg.headerRow + 1; i < rows.length; i++) {
      const r = rows[i];
      if (!r || !r.length) continue;
      const c = cfg.cols;
      const name = clean(r[c.name]);
      if (!name || name.length < 3) continue;

      const isSectionDecor = String(r[c.cups] || '').toLowerCase().includes('cups') ||
        String(r[c.simon] || '').toLowerCase().includes('simon');

      if (cfg.categoryBySection) {
        const maybeSection = sectionCategory(name);
        const hasCode = clean(r[c.simon]) || clean(r[c.cups]);
        const hasPrice = num(r[c.premium]) || num(r[c.basico]);
        if (maybeSection && !hasCode && !hasPrice) {
          section = maybeSection;
          continue;
        }
      }

      if (cfg.materialBlocks) {
        if (isSectionDecor) {
          inMaterialBlock = false;
          continue;
        }
        if (/^material/i.test(name)) {
          inMaterialBlock = true;
          stats.skipped++;
          ctx.skipped++;
          continue;
        }
        if (inMaterialBlock) {
          stats.skipped++;
          ctx.skipped++;
          continue;
        }
        if (/^[•·]/.test(name) || /\.$/.test(name) || COMPONENT_RE.test(name)) {
          stats.skipped++;
          ctx.skipped++;
          continue;
        }
        const openParen = (name.match(/\(/g) || []).length;
        const closeParen = (name.match(/\)/g) || []).length;
        const isFragment =
          openParen > closeParen ||
          /^(programada del médico|demanda para el médico|programada de la enfermera|demanda para la enfermera|pediátrica\)|permanente \(uhd pediátrica\))$/i.test(name);
        if (isFragment) {
          stats.skipped++;
          ctx.skipped++;
          continue;
        }
      }

      let cups = clean(r[c.cups] || '');
      let simon = clean(r[c.simon] || '');
      let basePrice = 0;

      if (cups === '0') cups = '';
      if (cups && !isCups(cups)) cups = '';
      if (simon && !isSimon(simon)) simon = '';

      if (!isSectionDecor && r[c.premium] != null) basePrice = num(r[c.premium]);
      if (!basePrice && r[c.basico] != null) basePrice = num(r[c.basico]);

      if (cfg.sheet === 'HOSPITAL DE DIA') {
        const simonNum = Number(simon);
        const hasValid = (simon && simonNum >= 100) || cups;
        const isMaterial = /material|gastable/i.test(name);
        if (!hasValid || isMaterial) {
          stats.skipped++;
          ctx.skipped++;
          continue;
        }
      }

      if (!cups && !simon) {
        stats.skipped++;
        ctx.skipped++;
        continue;
      }

      const nameKey = normKey(name);
      if (seenNames.has(nameKey)) {
        stats.skipped++;
        ctx.skipped++;
        continue;
      }
      seenNames.add(nameKey);

      let category = cfg.category;
      if (cfg.categoryBySection && section) category = section;
      if (cfg.categoryByRow) category = cfg.categoryByRow(name);

      await upsert({ name, cups, simon, basePrice, category }, all, ctx);
    }

    stats.created += ctx.created;
    stats.matched += ctx.matched;
    stats.skipped += ctx.skipped;
    lines.push(...ctx.lines);
    console.log(
      `${cfg.sheet.padEnd(28)} creados:${ctx.created} coinciden:${ctx.matched} omitidos:${ctx.skipped}`
    );
  }

  console.log('\n=== TOTAL ===');
  console.log(`creados:${stats.created} coinciden(actualizados):${stats.matched} omitidos:${stats.skipped}`);

  if (isDry) {
    const news = lines.filter((l) => l.startsWith('[NEW]'));
    console.log('\n--- Nuevos que se crearán (dry-run) ---');
    for (const line of news.slice(0, 250)) console.log(line);
    if (news.length > 250) console.log(`... y ${news.length - 250} más`);
  }
  await mongoose.disconnect();
}

(async () => {
  await mongoose.connect(MONGODB_URI);
  console.log(isDry ? '=== MODO DRY-RUN (no escribe) ===' : '=== IMPORTACION REAL ===');
  console.log('Archivo:', filePath);
  await main();
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
