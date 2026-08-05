/*
 * ============================================================
 *  UNIDOLOR — Base de Conocimiento
 *  Fuente de verdad: knowledge/conocimiento-unidolor.md
 *  Config interna (keywords, intents): knowledge/chatbot-config.md
 * ============================================================
 *
 *  Categorías de servicio (findService() busca por keywords):
 *  ─────────────────────────────────────────────────────
 *    CON  — Consultas Médicas
 *    DOL  — Medicina del Dolor
 *    PROC — Procedimientos Intervencionistas
 *    PAL  — Cuidados Paliativos
 *    ENF  — Enfermería
 *    RX   — Rayos X
 *    SONO — Sonografía / Ecografía
 *    DOP  — Doppler Vascular
 *    CAR  — Estudios Cardíacos (ECG, Holter, MAPA, Eco)
 *    LAB  — Laboratorio Clínico
 *    HOS  — Hospitalización Domiciliaria
 *    HEMO — Hemohogar (Transfusiones)
 *    QMA  — Oncomejórate (Quimioterapia)
 *    TER  — Terapias
 *    ESP  — Programas Especiales
 *    EMP  — Programas Empresariales
 * ============================================================
 */

import { SITE_URL } from './knowledge.js';

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

export const faq = [
  { pregunta: "¿Cómo agendo una cita?", respuesta: "Puede agendar llamando al 809-636-3656 o enviando un WhatsApp al mismo número. También puede hacerlo a través de esta conversación. Necesitaremos: nombre completo, cédula, edad, dirección, teléfono y servicio requerido.", intencion: "agendar_cita" },
  { pregunta: "¿Cuánto cuesta una consulta?", respuesta: "Consulta en clínica (primera vez y subsecuentes): RD$5,000. Consulta a domicilio y otros servicios: se cotizan personalizados según ubicación, materiales y personal. Un asesor se comunicará para darle la cotización.", intencion: "precio" },
  { pregunta: "¿Qué seguros/ARS aceptan?", respuesta: "Tenemos convenio directo con Bupa, Meta Salud, APS, Monumental y Aetna La Colonia. Si su seguro no está en esa lista, podemos emitirle una carta y factura para que solicite reembolso a su aseguradora. ¿Qué seguro tiene?", intencion: "seguro" },
  { pregunta: "¿Cuál es el horario de atención?", respuesta: "Clínica: lunes a viernes 8:00am-5:00pm, sábados 8:00am-12:00pm. Domicilio: lunes a viernes 8:00am-6:00pm, sábados disponibilidad limitada. Domingos no laboramos.", intencion: "horario" },
  { pregunta: "¿Hacen visitas a domicilio?", respuesta: "Sí, todos nuestros servicios están disponibles a domicilio en Santo Domingo, Nagua, Terrenas, Santiago y zonas aledañas. Solo debe indicarnos su dirección.", intencion: "domicilio" },
  { pregunta: "¿Qué zonas cubren?", respuesta: "Cubrimos Santo Domingo, Nagua, Terrenas, Santiago y zonas aledañas. Consúltenos por su ubicación específica.", intencion: "cobertura" },
  { pregunta: "¿Cómo puedo pagar?", respuesta: "Aceptamos efectivo, transferencia bancaria (BanReservas cuenta 9600601779, Unidolor SRL, RNC 131080219), tarjeta de débito/crédito y cheque. Pagos antes de las 4:00pm se procesan el mismo día.", intencion: "pago" },
  { pregunta: "¿Entregan resultados de laboratorio?", respuesta: "Sí, se entregan en 24 a 48 horas después del servicio, vía WhatsApp y correo electrónico. También puede retirar físicamente en nuestra oficina.", intencion: "resultados" },
  { pregunta: "¿Necesito orden médica para transfusión?", respuesta: "Sí. Requisitos: indicación médica, hemograma reciente, sangre autorizada por el Banco de Sangre, pruebas cruzadas realizadas, y un cuidador responsable presente durante todo el procedimiento.", intencion: "transfusion" },
  { pregunta: "¿Necesito orden médica para rayos X?", respuesta: "Sí, para Rayos X a domicilio se requiere indicación médica. Solo necesitamos la orden y sus datos para coordinar la visita.", intencion: "rayosx" },
  { pregunta: "¿Qué son los cuidados paliativos?", respuesta: "Atención médica especializada para pacientes con enfermedades graves o terminales. El objetivo es controlar el dolor y mejorar la calidad de vida del paciente y su familia.", intencion: "paliativos" },
  { pregunta: "¿Dónde están ubicados?", respuesta: "Estamos en Ave. Gustavo Mejía Ricart No.54, Torre Solazar, Piso 3, Local 3F, Ensanche Naco, Santo Domingo.", intencion: "ubicacion" },
  { pregunta: "¿Puedo cancelar o reprogramar?", respuesta: "No ofrecemos reembolsos. Al cancelar o cambiar un servicio, se otorga un crédito por el monto pagado, utilizable exclusivamente para futuros servicios dentro de los siguientes 6 meses. Para servicios continuos (ej. enfermería 24/7) se requiere aviso con al menos 1 mes de anticipación. Se sugiere cancelar con la mayor antelación posible.", intencion: "cancelacion" },
  { pregunta: "¿Me devuelven el dinero?", respuesta: "No ofrecemos reembolsos en efectivo. En su lugar, proporcionamos un crédito por el monto pagado, utilizable exclusivamente para futuros servicios dentro de los siguientes 6 meses.", intencion: "reembolso" },
  { pregunta: "¿Puedo dejar el dinero en fondo o como balance?", respuesta: "Sí. Al cancelar, el monto se convierte en crédito para futuros servicios, válido por 6 meses. No hay reembolsos en efectivo.", intencion: "balance_favor" },
  { pregunta: "¿Cómo reprogramo una cita?", respuesta: "Puede reprogramar su cita contactándonos. Cancelaremos la cita original y le ofreceremos nuevos horarios disponibles. Se sugiere reprogramar con mínimo 24 horas de antelación.", intencion: "reprogramacion" },
  { pregunta: "¿Qué servicios de enfermería ofrecen?", respuesta: "Enfermería profesional en domicilio. Según la necesidad puede incluir curaciones, canalización venosa, aplicación de medicamentos, nebulizaciones, sondas, sueros, extracción de muestras y toma de signos vitales. Modalidades desde 4h hasta 24h.", intencion: "enfermeria" },
  { pregunta: "¿Ofrecen terapia física?", respuesta: "Sí, contamos con terapia física y rehabilitación a domicilio. El fisioterapeuta visita al paciente, evalúa su condición y realiza el tratamiento según sus necesidades.", intencion: "terapia" },
  { pregunta: "¿Qué necesito para agendar?", respuesta: "Nombre completo del paciente, cédula, edad, dirección exacta con referencia, teléfono de contacto, seguro médico (si tiene), y el servicio que necesita.", intencion: "requisitos" },
  { pregunta: "¿Atienden emergencias?", respuesta: "No somos un servicio de emergencias 24h. Si es una emergencia (dolor intenso, sangrado, dificultad para respirar, pérdida de conciencia), acuda a la sala de urgencias más cercana o llame al 911.", intencion: "emergencia" },
  { pregunta: "¿Cuánto dura la consulta?", respuesta: "La consulta médica a domicilio suele durar entre 30 y 60 minutos, dependiendo de la complejidad del caso.", intencion: "duracion" },
  { pregunta: "¿Necesito preparación para sonografía?", respuesta: "Depende del tipo: sonografía abdominal requiere ayuno 6-8h; sonografía pélvica requiere vejiga llena (tomar agua y no orinar); renal no requiere preparación especial.", intencion: "sonografia_prep" },
  { pregunta: "¿Cómo consigo una receta controlada?", respuesta: "Envíe un WhatsApp al 809-636-3656 con foto de la cédula del beneficiario y especificando el medicamento. Si el paciente fue visto hace más de 3 meses, debe realizar una nueva consulta.", intencion: "receta" },
  { pregunta: "¿Realizan hospitalización en casa?", respuesta: "Sí, ofrecemos internamiento en casa con atención médica y de enfermería continua. Modalidades desde 4h hasta 24h, incluyendo hospitalización domiciliaria completa.", intencion: "hospitalizacion" },
  { pregunta: "¿Ofrecen quimioterapia a domicilio?", respuesta: "Sí, a través de nuestro programa Oncomejórate®. Administramos quimioterapia, inmunoterapia y terapias biológicas en domicilio o clínica con supervisión especializada.", intencion: "quimioterapia" },
  { pregunta: "¿Tienen planes para empresas?", respuesta: "Sí, ofrecemos programas empresariales: evaluaciones médicas, jornadas de salud, salud ocupacional, ergonomía y charlas. Consulte para más información.", intencion: "empresarial" },
  { pregunta: "¿Cómo pido una factura?", respuesta: "La facturación se gestiona por el departamento de Contabilidad. Un asesor se comunicará con usted para enviar la factura o recibo correspondiente.", intencion: "factura" },
  { pregunta: "¿Cómo agendar por Nimbo?", respuesta: "Las citas se gestionan a través del chatbot o un asesor humano. No es necesario acceder directamente a la plataforma Nimbo.", intencion: "nimbo" },
  { pregunta: "¿Quién maneja la contabilidad?", respuesta: "El departamento de Contabilidad gestiona facturas y pagos. Un asesor derivará su consulta al área correspondiente.", intencion: "contabilidad" },
  { pregunta: "¿Cómo contacto a RRHH?", respuesta: "RRHH (Yolanda Del Rosario) gestiona temas de personal y empleo. Un asesor derivará su consulta al área correspondiente.", intencion: "rrhh" },
  { pregunta: "¿Dra. Bethania atiende fines de semana?", respuesta: "Dra. Bethania Martínez atiende miércoles y jueves de 8:00am a 6:00pm en Santo Domingo (Torre Solazar). Para otras fechas, consulte disponibilidad.", intencion: "doctor" },
];

