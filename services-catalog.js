/*
 * ============================================================
 *  UNIDOLOR — Catálogo Unificado de Servicios
 *  Fuente única de verdad para: Chatbot, CRM y Formulario Web
 *  Generado: 2026-08-29
 * ============================================================
 */

export const MOTIVOS_CONTACTO = [
  {
    id: 'dolor',
    label: 'Dolor o molestia',
    keywords: ['dolor', 'duele', 'molestia', 'molesto', 'ardor', 'hormigueo', 'inflamacion', 'inchazon'],
    preguntasIniciales: [
      '¿Qué zona del cuerpo le duele?',
      '¿Desde cuándo tiene el dolor?',
      '¿El dolor es continuo o intermitente?',
    ],
  },
  {
    id: 'consulta',
    label: 'Consulta médica',
    keywords: ['consulta', 'medico', 'doctor', 'doctora', 'dra', 'dr', 'revisar', 'chequeo', 'valoracion'],
    preguntasIniciales: [
      '¿Es la primera vez que nos consulta?',
      '¿Qué motivo le trae?',
    ],
  },
  {
    id: 'domicilio',
    label: 'Servicio a domicilio',
    keywords: ['domicilio', 'casa', 'encamado', 'no puede movilizarse', 'hogar', 'vivir'],
    preguntasIniciales: [
      '¿Qué tipo de atención necesita en casa?',
      '¿El paciente puede movilizarse?',
    ],
  },
  {
    id: 'estudios',
    label: 'Estudios o exámenes',
    keywords: ['rayos', 'radiografia', 'sonografia', 'ecografia', 'ecg', 'holter', 'doppler', 'laboratorio', 'analisis', 'estudio'],
    preguntasIniciales: [
      '¿Qué estudio necesita?',
      '¿Tiene orden médica para el estudio?',
    ],
  },
  {
    id: 'enfermeria',
    label: 'Enfermería',
    keywords: ['enfermeria', 'enfermera', 'enfermero', 'curacion', 'cura', 'inyeccion', 'suero', 'sonda', 'nebulizacion'],
    preguntasIniciales: [
      '¿Qué tipo de atención de enfermería necesita?',
      '¿Cada cuántos días se realizaría?',
    ],
  },
  {
    id: 'rehab',
    label: 'Terapia o rehabilitación',
    keywords: ['terapia', 'rehabilitacion', 'fisioterapia', 'fisioterapeuta'],
    preguntasIniciales: [
      '¿Qué condición necesita rehabilitar?',
      '¿Ha tenido cirugía reciente?',
    ],
  },
  {
    id: 'paliativos',
    label: 'Cuidados paliativos',
    keywords: ['paliativos', 'cuidados paliativos', 'terminal', 'avanzado'],
    preguntasIniciales: [
      '¿Cuál es el diagnóstico del paciente?',
      '¿Dónde se encuentra actualmente el paciente?',
    ],
  },
  {
    id: 'orientacion',
    label: 'Orientación o información',
    keywords: ['info', 'informacion', 'saber', 'conocer', 'pregunta', 'cuanto', 'precio', 'costo', 'cotizar'],
    preguntasIniciales: [
      '¿Qué le gustaría saber?',
      '¿Sobre cuál de nuestros servicios?',
    ],
  },
  {
    id: 'otro',
    label: 'Otro',
    keywords: [],
    preguntasIniciales: [
      '¿En qué podemos ayudarle?',
    ],
  },
];

