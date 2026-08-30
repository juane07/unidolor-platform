/*
 * ============================================================
 *  UNIDOLOR — Seed: Procedimientos + Consent Templates
 *  Ejecutar: node backend/src/scripts/seed-catalog.js
 *  Requiere: MONGODB_URI en .env o como argumento
 * ============================================================
 */

const mongoose = require('mongoose');
require('dotenv').config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://<user>:<pass>@cluster.xxxxx.mongodb.net/idurar?retryWrites=true&w=majority';

// ── Datos del catálogo (extraídos de services-catalog.js) ──

const PROCEDIMIENTOS = [
  { codigo: 'INF-EPIDURAL', nombre: 'Infiltración epidural', servicioRef: 'PROC', duracionMin: 30, requiereConsent: 'CONSENT_INFILTRACION', requiereIndicacion: true, material: ['aguja epidural', 'anestésico local', 'esteroides'], grupoCatalogo: 'procedimientos_intervencionistas', modalidad: 'clinica' },
  { codigo: 'INF-FACETARIA', nombre: 'Infiltración facetaria', servicioRef: 'PROC', duracionMin: 30, requiereConsent: 'CONSENT_INFILTRACION', requiereIndicacion: true, material: ['aguja', 'anestésico local', 'esteroides'], grupoCatalogo: 'procedimientos_intervencionistas', modalidad: 'clinica' },
  { codigo: 'BLOQ-NERVioso', nombre: 'Bloqueo nervioso periférico', servicioRef: 'PROC', duracionMin: 45, requiereConsent: 'CONSENT_BLOQUEO', requiereIndicacion: true, material: ['aguja de bloqueo', 'anestésico local', 'ecógrafo'], grupoCatalogo: 'procedimientos_intervencionistas', modalidad: 'clinica' },
  { codigo: 'RADIOF-CORP', nombre: 'Radiofrecuencia corporal', servicioRef: 'PROC', duracionMin: 60, requiereConsent: 'CONSENT_RADIOFRECUENCIA', requiereIndicacion: true, material: ['aguja de radiofrecuencia', 'generador RF', 'anestésico local'], grupoCatalogo: 'procedimientos_intervencionistas', modalidad: 'clinica' },
  { codigo: 'RIZO-LISIS', nombre: 'Rizólisis', servicioRef: 'PROC', duracionMin: 45, requiereConsent: 'CONSENT_RADIOFRECUENCIA', requiereIndicacion: true, material: ['aguja de radiofrecuencia', 'generador RF'], grupoCatalogo: 'procedimientos_intervencionistas', modalidad: 'clinica' },
  { codigo: 'INF-ARTICULAR', nombre: 'Infiltración articular', servicioRef: 'PROC', duracionMin: 20, requiereConsent: 'CONSENT_INFILTRACION', requiereIndicacion: true, material: ['aguja', 'anestésico local', 'esteroides'], grupoCatalogo: 'procedimientos_intervencionistas', modalidad: 'clinica' },
  { codigo: 'INF-TENDONOSA', nombre: 'Infiltración peritendinosa / puntos gatillo', servicioRef: 'PROC', duracionMin: 15, requiereConsent: 'CONSENT_INFILTRACION', requiereIndicacion: true, material: ['aguja', 'anestésico local'], grupoCatalogo: 'procedimientos_intervencionistas', modalidad: 'clinica' },
  { codigo: 'BLOQ-SIMPATICO', nombre: 'Bloqueo del simpático cervical/dorsal', servicioRef: 'PROC', duracionMin: 45, requiereConsent: 'CONSENT_BLOQUEO', requiereIndicacion: true, material: ['aguja de bloqueo', 'anestésico local', 'ecógrafo'], grupoCatalogo: 'procedimientos_intervencionistas', modalidad: 'clinica' },
  { codigo: 'BLOQ-PLEXO', nombre: 'Bloqueo de plexo braquial/lumbar', servicioRef: 'PROC', duracionMin: 60, requiereConsent: 'CONSENT_BLOQUEO', requiereIndicacion: true, material: ['aguja de bloqueo', 'anestésico local', 'ecógrafo'], grupoCatalogo: 'procedimientos_intervencionistas', modalidad: 'clinica' },
  { codigo: 'SONO-ABDOMINAL', nombre: 'Sonografía abdominal', servicioRef: 'SONO', duracionMin: 30, requiereConsent: null, requiereIndicacion: true, material: ['ecógrafo portátil', 'gel'], grupoCatalogo: 'sonografia', modalidad: 'domicilio' },
  { codigo: 'SONO-PELVICA', nombre: 'Sonografía pélvica', servicioRef: 'SONO', duracionMin: 30, requiereConsent: null, requiereIndicacion: true, material: ['ecógrafo portátil', 'gel'], grupoCatalogo: 'sonografia', modalidad: 'domicilio' },
  { codigo: 'SONO-RENAL', nombre: 'Sonografía renal', servicioRef: 'SONO', duracionMin: 25, requiereConsent: null, requiereIndicacion: true, material: ['ecógrafo portátil', 'gel'], grupoCatalogo: 'sonografia', modalidad: 'domicilio' },
  { codigo: 'SONO-PARTES-BLANDAS', nombre: 'Sonografía de partes blandas', servicioRef: 'SONO', duracionMin: 25, requiereConsent: null, requiereIndicacion: true, material: ['ecógrafo portátil', 'gel'], grupoCatalogo: 'sonografia', modalidad: 'domicilio' },
  { codigo: 'RX-TORAX', nombre: 'Radiografía de tórax', servicioRef: 'RX', duracionMin: 20, requiereConsent: 'CONSENT_IMAGENES', requiereIndicacion: true, material: ['rayos X portátil'], grupoCatalogo: 'rayos_x', modalidad: 'domicilio' },
  { codigo: 'RX-COLUMNA', nombre: 'Radiografía de columna', servicioRef: 'RX', duracionMin: 25, requiereConsent: 'CONSENT_IMAGENES', requiereIndicacion: true, material: ['rayos X portátil'], grupoCatalogo: 'rayos_x', modalidad: 'domicilio' },
  { codigo: 'RX-EXTREMIDAD', nombre: 'Radiografía de extremidad', servicioRef: 'RX', duracionMin: 20, requiereConsent: 'CONSENT_IMAGENES', requiereIndicacion: true, material: ['rayos X portátil'], grupoCatalogo: 'rayos_x', modalidad: 'domicilio' },
  { codigo: 'RX-ABDOMEN', nombre: 'Radiografía de abdomen', servicioRef: 'RX', duracionMin: 20, requiereConsent: 'CONSENT_IMAGENES', requiereIndicacion: true, material: ['rayos X portátil'], grupoCatalogo: 'rayos_x', modalidad: 'domicilio' },
  { codigo: 'ENF-CURACION', nombre: 'Curación de herida', servicioRef: 'ENF', duracionMin: 30, requiereConsent: 'CONSENT_CURACION', requiereIndicacion: true, material: ['material de curación', 'solución antiséptica', 'guantes'], grupoCatalogo: 'enfermeria', modalidad: 'domicilio' },
  { codigo: 'ENF-NEBULIZACION', nombre: 'Nebulización', servicioRef: 'NEB', duracionMin: 20, requiereConsent: 'CONSENT_ENFERMERIA', requiereIndicacion: true, material: ['nebulizador', 'medicamento'], grupoCatalogo: 'enfermeria', modalidad: 'domicilio' },
  { codigo: 'ENF-IV', nombre: 'Canalización venosa y administración IV', servicioRef: 'SUE', duracionMin: 30, requiereConsent: 'CONSENT_ENFERMERIA', requiereIndicacion: true, material: ['catéter venoso', 'suero', 'medicamento'], grupoCatalogo: 'enfermeria', modalidad: 'domicilio' },
  { codigo: 'ENF-IM', nombre: 'Aplicación intramuscular', servicioRef: 'MED', duracionMin: 10, requiereConsent: null, requiereIndicacion: true, material: ['aguja', 'jeringa', 'medicamento'], grupoCatalogo: 'enfermeria', modalidad: 'domicilio' },
  { codigo: 'ENF-SONDA', nombre: 'Colocación/retiro de sonda vesical', servicioRef: 'SON', duracionMin: 20, requiereConsent: 'CONSENT_ENFERMERIA', requiereIndicacion: true, material: ['sonda vesical', 'lubricante', 'solución'], grupoCatalogo: 'enfermeria', modalidad: 'domicilio' },
  { codigo: 'ENF-MUESTRA', nombre: 'Extracción de muestra sanguínea', servicioRef: 'MUES', duracionMin: 15, requiereConsent: null, requiereIndicacion: true, material: ['tubo', 'aguja', 'algodón'], grupoCatalogo: 'enfermeria', modalidad: 'domicilio' },
  { codigo: 'TF-SESION', nombre: 'Sesión de terapia física', servicioRef: 'TF', duracionMin: 45, requiereConsent: null, requiereIndicacion: false, material: ['equipos de terapia'], grupoCatalogo: 'medicina_dolor', modalidad: 'domicilio' },
];