export const politicas = {
  pago: { metodo: "Efectivo, transferencia bancaria, tarjeta (débito/crédito), cheque", cuenta: "9600601779", banco: "Banco de Reservas", titular: "Unidolor SRL", tipo: "Cuenta Corriente", rnc: "131080219" },
  programacion: { plazo: "24 a 48 horas después de confirmación", corte_diario: "4:00 pm", detalle: "Pagos antes de las 4:00 pm se procesan para programación del día siguiente." },
  resultados: { plazo: "24 a 48 horas", envio: "WhatsApp y correo electrónico", retiro_fisico: "Ave. Gustavo Mejía Ricart No.54, Torre Solazar, Piso 3, Local 3F" },
  cancelacion: { politica: "No ofrecemos reembolsos en efectivo. En su lugar, proporcionamos un crédito por el monto pagado, el cual podrá ser utilizado exclusivamente para futuros servicios dentro de los siguientes 6 meses. Para servicios continuos (ej. enfermería 24/7) se requiere aviso con al menos 1 mes de anticipación.", cotizacion_vigencia: "15 días" },
  oficinas: ["Ave. Gustavo Mejía Ricart No.54, Torre Solazar, Piso 3, Local 3F, Ensanche Naco"]
};

export const horarios = {
  clinica: { lunes_a_viernes: "8:00am - 5:00pm", sabado: "8:00am - 12:00pm", domingo: "Cerrado" },
  domicilio: { lunes_a_viernes: "8:00am - 6:00pm", sabado: "Disponibilidad limitada", domingo: "No laboramos" },
  corte_pago: "4:00 pm",
  programacion_servicios: "24 a 48 horas",
  entrega_resultados: "24 a 48 horas",
  zonas_cobertura: ["Santo Domingo", "Nagua", "Terrenas", "Santiago", "Zonas aledañas"],
  contactos: {
    telefonos: ["809-636-3656", "829-263-4143"],
    emails: ["info@unidolor.com.do", "info@mejorateencasa.com"],
    websites: ["www.unidolor.com.do", "www.mejorateencasa.com"],
  }
};

export const CHUNKS_EJEMPLOS = [
  'Cliente: Buenas tardes, ¿hacen visita a domicilio?\nAsistente: Sí, en Santo Domingo, Nagua, Terrenas y Santiago. ¿Su dirección?',
  'Cliente: ¿Cuánto cuesta una consulta?\nAsistente: Se cotiza de forma personalizada. Tiene 2 opciones: 1) llenar el formulario web aquí ${SITE_URL}/solicitud (más rápido), o 2) le tomo los datos por aquí con un asesor. ¿Cómo prefiere?',
  'Cliente: Tengo seguro Humano\nAsistente: Tenemos convenio con Bupa, La Colonial, Meta Salud, APS, Monumental y Aetna. Para otros emitimos carta de reembolso. ¿Su número de afiliado?',
  'Cliente: ¿Necesito orden médica?\nAsistente: Para Rayos X, sonografía y laboratorio sí. Para consulta no.',
  'Cliente: Mi mamá está encamada y necesita enfermería\nAsistente: Entendido. ¿Qué atención necesita y cuántas horas al día? ¿Tiene indicación médica?',
  'Cliente: ¿Duele?\nAsistente: Son procedimientos mínimamente invasivos con anestesia local. El médico le explicará.',
  'Cliente: ¿Diferencia entre cuidados paliativos y curativos?\nAsistente: Los paliativos enfocan calidad de vida y control de síntomas, no curar la enfermedad.',
  'Cliente: Hola\nAsistente: Bienvenido a UNIDOLOR. ¿En qué puedo ayudarle?',
  'Cliente: Quiero una visita para mi mamá\nAsistente: Claro. ¿Nombre completo y cédula de su mamá?',
];