export const SERVICIOS = [
  {
    categoria: 'Consultas Médicas',
    items: [
      {
        codigo: 'CMD',
        nombre: 'Consulta médica general a domicilio',
        descripcion: 'Evaluación médica completa en la comodidad del hogar.',
        modalidad: 'domicilio',
        tipoServicio: 'consulta',
        grupoCatalogo: 'consultas_medicas',
        preguntar: ['Nombre del paciente', 'Edad', 'Cédula', 'Dirección', 'Síntomas o motivo de consulta', '¿Tiene seguro médico?', '¿Tiene estudios previos?'],
      },
      {
        codigo: 'CMC',
        nombre: 'Consulta médica en clínica',
        descripcion: 'Atención especializada en nuestro consultorio con la Dra. Bethania Martínez.',
        modalidad: 'clinica',
        tipoServicio: 'consulta',
        grupoCatalogo: 'consultas_medicas',
        preguntar: ['Nombre del paciente', 'Cédula', 'Motivo de consulta', '¿Tiene referimiento médico?', '¿Tiene estudios de imágenes previos?', '¿Qué seguro tiene?'],
      },
      {
        codigo: 'CE',
        nombre: 'Consulta especialista',
        descripcion: 'Consulta con médicos especialistas en ortopedia, neurología, etc.',
        modalidad: 'clinica',
        tipoServicio: 'consulta',
        grupoCatalogo: 'consultas_medicas',
        preguntar: ['Nombre del paciente', 'Especialidad requerida', '¿Tiene referimiento?', '¿Qué estudios previos tiene?', 'Motivo de consulta detallado'],
      },
      {
        codigo: 'CI',
        nombre: 'Consulta intrahospitalaria',
        descripcion: 'Atención especializada para pacientes hospitalizados.',
        modalidad: 'clinica',
        tipoServicio: 'consulta',
        grupoCatalogo: 'consultas_medicas',
        preguntar: ['Nombre del paciente', 'Hospital donde está ingresado', 'Habitación', 'Médico tratante', 'Diagnóstico actual'],
      },
    ],
  },
  {
    categoria: 'Medicina del Dolor',
    items: [
      {
        codigo: 'DOL',
        nombre: 'Manejo del dolor',
        descripcion: 'Atención especializada para pacientes con dolor crónico, oncológico o complejo.',
        modalidad: 'clinica',
        tipoServicio: 'procedimiento',
        grupoCatalogo: 'medicina_dolor',
        preguntar: ['Tipo de dolor (localización, intensidad, frecuencia)', 'Diagnóstico de base', 'Medicamentos actuales', 'Médico tratante', '¿Tratamientos previos?', '¿Tiene estudios de imágenes o laboratorios recientes?'],
      },
      {
        codigo: 'BOM',
        nombre: 'Recarga de bomba intratecal (Medtronic)',
        descripcion: 'Recarga de bomba de infusión intratecal Medtronic en domicilio.',
        modalidad: 'domicilio',
        tipoServicio: 'procedimiento',
        grupoCatalogo: 'medicina_dolor',
        preguntar: ['Tipo de bomba (Medtronic u otra)', 'Medicamentos habituales', 'Fecha de última recarga', '¿Tiene indicación médica actualizada?', '¿Ha tenido alarmas o problemas?'],
      },
      {
        codigo: 'BEL',
        nombre: 'Bomba elastomérica',
        descripcion: 'Dispositivo de infusión continua para administración de medicamentos.',
        modalidad: 'domicilio',
        tipoServicio: 'procedimiento',
        grupoCatalogo: 'medicina_dolor',
        preguntar: ['¿Qué medicamento necesita?', '¿Vía de administración?', '¿Tiene acceso venoso?', '¿Tiene indicación médica?'],
      },
    ],
  },
  {
    categoria: 'Procedimientos Intervencionistas',
    items: [
      {
        codigo: 'PROC',
        nombre: 'Procedimientos intervencionistas',
        descripcion: 'Bloqueos nerviosos, radiofrecuencia, rizólisis, infiltraciones, epidurales, facetarios y otros guiados por ecografía o fluoroscopia.',
        modalidad: 'clinica',
        tipoServicio: 'procedimiento',
        grupoCatalogo: 'procedimientos_intervencionistas',
        preguntar: ['¿Tipo de procedimiento o zona del cuerpo?', '¿Tiene indicación médica?', '¿Diagnóstico de base y médico tratante?', '¿Estudios de imágenes previos?', '¿Medicamentos actuales (anticoagulantes)?', '¿Alergias conocidas?'],
      },
    ],
  },
  {
    categoria: 'Cuidados Paliativos',
    items: [
      {
        codigo: 'PAL',
        nombre: 'Cuidados paliativos',
        descripcion: 'Atención especializada para pacientes con enfermedades graves o terminales. Control de síntomas, apoyo familiar, atención domiciliaria y hospitalaria.',
        modalidad: 'clinica',
        tipoServicio: 'consulta',
        grupoCatalogo: 'cuidados_paliativos',
        preguntar: ['¿Dónde se requiere (domicilio o clínica)?', '¿Diagnóstico de base y médico tratante?', '¿Estado actual del paciente?', '¿Tiene cuidador familiar?', '¿Qué tipo de atención necesita? (control síntomas, sedación, apoyo)'],
      },
    ],
  },
  {
    categoria: 'Enfermería',
    items: [
      {
        codigo: 'ENF',
        nombre: 'Enfermería general a domicilio',
        descripcion: 'Atención de enfermería profesional. Según necesidad puede incluir curaciones, canalización, medicación, nebulizaciones, sondas, sueros, muestras, signos vitales.',
        modalidad: 'domicilio',
        tipoServicio: 'enfermeria',
        grupoCatalogo: 'enfermeria',
        preguntar: ['¿Qué tipo de atención de enfermería necesita?', '¿Horas al día y por cuántos días (tanda)?', '¿Paciente encamado?', '¿Tiene cuidador familiar?', '¿Indicación médica vigente?', '¿Tiene los insumos o los proveemos?'],
      },
      {
        codigo: 'SV',
        nombre: 'Toma de signos vitales',
        descripcion: 'Presión arterial, frecuencia cardíaca, temperatura, saturación de oxígeno.',
        modalidad: 'domicilio',
        tipoServicio: 'enfermeria',
        grupoCatalogo: 'enfermeria',
        preguntar: ['¿Frecuencia requerida?', '¿Tiene indicación médica?', '¿Reportar a alguien?'],
      },
      {
        codigo: 'MED',
        nombre: 'Aplicación de medicamentos',
        descripcion: 'Administración IM, SC, IV según indicación médica.',
        modalidad: 'domicilio',
        tipoServicio: 'enfermeria',
        grupoCatalogo: 'enfermeria',
        preguntar: ['¿Qué medicamento?', '¿Dosis y vía?', '¿Tiene indicación médica?', '¿Alergias conocidas?'],
      },
      {
        codigo: 'NEB',
        nombre: 'Nebulizaciones / Oxigenoterapia',
        descripcion: 'Administración de medicamentos inhalados y oxígeno.',
        modalidad: 'domicilio',
        tipoServicio: 'enfermeria',
        grupoCatalogo: 'enfermeria',
        preguntar: ['¿Qué medicamento nebulizar?', '¿Frecuencia de nebulizaciones?', '¿Requiere oxígeno?', '¿Tiene indicación médica?'],
      },
      {
        codigo: 'CUR',
        nombre: 'Curas (simples y complejas)',
        descripcion: 'Curaciones de heridas, úlceras por presión, postquirúrgicas y quemaduras.',
        modalidad: 'domicilio',
        tipoServicio: 'enfermeria',
        grupoCatalogo: 'enfermeria',
        preguntar: ['¿Tipo de herida?', '¿Tiempo de evolución?', '¿Signos de infección?', '¿Frecuencia de curación (cada cuántos días)?', '¿Por cuánto tiempo?', '¿Tiene indicación médica?', '¿Tiene materiales de curación?'],
      },
      {
        codigo: 'SON',
        nombre: 'Colocación/retiro de sondas',
        descripcion: 'Sondas vesicales (Foley), nasogástricas y de alimentación.',
        modalidad: 'domicilio',
        tipoServicio: 'enfermeria',
        grupoCatalogo: 'enfermeria',
        preguntar: ['¿Tipo de sonda?', '¿Colocar o retirar?', '¿Tiene indicación médica?', '¿Alergias conocidas?'],
      },
      {
        codigo: 'SUE',
        nombre: 'Administración de sueros / antibióticos IV',
        descripcion: 'Canalización venosa y administración de sueros o antibióticos intravenosos.',
        modalidad: 'domicilio',
        tipoServicio: 'enfermeria',
        grupoCatalogo: 'enfermeria',
        preguntar: ['¿Qué medicamento administrar?', '¿Dosis y duración de la infusión?', '¿Tiene acceso venoso?', '¿Tiene indicación médica?'],
      },
      {
        codigo: 'MUES',
        nombre: 'Extracción de muestras',
        descripcion: 'Toma de muestras sanguíneas y otros fluidos para análisis.',
        modalidad: 'domicilio',
        tipoServicio: 'enfermeria',
        grupoCatalogo: 'enfermeria',
        preguntar: ['¿Qué exámenes necesita?', '¿Tiene orden médica?', '¿Dónde procesar las muestras?'],
      },
    ],
  },
  {
    categoria: 'Rayos X',
    items: [
      {
        codigo: 'RX',
        nombre: 'Rayos X a domicilio',
        descripcion: 'Radiografía portátil digital en el hogar. Resultados en 24-48h.',
        modalidad: 'domicilio',
        tipoServicio: 'diagnostico',
        grupoCatalogo: 'rayos_x',
        preguntar: ['¿Qué área del cuerpo necesita? (tórax, columna, extremidad, abdomen)', '¿Tiene indicación médica?', '¿Está encamado o puede movilizarse?'],
      },
    ],
  },
  {
    categoria: 'Sonografía / Ecografía',
    items: [
      {
        codigo: 'SONO',
        nombre: 'Sonografía / Ecografía a domicilio',
        descripcion: 'Ecografía portátil. Abdominal, pélvica, renal, partes blandas.',
        modalidad: 'domicilio',
        tipoServicio: 'diagnostico',
        grupoCatalogo: 'sonografia',
        preguntar: ['¿Qué tipo de sonografía necesita?', '¿Tiene indicación médica?', '¿Está encamado?'],
      },
    ],
  },
  {
    categoria: 'Doppler Vascular',
    items: [
      {
        codigo: 'DOP',
        nombre: 'Doppler vascular',
        descripcion: 'Doppler arterial, venoso, carotídeo y de extremidades.',
        modalidad: 'clinica',
        tipoServicio: 'diagnostico',
        grupoCatalogo: 'doppler_vascular',
        preguntar: ['¿Qué área evaluar?', '¿Motivo del estudio? (dolor, hinchazón, várices)', '¿Tiene indicación médica?'],
      },
    ],
  },
  {
    categoria: 'Estudios Cardíacos',
    items: [
      {
        codigo: 'ECG',
        nombre: 'Electrocardiograma (ECG)',
        descripcion: 'Registro de actividad eléctrica del corazón. Resultados inmediatos.',
        modalidad: 'clinica',
        tipoServicio: 'diagnostico',
        grupoCatalogo: 'estudios_cardiacos',
        preguntar: ['¿Dolor en el pecho?', '¿Palpitaciones?', '¿Tiene indicación médica?'],
      },
      {
        codigo: 'ECO_CARD',
        nombre: 'Ecocardiograma',
        descripcion: 'Evaluación de estructura y función cardíaca por ultrasonido.',
        modalidad: 'clinica',
        tipoServicio: 'diagnostico',
        grupoCatalogo: 'estudios_cardiacos',
        preguntar: ['¿Problemas cardíacos conocidos?', '¿Tiene indicación médica?', '¿Síntomas: falta de aire, dolor en pecho?'],
      },
      {
        codigo: 'HOL',
        nombre: 'Holter (ritmo cardíaco 24h)',
        descripcion: 'Monitoreo continuo del ritmo cardíaco por 24 horas.',
        modalidad: 'clinica',
        tipoServicio: 'diagnostico',
        grupoCatalogo: 'estudios_cardiacos',
        preguntar: ['¿Síntomas: palpitaciones, mareos, desmayos?', '¿Tiene indicación médica?'],
      },
      {
        codigo: 'MAPA',
        nombre: 'MAPA (presión arterial 24h)',
        descripcion: 'Monitoreo ambulatorio de presión arterial por 24 horas.',
        modalidad: 'clinica',
        tipoServicio: 'diagnostico',
        grupoCatalogo: 'estudios_cardiacos',
        preguntar: ['¿Diagnóstico de hipertensión?', '¿Toma medicamentos para presión?', '¿Tiene indicación médica?'],
      },
    ],
  },
  {
    categoria: 'Laboratorio',
    items: [
      {
        codigo: 'LAB',
        nombre: 'Laboratorio clínico a domicilio',
        descripcion: 'Toma de muestras y procesamiento en laboratorio aliado. Resultados 24-48h.',
        modalidad: 'domicilio',
        tipoServicio: 'diagnostico',
        grupoCatalogo: 'laboratorio',
        preguntar: ['¿Qué exámenes necesita?', '¿Tiene orden médica?', '¿Dónde procesamos las muestras?'],
      },
    ],
  },
  {
    categoria: 'Hospitalización Domiciliaria',
    items: [
      {
        codigo: 'HOS',
        nombre: 'Internamiento en casa',
        descripcion: 'Hospitalización domiciliaria con atención médica y enfermería continua.',
        modalidad: 'domicilio',
        tipoServicio: 'hospitalizacion_domiciliaria',
        grupoCatalogo: 'hospitalizacion_domiciliaria',
        preguntar: ['¿Diagnóstico y estado actual?', '¿Nivel de atención? (enfermería 4h, 8h, 12h, 24h)', '¿Tiene médico tratante y cuidador familiar?', '¿Qué medicamentos o equipos necesita?', '¿Tiene seguro médico?'],
      },
    ],
  },
  {
    categoria: 'Hemohogar (Transfusiones)',
    items: [
      {
        codigo: 'HEMO',
        nombre: 'Transfusión domiciliaria (Hemohogar)',
        descripcion: 'Transfusión de sangre y hemoderivados en domicilio o clínica. Supervisión médica.',
        modalidad: 'domicilio',
        tipoServicio: 'procedimiento',
        grupoCatalogo: 'hemohogar',
        preguntar: ['¿Dónde se realiza? (domicilio o clínica)', '¿Tiene indicación médica y hemograma reciente?', '¿Sangre autorizada por Banco de Sangre?', '¿Pruebas cruzadas realizadas?', '¿Cuenta con cuidador responsable presente?'],
      },
    ],
  },
  {
    categoria: 'Oncomejórate (Quimioterapia)',
    items: [
      {
        codigo: 'QUIMIO',
        nombre: 'Quimioterapia en casa',
        descripcion: 'Quimioterapia, inmunoterapia y terapias biológicas. Supervisión especializada.',
        modalidad: 'domicilio',
        tipoServicio: 'procedimiento',
        grupoCatalogo: 'oncomejorate',
        preguntar: ['¿Dónde se realiza? (domicilio o clínica)', '¿Diagnóstico oncológico y protocolo?', '¿Tiene acceso venoso central? (PICC, port-a-cath)', 'Médico oncólogo tratante'],
      },
    ],
  },
  {
    categoria: 'Terapias',
    items: [
      {
        codigo: 'TF',
        nombre: 'Terapia física / Rehabilitación',
        descripcion: 'Terapia física y rehabilitación a domicilio.',
        modalidad: 'domicilio',
        tipoServicio: 'consulta',
        grupoCatalogo: 'terapias',
        preguntar: ['¿Condición o diagnóstico?', '¿Limitación funcional?', '¿Cirugía reciente?', '¿Frecuencia deseada? (veces por semana)'],
      },
      {
        codigo: 'ANT',
        nombre: 'Antibioterapia en casa',
        descripcion: 'Antibióticos intravenosos en domicilio.',
        modalidad: 'domicilio',
        tipoServicio: 'procedimiento',
        grupoCatalogo: 'terapias',
        preguntar: ['¿Qué antibiótico?', '¿Dosis y frecuencia?', '¿Tiene acceso venoso?', 'Diagnóstico de la infección'],
      },
      {
        codigo: 'NUTRI',
        nombre: 'Planes nutricionales',
        descripcion: 'Evaluación y planes nutricionales personalizados.',
        modalidad: 'clinica',
        tipoServicio: 'consulta',
        grupoCatalogo: 'terapias',
        preguntar: ['Condición de salud', '¿Requiere nutrición enteral? (sonda)', '¿Alergias alimentarias?'],
      },
      {
        codigo: 'ODONTO',
        nombre: 'Odontología a domicilio',
        descripcion: 'Evaluación, limpieza, extracciones y procedimientos menores.',
        modalidad: 'domicilio',
        tipoServicio: 'procedimiento',
        grupoCatalogo: 'terapias',
        preguntar: ['Motivo de consulta', '¿Dolor o molestia específica?', '¿Condiciones de salud preexistentes?'],
      },
    ],
  },
  {
    categoria: 'Programas Especiales',
    items: [
      {
        codigo: 'AM',
        nombre: 'Programa Adulto Mayor',
        descripcion: 'Evaluación geriátrica, seguimiento médico y de enfermería.',
        modalidad: 'clinica',
        tipoServicio: 'programa_especial',
        grupoCatalogo: 'programas_especiales',
        preguntar: ['Nombre del paciente', 'Edad', 'Condiciones de salud actuales', '¿Vive solo o acompañado?', '¿Requiere enfermería?'],
      },
      {
        codigo: 'CPN',
        nombre: 'Cuidados paliativos neurológicos',
        descripcion: 'Para pacientes con ACV, Parkinson, Alzheimer, ELA.',
        modalidad: 'clinica',
        tipoServicio: 'programa_especial',
        grupoCatalogo: 'programas_especiales',
        preguntar: ['Diagnóstico específico', 'Estado actual (encamado, movilidad)', '¿Tiene sonda, úlceras, dificultad para tragar?', 'Nombre del cuidador principal'],
      },
      {
        codigo: 'CUIDA',
        nombre: 'Cuidadora domiciliaria',
        descripcion: 'Compañía y asistencia básica para adultos mayores.',
        modalidad: 'domicilio',
        tipoServicio: 'programa_especial',
        grupoCatalogo: 'programas_especiales',
        preguntar: ['Nombre del paciente', 'Edad', '¿Requiere asistencia para comer, bañarse, movilizarse?', '¿Horas diarias requeridas?'],
      },
      {
        codigo: 'ACOMP',
        nombre: 'Acompañamiento a citas médicas',
        descripcion: 'Traslado y acompañamiento a citas.',
        modalidad: 'domicilio',
        tipoServicio: 'programa_especial',
        grupoCatalogo: 'programas_especiales',
        preguntar: ['Nombre del paciente', 'Dirección de la cita', 'Fecha y hora', '¿Requiere silla de ruedas?'],
      },
    ],
  },
  {
    categoria: 'Programas Empresariales',
    items: [
      {
        codigo: 'EMP',
        nombre: 'Programas empresariales',
        descripcion: 'Evaluaciones médicas, programas preventivos, jornadas, salud ocupacional.',
        modalidad: 'clinica',
        tipoServicio: 'programa_especial',
        grupoCatalogo: 'programas_empresariales',
        preguntar: ['¿Qué tipo de programa necesita?', 'Cantidad de empleados', '¿En sus instalaciones?', 'Nombre de empresa, contacto, teléfono'],
      },
    ],
  },
];

