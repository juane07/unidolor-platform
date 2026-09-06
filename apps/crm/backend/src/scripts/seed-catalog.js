/*
 * UNIDOLOR — Seed: Services + Procedures + Consent Templates (Prisma)
 * Ejecutar: cd apps/crm/backend && node src/scripts/seed-catalog.js
 */

require('module-alias/register');
require('dotenv').config({ path: '.env' });
require('dotenv').config({ path: '.env.local' });

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// ── Servicios del catálogo ──
const SERVICES = [
  { name: 'Consulta de primera vez', cupsCode: 'CONS-001', category: 'consulta', tipoServicio: 'consulta', modalidad: 'clinica', requiereConsentimiento: false, basePrice: 5000 },
  { name: 'Consulta de seguimiento', cupsCode: 'CONS-002', category: 'consulta', tipoServicio: 'consulta', modalidad: 'clinica', requiereConsentimiento: false, basePrice: 3500 },
  { name: 'Consulta de urgencia', cupsCode: 'CONS-003', category: 'consulta', tipoServicio: 'consulta', modalidad: 'clinica', requiereConsentimiento: false, basePrice: 7000 },
  { name: 'Infiltración epidural', cupsCode: 'PROC-001', category: 'procedimiento', tipoServicio: 'procedimiento', modalidad: 'clinica', requiereConsentimiento: true, basePrice: 15000, tiempoEstimadoMin: 30 },
  { name: 'Infiltración facetaria', cupsCode: 'PROC-002', category: 'procedimiento', tipoServicio: 'procedimiento', modalidad: 'clinica', requiereConsentimiento: true, basePrice: 15000, tiempoEstimadoMin: 30 },
  { name: 'Infiltración articular', cupsCode: 'PROC-003', category: 'procedimiento', tipoServicio: 'procedimiento', modalidad: 'clinica', requiereConsentimiento: true, basePrice: 12000, tiempoEstimadoMin: 20 },
  { name: 'Infiltración peritendinosa / puntos gatillo', cupsCode: 'PROC-004', category: 'procedimiento', tipoServicio: 'procedimiento', modalidad: 'clinica', requiereConsentimiento: true, basePrice: 8000, tiempoEstimadoMin: 15 },
  { name: 'Bloqueo nervioso periférico', cupsCode: 'PROC-005', category: 'procedimiento', tipoServicio: 'procedimiento', modalidad: 'clinica', requiereConsentimiento: true, basePrice: 20000, tiempoEstimadoMin: 45 },
  { name: 'Bloqueo del simpático cervical/dorsal', cupsCode: 'PROC-006', category: 'procedimiento', tipoServicio: 'procedimiento', modalidad: 'clinica', requiereConsentimiento: true, basePrice: 20000, tiempoEstimadoMin: 45 },
  { name: 'Bloqueo de plexo braquial/lumbar', cupsCode: 'PROC-007', category: 'procedimiento', tipoServicio: 'procedimiento', modalidad: 'clinica', requiereConsentimiento: true, basePrice: 22000, tiempoEstimadoMin: 60 },
  { name: 'Radiofrecuencia corporal', cupsCode: 'PROC-008', category: 'procedimiento', tipoServicio: 'procedimiento', modalidad: 'clinica', requiereConsentimiento: true, basePrice: 35000, tiempoEstimadoMin: 60 },
  { name: 'Rizólisis', cupsCode: 'PROC-009', category: 'procedimiento', tipoServicio: 'procedimiento', modalidad: 'clinica', requiereConsentimiento: true, basePrice: 30000, tiempoEstimadoMin: 45 },
  { name: 'Sonografía abdominal', cupsCode: 'DIAG-001', category: 'estudio', tipoServicio: 'diagnostico', modalidad: 'domicilio', requiereConsentimiento: false, basePrice: 8000, tiempoEstimadoMin: 30 },
  { name: 'Sonografía pélvica', cupsCode: 'DIAG-002', category: 'estudio', tipoServicio: 'diagnostico', modalidad: 'domicilio', requiereConsentimiento: false, basePrice: 8000, tiempoEstimadoMin: 30 },
  { name: 'Sonografía renal', cupsCode: 'DIAG-003', category: 'estudio', tipoServicio: 'diagnostico', modalidad: 'domicilio', requiereConsentimiento: false, basePrice: 8000, tiempoEstimadoMin: 25 },
  { name: 'Sonografía de partes blandas', cupsCode: 'DIAG-004', category: 'estudio', tipoServicio: 'diagnostico', modalidad: 'domicilio', requiereConsentimiento: false, basePrice: 7000, tiempoEstimadoMin: 25 },
  { name: 'Radiografía de tórax', cupsCode: 'DIAG-005', category: 'estudio', tipoServicio: 'diagnostico', modalidad: 'domicilio', requiereConsentimiento: true, basePrice: 6000, tiempoEstimadoMin: 20 },
  { name: 'Radiografía de columna', cupsCode: 'DIAG-006', category: 'estudio', tipoServicio: 'diagnostico', modalidad: 'domicilio', requiereConsentimiento: true, basePrice: 7000, tiempoEstimadoMin: 25 },
  { name: 'Radiografía de extremidad', cupsCode: 'DIAG-007', category: 'estudio', tipoServicio: 'diagnostico', modalidad: 'domicilio', requiereConsentimiento: true, basePrice: 6000, tiempoEstimadoMin: 20 },
  { name: 'Radiografía de abdomen', cupsCode: 'DIAG-008', category: 'estudio', tipoServicio: 'diagnostico', modalidad: 'domicilio', requiereConsentimiento: true, basePrice: 6000, tiempoEstimadoMin: 20 },
  { name: 'Curación de herida', cupsCode: 'ENF-001', category: 'procedimiento', tipoServicio: 'enfermeria', modalidad: 'domicilio', requiereConsentimiento: true, basePrice: 5000, tiempoEstimadoMin: 30 },
  { name: 'Nebulización', cupsCode: 'ENF-002', category: 'procedimiento', tipoServicio: 'enfermeria', modalidad: 'domicilio', requiereConsentimiento: true, basePrice: 4000, tiempoEstimadoMin: 20 },
  { name: 'Canalización venosa y administración IV', cupsCode: 'ENF-003', category: 'procedimiento', tipoServicio: 'enfermeria', modalidad: 'domicilio', requiereConsentimiento: true, basePrice: 5000, tiempoEstimadoMin: 30 },
  { name: 'Aplicación intramuscular', cupsCode: 'ENF-004', category: 'procedimiento', tipoServicio: 'enfermeria', modalidad: 'domicilio', requiereConsentimiento: false, basePrice: 2500, tiempoEstimadoMin: 10 },
  { name: 'Colocación/retiro de sonda vesical', cupsCode: 'ENF-005', category: 'procedimiento', tipoServicio: 'enfermeria', modalidad: 'domicilio', requiereConsentimiento: true, basePrice: 5000, tiempoEstimadoMin: 20 },
  { name: 'Extracción de muestra sanguínea', cupsCode: 'ENF-006', category: 'procedimiento', tipoServicio: 'enfermeria', modalidad: 'domicilio', requiereConsentimiento: false, basePrice: 2000, tiempoEstimadoMin: 15 },
  { name: 'Sesión de terapia física', cupsCode: 'ENF-007', category: 'procedimiento', tipoServicio: 'enfermeria', modalidad: 'domicilio', requiereConsentimiento: false, basePrice: 6000, tiempoEstimadoMin: 45 },
  { name: 'Visita domiciliaria', cupsCode: 'VIS-001', category: 'visita_domicilio', tipoServicio: 'visita_domicilio', modalidad: 'domicilio', requiereConsentimiento: false, basePrice: 10000, tiempoEstimadoMin: 60 },
  { name: 'Evaluación domiciliaria', cupsCode: 'VIS-002', category: 'visita_domicilio', tipoServicio: 'visita_domicilio', modalidad: 'domicilio', requiereConsentimiento: false, basePrice: 12000, tiempoEstimadoMin: 45 },
];