export function findService(text) {
  const t = text.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  const keywords = {
    'rayos x': 'RX', 'radiografia': 'RX', 'rx': 'RX', 'placa': 'RX',
    'sonografia': 'SONO', 'ecografia': 'SONO', 'ultrasonido': 'SONO', 'eco': 'SONO',
    'doppler': 'DOP',
    'holter': 'HOL', 'ritmo cardiaco': 'HOL',
    'mapa': 'MAPA', 'presion arterial': 'MAPA', 'monitoreo presion': 'MAPA',
    'bomba intratecal': 'BOM', 'medtronic': 'BOM', 'recarga bomba': 'BOM',
    'bomba elastomerica': 'BEL', 'infusion continua': 'BEL',
    'transfusion': 'HEMO', 'hemohogar': 'HEMO', 'hemoglobina': 'HEMO', 'sangre': 'HEMO',
    'pie diabetico': 'PD', 'ulcera diabetico': 'PD',
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
    'paquete': 'PAQ', 'combo': 'PAQ', 'integral': 'PAQ',
    'cirugia': 'PD',
    'signos vitales': 'SV', 'tomar signos': 'SV',
    'electrocardiograma': 'ECG', 'ecg': 'ECG',
    'ecocardiograma': 'ECO', 'eco cardiaco': 'ECO',
    'internamiento': 'HOS', 'hospitalizacion': 'HOS', 'ingreso': 'HOS',
    'quimioterapia': 'QUIMIO', 'oncomejorate': 'QUIMIO', 'inmunoterapia': 'QUIMIO',
    'antibiotico': 'ANT', 'antibioterapia': 'ANT',
    'dialisis': 'DP', 'dialisis peritoneal': 'DP',
    'nutricion': 'NUTRI', 'nutricional': 'NUTRI', 'dieta': 'NUTRI',
    'odontologia': 'ODONTO', 'dentista': 'ODONTO', 'dientes': 'ODONTO', 'muela': 'ODONTO',
    'postquirurgico': 'POST', 'post operatorio': 'POST', 'post cirugia': 'POST',
    'cuidadora': 'CUIDA', 'cuidador': 'CUIDA',
    'acompanamiento': 'ACOMP', 'traslado': 'ACOMP', 'acompanante': 'ACOMP',
    'receta': 'RECETA', 'receta controlada': 'RECETA',
  };
  for (const [kw, code] of Object.entries(keywords)) {
    if (t.includes(kw)) return code;
  }
  return null;
}

// Etiqueta legible para cada código de findService() (usada en el checklist de datos)
export const SERVICE_CODE_LABEL = {
  CMD: 'consulta médica', CMC: 'consulta en consultorio', CE: 'especialista (neurología, ortopedia, etc.)',
  CI: 'consulta infantil', PROC: 'procedimiento', DOL: 'manejo del dolor', BOM: 'bomba intratecal',
  BEL: 'bomba elastomérica', PAL: 'cuidados paliativos', QUIMIO: 'quimioterapia', ENF: 'enfermería',
  SV: 'signos vitales', MED: 'aplicación de medicamento', NEB: 'nebulización', CUR: 'curaciones',
  SON: 'sondas', SUE: 'sueros/venoclisis', MUES: 'toma de muestras', HOS: 'internamiento',
  ANT: 'antibioticoterapia', RX: 'rayos X', SONO: 'sonografía', DOP: 'doppler',
  ECG: 'electrocardiograma', ECO: 'ecocardiograma', HOL: 'holter', MAPA: 'MAPA',
  LAB: 'laboratorio clínico', HEMO: 'transfusión (Hemohogar)', TF: 'terapia física',
  PD: 'pie diabético', AM: 'programa adulto mayor', PAQ: 'paquete integral', DP: 'diálisis',
  POST: 'cuidado postquirúrgico', CUIDA: 'cuidadora', ACOMP: 'acompañamiento',
  NUTRI: 'nutrición', ODONTO: 'odontología', RECETA: 'receta',
};