export const PROCEDIMIENTOS = [
  {
    codigo: 'INF-EPIDURAL',
    nombre: 'Infiltración epidural',
    servicioRef: 'PROC',
    duracionMin: 30,
    requiereConsent: 'CONSENT_INFILTRACION',
    requiereIndicacion: true,
    material: ['aguja epidural', 'anestésico local', 'esteroides'],
  },
  {
    codigo: 'INF-FACETARIA',
    nombre: 'Infiltración facetaria',
    servicioRef: 'PROC',
    duracionMin: 30,
    requiereConsent: 'CONSENT_INFILTRACION',
    requiereIndicacion: true,
    material: ['aguja', 'anestésico local', 'esteroides'],
  },
  {
    codigo: 'BLOQ-NERVioso',
    nombre: 'Bloqueo nervioso periférico',
    servicioRef: 'PROC',
    duracionMin: 45,
    requiereConsent: 'CONSENT_BLOQUEO',
    requiereIndicacion: true,
    material: ['aguja de bloqueo', 'anestésico local', 'ecógrafo'],
  },
  {
    codigo: 'RADIOF-CORP',
    nombre: 'Radiofrecuencia corporal',
    servicioRef: 'PROC',
    duracionMin: 60,
    requiereConsent: 'CONSENT_RADIOFRECUENCIA',
    requiereIndicacion: true,
    material: ['aguja de radiofrecuencia', 'generador RF', 'anestésico local'],
  },
  {
    codigo: 'RIZO-LISIS',
    nombre: 'Rizólisis',
    servicioRef: 'PROC',
    duracionMin: 45,
    requiereConsent: 'CONSENT_RADIOFRECUENCIA',
    requiereIndicacion: true,
    material: ['aguja de radiofrecuencia', 'generador RF'],
  },
  {
    codigo: 'INF-ARTICULAR',
    nombre: 'Infiltración articular',
    servicioRef: 'PROC',
    duracionMin: 20,
    requiereConsent: 'CONSENT_INFILTRACION',
    requiereIndicacion: true,
    material: ['aguja', 'anestésico local', 'esteroides'],
  },
  {
    codigo: 'INF-TENDONOSA',
    nombre: 'Infiltración peritendinosa / puntos gatillo',
    servicioRef: 'PROC',
    duracionMin: 15,
    requiereConsent: 'CONSENT_INFILTRACION',
    requiereIndicacion: true,
    material: ['aguja', 'anestésico local'],
  },
  {
    codigo: 'BLOQ-SIMPATICO',
    nombre: 'Bloqueo del simpático cervical/dorsal',
    servicioRef: 'PROC',
    duracionMin: 45,
    requiereConsent: 'CONSENT_BLOQUEO',
    requiereIndicacion: true,
    material: ['aguja de bloqueo', 'anestésico local', 'ecógrafo'],
  },
  {
    codigo: 'BLOQ-PLEXO',
    nombre: 'Bloqueo de plexo braquial/lumbar',
    servicioRef: 'PROC',
    duracionMin: 60,
    requiereConsent: 'CONSENT_BLOQUEO',
    requiereIndicacion: true,
    material: ['aguja de bloqueo', 'anestésico local', 'ecógrafo'],
  },
  {
    codigo: 'SONO-ABDOMINAL',
    nombre: 'Sonografía abdominal',
    servicioRef: 'SONO',
    duracionMin: 30,
    requiereConsent: null,
    requiereIndicacion: true,
    material: ['ecógrafo portátil', 'gel'],
  },
  {
    codigo: 'SONO-PELVICA',
    nombre: 'Sonografía pélvica',
    servicioRef: 'SONO',
    duracionMin: 30,
    requiereConsent: null,
    requiereIndicacion: true,
    material: ['ecógrafo portátil', 'gel'],
  },
  {
    codigo: 'SONO-RENAL',
    nombre: 'Sonografía renal',
    servicioRef: 'SONO',
    duracionMin: 25,
    requiereConsent: null,
    requiereIndicacion: true,
    material: ['ecógrafo portátil', 'gel'],
  },
  {
    codigo: 'SONO-PARTES-BLANDAS',
    nombre: 'Sonografía de partes blandas',
    servicioRef: 'SONO',
    duracionMin: 25,
    requiereConsent: null,
    requiereIndicacion: true,
    material: ['ecógrafo portátil', 'gel'],
  },
  {
    codigo: 'RX-TORAX',
    nombre: 'Radiografía de tórax',
    servicioRef: 'RX',
    duracionMin: 20,
    requiereConsent: 'CONSENT_IMAGENES',
    requiereIndicacion: true,
    material: ['rayos X portátil'],
  },
  {
    codigo: 'RX-COLUMNA',
    nombre: 'Radiografía de columna',
    servicioRef: 'RX',
    duracionMin: 25,
    requiereConsent: 'CONSENT_IMAGENES',
    requiereIndicacion: true,
    material: ['rayos X portátil'],
  },
  {
    codigo: 'RX-EXTREMIDAD',
    nombre: 'Radiografía de extremidad',
    servicioRef: 'RX',
    duracionMin: 20,
    requiereConsent: 'CONSENT_IMAGENES',
    requiereIndicacion: true,
    material: ['rayos X portátil'],
  },
  {
    codigo: 'RX-ABDOMEN',
    nombre: 'Radiografía de abdomen',
    servicioRef: 'RX',
    duracionMin: 20,
    requiereConsent: 'CONSENT_IMAGENES',
    requiereIndicacion: true,
    material: ['rayos X portátil'],
  },
  {
    codigo: 'ENF-CURACION',
    nombre: 'Curación de herida',
    servicioRef: 'ENF',
    duracionMin: 30,
    requiereConsent: 'CONSENT_CURACION',
    requiereIndicacion: true,
    material: ['material de curación', 'solución antiséptica', 'guantes'],
  },
  {
    codigo: 'ENF-NEBULIZACION',
    nombre: 'Nebulización',
    servicioRef: 'NEB',
    duracionMin: 20,
    requiereConsent: 'CONSENT_ENFERMERIA',
    requiereIndicacion: true,
    material: ['nebulizador', 'medicamento'],
  },
  {
    codigo: 'ENF-IV',
    nombre: 'Canalización venosa y administración IV',
    servicioRef: 'SUE',
    duracionMin: 30,
    requiereConsent: 'CONSENT_ENFERMERIA',
    requiereIndicacion: true,
    material: ['catéter venoso', 'suero', 'medicamento'],
  },
  {
    codigo: 'ENF-IM',
    nombre: 'Aplicación intramuscular',
    servicioRef: 'MED',
    duracionMin: 10,
    requiereConsent: null,
    requiereIndicacion: true,
    material: ['aguja', 'jeringa', 'medicamento'],
  },
  {
    codigo: 'ENF-SONDA',
    nombre: 'Colocación/retiro de sonda vesical',
    servicioRef: 'SON',
    duracionMin: 20,
    requiereConsent: 'CONSENT_ENFERMERIA',
    requiereIndicacion: true,
    material: ['sonda vesical', 'lubricante', 'solución'],
  },
  {
    codigo: 'ENF-MUESTRA',
    nombre: 'Extracción de muestra sanguínea',
    servicioRef: 'MUES',
    duracionMin: 15,
    requiereConsent: null,
    requiereIndicacion: true,
    material: ['tubo', 'aguja', 'algodón'],
  },
  {
    codigo: 'TF-SESION',
    nombre: 'Sesión de terapia física',
    servicioRef: 'TF',
    duracionMin: 45,
    requiereConsent: null,
    requiereIndicacion: false,
    material: ['equipos de terapia'],
  },
];