// ── Procedimientos del catálogo ──
const PROCEDIMIENTOS = [
  { codigo: 'INF-EPIDURAL', nombre: 'Infiltración epidural', servicioRef: 'PROC-001', duracionMin: 30, requiereConsent: 'CONSENT_INFILTRACION', requiereIndicacion: true, material: ['aguja epidural', 'anestésico local', 'esteroides'], grupoCatalogo: 'procedimientos_intervencionistas', modalidad: 'clinica' },
  { codigo: 'INF-FACETARIA', nombre: 'Infiltración facetaria', servicioRef: 'PROC-002', duracionMin: 30, requiereConsent: 'CONSENT_INFILTRACION', requiereIndicacion: true, material: ['aguja', 'anestésico local', 'esteroides'], grupoCatalogo: 'procedimientos_intervencionistas', modalidad: 'clinica' },
  { codigo: 'BLOQ-NERVioso', nombre: 'Bloqueo nervioso periférico', servicioRef: 'PROC-005', duracionMin: 45, requiereConsent: 'CONSENT_BLOQUEO', requiereIndicacion: true, material: ['aguja de bloqueo', 'anestésico local', 'ecógrafo'], grupoCatalogo: 'procedimientos_intervencionistas', modalidad: 'clinica' },
  { codigo: 'RADIOF-CORP', nombre: 'Radiofrecuencia corporal', servicioRef: 'PROC-008', duracionMin: 60, requiereConsent: 'CONSENT_RADIOFRECUENCIA', requiereIndicacion: true, material: ['aguja de radiofrecuencia', 'generador RF', 'anestésico local'], grupoCatalogo: 'procedimientos_intervencionistas', modalidad: 'clinica' },
  { codigo: 'RIZO-LISIS', nombre: 'Rizólisis', servicioRef: 'PROC-009', duracionMin: 45, requiereConsent: 'CONSENT_RADIOFRECUENCIA', requiereIndicacion: true, material: ['aguja de radiofrecuencia', 'generador RF'], grupoCatalogo: 'procedimientos_intervencionistas', modalidad: 'clinica' },
  { codigo: 'INF-ARTICULAR', nombre: 'Infiltración articular', servicioRef: 'PROC-003', duracionMin: 20, requiereConsent: 'CONSENT_INFILTRACION', requiereIndicacion: true, material: ['aguja', 'anestésico local', 'esteroides'], grupoCatalogo: 'procedimientos_intervencionistas', modalidad: 'clinica' },
  { codigo: 'INF-TENDINOSA', nombre: 'Infiltración peritendinosa / puntos gatillo', servicioRef: 'PROC-004', duracionMin: 15, requiereConsent: 'CONSENT_INFILTRACION', requiereIndicacion: true, material: ['aguja', 'anestésico local'], grupoCatalogo: 'procedimientos_intervencionistas', modalidad: 'clinica' },
  { codigo: 'BLOQ-SIMPATICO', nombre: 'Bloqueo del simpático cervical/dorsal', servicioRef: 'PROC-006', duracionMin: 45, requiereConsent: 'CONSENT_BLOQUEO', requiereIndicacion: true, material: ['aguja de bloqueo', 'anestésico local', 'ecógrafo'], grupoCatalogo: 'procedimientos_intervencionistas', modalidad: 'clinica' },
  { codigo: 'BLOQ-PLEXO', nombre: 'Bloqueo de plexo braquial/lumbar', servicioRef: 'PROC-007', duracionMin: 60, requiereConsent: 'CONSENT_BLOQUEO', requiereIndicacion: true, material: ['aguja de bloqueo', 'anestésico local', 'ecógrafo'], grupoCatalogo: 'procedimientos_intervencionistas', modalidad: 'clinica' },
  { codigo: 'SONO-ABDOMINAL', nombre: 'Sonografía abdominal', servicioRef: 'DIAG-001', duracionMin: 30, requiereConsent: null, requiereIndicacion: true, material: ['ecógrafo portátil', 'gel'], grupoCatalogo: 'sonografia', modalidad: 'domicilio' },
  { codigo: 'SONO-PELVICA', nombre: 'Sonografía pélvica', servicioRef: 'DIAG-002', duracionMin: 30, requiereConsent: null, requiereIndicacion: true, material: ['ecógrafo portátil', 'gel'], grupoCatalogo: 'sonografia', modalidad: 'domicilio' },
  { codigo: 'SONO-RENAL', nombre: 'Sonografía renal', servicioRef: 'DIAG-003', duracionMin: 25, requiereConsent: null, requiereIndicacion: true, material: ['ecógrafo portátil', 'gel'], grupoCatalogo: 'sonografia', modalidad: 'domicilio' },
  { codigo: 'SONO-PARTES-BLANDAS', nombre: 'Sonografía de partes blandas', servicioRef: 'DIAG-004', duracionMin: 25, requiereConsent: null, requiereIndicacion: true, material: ['ecógrafo portátil', 'gel'], grupoCatalogo: 'sonografia', modalidad: 'domicilio' },
  { codigo: 'RX-TORAX', nombre: 'Radiografía de tórax', servicioRef: 'DIAG-005', duracionMin: 20, requiereConsent: 'CONSENT_IMAGENES', requiereIndicacion: true, material: ['rayos X portátil'], grupoCatalogo: 'rayos_x', modalidad: 'domicilio' },
  { codigo: 'RX-COLUMNA', nombre: 'Radiografía de columna', servicioRef: 'DIAG-006', duracionMin: 25, requiereConsent: 'CONSENT_IMAGENES', requiereIndicacion: true, material: ['rayos X portátil'], grupoCatalogo: 'rayos_x', modalidad: 'domicilio' },
  { codigo: 'RX-EXTREMIDAD', nombre: 'Radiografía de extremidad', servicioRef: 'DIAG-007', duracionMin: 20, requiereConsent: 'CONSENT_IMAGENES', requiereIndicacion: true, material: ['rayos X portátil'], grupoCatalogo: 'rayos_x', modalidad: 'domicilio' },
  { codigo: 'RX-ABDOMEN', nombre: 'Radiografía de abdomen', servicioRef: 'DIAG-008', duracionMin: 20, requiereConsent: 'CONSENT_IMAGENES', requiereIndicacion: true, material: ['rayos X portátil'], grupoCatalogo: 'rayos_x', modalidad: 'domicilio' },
  { codigo: 'ENF-CURACION', nombre: 'Curación de herida', servicioRef: 'ENF-001', duracionMin: 30, requiereConsent: 'CONSENT_CURACION', requiereIndicacion: true, material: ['material de curación', 'solución antiséptica', 'guantes'], grupoCatalogo: 'enfermeria', modalidad: 'domicilio' },
  { codigo: 'ENF-NEBULIZACION', nombre: 'Nebulización', servicioRef: 'ENF-002', duracionMin: 20, requiereConsent: 'CONSENT_ENFERMERIA', requiereIndicacion: true, material: ['nebulizador', 'medicamento'], grupoCatalogo: 'enfermeria', modalidad: 'domicilio' },
  { codigo: 'ENF-IV', nombre: 'Canalización venosa y administración IV', servicioRef: 'ENF-003', duracionMin: 30, requiereConsent: 'CONSENT_ENFERMERIA', requiereIndicacion: true, material: ['catéter venoso', 'suero', 'medicamento'], grupoCatalogo: 'enfermeria', modalidad: 'domicilio' },
  { codigo: 'ENF-IM', nombre: 'Aplicación intramuscular', servicioRef: 'ENF-004', duracionMin: 10, requiereConsent: null, requiereIndicacion: true, material: ['aguja', 'jeringa', 'medicamento'], grupoCatalogo: 'enfermeria', modalidad: 'domicilio' },
  { codigo: 'ENF-SONDA', nombre: 'Colocación/retiro de sonda vesical', servicioRef: 'ENF-005', duracionMin: 20, requiereConsent: 'CONSENT_ENFERMERIA', requiereIndicacion: true, material: ['sonda vesical', 'lubricante', 'solución'], grupoCatalogo: 'enfermeria', modalidad: 'domicilio' },
  { codigo: 'ENF-MUESTRA', nombre: 'Extracción de muestra sanguínea', servicioRef: 'ENF-006', duracionMin: 15, requiereConsent: null, requiereIndicacion: true, material: ['tubo', 'aguja', 'algodón'], grupoCatalogo: 'enfermeria', modalidad: 'domicilio' },
  { codigo: 'TF-SESION', nombre: 'Sesión de terapia física', servicioRef: 'ENF-007', duracionMin: 45, requiereConsent: null, requiereIndicacion: false, material: ['equipos de terapia'], grupoCatalogo: 'medicina_dolor', modalidad: 'domicilio' },
];