const CONSENT_TEMPLATES = [
  { templateId: 'CONSENT_INFILTRACION', nombre: 'Consentimiento Informado — Infiltraciones', version: '3.0', fecha: '2026-01-15', obligatorio: true },
  { templateId: 'CONSENT_BLOQUEO', nombre: 'Consentimiento Informado — Bloqueos Nerviosos', version: '2.1', fecha: '2026-01-15', obligatorio: true },
  { templateId: 'CONSENT_RADIOFRECUENCIA', nombre: 'Consentimiento Informado — Radiofrecuencia', version: '2.0', fecha: '2026-01-15', obligatorio: true },
  { templateId: 'CONSENT_IMAGENES', nombre: 'Consentimiento Informado — Estudios de Imágenes', version: '1.0', fecha: '2026-01-15', obligatorio: false },
  { templateId: 'CONSENT_ENFERMERIA', nombre: 'Consentimiento Informado — Procedimientos de Enfermería', version: '1.0', fecha: '2026-01-15', obligatorio: false },
  { templateId: 'CONSENT_CURACION', nombre: 'Consentimiento Informado — Curaciones', version: '1.0', fecha: '2026-01-15', obligatorio: false },
  { templateId: 'CONSENT_TRANSFUSION', nombre: 'Consentimiento Informado — Transfusiones', version: '2.0', fecha: '2026-01-15', obligatorio: true },
];