export const CONSENT_TEMPLATES = [
  {
    id: 'CONSENT_INFILTRACION',
    nombre: 'Consentimiento Informado — Infiltraciones',
    version: '3.0',
    fecha: '2026-01-15',
    obligatorio: true,
    html: `<h2>CONSENTIMIENTO INFORMADO PARA INFILTRACIONES</h2>
<p><strong>Unidolor S.R.L.</strong></p>
<p>Paciente: _____________ Cédula: _____________ Fecha: _____________</p>
<p>Yo, _________________________________________________, mayor de edad, portador(a) de la cédula de identidad N.º _________________, de forma libre y voluntaria, AUTORIZO al personal médico de <strong>Unidolor S.R.L.</strong> para que me realice <strong>INFILTRACIONES</strong> en las zonas acordadas con el médico tratante.</p>
<h3>1. Descripción del procedimiento</h3>
<p>Las infiltraciones consisten en la inyección de medicamentos (anestésicos locales, corticoides y/u otros fármacos) en articulaciones, tejidos blandos, puntos gatillo o estructuras anatómicas específicas, con fines terapéuticos (alivio del dolor, reducción de inflamación, mejoría funcional).</p>
<h3>2. Beneficios esperados</h3>
<ul><li>Reducción del dolor en la zona tratada.</li><li>Disminución de la inflamación.</li><li>Mejora de la movilidad y función.</li></ul>
<h3>3. Riesgos y posibles complicaciones</h3>
<ul><li><strong>Frecuentes:</strong> dolor temporal en el sitio de inyección, enrojecimiento, inflamación leve.</li><li><strong>Poco frecuentes:</strong> infección en el sitio de punción, hematoma, reacción alérgica al medicamento.</li><li><strong>Raros:</strong> lesión nerviosa, daño vascular, complicaciones sistémicas (rarísimos).</li></ul>
<h3>4. Alternativas</h3>
<p>Medicamentos orales, fisioterapia, cirugía u otras modalidades que su médico le indicará.</p>
<h3>5. Derechos del paciente</h3>
<p>Usted tiene derecho a recibir información completa antes del procedimiento, a formular preguntas y a retirar este consentimiento en cualquier momento antes de que se inicie la intervención.</p>
<p>Firma del paciente o representante: ___________________________</p>
<p>Firma del médico: ___________________________</p>
<p><em>Versión 3.0 — Unidolor S.R.L. — Enero 2026</em></p>`,
  },
  {
    id: 'CONSENT_BLOQUEO',
    nombre: 'Consentimiento Informado — Bloqueos Nerviosos',
    version: '2.1',
    fecha: '2026-01-15',
    obligatorio: true,
    html: `<h2>CONSENTIMIENTO INFORMADO PARA BLOQUEOS NERVIOSOS</h2>
<p><strong>Unidolor S.R.L.</strong></p>
<p>Paciente: _____________ Cédula: _____________ Fecha: _____________</p>
<p>Yo, _________________________________________________, mayor de edad, portador(a) de la cédula de identidad N.º _________________, de forma libre y voluntaria, AUTORIZO al personal médico de <strong>Unidolor S.R.L.</strong> para que me realice <strong>BLOQUEOS NERVIOSOS</strong> (periféricos, simpáticos, de plexo o de otra localización) en las zonas acordadas con el médico tratante.</p>
<h3>1. Descripción del procedimiento</h3>
<p>Un bloqueo nervioso es la inyección de anestésicos locales y/o corticoides cerca de un nervio o grupo de nervios, con fines diagnósticos o terapéuticos. Puede realizarse con guía ecográfica o fluoroscópica.</p>
<h3>2. Beneficios esperados</h3>
<ul><li>Alivio del dolor agudo o crónico.</li><li>Mejora de la función neuromuscular.</li><li>Reducción del uso de analgésicos orales.</li></ul>
<h3>3. Riesgos y posibles complicaciones</h3>
<ul><li><strong>Frecuentes:</strong> dolor transitorio en el sitio de punción, parestesia temporal.</li><li><strong>Poco frecuentes:</strong> hematomas, infección, hipotensión ortostática.</li><li><strong>Raros:</strong> lesión nerviosa permanente, toxicidad por anestésico local, neumotórax (en bloqueos del plano cervical).</li></ul>
<h3>4. Alternativas</h3>
<p>Tratamiento oral, infiltraciones, fisioterapia, intervención quirúrgica.</p>
<h3>5. Derechos del paciente</h3>
<p>Usted tiene derecho a recibir información completa antes del procedimiento, a formular preguntas y a retirar este consentimiento en cualquier momento antes de que se inicie la intervención.</p>
<p>Firma del paciente o representante: ___________________________</p>
<p>Firma del médico: ___________________________</p>
<p><em>Versión 2.1 — Unidolor S.R.L. — Enero 2026</em></p>`,
  },
  {
    id: 'CONSENT_RADIOFRECUENCIA',
    nombre: 'Consentimiento Informado — Radiofrecuencia',
    version: '2.0',
    fecha: '2026-01-15',
    obligatorio: true,
    html: `<h2>CONSENTIMIENTO INFORMADO PARA RADIOFRECUENCIA</h2>
<p><strong>Unidolor S.R.L.</strong></p>
<p>Paciente: _____________ Cédula: _____________ Fecha: _____________</p>
<p>Yo, _________________________________________________, mayor de edad, portador(a) de la cédula de identidad N.º _________________, de forma libre y voluntaria, AUTORIZO al personal médico de <strong>Unidolor S.R.L.</strong> para que me realice <strong>RADIOFRECUENCIA</strong> ( Corporal, Rizólisis o neurotomía por radiofrecuencia) en las zonas acordadas con el médico tratante.</p>
<h3>1. Descripción del procedimiento</h3>
<p>La radiofrecuencia utiliza energía de radiofrecuencia para generar calor controlado en estructuras nerviosas específicas, interrumpiendo la transmisión del dolor. Puede ser pulsada (diagnóstica) o continua (terapéutica).</p>
<h3>2. Beneficios esperados</h3>
<ul><li>Alivio del dolor crónico de moderado a severo.</li><li>Reducción significativa del uso de analgésicos.</li><li>Mejora de la calidad de vida y función.</li></ul>
<h3>3. Riesgos y posibles complicaciones</h3>
<ul><li><strong>Frecuentes:</strong> dolor temporal, enrojecimiento en el sitio de punción.</li><li><strong>Poco frecuentes:</strong> hematoma, hinchazón, irritación nerviosa transitoria.</li><li><strong>Raros:</strong> lesión nerviosa permanente, infección, quemadura en piel.</li></ul>
<h3>4. Alternativas</h3>
<p>Infiltraciones, bloqueos nerviosos, medicamentos orales, cirugía.</p>
<h3>5. Derechos del paciente</h3>
<p>Usted tiene derecho a recibir información completa antes del procedimiento, a formular preguntas y a retirar este consentimiento en cualquier momento antes de que se inicie la intervención.</p>
<p>Firma del paciente o representante: ___________________________</p>
<p>Firma del médico: ___________________________</p>
<p><em>Versión 2.0 — Unidolor S.R.L. — Enero 2026</em></p>`,
  },
  {
    id: 'CONSENT_IMAGENES',
    nombre: 'Consentimiento Informado — Estudios de Imágenes',
    version: '1.0',
    fecha: '2026-01-15',
    obligatorio: false,
    html: `<h2>CONSENTIMIENTO INFORMADO PARA ESTUDIOS DE IMÁGENES</h2>
<p><strong>Unidolor S.R.L.</strong></p>
<p>Paciente: _____________ Cédula: _____________ Fecha: _____________</p>
<p>Autorizo al personal de Unidolor S.R.L. a realizarme el estudio de imagen (rayos X, ecografía, etc.) indicado por mi médico tratante.</p>
<h3>Información importante</h3>
<ul><li>Los estudios de imágenes son procedimientos diagnósticos de bajo riesgo.</li><li>En caso de Rayos X, existe exposición mínima a radiación ionizante.</li><li>Las imágenes serán interpretadas por un radiólogo certificado.</li><li>Los resultados se entregarán en un plazo de 24 a 48 horas.</li></ul>
<p>Firma del paciente o representante: ___________________________</p>
<p><em>Versión 1.0 — Unidolor S.R.L. — Enero 2026</em></p>`,
  },
  {
    id: 'CONSENT_ENFERMERIA',
    nombre: 'Consentimiento Informado — Procedimientos de Enfermería',
    version: '1.0',
    fecha: '2026-01-15',
    obligatorio: false,
    html: `<h2>CONSENTIMIENTO INFORMADO PARA PROCEDIMIENTOS DE ENFERMERÍA</h2>
<p><strong>Unidolor S.R.L.</strong></p>
<p>Paciente: _____________ Cédula: _____________ Fecha: _____________</p>
<p>Autorizo al personal de enfermería de Unidolor S.R.L. a realizarme el procedimiento indicado.</p>
<h3>Procedimientos</h3>
<p>Canalización venosa, administración de medicamentos (IM, SC, IV), nebulizaciones, colocación/retiro de sondas, curaciones y otros procedimientos de enfermería.</p>
<h3>Información importante</h3>
<ul><li>Estos procedimientos son de bajo riesgo cuando son realizados por personal calificado.</li><li>Podrían presentarse molestias menores (dolor en el sitio de punción, hematoma).</li><li>En caso de alergia conocida a algún medicamento, informe al personal antes del procedimiento.</li></ul>
<p>Firma del paciente o representante: ___________________________</p>
<p><em>Versión 1.0 — Unidolor S.R.L. — Enero 2026</em></p>`,
  },
  {
    id: 'CONSENT_CURACION',
    nombre: 'Consentimiento Informado — Curaciones',
    version: '1.0',
    fecha: '2026-01-15',
    obligatorio: false,
    html: `<h2>CONSENTIMIENTO INFORMADO PARA CURACIONES</h2>
<p><strong>Unidolor S.R.L.</strong></p>
<p>Paciente: _____________ Cédula: _____________ Fecha: _____________</p>
<p>Autorizo al personal de enfermería de Unidolor S.R.L. a realizarme las curaciones indicadas.</p>
<h3>Información importante</h3>
<ul><li>Las curaciones consisten en la limpieza, desinfección y cubrimiento de heridas.</li><li>Se utilizarán materiales estériles y soluciones antisépticas.</li><li>El procedimiento puede causar molestias leves temporales.</li><li>Se seguirán las indicaciones médicas para frecuencia y tipo de curación.</li></ul>
<p>Firma del paciente o representante: ___________________________</p>
<p><em>Versión 1.0 — Unidolor S.R.L. — Enero 2026</em></p>`,
  },
  {
    id: 'CONSENT_TRANSFUSION',
    nombre: 'Consentimiento Informado — Transfusiones',
    version: '2.0',
    fecha: '2026-01-15',
    obligatorio: true,
    html: `<h2>CONSENTIMIENTO INFORMADO PARA TRANSFUSIONES</h2>
<p><strong>Unidolor S.R.L.</strong></p>
<p>Paciente: _____________ Cédula: _____________ Fecha: _____________</p>
<p>Yo, _________________________________________________, mayor de edad, portador(a) de la cédula de identidad N.º _________________, AUTORIZO la transfusión de sangre y/o hemoderivados indicada por mi médico tratante.</p>
<h3>1. Descripción</h3>
<p>La transfusión consiste en administrar sangre o productos derivados de la sangre por vía intravenosa.</p>
<h3>2. Beneficios</h3>
<ul><li>Restauración de la capacidad de transporte de oxígeno.</li><li>Prevención de complicaciones por anemia severa.</li></ul>
<h3>3. Riesgos</h3>
<ul><li><strong>Frecuentes:</strong> fiebre, urticaria leve.</li><li><strong>Poco frecuentes:</strong> reacción hemolítica, infección.</li><li><strong>Raros:</strong> reacción anafiláctica, sobrecarga circulatoria.</li></ul>
<h3>4. Requisitos</h3>
<ul><li>Indicación médica con diagnóstico.</li><li>Hemograma completo reciente.</li><li>Sangre autorizada por Banco de Sangre.</li><li>Pruebas cruzadas realizadas.</li><li>Cuidador responsable presente durante todo el procedimiento.</li></ul>
<p>Firma del paciente o representante: ___________________________</p>
<p>Firma del médico: ___________________________</p>
<p><em>Versión 2.0 — Unidolor S.R.L. — Enero 2026</em></p>`,
  },
];