// ── Consent Templates ──
const CONSENT_TEMPLATES = [
  { templateId: 'CONSENT_INFILTRACION', nombre: 'Consentimiento Informado — Infiltraciones', version: '3.1', obligatorio: true },
  { templateId: 'CONSENT_BLOQUEO', nombre: 'Consentimiento Informado — Neurolisis', version: '2.2', obligatorio: true },
  { templateId: 'CONSENT_RADIOFRECUENCIA', nombre: 'Consentimiento Informado — Radiofrecuencia', version: '2.1', obligatorio: true },
  { templateId: 'CONSENT_IMAGENES', nombre: 'Consentimiento Informado — Estudios de Imágenes', version: '1.1', obligatorio: false },
  { templateId: 'CONSENT_ENFERMERIA', nombre: 'Consentimiento Informado — Procedimientos de Enfermería', version: '1.1', obligatorio: false },
  { templateId: 'CONSENT_CURACION', nombre: 'Consentimiento Informado — Curaciones', version: '1.1', obligatorio: false },
  { templateId: 'CONSENT_TRANSFUSION', nombre: 'Consentimiento Informado — Transfusiones', version: '2.1', obligatorio: true },
];

async function seed() {
  try {
    await prisma.$connect();
    console.log('✅ Connected to PostgreSQL\n');

    // 1. Seed Consent Templates
    let created = 0, updated = 0;
    for (const tpl of CONSENT_TEMPLATES) {
      const existing = await prisma.consentTemplate.findFirst({ where: { templateId: tpl.templateId } });
      if (existing) {
        await prisma.consentTemplate.update({ where: { id: existing.id }, data: { nombre: tpl.nombre, version: tpl.version, obligatorio: tpl.obligatorio } });
        updated++;
      } else {
        await prisma.consentTemplate.create({ data: { ...tpl, html: '', aplicaA: ['procedimiento'] } });
        created++;
      }
    }
    console.log(`Consent Templates: ${created} created, ${updated} updated`);

    // 2. Seed Services
    created = 0; updated = 0;
    for (const svc of SERVICES) {
      const existing = await prisma.service.findFirst({ where: { cupsCode: svc.cupsCode } });
      if (existing) {
        await prisma.service.update({ where: { id: existing.id }, data: svc });
        updated++;
      } else {
        await prisma.service.create({ data: svc });
        created++;
      }
    }
    console.log(`Services: ${created} created, ${updated} updated`);

    // 3. Seed Procedures
    created = 0; updated = 0;
    for (const proc of PROCEDIMIENTOS) {
      const existing = await prisma.procedure.findFirst({ where: { codigo: proc.codigo } });
      if (existing) {
        await prisma.procedure.update({ where: { id: existing.id }, data: proc });
        updated++;
      } else {
        await prisma.procedure.create({ data: proc });
        created++;
      }
    }
    console.log(`Procedures: ${created} created, ${updated} updated`);

    console.log('\n🎉 Seed completed!');
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

seed();