async function seed() {
  console.log('Connecting to MongoDB...');
  await mongoose.connect(MONGODB_URI);
  console.log('Connected.\n');

  const Procedure = mongoose.model('Procedure');
  const ConsentTemplate = mongoose.model('ConsentTemplate');

  // ── Seed Consent Templates ──
  let created = 0, updated = 0;
  for (const tpl of CONSENT_TEMPLATES) {
    const existing = await ConsentTemplate.findOne({ templateId: tpl.templateId });
    if (existing) {
      await ConsentTemplate.updateOne({ templateId: tpl.templateId }, { $set: tpl });
      updated++;
    } else {
      await ConsentTemplate.create(tpl);
      created++;
    }
  }
  console.log(`Consent Templates: ${created} created, ${updated} updated`);

  // ── Seed Procedures ──
  created = 0; updated = 0;
  for (const proc of PROCEDIMIENTOS) {
    const existing = await Procedure.findOne({ codigo: proc.codigo });
    if (existing) {
      await Procedure.updateOne({ codigo: proc.codigo }, { $set: proc });
      updated++;
    } else {
      await Procedure.create(proc);
      created++;
    }
  }
  console.log(`Procedures: ${created} created, ${updated} updated`);

  await mongoose.disconnect();
  console.log('\nDone. Disconnected.');
}

seed().catch(err => {
  console.error('Seed error:', err);
  process.exit(1);
});