// Mapeo código de servicio → valor del select del formulario web
export const FORM_SERVICIO_MAP = {
  CMD: 'consulta', CMC: 'consulta', CE: 'consulta', CI: 'consulta',
  PROC: 'manejo-dolor', DOL: 'manejo-dolor', BOM: 'manejo-dolor', BEL: 'manejo-dolor',
  PAL: 'cuidados-paliativos', QUIMIO: 'cuidados-paliativos',
  ENF: 'enfermeria', SV: 'enfermeria', MED: 'enfermeria', NEB: 'enfermeria',
  CUR: 'curacion', SON: 'curacion', SUE: 'curacion', MUES: 'curacion',
  HOS: 'enfermeria', ANT: 'enfermeria',
  RX: 'rayos-x',
  SONO: 'sonografia',
  DOP: 'doppler', ECG: 'doppler', ECO_CARD: 'doppler', HOL: 'doppler', MAPA: 'doppler',
  LAB: 'laboratorio',
  HEMO: 'transfusion',
  TF: 'terapia',
  PD: 'pie-diabetico',
  AM: 'otro', CPN: 'otro', CUIDA: 'otro', ACOMP: 'otro', EMP: 'otro',
  NUTRI: 'otro', ODONTO: 'otro',
};

// Etiquetas legibles para cada código de findService()
export const SERVICE_CODE_LABEL = {
  CMD: 'consulta médica', CMC: 'consulta en consultorio', CE: 'especialista (neurología, ortopedia, etc.)',
  CI: 'consulta intrahospitalaria', PROC: 'procedimiento intervencionista', DOL: 'manejo del dolor', BOM: 'bomba intratecal',
  BEL: 'bomba elastomérica', PAL: 'cuidados paliativos', QUIMIO: 'quimioterapia', ENF: 'enfermería',
  SV: 'signos vitales', MED: 'aplicación de medicamento', NEB: 'nebulización', CUR: 'curaciones',
  SON: 'sondas', SUE: 'sueros/venoclisis', MUES: 'toma de muestras', HOS: 'internamiento',
  ANT: 'antibioticoterapia', RX: 'rayos X', SONO: 'sonografía', DOP: 'doppler',
  ECG: 'electrocardiograma', ECO_CARD: 'ecocardiograma', HOL: 'holter', MAPA: 'MAPA',
  LAB: 'laboratorio clínico', HEMO: 'transfusión (Hemohogar)', TF: 'terapia física',
  AM: 'programa adulto mayor', CPN: 'cuidados paliativos neurológicos', CUIDA: 'cuidadora domiciliaria',
  ACOMP: 'acompañamiento a citas', EMP: 'programas empresariales', NUTRI: 'nutrición',
  ODONTO: 'odontología',
};

