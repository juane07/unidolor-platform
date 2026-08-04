/**
 * Backfill del Catálogo Maestro de Servicios (Cerebro 02_SERVICES.md).
 *
 * Clasifica cada servicio del tarifario SISALRIL en uno de los grupos del
 * catálogo maestro y le asigna:
 *   - grupoCatalogo
 *   - preguntasCotizacion (de 02_SERVICES.md, sección "Preguntar para cotizar")
 *   - tipoServicio / modalidad / clasificacion / prioridadDefault
 *   - requiereConsentimiento / requiereIndicacionMedica
 *   - tiempoEstimadoMin / materiales / personalRequerido
 *
 * Uso:
 *   node scripts/backfill-service-catalog.js --dry   # solo reporte
 *   node scripts/backfill-service-catalog.js         # escribe
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

// ============ Catálogo maestro (02_SERVICES.md) ============

const GRUPOS = {
  consultas_medicas: {
    label: 'CONSULTAS MÉDICAS',
    tipoServicio: 'consulta',
    clasificacion: ['clinico', 'ambulatorio'],
    prioridadDefault: 'programado',
    tiempoEstimadoMin: 30,
    personalRequerido: ['Medico general o especialista'],
    preguntasCotizacion: [
      '¿Dónde desea la consulta (domicilio, clínica, intrahospitalaria)?',
      '¿Es primera vez o subsecuente?',
      '¿Qué especialidad o motivo de consulta?',
      'Nombre completo del paciente, cédula, edad, dirección, teléfono',
      '¿Tiene estudios previos (imágenes, laboratorios)?',
      '¿Tiene seguro médico?',
    ],
  },
  medicina_dolor: {
    label: 'MEDICINA DEL DOLOR',
    tipoServicio: 'consulta',
    clasificacion: ['clinico', 'terapeutico', 'ambulatorio'],
    prioridadDefault: 'preferente',
    requiereConsentimiento: false,
    requiereIndicacionMedica: true,
    tiempoEstimadoMin: 45,
    personalRequerido: ['Medico especialista en Medicina del Dolor'],
    preguntasCotizacion: [
      '¿Dónde se realizaría (domicilio, clínica)?',
      '¿Tipo de dolor, localización, intensidad, tiempo de evolución?',
      '¿Diagnóstico de base o médico tratante?',
      '¿Tratamientos previos (medicamentos, procedimientos)?',
      '¿Tiene estudios de imágenes o laboratorios recientes?',
      'Nombre completo, cédula, dirección, teléfono',
      '¿Tiene seguro médico?',
    ],
  },
  procedimientos_intervencionistas: {
    label: 'PROCEDIMIENTOS INTERVENCIONISTAS',
    tipoServicio: 'procedimiento',
    clasificacion: ['clinico', 'terapeutico', 'hospitalario'],
    prioridadDefault: 'preferente',
    requiereConsentimiento: true,
    requiereIndicacionMedica: true,
    tiempoEstimadoMin: 60,
    personalRequerido: ['Medico especialista', 'Enfermera circulante'],
    materiales: ['Kit de procedimiento', 'Aguja de punción', 'Antiséptico', 'Anestésico local', 'Equipo de protección'],
    preguntasCotizacion: [
      '¿Tipo de procedimiento (si lo conoce) o zona del cuerpo?',
      '¿Tiene indicación médica o referimiento?',
      '¿Diagnóstico de base y médico tratante?',
      '¿Estudios de imágenes previos (RMN, TAC, RX, sonografía)?',
      '¿Medicamentos actuales (anticoagulantes, antiagregantes)?',
      '¿Alergias conocidas?',
      'Nombre completo, cédula, dirección, teléfono',
      '¿Tiene seguro médico?',
    ],
  },
  cuidados_paliativos: {
    label: 'CUIDADOS PALIATIVOS',
    tipoServicio: 'programa_especial',
    clasificacion: ['clinico', 'domiciliario'],
    prioridadDefault: 'preferente',
    requiereIndicacionMedica: true,
    tiempoEstimadoMin: 60,
    personalRequerido: ['Medico paliativista', 'Enfermera'],
    preguntasCotizacion: [
      '¿Dónde se requiere la atención (domicilio, clínica)?',
      '¿Diagnóstico de base y médico tratante?',
      '¿Estado actual del paciente (consciente, encamado, síntomas)?',
      '¿Tiene cuidador familiar responsable?',
      '¿Qué tipo de atención necesita (control de síntomas, sedación, apoyo)?',
      '¿Tiene indicación médica de cuidados paliativos?',
      'Nombre completo, cédula, dirección, teléfono',
    ],
  },
  enfermeria: {
    label: 'ENFERMERÍA',
    tipoServicio: 'enfermeria',
    clasificacion: ['clinico', 'domiciliario'],
    prioridadDefault: 'programado',
    requiereIndicacionMedica: false,
    tiempoEstimadoMin: 60,
    personalRequerido: ['Enfermera'],
    materiales: ['Kit de curaciones', 'Gasas estériles', 'Guantes', 'Antiséptico', 'Jeringas'],
    preguntasCotizacion: [
      '¿Qué tipo de atención de enfermería necesita?',
      '¿Horas al día y por cuántos días o semanas (tanda)?',
      '¿Paciente encamado o con movilidad reducida?',
      '¿Tiene cuidador familiar presente?',
      '¿Indicación médica vigente?',
      '¿Tiene los insumos y medicamentos o los proveemos?',
      '¿Dirección de atención y horario preferido?',
      'Nombre completo, cédula, teléfono, seguro',
    ],
  },
  rayos_x: {
    label: 'RAYOS X',
    tipoServicio: 'diagnostico',
    clasificacion: ['diagnostico', 'ambulatorio'],
    prioridadDefault: 'programado',
    requiereIndicacionMedica: true,
    tiempoEstimadoMin: 30,
    personalRequerido: ['Tecnico de radiología', 'Radiólogo (lectura)'],
    preguntasCotizacion: [
      '¿Qué área del cuerpo necesita (tórax, columna, extremidad, abdomen)?',
      '¿Dónde se toma la placa (domicilio o clínica)?',
      '¿Tiene indicación médica?',
      '¿Paciente puede movilizarse o está encamado?',
      'Nombre completo, cédula, dirección, teléfono',
    ],
  },
  sonografia: {
    label: 'SONOGRAFÍA / ECOGRAFÍA',
    tipoServicio: 'diagnostico',
    clasificacion: ['diagnostico', 'ambulatorio'],
    prioridadDefault: 'programado',
    requiereIndicacionMedica: true,
    tiempoEstimadoMin: 30,
    personalRequerido: ['Radiólogo o ecografista'],
    preguntasCotizacion: [
      '¿Qué tipo de sonografía necesita?',
      '¿Dónde se realiza (domicilio o clínica)?',
      '¿Tiene indicación médica?',
      '¿Paciente encamado o puede trasladarse?',
      'Nombre completo, cédula, dirección, teléfono',
    ],
  },
  doppler_vascular: {
    label: 'DOPPLER VASCULAR',
    tipoServicio: 'diagnostico',
    clasificacion: ['diagnostico', 'ambulatorio'],
    prioridadDefault: 'programado',
    requiereIndicacionMedica: true,
    tiempoEstimadoMin: 45,
    personalRequerido: ['Radiólogo vascular'],
    preguntasCotizacion: [
      '¿Qué área evaluar (extremidad inferior, superior, carótidas)?',
      '¿Cuál es el motivo del estudio (dolor, hinchazón, várices)?',
      '¿Tiene indicación médica?',
      '¿Dónde se realiza (domicilio o clínica)?',
      'Nombre completo, cédula, dirección, teléfono',
    ],
  },
  estudios_cardiacos: {
    label: 'ESTUDIOS CARDÍACOS',
    tipoServicio: 'diagnostico',
    clasificacion: ['diagnostico', 'domiciliario'],
    prioridadDefault: 'programado',
    requiereIndicacionMedica: true,
    tiempoEstimadoMin: 60,
    personalRequerido: ['Tecnico de cardiología', 'Cardiólogo (lectura)'],
    preguntasCotizacion: [
      '¿Qué estudio necesita (ECG, ecocardiograma, holter, MAPA)?',
      '¿Síntomas (dolor en pecho, palpitaciones, mareos, falta de aire)?',
      '¿Tiene indicación médica?',
      '¿Dónde se realiza (domicilio o clínica)?',
      'Nombre completo, cédula, dirección, teléfono',
    ],
  },
  laboratorio: {
    label: 'LABORATORIO CLÍNICO',
    tipoServicio: 'diagnostico',
    clasificacion: ['diagnostico', 'domiciliario'],
    prioridadDefault: 'programado',
    requiereIndicacionMedica: false,
    tiempoEstimadoMin: 30,
    personalRequerido: ['Flebotomista / enfermera'],
    preguntasCotizacion: [
      '¿Qué exámenes de laboratorio necesita?',
      '¿Tiene orden médica?',
      '¿Dónde procesamos las muestras (laboratorio de preferencia)?',
      'Dirección para la toma',
      'Nombre completo, cédula, teléfono',
    ],
  },
  hospitalizacion_domiciliaria: {
    label: 'HOSPITALIZACIÓN DOMICILIARIA',
    tipoServicio: 'hospitalizacion_domiciliaria',
    clasificacion: ['clinico', 'domiciliario', 'hospitalario'],
    prioridadDefault: 'urgente',
    requiereIndicacionMedica: true,
    tiempoEstimadoMin: 480,
    personalRequerido: ['Medico', 'Enfermera', 'Cuidadora'],
    preguntasCotizacion: [
      '¿Diagnóstico y estado actual del paciente?',
      '¿Qué nivel de atención requiere (enfermería 4h, 8h, 12h, 24h)?',
      '¿Tiene médico tratante y cuidador familiar?',
      '¿Qué medicamentos o equipos necesita?',
      '¿Tiene seguro médico?',
      'Nombre completo, cédula, dirección, teléfono',
    ],
  },
  hemohogar: {
    label: 'HEMOHOGAR® (TRANSFUSIÓN)',
    tipoServicio: 'procedimiento',
    clasificacion: ['terapeutico', 'hospitalario', 'domiciliario'],
    prioridadDefault: 'urgente',
    requiereConsentimiento: true,
    requiereIndicacionMedica: true,
    tiempoEstimadoMin: 180,
    personalRequerido: ['Medico', 'Enfermera'],
    materiales: ['Sangre autorizada por Banco de Sangre', 'Equipo de transfusión', 'Monitoreo'],
    preguntasCotizacion: [
      '¿Dónde se realiza la transfusión (domicilio o clínica)?',
      '¿Tiene indicación médica y hemograma reciente?',
      '¿La sangre está autorizada por un Banco de Sangre?',
      '¿Pruebas cruzadas realizadas?',
      '¿Cuenta con cuidador responsable presente?',
      'Nombre completo, cédula, dirección, teléfono',
    ],
  },
  oncomejorate: {
    label: 'ONCOMEJÓRATE (QUIMIO/INFUSIONES)',
    tipoServicio: 'procedimiento',
    clasificacion: ['terapeutico', 'hospitalario'],
    prioridadDefault: 'preferente',
    requiereConsentimiento: true,
    requiereIndicacionMedica: true,
    tiempoEstimadoMin: 240,
    personalRequerido: ['Medico oncólogo', 'Enfermera oncóloga'],
    materiales: ['Acceso venoso central (PICC, port-a-cath)', 'Medicamento oncológico', 'Equipo de infusión'],
    preguntasCotizacion: [
      '¿Dónde se realiza el tratamiento (domicilio o clínica)?',
      '¿Diagnóstico oncológico y protocolo de tratamiento?',
      '¿Tiene acceso venoso central (PICC, port-a-cath)?',
      '¿Médico oncólogo tratante?',
      '¿Qué medicamentos o protocolo específico?',
      'Nombre completo, cédula, dirección, teléfono',
    ],
  },
  terapias: {
    label: 'TERAPIAS',
    tipoServicio: 'programa_especial',
    clasificacion: ['terapeutico', 'domiciliario'],
    prioridadDefault: 'programado',
    requiereIndicacionMedica: true,
    tiempoEstimadoMin: 45,
    personalRequerido: ['Terapeuta físico / respiratorio / nutricionista'],
    preguntasCotizacion: [
      '¿Qué tipo de terapia necesita (física, respiratoria, nutrición)?',
      '¿Condición o diagnóstico del paciente?',
      '¿Limitación funcional o necesidad específica?',
      '¿Frecuencia deseada (veces por semana)?',
      '¿Tiene indicación médica?',
      'Nombre completo, cédula, dirección, teléfono',
    ],
  },
  programas_especiales: {
    label: 'PROGRAMAS ESPECIALES',
    tipoServicio: 'programa_especial',
    clasificacion: ['clinico', 'domiciliario'],
    prioridadDefault: 'programado',
    requiereIndicacionMedica: true,
    tiempoEstimadoMin: 120,
    personalRequerido: ['Medico geriatra / neurólogo', 'Cuidadora'],
    preguntasCotizacion: [
      '¿Qué programa necesita (adulto mayor, neurológico, cuidadora)?',
      '¿Diagnóstico y estado actual del paciente?',
      '¿Vive solo o acompañado? ¿Tiene cuidador familiar?',
      '¿Qué tipo de atención requiere y cuántas horas al día?',
      'Nombre completo, cédula, dirección, teléfono',
    ],
  },
  programas_empresariales: {
    label: 'PROGRAMAS EMPRESARIALES',
    tipoServicio: 'programa_especial',
    clasificacion: ['empresarial', 'preventivo'],
    prioridadDefault: 'programado',
    requiereIndicacionMedica: false,
    tiempoEstimadoMin: 120,
    personalRequerido: ['Medico ocupacional', 'Equipo de salud'],
    preguntasCotizacion: [
      '¿Qué tipo de programa necesita la empresa?',
      'Cantidad aproximada de empleados',
      '¿En sus instalaciones o en nuestras sedes?',
      '¿Frecuencia deseada (eventual, periódico)?',
      'Nombre de empresa, contacto, teléfono, correo',
    ],
  },
};

// ============ Reglas de clasificación (nombre -> grupo) ============

const RULES = [
  { re: /quimioterapia|quimio|inmunoterapia|biologica|infusion de quimio|medicamento oncologico|colocacion de puerto|sala de quimioterapia|poliquimioterapia/i, grupo: 'oncomejorate' },
  { re: /transfus|hemoterapia|exanguino|plaquetas|plasma|sangre|hematies|hemocomponente|concentrado/i, grupo: 'hemohogar' },
  { re: /radiograf|rayos x/i, grupo: 'rayos_x' },
  { re: /ultrasonografia|ecografia|sonografia|ultrasonido/i, grupo: 'sonografia' },
  { re: /doppler/i, grupo: 'doppler_vascular' },
  { re: /electrocardiograma|ecocardiograma|holter|mapa|presion arterial|electrocardiograf/i, grupo: 'estudios_cardiacos' },
  { re: /espirmometria|espirometria|laboratorio|citologia|cultivo|biopsia|extendido|muestra|toma no quirurgica|hemocultivo/i, grupo: 'laboratorio' },
  { re: /visita (basica|urgente|domiciliaria)?.*medic|visita medica en domicilio|visita.*medico en domicilio|primera visita.*medic/i, grupo: 'consultas_medicas' },
  { re: /cura\b|curacion|cura compleja|cura simple|curas|canalizacion|inyeccion|nebulizacion|sonda|sueroterapia|vendaje|enfermer|visita.*enfermeria|cuidados de enfermeria|acceso y mantenimiento|adiestramiento|nutricion enteral|oxigeno|bomba de infusion|cateter venoso/i, grupo: 'enfermeria' },
  { re: /puncion lumbar|artrocentesis|paracentesis|toracocentesis|cambio de peg|infiltraci|bloqueo|radiofrecuencia|rizolisis|epidural|facetario|sacroil|peng|piriforme|neurolisis|plexo|procedimiento|sala de cirugia/i, grupo: 'procedimientos_intervencionistas' },
  { re: /cuidados paliativos|paliativo/i, grupo: 'cuidados_paliativos' },
  { re: /hospitalizacion|hospitalizacion domiciliaria|internamiento|uhd|permanente/i, grupo: 'hospitalizacion_domiciliaria' },
  { re: /dolor|manejo de dolor/i, grupo: 'medicina_dolor' },
  { re: /terapia|rehabilitacion|fisioterapia|terapia fisica|terapia respiratoria|terapia ventilatoria|nutricion|geriatria|geriatrica|evaluacion cardiovascular|evaluaciones pre/i, grupo: 'terapias' },
  { re: /adulto mayor|neurologico|cuidadora|alzheimer|parkinson|acv|ela/i, grupo: 'programas_especiales' },
  { re: /empresa|ocupacional|preventivo|jornada|corporativ|charlas|capacitacion|evaluaciones medicas ocupacionales/i, grupo: 'programas_empresariales' },
  { re: /consulta|interconsulta|psicologia|telemedicina|seguimiento programado|anestesia|sedo|sedacion|tiva/i, grupo: 'consultas_medicas' },
];

function inferByRules(name) {
  const n = norm(name);
  for (const r of RULES) {
    if (r.re.test(n)) return r.grupo;
  }
  return null;
}

// Mapa de categoría SISALRIL -> grupo por defecto
const CATEGORY_DEFAULT = {
  consulta: 'consultas_medicas',
  estudio: 'sonografia',
  visita_domicilio: 'enfermeria',
  procedimiento: 'procedimientos_intervencionistas',
};

function classify(svc) {
  let grupo = inferByRules(svc.name);
  if (!grupo) {
    grupo = CATEGORY_DEFAULT[svc.category] || 'sin_clasificar';
  }

  // Medicina del dolor primero si la categoría es consulta y hay indicios de dolor
  const g = GRUPOS[grupo];
  if (!g) {
    return {
      grupoCatalogo: 'sin_clasificar',
      preguntasCotizacion: [],
      tipoServicio: svc.tipoServicio || 'consulta',
      clasificacion: svc.clasificacion || ['clinico', 'ambulatorio'],
      prioridadDefault: svc.prioridadDefault || 'programado',
      requiereConsentimiento: false,
      requiereIndicacionMedica: false,
    };
  }

  // Modalidad según grupo
  let modalidad = svc.modalidad || 'clinica';
  if (['domicilio', 'telemedicina'].includes(modalidad)) {
    // conservar
  } else if (['enfermeria', 'hospitalizacion_domiciliaria', 'cuidados_paliativos', 'terapias', 'hemohogar', 'laboratorio', 'estudios_cardiacos'].includes(grupo)) {
    modalidad = 'domicilio';
  } else if (grupo === 'oncomejorate' && /quimioterapia >|quimioterapia 2|quimioterapia <|quimioterapia de induccion|quimioterapia intratecal/i.test(svc.name)) {
    modalidad = 'domicilio';
  }

  return {
    grupoCatalogo: grupo,
    preguntasCotizacion: g.preguntasCotizacion,
    tipoServicio: g.tipoServicio,
    clasificacion: g.clasificacion,
    prioridadDefault: g.prioridadDefault,
    requiereConsentimiento: !!g.requiereConsentimiento,
    requiereIndicacionMedica: !!g.requiereIndicacionMedica,
    modalidad,
  };
}

async function main() {
  const all = await Service.find({ removed: false });
  const stats = { total: 0, updated: 0, byGrupo: {}, unclassified: [] };

  for (const svc of all) {
    const res = classify(svc);
    stats.total++;

    if (res.grupoCatalogo === 'sin_clasificar') {
      stats.unclassified.push(svc.name);
      continue;
    }

    stats.byGrupo[res.grupoCatalogo] = (stats.byGrupo[res.grupoCatalogo] || 0) + 1;

    const g = GRUPOS[res.grupoCatalogo];
    const patch = {
      $set: {
        grupoCatalogo: res.grupoCatalogo,
        tipoServicio: res.tipoServicio,
        clasificacion: res.clasificacion,
        prioridadDefault: res.prioridadDefault,
        requiereConsentimiento: res.requiereConsentimiento,
        requiereIndicacionMedica: res.requiereIndicacionMedica,
        modalidad: res.modalidad,
        preguntasCotizacion: res.preguntasCotizacion,
        updated: Date.now(),
      },
    };
    if (g.tiempoEstimadoMin && !svc.tiempoEstimadoMin) {
      patch.$set.tiempoEstimadoMin = g.tiempoEstimadoMin;
    }
    if (g.materiales && (!svc.materiales || svc.materiales.length === 0)) {
      patch.$set.materiales = g.materiales;
    }
    if (g.personalRequerido && (!svc.personalRequerido || svc.personalRequerido.length === 0)) {
      patch.$set.personalRequerido = g.personalRequerido;
    }

    if (!isDry) {
      await Service.updateOne({ _id: svc._id }, patch);
    }
    stats.updated++;
  }

  console.log(isDry ? '=== DRY-RUN (no escribe) ===' : '=== BACKFILL REAL ===');
  console.log(`Total servicios: ${stats.total}`);
  console.log(`Actualizados: ${stats.updated}`);
  console.log('\nPor grupoCatalogo:', JSON.stringify(stats.byGrupo, null, 1));
  console.log(`\nSin clasificar (${stats.unclassified.length}):`);
  for (const n of stats.unclassified) console.log('  -', n);

  await mongoose.disconnect();
}

(async () => {
  await mongoose.connect(MONGODB_URI);
  await main();
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