// Detección determinística (a nivel de código) de los datos que el cliente ya entregó.
// Escanea los mensajes del cliente y devuelve un objeto con los campos encontrados.
// Se inyecta en el prompt para que el LLM NUNCA vuelva a pedir un dato ya dado.
export function detectFields(userMessages) {
  const fields = { nombre: null, cedula: null, servicio: null, servicioLabel: null, direccion: null, telefono: null, seguro: null, afiliado: null, email: null, fecha_nacimiento: null, genero: null, sucursal: null, notas: null, requisitos: null, caller_name: null, caller_phone: null, patient_name: null, patient_phone: null, relationship: null };
  if (!userMessages) return fields;

  // Nombre aceptable = no es dirección, empresa, teléfono, cédula ni cadena vacía/numérica
  const isName = (value) => {
    if (!value) return null;
    const v = String(value).trim();
    if (!v || v.length < 3 || v.length > 60) return null;
    if (/^\d+$/.test(v)) return null;
    if (/^\d{3}[\s.-]?\d{7}[\s.-]?\d$/.test(v)) return null;
    if (/^(calle|av\.|avenida|avda|torre|torres|edificio|edif\.|sector|ensanche|apartamento|apto|apt\.|residencial|urbanizaci|plaza|centro|carretera|km|no\.|#)\b/i.test(v) || /^\d/.test(v)) return null;
    if (/\b(banco|seguro|ars|humano|universal|popular|reservas|central|humana|mapfre|palic|senasa|bupa|monumental|metasalud|metal salud|colonial)\b/i.test(v)) return null;
    return v;
  };

  for (const msg of userMessages) {
    if (!msg) continue;
    const t = msg.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');

    if (!fields.telefono) {
      const m = msg.match(/(?:\(?\+?1?\)?[\s-]?)?\(?8\d{2}\)?[\s-]?\d{3}[\s-]?\d{4}/);
      if (m) {
        const clean = m[0].replace(/\D/g, '');
        // Intercambio = dígitos 4-6 (con código país) o 3-5 (sin él). Rechazar 555.
        const body = clean.startsWith('1') && clean.length === 11 ? clean.slice(1) : clean;
        const exchange = body.slice(3, 6);
        const validLen = body.length === 10;
        if (validLen && exchange !== '555' && !/5555/.test(body)) {
          fields.telefono = m[0].trim();
        }
      }
    }
    if (!fields.cedula) {
      const c = msg.match(/\b\d{3}[\s.-]?\d{7}[\s.-]?\d\b/) || msg.match(/\b\d{11}\b/);
      if (c) fields.cedula = c[0];
    }
    if (!fields.direccion && (
      /(?:vivo en|vive en|direccion|domicilio en|calle|avenida|avda|carretera|sector|ensanche|residencial|urbanizaci|edificio|torre|apto|apartamento|km|#)/i.test(msg)
      || (/(?:santo domingo|sto dgo|nagua|santiago|terrenas|bonao|san pedro|la romana|boca chica|los alcarrizos|haina|san cristobal)/i.test(t) && /\d/.test(msg))
    )) {
      fields.direccion = msg
        .trim()
        .replace(/^(?:mi\s+)?(?:direcci[oó]n(?:\s+es)?|domicilio\s+en|vivo\s+en|vive\s+en|yo\s+vivo\s+en|resido\s+en)\s*(?:en\s+|en\s+la\s+|en\s+el\s+|la\s+|el\s+)?[:\-]?\s*/i, '')
        .replace(/\s+[A-ZÁÉÍÓÚÑ]{2,}$/, '')
        .replace(/[.!;]*$/, '')
        .trim();
    }
    if (!fields.nombre) {
      const intro = msg.match(/(?:me llamo|mi nombre es|soy|llámame|me dicen)\s+([A-ZÁÉÍÓÚÑ][a-záéíóúñ]+(?:\s+[A-ZÁÉÍÓÚÑ][a-záéíóúñ]+)+)/i);
      if (intro) {
        const n = isName(intro[1]);
        if (n) fields.nombre = n;
      } else if (fields.cedula) {
        const antes = msg.replace(new RegExp(fields.cedula.replace(/[-.]/g, '\\$&'), 'g'), '').trim();
        const caps = antes.split(/\s+/).filter(w => /^[A-ZÁÉÍÓÚÑ]/.test(w));
        if (caps.length >= 2) {
          const candidato = caps.slice(0, 3).join(' ');
          const n = isName(candidato);
          if (n) fields.nombre = n;
        }
      }
    }
    // Catch "Le habla la Sra/Nombre", "Y quien le habla...", "Nombre tel X", etc.
    if (!fields.nombre) {
      // Pattern: "Le habla la Sra Magaly Díaz", "Y quien le habla su esposa Sra Magaly Díaz"
      const spoken = msg.match(/(?:le\s+habla|y\s+quien\s+le\s+habla|es|soy)\s+(?:la\s+)?(?:su\s+(?:esposa|esposo)\s+)?(?:sra?\.?|sr?\.?|don|doña)\s+([A-ZÁÉÍÓÚÑ][a-záéíóúñ]+\s+[A-ZÁÉÍÓÚÑ][a-záéíóúñ]+)(?:\s+[A-ZÁÉÍÓÚÑ][a-záéíóúñ]+)?(?:\s|$|,|\.|;)/i);
      if (spoken) {
        const n = isName(spoken[1]);
        if (n) fields.nombre = n;
      } else {
        const relative = msg.match(/(?:mi\s+(?:esposa|esposo|madre|padre|hijo|hija|familiar)\s+(?:es|se\s+llama))\s+([A-ZÁÉÍÓÚÑ][a-záéíóúñ]+\s+[A-ZÁÉÍÓÚÑ][a-záéíóúñ]+)(?:\s+[A-ZÁÉÍÓÚÑ][a-záéíóúñ]+)?(?:\s|$|,|\.|;)/i);
        if (relative) {
          const n = isName(relative[1]);
          if (n) fields.nombre = n;
        }
      }
    }
    // Pattern: "Magaly Díaz 809-7080241" - name followed by phone at start of message
    if (!fields.nombre && fields.telefono) {
      const namePhone = msg.match(/^([A-ZÁÉÍÓÚÑ][a-záéíóúñ]+\s+[A-ZÁÉÍÓÚÑ][a-záéíóúñ]+)(?:\s+[A-ZÁÉÍÓÚÑ][a-záéíóúñ]+)?\s+\d/);
      if (namePhone) {
        const n = isName(namePhone[1]);
        if (n) fields.nombre = n;
      }
    }
    if (!fields.seguro && /(?:seguro|ars\b|universal|humano|mapfre|palic|senasa|banco central|futuro|renacer|simag|metal salud|sib\b|monumental|bupa|colonial|aetna|aps\b)/i.test(msg)) {
      const seg = msg.match(/(?:seguro|ars)\s*(?:de\s+)?\s*[:\-]?\s*([A-Za-zÁÉÍÓÚÑáéíóúñ][A-Za-zÁÉÍÓÚÑáéíóúñ\s]*?)(?:\s*(?:afiliado|nro|numero|con\s+afiliado|,\s*afiliado)|$)/i);
      const cleaned = seg ? seg[1].trim() : msg.replace(/^tengo\s+/i, '').trim();
      if (cleaned.length <= 40) {
        fields.seguro = cleaned.replace(/[.,;]+$/,'');
      }
    }
    if (!fields.afiliado && /(?:afiliado|numero de afiliado|número de afiliado|nro\.?\s*afiliado)/i.test(msg)) {
      const af = msg.match(/(?:afiliado|nro\.?\s*afiliado|numero de afiliado|número de afiliado)\s*:?\s*([A-Z0-9-]+)/i);
      if (af) fields.afiliado = af[1].trim();
    }
    if (!fields.email) {
      const em = msg.match(/[\w.+-]+@[\w-]+\.[\w.-]+/);
      if (em) fields.email = em[0].trim();
    }
    if (!fields.fecha_nacimiento) {
      const fn = msg.match(/\b(\d{1,2}[\/\-]\d{1,2}[\/\-]\d{4})\b/);
      if (fn) fields.fecha_nacimiento = fn[1].trim();
    }
    if (!fields.genero && /(?:sexo|genero|género)\s*:?\s*(masculino|femenino|m|f)/i.test(msg)) {
      const g = msg.match(/(?:sexo|genero|género)\s*:?\s*(masculino|femenino|m|f)/i);
      if (g) fields.genero = g[1].charAt(0).toUpperCase() + g[1].slice(1).toLowerCase();
    }
    if (!fields.sucursal && /(?:sucursal|sede|clinica|clínica)\s*:?\s*(santo domingo|terrenas|mejorate)/i.test(msg)) {
      const s = msg.match(/(?:sucursal|sede|clinica|clínica)\s*:?\s*(santo domingo|terrenas|mejorate)/i);
      if (s) fields.sucursal = s[1].charAt(0).toUpperCase() + s[1].slice(1).toLowerCase();
    }
    // Detectar si agendan PARA OTRA PERSONA: "para mi esposo Sr X", "es para mi madre", "para su hijo"
    if (!fields.relationship && /(?:para\s+mi|es\s+para|es\s+mi|para\s+su|de\s+mi|de\s+su|por\s+mi)\s+(?:esposo|esposa|madre|padre|hijo|hija|abuela|abuelo|hermano|hermana|t[ií]o|t[ií]a|familiar|paciente|nieto|nieta|sobrino|sobrina)/i.test(msg)) {
      const rel = msg.match(/(?:para\s+mi|es\s+para|es\s+mi|para\s+su|de\s+mi|de\s+su|por\s+mi)\s+(esposo|esposa|madre|padre|hijo|hija|abuela|abuelo|hermano|hermana|t[ií]o|t[ií]a|familiar|paciente|nieto|nieta|sobrino|sobrina)/i);
      if (rel) fields.relationship = rel[1].toLowerCase();
      if (!fields.patient_name) {
        // Nombre del paciente tras el parentesco (captura sensible a mayúsculas)
        const afterRel = msg.match(new RegExp('(?:esposo|esposa|madre|padre|hijo|hija|abuela|abuelo|hermano|hermana|t[ií]o|t[ií]a|familiar|paciente|nieto|nieta|sobrino|sobrina)(?:\\s+(?:que\\s+)?(?:se\\s+llama|llamado|llamada))?\\s+(?:(?:el|la)\\s+)?(?:(?:sr\\.?|sra\\.?|don|do[ñn]a|lic\\.?|dr\\.?|dra\\.?)\\s+)?([A-ZÁÉÍÓÚÑ][a-záéíóúñ]+(?:\\s+[A-ZÁÉÍÓÚÑ][a-záéíóúñ]+){0,3})'));
        if (afterRel) {
          const candidato = afterRel[1]
            .replace(/^(?:el|la|sr\.?|sra\.?|don|do[ñn]a|lic\.?|dr\.?|dra\.?)\s+/i, '')
            .trim();
          const n = isName(candidato);
          if (n) fields.patient_name = n;
        }
      }
    }
    if (!fields.notas && msg.length > 20 && !fields.servicio) {
      // If message is long and not a service request, might be notes
      fields.notas = msg.trim();
    }
    if (!fields.servicio) {
      const code = findService(msg);
      if (code) {
        fields.servicio = code;
        fields.servicioLabel = SERVICE_CODE_LABEL[code] || code;
      }
    }
  }
  // Si no se capturó nombre pero sí paciente (agendan para otra persona), promoverlo
  if (!fields.nombre && fields.patient_name) {
    fields.nombre = fields.patient_name;
  }
  return fields;
}

// Mapea código de servicio (findService) → valor del <select> del formulario web /solicitud
export const FORM_SERVICIO_MAP = {
  'CMD': 'consulta', 'CMC': 'consulta', 'CE': 'consulta', 'CI': 'consulta',
  'PROC': 'manejo-dolor', 'DOL': 'manejo-dolor', 'BOM': 'manejo-dolor', 'BEL': 'manejo-dolor',
  'PAL': 'cuidados-paliativos', 'QUIMIO': 'cuidados-paliativos',
  'ENF': 'enfermeria', 'SV': 'enfermeria', 'MED': 'enfermeria', 'NEB': 'enfermeria',
  'CUR': 'curacion', 'SON': 'curacion', 'SUE': 'curacion', 'MUES': 'curacion',
  'HOS': 'enfermeria', 'ANT': 'enfermeria',
  'RX': 'rayos-x',
  'SONO': 'sonografia',
  'DOP': 'doppler', 'ECG': 'doppler', 'ECO': 'doppler', 'HOL': 'doppler', 'MAPA': 'doppler',
  'LAB': 'laboratorio',
  'HEMO': 'transfusion',
  'TF': 'terapia',
  'PD': 'pie-diabetico',
  'AM': 'otro', 'PAQ': 'otro', 'DP': 'otro', 'POST': 'otro', 'CUIDA': 'otro',
  'ACOMP': 'otro', 'RECETA': 'otro', 'NUTRI': 'otro', 'ODONTO': 'otro',
};

export const FORM_SERVICIO_LABELS = {
  consulta: 'Consulta médica a domicilio',
  'rayos-x': 'Rayos X a domicilio',
  sonografia: 'Sonografía / Eco',
  doppler: 'Doppler / Holter / MAPA',
  enfermeria: 'Enfermería a domicilio',
  terapia: 'Terapia física',
  laboratorio: 'Laboratorio clínico',
  transfusion: 'Transfusiones (Hemohogar)',
  curacion: 'Curaciones / Nebulizaciones',
  'manejo-dolor': 'Manejo del dolor / Bomba intratecal',
  'cuidados-paliativos': 'Cuidados paliativos',
  'pie-diabetico': 'Cirugía de pie diabético',
};

export function getFormServicioValue(code) {
  return code ? (FORM_SERVICIO_MAP[code] || null) : null;
}

export function getFormServicioLabel(value) {
  return value ? (FORM_SERVICIO_LABELS[value] || value) : '';
}

// Campos adicionales que el formulario /solicitud muestra según el servicio seleccionado.
// `requiere_orden: true` → se pregunta por la indicación/orden médica (obligatoria para
// Rayos X, sonografía, EKG/Doppler/Holter/MAPA, laboratorio, transfusiones, pie diabético).
export const FORM_REQUISITOS = {
  consulta: {
    titulo: 'Información para su consulta',
    campos: [
      { id: 'motivo', label: 'Motivo de la consulta', placeholder: 'Síntomas o razón de la visita' },
      { id: 'estudios_previos', label: '¿Tiene estudios previos?', placeholder: 'Radiografías, laboratorios, etc.' },
    ],
  },
  'rayos-x': {
    titulo: 'Requisitos para Rayos X',
    requiere_orden: true,
    campos: [
      { id: 'area', label: '¿Qué área del cuerpo necesita?', placeholder: 'Tórax, columna, extremidad, abdomen...' },
      { id: 'movilidad', label: 'Movilidad del paciente', tipo: 'select', opciones: ['Encamado', 'Se moviliza con ayuda', 'Se moviliza solo'] },
    ],
  },
  sonografia: {
    titulo: 'Requisitos para Sonografía',
    requiere_orden: true,
    campos: [
      { id: 'tipo', label: '¿Qué tipo de sonografía necesita?', placeholder: 'Abdominal, pélvica, renal, partes blandas...' },
      { id: 'preparacion', label: '¿Requirió preparación (ayuno, vejiga llena)?', tipo: 'select', opciones: ['Sí, ya está preparado', 'No, no lo sabía'] },
    ],
  },
  doppler: {
    titulo: 'Requisitos para estudios cardíacos / Doppler',
    requiere_orden: true,
    campos: [
      { id: 'tipo_estudio', label: '¿Qué estudio necesita?', placeholder: 'ECG, Ecocardiograma, Doppler, Holter, MAPA...' },
      { id: 'sintomas', label: '¿Presenta síntomas?', placeholder: 'Dolor en el pecho, palpitaciones, mareos...' },
    ],
  },
  enfermeria: {
    titulo: 'Información para enfermería',
    campos: [
      { id: 'tipo_atencion', label: '¿Qué atención necesita?', placeholder: 'Curación, inyección, nebulización, sondas, sueros...' },
      { id: 'horas', label: '¿Horas al día y por cuántos días?', placeholder: 'Ej: turno 4h, 8h, 12h, 24h' },
      { id: 'encamado', label: '¿El paciente está encamado?', tipo: 'select', opciones: ['Sí', 'No'] },
    ],
  },
  terapia: {
    titulo: 'Información para terapia física',
    campos: [
      { id: 'condicion', label: '¿Condición o diagnóstico?', placeholder: 'Ej: post cirugía, dolor lumbar...' },
      { id: 'frecuencia', label: '¿Frecuencia deseada?', placeholder: 'Ej: 3 veces por semana' },
    ],
  },
  laboratorio: {
    titulo: 'Requisitos para laboratorio',
    requiere_orden: true,
    campos: [
      { id: 'examenes', label: '¿Qué exámenes necesita?', placeholder: 'Hemograma, glicemia, perfil lipídico...' },
      { id: 'ayuno', label: '¿Requirió ayuno?', tipo: 'select', opciones: ['Sí', 'No', 'No sé'] },
    ],
  },
  transfusion: {
    titulo: 'Requisitos para transfusión (Hemohogar)',
    requiere_orden: true,
    campos: [
      { id: 'sangre_autorizada', label: '¿La sangre está autorizada por el Banco de Sangre?', tipo: 'select', opciones: ['Sí', 'No', 'No sé'] },
      { id: 'pruebas_cruzadas', label: '¿Tiene pruebas cruzadas realizadas?', tipo: 'select', opciones: ['Sí', 'No'] },
      { id: 'cuidador', label: '¿Contará con un cuidador responsable presente?', tipo: 'select', opciones: ['Sí', 'No'] },
    ],
  },
  curacion: {
    titulo: 'Información para curaciones',
    campos: [
      { id: 'tipo_herida', label: '¿Qué tipo de herida?', placeholder: 'Herida quirúrgica, úlcera por presión, quemadura...' },
      { id: 'frecuencia', label: '¿Cada cuántos días se realiza la curación?', placeholder: 'Ej: cada 2 días' },
    ],
  },
  'manejo-dolor': {
    titulo: 'Información para manejo del dolor',
    campos: [
      { id: 'tipo_dolor', label: '¿Tipo de dolor?', placeholder: 'Localización, intensidad, frecuencia' },
      { id: 'diagnostico', label: '¿Diagnóstico de base?', placeholder: 'Enfermedad o condición que causa el dolor' },
      { id: 'medico', label: '¿Médico tratante?', placeholder: 'Nombre del médico' },
    ],
  },
  'cuidados-paliativos': {
    titulo: 'Información para cuidados paliativos',
    campos: [
      { id: 'diagnostico', label: '¿Diagnóstico de base y médico tratante?', placeholder: 'Diagnóstico y médico' },
      { id: 'estado', label: '¿Estado actual del paciente?', placeholder: 'Breve descripción' },
      { id: 'lugar', label: '¿Dónde se requiere la atención?', tipo: 'select', opciones: ['Domicilio', 'Clínica'] },
    ],
  },
  'pie-diabetico': {
    titulo: 'Requisitos para cirugía de pie diabético',
    requiere_orden: true,
    campos: [
      { id: 'evolucion', label: '¿Tiempo de evolución de la herida?', placeholder: 'Días o meses' },
      { id: 'diagnostico', label: '¿Tiene diagnóstico de diabetes?', tipo: 'select', opciones: ['Sí', 'No'] },
    ],
  },
};

export function getFormLink(servicioCode, phone) {
  const params = new URLSearchParams();
  const value = getFormServicioValue(servicioCode);
  if (value) params.set('servicio', value);
  if (phone && /^\d{7,15}$/.test(phone)) params.set('phone', phone);
  const qs = params.toString();
  return qs ? `${SITE_URL}/solicitud?${qs}` : `${SITE_URL}/solicitud`;
}

export function getServiceInfo(code) {
  for (const cat of servicios) {
    for (const s of cat.servicios) {
      if (s.codigo === code) return { ...s, categoria: cat.categoria };
    }
  }
  return null;
}

export function formatServicios() {
  return servicios.map(c => `${c.categoria}: ${c.servicios.map(s => s.nombre).join(', ')}`).join('\n');
}

export function formatFAQSobre(intencion) {
  return faq.filter(f => f.intencion === intencion).map(f => `P: ${f.pregunta}\nR: ${f.respuesta}`).join('\n\n');
}

export function formatPoliticas() {
  const p = politicas;
  return `PAGO: ${p.pago.metodo} | Cuenta ${p.pago.cuenta} (${p.pago.banco}, ${p.pago.titular}, RNC ${p.pago.rnc})
PROGRAMACIÓN: ${p.programacion.plazo}. Corte ${p.programacion.corte_diario}
RESULTADOS: ${p.resultados.plazo}. Envío: ${p.resultados.envio}`;
}

export function formatHorarios() {
  const h = horarios;
  return `Clínica: ${h.clinica.lunes_a_viernes} | Sáb: ${h.clinica.sabado} | Dom: ${h.clinica.domingo} | Domicilio: ${h.domicilio.lunes_a_viernes} | Sáb: ${h.domicilio.sabado} | Dom: ${h.domicilio.domingo}
Zonas: ${h.zonas_cobertura.join(', ')}`;
}

export function detectarIntencion(text, history) {
  const t = text.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  const h = history.map(x => x.content.toLowerCase()).join(' ');

  if (t.includes('gracias') || t.includes('perfecto') || t.includes('ok') || t.includes('de acuerdo') || t.includes('chao') || t.includes('adios') || t.includes('nos vemos')) return 'cierre';
  if (t.includes('precio') || t.includes('cuanto cuesta') || t.includes('costo') || t.includes('cotiz') || t.includes('cuanto vale') || t.includes('tarifa') || t.includes('valor') || t.includes('presupuesto')) return 'precio';
  if (t.includes('agendar') || t.includes('cita') || t.includes('visita') || t.includes('domicilio') || t.includes('quiero') || t.includes('necesito') || t.includes('programar')) return 'agendar';
  if (t.includes('seguro') || t.includes('ars') || t.includes('aseguradora') || t.includes('cobertura') || t.includes('humano') || t.includes('mapfre') || t.includes('universal') || t.includes('palic') || t.includes('senasa') || t.includes('banco central')) return 'seguro';
  if (t.includes('horario') || t.includes('hora') || t.includes('atienden') || t.includes('abierto') || t.includes('domingo') || t.includes('sabado') || t.includes('abren') || t.includes('disponibilidad')) return 'horario';
  if (t.includes('donde') || t.includes('ubicacion') || t.includes('direccion') || t.includes('oficina') || t.includes('estan')) return 'ubicacion';
  if (t.includes('cancelar') || t.includes('reprogramar') || t.includes('cambiar') || t.includes('modificar') || t.includes('cancelacion')) return 'cancelacion';
  if (t.includes('reembolso') || t.includes('devolver') || t.includes('devolución') || t.includes('dinero') || t.includes('reembolsar') || t.includes('reintegro') || t.includes('devuelvan') || t.includes('me devuelven') || t.includes('devuelven')) return 'reembolso';
  if (t.includes('balance a favor') || t.includes('dejar en fondo') || t.includes('crédito') || t.includes('credito') || t.includes('fondo') || t.includes('balance')) return 'balance_favor';
  if (t.includes('pago') || t.includes('pagar') || t.includes('transferencia') || t.includes('cuenta') || t.includes('banco') || t.includes('deposito') || t.includes('efectivo') || t.includes('tarjeta')) return 'pago';
  if (t.includes('resultado') || t.includes('entrega') || (t.includes('cuando') && (t.includes('listo') || t.includes('sale') || t.includes('estar')))) return 'resultados';
  if (t.includes('preparacion') || t.includes('ayuno') || t.includes('preparar') || t.includes('necesito hacer')) return 'preparacion';
  if (t.includes('orden medica') || t.includes('indicacion') || t.includes('receta') || t.includes('referimiento') || t.includes('necesito orden')) return 'orden_medica';
  if (t.includes('empresa') || t.includes('empleado') || t.includes('corporativo') || t.includes('trabajadore')) return 'empresarial';
  if (t.includes('internamiento') || t.includes('hospitalizacion') || t.includes('ingreso')) return 'hospitalizacion';

  const serviceCode = findService(text);
  if (serviceCode) return 'servicio';

  if (t.includes('hola') || t.includes('bueno') || t.includes('saludos') || t.includes('buenas') || t.includes('que tal')) return 'saludo';

  return 'general';
}

export function getSectionForIntent(intent, userText) {
  const servFAQs = faq.filter(f => ['enfermeria', 'terapia', 'rayosx', 'transfusion', 'paliativos', 'sonografia_prep', 'quimioterapia', 'hospitalizacion'].includes(f.intencion));

  switch (intent) {
    case 'precio':
      return `=== POLÍTICA DE PRECIOS ===\nCada servicio se cotiza de forma personalizada según ubicación, materiales y personal requerido. Un asesor se comunicará para dar la cotización. Recopilar datos del paciente y escalar.\n\n=== OFERTA DE CANAL ===\nAl detectar que el cliente quiere cotizar, ofrécele DOS opciones claras y espera su elección:\n(A) "Puede llenar el formulario web (más rápido): ${SITE_URL}/solicitud" — el enlace ya trae el servicio que mencionó.\n(B) "O si prefiere, le tomo los datos por aquí (manual/asistido) y un asesor lo contacta."\nNO recojas datos hasta que el cliente elija una opción.\n\n${faq.filter(f => f.intencion === 'precio').map(f => `FAQ: ${f.pregunta} → ${f.respuesta}`).join('\n')}`;

    case 'agendar':
      return `=== AGENDAMIENTO ===\nRecopilar datos de a uno por vez. Cuando tengas 3+ datos (nombre, cédula, servicio, dirección, seguro, teléfono), marcar FORMDATA + ESCALACION.\n\nSi el servicio requiere orden médica (Rayos X, sonografía, EKG/Doppler/Holter/MAPA, laboratorio, transfusiones, pie diabético), pregunta si el paciente tiene la indicación médica y anótala en los datos.\n\n=== OFERTA DE CANAL ===\nAl detectar que el cliente quiere agendar, ofrécele DOS opciones claras y espera su elección:\n(A) "Puede llenar el formulario web (más rápido): ${SITE_URL}/solicitud" — el enlace ya trae el servicio que mencionó.\n(B) "O si prefiere, le tomo los datos por aquí (manual/asistido) y un asesor lo contacta."\nNO recojas datos hasta que el cliente elija una opción.\n\nHORARIOS:\nLunes a viernes 8:00am-6:00pm. Sábados disponibilidad limitada. Domingos no laboramos.\n\n${faq.filter(f => ['agendar_cita', 'requisitos', 'duracion'].includes(f.intencion)).map(f => `FAQ: ${f.pregunta} → ${f.respuesta}`).join('\n')}`;

     case 'seguro':
       return `=== SEGUROS ===\nConvenio directo: Bupa, Meta Salud, APS, Monumental, Aetna La Colonia.\nPara otros seguros: ofrecer carta de reembolso si el plan lo admite, o atención como privado.\n\n${faq.filter(f => f.intencion === 'seguro').map(f => `FAQ: ${f.pregunta} → ${f.respuesta}`).join('\n')}\n\nPreguntar: nombre del seguro, número de afiliado, y si necesita autorización.`;

    case 'horario':
      return `=== HORARIOS Y COBERTURA ===\n${formatHorarios()}\n\n${faq.filter(f => ['horario', 'cobertura', 'domicilio'].includes(f.intencion)).map(f => `FAQ: ${f.pregunta} → ${f.respuesta}`).join('\n')}`;

    case 'servicio': {
      const code = findService(userText);
      const info = code ? getServiceInfo(code) : null;
      let section = `=== SERVICIOS ===\n${formatServicios()}\n`;
      if (info) {
        section += `\n--- ${info.nombre} ---\n${info.descripcion || ''}\n`;
        if (info.incluye) section += `\nIncluye: ${info.incluye.join(', ')}\n`;
        if (info.preparacion) section += `Preparación: ${info.preparacion}\n`;
        section += '\n';
      }
      section += servFAQs.map(f => `FAQ: ${f.pregunta} → ${f.respuesta}`).join('\n');
      return section;
    }

    case 'ubicacion':
      return `=== UBICACIÓN ===\nOficinas: ${politicas.oficinas.join(' | ')}\nTeléfono: 809-636-3656\n\nHorario clínica: ${horarios.clinica.lunes_a_viernes}`;

    case 'pago':
      return `=== PAGO ===\n${formatPoliticas()}\n\n${faq.filter(f => f.intencion === 'pago').map(f => `FAQ: ${f.pregunta} → ${f.respuesta}`).join('\n')}`;

    case 'resultados':
      return `=== RESULTADOS ===\n${faq.filter(f => f.intencion === 'resultados').map(f => `FAQ: ${f.pregunta} → ${f.respuesta}`).join('\n')}`;

      case 'cancelacion':
        return `=== CANCELACIÓN ===\n${faq.filter(f => f.intencion === 'cancelacion').map(f => `FAQ: ${f.pregunta} → ${f.respuesta}`).join('\n')}\n\n${faq.filter(f => f.intencion === 'reembolso').map(f => `FAQ: ${f.pregunta} → ${f.respuesta}`).join('\n')}\n\n${faq.filter(f => f.intencion === 'balance_favor').map(f => `FAQ: ${f.pregunta} → ${f.respuesta}`).join('\n')}`;

      case 'reembolso':
        return `=== REEMBOLSO ===\n${faq.filter(f => f.intencion === 'reembolso').map(f => `FAQ: ${f.pregunta} → ${f.respuesta}`).join('\n')}`;

      case 'balance_favor':
        return `=== BALANCE A FAVOR ===\n${faq.filter(f => f.intencion === 'balance_favor').map(f => `FAQ: ${f.pregunta} → ${f.respuesta}`).join('\n')}`;

      case 'reprogramacion':
        return `=== REPROGRAMACIÓN ===\n${faq.filter(f => f.intencion === 'reprogramacion').map(f => `FAQ: ${f.pregunta} → ${f.respuesta}`).join('\n')}`;

      case 'orden_medica':
       return `=== REQUISITOS MÉDICOS ===\n${faq.filter(f => ['rayosx', 'transfusion', 'receta'].includes(f.intencion)).map(f => `FAQ: ${f.pregunta} → ${f.respuesta}`).join('\n')}\n\nPara consulta médica NO se necesita orden. Para Rayos X, sonografía, laboratorio y transfusiones SÍ.`;

     case 'empresarial':
       return `=== PROGRAMAS EMPRESARIALES ===\n${faq.filter(f => f.intencion === 'empresarial').map(f => `FAQ: ${f.pregunta} → ${f.respuesta}`).join('\n')}`;

     case 'hospitalizacion':
       return `=== HOSPITALIZACIÓN DOMICILIARIA ===\n${faq.filter(f => f.intencion === 'hospitalizacion').map(f => `FAQ: ${f.pregunta} → ${f.respuesta}`).join('\n')}`;

     case 'factura':
       return `=== FACTURACIÓN ===\nLa facturación y emisión de recibos es gestionada por el departamento de Contabilidad. Un asesor se comunicará con usted para enviar la factura o recibo correspondiente.\n\n${faq.filter(f => f.intencion === 'factura').map(f => `FAQ: ${f.pregunta} → ${f.respuesta}`).join('\n')}`;

     case 'nimbo':
       return `=== CITAS VÍA NIMBO ===\nLas citas se gestionan a través del chatbot o un asesor humano. No es necesario acceder directamente a la plataforma Nimbo. Si necesita agendar, le podemos ayudar aquí.\n\n${faq.filter(f => f.intencion === 'nimbo').map(f => `FAQ: ${f.pregunta} → ${f.respuesta}`).join('\n')}`;

     case 'contabilidad':
       return `=== DEPARTAMENTOS INTERNOS ===\nContabilidad, RRHH y Facturación son gestionados por equipos internos de UNIDOLOR. Un asesor derivará su consulta al área correspondiente.\n\n${faq.filter(f => ['contabilidad', 'rrhh'].includes(f.intencion)).map(f => `FAQ: ${f.pregunta} → ${f.respuesta}`).join('\n')}`;

     case 'doctor':
       return `=== DOCTORES ===\nDra. Bethania Martínez — medicina del dolor y cuidados paliativos. Atiende miércoles y jueves 8:00am-6:00pm en Santo Domingo (Torre Solazar).\nDra. Ximena Almanzar — ortopedia.\nDr. Mármol — consulta general.\n\n${faq.filter(f => f.intencion === 'doctor').map(f => `FAQ: ${f.pregunta} → ${f.respuesta}`).join('\n')}`;

     case 'emergencia':
       return faq.filter(f => f.intencion === 'emergencia').map(f => `FAQ: ${f.pregunta} → ${f.respuesta}`).join('\n');

     case 'saludo':
       return 'El cliente acaba de saludar. No ha especificado ningún servicio ni paciente. PRESÉNTATE brevemente y pregúntale genéricamente cómo puedes ayudarle. NO menciones familiares (mamá, papá, etc.) ni servicios específicos.';

     default:
       return `${formatServicios()}\n\nPREGUNTAS FRECUENTES:\n${faq.slice(0, 8).map(f => `• ${f.pregunta}`).join('\n')}`;
  }
}