// Keywords para findService()
export const SERVICE_KEYWORDS = {
  'rayos x': 'RX', 'radiografia': 'RX', 'rx': 'RX', 'placa': 'RX',
  'sonografia': 'SONO', 'ecografia': 'SONO', 'ultrasonido': 'SONO', 'eco': 'SONO',
  'doppler': 'DOP',
  'holter': 'HOL', 'ritmo cardiaco': 'HOL',
  'mapa': 'MAPA', 'presion arterial': 'MAPA', 'monitoreo presion': 'MAPA',
  'bomba intratecal': 'BOM', 'medtronic': 'BOM', 'recarga bomba': 'BOM',
  'bomba elastomerica': 'BEL', 'infusion continua': 'BEL',
  'transfusion': 'HEMO', 'hemohogar': 'HEMO', 'hemoglobina': 'HEMO', 'sangre': 'HEMO',
  'terapia fisica': 'TF', 'rehabilitacion': 'TF', 'fisioterapia': 'TF',
  'enfermeria': 'ENF', 'enfermero': 'ENF', 'enfermera': 'ENF',
  'curaciones': 'CUR', 'cura': 'CUR', 'herida': 'CUR', 'ulcera': 'CUR', 'aposito': 'CUR',
  'inyeccion': 'MED', 'inyectable': 'MED', 'aplicar medicamento': 'MED',
  'nebulizacion': 'NEB', 'nebulizar': 'NEB', 'oxigeno': 'NEB', 'inhalacion': 'NEB',
  'sondas': 'SON', 'sonda': 'SON', 'sonda vesical': 'SON', 'foley': 'SON', 'nasogastrica': 'SON',
  'sueros': 'SUE', 'suero': 'SUE', 'venoclisis': 'SUE', 'intravenoso': 'SUE',
  'laboratorio': 'LAB', 'analisis': 'LAB', 'examen sangre': 'MUES', 'muestra': 'MUES',
  'consulta': 'CMD', 'medico a domicilio': 'CMD', 'medico domicilio': 'CMD',
  'consulta clinica': 'CMC', 'consultorio': 'CMC', 'presencial': 'CMC',
  'especialista': 'CE', 'ortopedia': 'CE', 'neurologia': 'CE',
  'dolor': 'DOL', 'paliativos': 'DOL', 'cuidados paliativos': 'DOL',
  'adulto mayor': 'AM', 'programa adulto': 'AM', 'anciano': 'AM',
  'signos vitales': 'SV', 'tomar signos': 'SV',
  'electrocardiograma': 'ECG', 'ecg': 'ECG',
  'ecocardiograma': 'ECO_CARD', 'eco cardiaco': 'ECO_CARD',
  'internamiento': 'HOS', 'hospitalizacion': 'HOS', 'ingreso': 'HOS',
  'quimioterapia': 'QUIMIO', 'oncomejorate': 'QUIMIO', 'inmunoterapia': 'QUIMIO',
  'antibiotico': 'ANT', 'antibioterapia': 'ANT',
  'nutricion': 'NUTRI', 'nutricional': 'NUTRI', 'dieta': 'NUTRI',
  'odontologia': 'ODONTO', 'dentista': 'ODONTO', 'dientes': 'ODONTO', 'muela': 'ODONTO',
  'cuidadora': 'CUIDA', 'cuidador': 'CUIDA',
  'acompanamiento': 'ACOMP', 'traslado': 'ACOMP', 'acompanante': 'ACOMP',
  'empresarial': 'EMP', 'empresa': 'EMP', 'empleados': 'EMP',
};

// Helper: buscar servicio por código
export function findServiceByCode(code) {
  for (const cat of SERVICIOS) {
    for (const s of cat.items) {
      if (s.codigo === code) return { ...s, categoria: cat.categoria };
    }
  }
  return null;
}

// Helper: buscar servicio por texto (keywords)
export function findServiceFromText(text) {
  const t = text.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  for (const [kw, code] of Object.entries(SERVICE_KEYWORDS)) {
    if (t.includes(kw)) return code;
  }
  return null;
}

// Helper: obtener todas las categorías formateadas
export function formatServicios() {
  return SERVICIOS.map(c => `${c.categoria}: ${c.items.map(s => s.nombre).join(', ')}`).join('\n');
}

// Helper: obtener motivos de contacto para el chatbot
export function getMotivosContacto() {
  return MOTIVOS_CONTACTO.map(m => `${m.id}: ${m.label}`).join('\n');
}

// Helper: clasificar motivo de contacto desde texto
export function classifyMotivo(text) {
  const t = text.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  for (const motivo of MOTIVOS_CONTACTO) {
    if (motivo.keywords.some(kw => t.includes(kw))) return motivo;
  }
  return MOTIVOS_CONTACTO.find(m => m.id === 'otro');
}
