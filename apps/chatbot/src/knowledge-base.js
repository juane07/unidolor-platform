/*
 * Lista curada de servicios (códigos estables para findService / SERVICE_CODE_LABEL).
 * Fuente manual: knowledge/conocimiento-unidolor.md. NO editar desde el sync.
 */
export const servicios = [
  {
    categoria: "Consultas Médicas",
    servicios: [
      { nombre: "Consulta médica general a domicilio", codigo: "CMD", descripcion: "Evaluación médica completa en la comodidad del hogar.", preguntar: ["Nombre del paciente", "Edad", "Cédula", "Dirección", "Síntomas o motivo de consulta", "¿Tiene seguro médico?", "¿Tiene estudios previos?"] },
      { nombre: "Consulta médica en clínica", codigo: "CMC", descripcion: "Atención especializada en nuestro consultorio con la Dra. Bethania Martínez.", preguntar: ["Nombre del paciente", "Cédula", "Motivo de consulta", "¿Tiene referimiento médico?", "¿Tiene estudios de imágenes previos?", "¿Qué seguro tiene?"] },
      { nombre: "Consulta especialista", codigo: "CE", descripcion: "Consulta con médicos especialistas en ortopedia, neurología, etc.", preguntar: ["Nombre del paciente", "Especialidad requerida", "¿Tiene referimiento?", "¿Qué estudios previos tiene?", "Motivo de consulta detallado"] },
      { nombre: "Consulta intrahospitalaria", codigo: "CI", descripcion: "Atención especializada para pacientes hospitalizados.", preguntar: ["Nombre del paciente", "Hospital donde está ingresado", "Habitación", "Médico tratante", "Diagnóstico actual"] },
    ]
  },
  {
    categoria: "Medicina del Dolor",
    servicios: [
      { nombre: "Manejo del dolor", codigo: "DOL", descripcion: "Atención especializada para pacientes con dolor crónico, oncológico o complejo. Incluye valoración, manejo farmacológico e intervencionista.", preguntar: ["Tipo de dolor (localización, intensidad, frecuencia)", "Diagnóstico de base", "Medicamentos actuales", "Médico tratante", "¿Tratamientos previos (medicamentos, procedimientos)?", "¿Tiene estudios de imágenes o laboratorios recientes?"] },
      { nombre: "Recarga de bomba intratecal (Medtronic)", codigo: "BOM", descripcion: "Recarga de bomba de infusión intratecal Medtronic en domicilio.", preguntar: ["Tipo de bomba (Medtronic u otra)", "Medicamentos habituales", "Fecha de última recarga", "¿Tiene indicación médica actualizada?", "¿Ha tenido alarmas o problemas?"] },
      { nombre: "Bomba elastomérica", codigo: "BEL", descripcion: "Dispositivo de infusión continua para administración de medicamentos.", preguntar: ["¿Qué medicamento necesita?", "¿Vía de administración?", "¿Tiene acceso venoso?", "¿Tiene indicación médica?"] },
    ]
  },
  {
    categoria: "Procedimientos Intervencionistas",
    servicios: [
      { nombre: "Procedimientos intervencionistas", codigo: "PROC", descripcion: "Bloqueos nerviosos, radiofrecuencia, rizólisis, infiltraciones, epidurales, facetarios y otros guiados por ecografía o fluoroscopia.", preguntar: ["¿Tipo de procedimiento o zona del cuerpo?", "¿Tiene indicación médica?", "¿Diagnóstico de base y médico tratante?", "¿Estudios de imágenes previos?", "¿Medicamentos actuales (anticoagulantes)?", "¿Alergias conocidas?"] },
    ]
  },
  {
    categoria: "Cuidados Paliativos",
    servicios: [
      { nombre: "Cuidados paliativos", codigo: "PAL", descripcion: "Atención especializada para pacientes con enfermedades graves o terminales. Control de síntomas, apoyo familiar, atención domiciliaria y hospitalaria.", preguntar: ["¿Dónde se requiere (domicilio o clínica)?", "¿Diagnóstico de base y médico tratante?", "¿Estado actual del paciente?", "¿Tiene cuidador familiar?", "¿Qué tipo de atención necesita? (control síntomas, sedación, apoyo)"] },
    ]
  },
  {
    categoria: "Enfermería",
    servicios: [
      { nombre: "Enfermería general a domicilio", codigo: "ENF", descripcion: "Atención de enfermería profesional. Según necesidad puede incluir curaciones, canalización, medicación, nebulizaciones, sondas, sueros, muestras, signos vitales. Modalidades 4h a 24h.", preguntar: ["¿Qué tipo de atención de enfermería necesita?", "¿Horas al día y por cuántos días (tanda)?", "¿Paciente encamado?", "¿Tiene cuidador familiar?", "¿Indicación médica vigente?", "¿Tiene los insumos o los proveemos?"] },
      { nombre: "Toma de signos vitales", codigo: "SV", descripcion: "Presión arterial, frecuencia cardíaca, temperatura, saturación de oxígeno.", preguntar: ["¿Frecuencia requerida?", "¿Tiene indicación médica?", "¿Reportar a alguien?"] },
      { nombre: "Aplicación de medicamentos", codigo: "MED", descripcion: "Administración IM, SC, IV según indicación médica.", preguntar: ["¿Qué medicamento?", "¿Dosis y vía?", "¿Tiene indicación médica?", "¿Alergias conocidas?"] },
      { nombre: "Nebulizaciones / Oxigenoterapia", codigo: "NEB", descripcion: "Administración de medicamentos inhalados y oxígeno.", preguntar: ["¿Qué medicamento nebulizar?", "¿Frecuencia de nebulizaciones?", "¿Requiere oxígeno?", "¿Tiene indicación médica?"] },
      { nombre: "Curas (simples y complejas)", codigo: "CUR", descripcion: "Curaciones de heridas, úlceras por presión, postquirúrgicas y quemaduras.", preguntar: ["¿Tipo de herida?", "¿Tiempo de evolución?", "¿Signos de infección?", "¿Frecuencia de curación (cada cuántos días)?", "¿Por cuánto tiempo?", "¿Tiene indicación médica?", "¿Tiene materiales de curación?"] },
      { nombre: "Colocación/retiro de sondas", codigo: "SON", descripcion: "Sondas vesicales (Foley), nasogástricas y de alimentación.", preguntar: ["¿Tipo de sonda?", "¿Colocar o retirar?", "¿Tiene indicación médica?", "¿Alergias conocidas?"] },
      { nombre: "Administración de sueros / antibióticos IV", codigo: "SUE", descripcion: "Canalización venosa y administración de sueros o antibióticos intravenosos.", preguntar: ["¿Qué medicamento administrar?", "¿Dosis y duración de la infusión?", "¿Tiene acceso venoso?", "¿Tiene indicación médica?"] },
      { nombre: "Extracción de muestras", codigo: "MUES", descripcion: "Toma de muestras sanguíneas y otros fluidos para análisis.", preguntar: ["¿Qué exámenes necesita?", "¿Tiene orden médica?", "¿Dónde procesar las muestras?"] },
    ]
  },
  {
    categoria: "Rayos X",
    servicios: [
      { nombre: "Rayos X a domicilio", codigo: "RX", descripcion: "Radiografía portátil digital en el hogar. Resultados en 24-48h.", preguntar: ["¿Qué área del cuerpo necesita? (tórax, columna, extremidad, abdomen)", "¿Tiene indicación médica?", "¿Está encamado o puede movilizarse?"] },
    ]
  },
  {
    categoria: "Sonografía / Ecografía",
    servicios: [
      { nombre: "Sonografía / Ecografía a domicilio", codigo: "SONO", descripcion: "Ecografía portátil. Abdominal, pélvica, renal, partes blandas.", preguntar: ["¿Qué tipo de sonografía necesita?", "¿Tiene indicación médica?", "¿Está encamado?"] },
    ]
  },
  {
    categoria: "Doppler Vascular",
    servicios: [
      { nombre: "Doppler vascular", codigo: "DOP", descripcion: "Doppler arterial, venoso, carotídeo y de extremidades.", preguntar: ["¿Qué área evaluar?", "¿Motivo del estudio? (dolor, hinchazón, várices)", "¿Tiene indicación médica?"] },
    ]
  },
  {
    categoria: "Estudios Cardíacos",
    servicios: [
      { nombre: "Electrocardiograma (ECG)", codigo: "ECG", descripcion: "Registro de actividad eléctrica del corazón. Resultados inmediatos.", preguntar: ["¿Dolor en el pecho?", "¿Palpitaciones?", "¿Tiene indicación médica?"] },
      { nombre: "Ecocardiograma", codigo: "ECO", descripcion: "Evaluación de estructura y función cardíaca por ultrasonido.", preguntar: ["¿Problemas cardíacos conocidos?", "¿Tiene indicación médica?", "¿Síntomas: falta de aire, dolor en pecho?"] },
      { nombre: "Holter (ritmo cardíaco 24h)", codigo: "HOL", descripcion: "Monitoreo continuo del ritmo cardíaco por 24 horas.", preguntar: ["¿Síntomas: palpitaciones, mareos, desmayos?", "¿Tiene indicación médica?"] },
      { nombre: "MAPA (presión arterial 24h)", codigo: "MAPA", descripcion: "Monitoreo ambulatorio de presión arterial por 24 horas.", preguntar: ["¿Diagnóstico de hipertensión?", "¿Toma medicamentos para presión?", "¿Tiene indicación médica?"] },
    ]
  },
  {
    categoria: "Laboratorio",
    servicios: [
      { nombre: "Laboratorio clínico a domicilio", codigo: "LAB", descripcion: "Toma de muestras y procesamiento en laboratorio aliado. Resultados 24-48h.", preguntar: ["¿Qué exámenes necesita?", "¿Tiene orden médica?", "¿Dónde procesamos las muestras?"] },
    ]
  },
  {
    categoria: "Hospitalización Domiciliaria",
    servicios: [
      { nombre: "Internamiento en casa", codigo: "HOS", descripcion: "Hospitalización domiciliaria con atención médica y enfermería continua.", preguntar: ["¿Diagnóstico y estado actual?", "¿Nivel de atención? (enfermería 4h, 8h, 12h, 24h)", "¿Tiene médico tratante y cuidador familiar?", "¿Qué medicamentos o equipos necesita?", "¿Tiene seguro médico?"] },
    ]
  },
  {
    categoria: "Hemohogar (Transfusiones)",
    servicios: [
      { nombre: "Transfusión domiciliaria (Hemohogar)", codigo: "HEMO", descripcion: "Transfusión de sangre y hemoderivados en domicilio o clínica. Supervisión médica.", preguntar: ["¿Dónde se realiza? (domicilio o clínica)", "¿Tiene indicación médica y hemograma reciente?", "¿Sangre autorizada por Banco de Sangre?", "¿Pruebas cruzadas realizadas?", "¿Cuenta con cuidador responsable presente?"] },
    ]
  },
  {
    categoria: "Oncomejórate (Quimioterapia)",
    servicios: [
      { nombre: "Quimioterapia en casa", codigo: "QUIMIO", descripcion: "Quimioterapia, inmunoterapia y terapias biológicas. Supervisión especializada.", preguntar: ["¿Dónde se realiza? (domicilio o clínica)", "¿Diagnóstico oncológico y protocolo?", "¿Tiene acceso venoso central? (PICC, port-a-cath)", "Médico oncólogo tratante"] },
    ]
  },
  {
    categoria: "Terapias",
    servicios: [
      { nombre: "Terapia física / Rehabilitación", codigo: "TF", descripcion: "Terapia física y rehabilitación a domicilio.", preguntar: ["¿Condición o diagnóstico?", "¿Limitación funcional?", "¿Cirugía reciente?", "¿Frecuencia deseada? (veces por semana)"] },
      { nombre: "Antibioterapia en casa", codigo: "ANT", descripcion: "Antibióticos intravenosos en domicilio.", preguntar: ["¿Qué antibiótico?", "¿Dosis y frecuencia?", "¿Tiene acceso venoso?", "Diagnóstico de la infección"] },
      { nombre: "Planes nutricionales", codigo: "NUTRI", descripcion: "Evaluación y planes nutricionales personalizados.", preguntar: ["Condición de salud", "¿Requiere nutrición enteral? (sonda)", "¿Alergias alimentarias?"] },
      { nombre: "Odontología a domicilio", codigo: "ODONTO", descripcion: "Evaluación, limpieza, extracciones y procedimientos menores.", preguntar: ["Motivo de consulta", "¿Dolor o molestia específica?", "¿Condiciones de salud preexistentes?"] },
    ]
  },
  {
    categoria: "Programas Especiales",
    servicios: [
      { nombre: "Programa Adulto Mayor", codigo: "AM", descripcion: "Evaluación geriátrica, seguimiento médico y de enfermería.", preguntar: ["Nombre del paciente", "Edad", "Condiciones de salud actuales", "¿Vive solo o acompañado?", "¿Requiere enfermería?"] },
      { nombre: "Cuidados paliativos neurológicos", codigo: "CPN", descripcion: "Para pacientes con ACV, Parkinson, Alzheimer, ELA.", preguntar: ["Diagnóstico específico", "Estado actual (encamado, movilidad)", "¿Tiene sonda, úlceras, dificultad para tragar?", "Nombre del cuidador principal"] },
      { nombre: "Cuidadora domiciliaria", codigo: "CUIDA", descripcion: "Compañía y asistencia básica para adultos mayores.", preguntar: ["Nombre del paciente", "Edad", "¿Requiere asistencia para comer, bañarse, movilizarse?", "¿Horas diarias requeridas?"] },
      { nombre: "Acompañamiento a citas médicas", codigo: "ACOMP", descripcion: "Traslado y acompañamiento a citas.", preguntar: ["Nombre del paciente", "Dirección de la cita", "Fecha y hora", "¿Requiere silla de ruedas?"] },
    ]
  },
  {
    categoria: "Programas Empresariales",
    servicios: [
      { nombre: "Programas empresariales", codigo: "EMP", descripcion: "Evaluaciones médicas, programas preventivos, jornadas, salud ocupacional.", preguntar: ["¿Qué tipo de programa necesita?", "Cantidad de empleados", "¿En sus instalaciones?", "Nombre de empresa, contacto, teléfono"] },
    ]
  }
];
