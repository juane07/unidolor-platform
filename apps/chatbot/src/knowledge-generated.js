/*
 * ============================================================
 *  GENERADO AUTOMÁTICAMENTE por scripts/sync-chatbot-knowledge.ts
 *  NO editar a mano. Fuentes: CRM MongoDB (InstitutionalFAQ,
 *  Service) + @unidolor/core. Regenerar con: pnpm run sync:knowledge
 * ============================================================
 */

export const faq = [
  {
    "pregunta": "¿Qué es UNIDOLOR?",
    "respuesta": "UNIDOLOR es una institución médica especializada en Medicina del Dolor, Cuidados Paliativos, Procedimientos Intervencionistas y Atención Médica Domiciliaria. Integra atención clínica especializada, procedimientos, diagnóstico, programas domiciliarios y servicios complementarios mediante protocolos estandarizados y un enfoque centrado en el paciente.",
    "intencion": "general",
    "categoria": "PACIENTES",
    "subcategoria": "Información General",
    "tags": [
      "general",
      "información",
      "servicios",
      "ubicación",
      "horario",
      "contacto",
      "cita",
      "pacientes_privados",
      "seguros"
    ]
  },
  {
    "pregunta": "¿Qué servicios ofrece UNIDOLOR?",
    "respuesta": "UNIDOLOR ofrece:\n\n- Consulta especializada en Medicina del Dolor.\n- Cuidados Paliativos.\n- Procedimientos intervencionistas.\n- Bloqueos nerviosos.\n- Radiofrecuencia.\n- Bombas elastoméricas.\n- Atención médica domiciliaria.\n- Enfermería domiciliaria.\n- Hospitalización domiciliaria.\n- Laboratorio a domicilio.\n- Rayos X portátiles.\n- Ecografía.\n- Doppler vascular.\n- Electrocardiograma.\n- Ecocardiograma.\n- Holter.\n- MAPA.\n- Transfusiones sanguíneas (Hemohogar).\n- Quimioterapia e infusiones (Oncomejórate).\n- Programas preventivos y empresariales.",
    "intencion": "general",
    "categoria": "PACIENTES",
    "subcategoria": "Información General",
    "tags": [
      "general",
      "información",
      "servicios",
      "ubicación",
      "horario",
      "contacto",
      "cita",
      "pacientes_privados",
      "seguros"
    ]
  },
  {
    "pregunta": "¿Dónde están ubicados?",
    "respuesta": "Nuestra oficina principal está en la Ave. Gustavo Mejía Ricart No. 54, Torre Solazar, Business Center, Piso 3, Local 3F, Ensanche Naco, Santo Domingo.",
    "intencion": "ubicacion",
    "categoria": "PACIENTES",
    "subcategoria": "Información General",
    "tags": [
      "general",
      "información",
      "servicios",
      "ubicación",
      "horario",
      "contacto",
      "cita",
      "pacientes_privados",
      "seguros"
    ]
  },
  {
    "pregunta": "¿Cuál es el horario de atención?",
    "respuesta": "Nuestro horario laboral es de lunes a viernes de 8:00 am a 6:00 pm. Sábados tenemos disponibilidad limitada. Domingos no laboramos.",
    "intencion": "horario",
    "categoria": "PACIENTES",
    "subcategoria": "Información General",
    "tags": [
      "general",
      "información",
      "servicios",
      "ubicación",
      "horario",
      "contacto",
      "cita",
      "pacientes_privados",
      "seguros"
    ]
  },
  {
    "pregunta": "¿Cómo puedo comunicarme?",
    "respuesta": "Puede contactarnos mediante:\n\n- WhatsApp: 829-263-4143\n- Teléfono: 809-636-3656\n- Correo electrónico\n- Visita presencial en nuestra oficina",
    "intencion": "ubicacion",
    "categoria": "PACIENTES",
    "subcategoria": "Información General",
    "tags": [
      "general",
      "información",
      "servicios",
      "ubicación",
      "horario",
      "contacto",
      "cita",
      "pacientes_privados",
      "seguros"
    ]
  },
  {
    "pregunta": "¿Cómo solicito una cita?",
    "respuesta": "Puede solicitar una cita mediante WhatsApp, teléfono, correo electrónico, página web o presencialmente. El personal solicitará la información básica necesaria para identificar el servicio requerido y coordinar la agenda.",
    "intencion": "agendar_cita",
    "categoria": "PACIENTES",
    "subcategoria": "Información General",
    "tags": [
      "general",
      "información",
      "servicios",
      "ubicación",
      "horario",
      "contacto",
      "cita",
      "pacientes_privados",
      "seguros"
    ]
  },
  {
    "pregunta": "¿Atienden pacientes privados?",
    "respuesta": "Sí. UNIDOLOR atiende pacientes privados y pacientes con aseguradoras cuando existe cobertura o autorización correspondiente.",
    "intencion": "seguro",
    "categoria": "PACIENTES",
    "subcategoria": "Información General",
    "tags": [
      "general",
      "información",
      "servicios",
      "ubicación",
      "horario",
      "contacto",
      "cita",
      "pacientes_privados",
      "seguros"
    ]
  },
  {
    "pregunta": "¿Trabajan con ARS?",
    "respuesta": "Sí, trabajamos con seguros. Pregunte al paciente cuál es su seguro.\n\n**Seguros con convenio directo:**\n\n- Bupa\n- La Colonial\n- Meta Salud\n- APS\n- Monumental\n- Aetna\n\n**Para cualquier otro seguro:**\nSi el seguro del paciente no está en la lista anterior, pregunte si su plan admite reembolso. De ser así, UNIDOLOR le entrega una carta para que el paciente pueda solicitar el reembolso directamente a su aseguradora.\n\n> **Política de respuesta:** Siempre pregunte \"¿Qué seguro tiene?\" antes de asumir cobertura. Si tiene uno de los seguros listados, proceda con la verificación de cobertura. Si es otro seguro, ofrezca la opción de carta para reembolso o atención como privado.",
    "intencion": "seguro",
    "categoria": "PACIENTES",
    "subcategoria": "Información General",
    "tags": [
      "general",
      "información",
      "servicios",
      "ubicación",
      "horario",
      "contacto",
      "cita",
      "pacientes_privados",
      "seguros"
    ]
  },
  {
    "pregunta": "¿Qué debo llevar a la consulta?",
    "respuesta": "Se recomienda llevar:\n\n- Documento de identidad.\n- Estudios previos.\n- Laboratorios.\n- Lista de medicamentos.\n- Referimiento médico si existe.\n- Autorización de ARS cuando corresponda.",
    "intencion": "requisitos",
    "categoria": "PACIENTES",
    "subcategoria": "Consultas",
    "tags": [
      "consulta",
      "preparación",
      "indicación_médica",
      "resultados",
      "dolor",
      "duración"
    ]
  },
  {
    "pregunta": "¿Necesito indicación médica?",
    "respuesta": "Depende del servicio solicitado. Algunos procedimientos requieren indicación médica obligatoria, mientras que otros pueden iniciar con una valoración realizada por un médico de UNIDOLOR.",
    "intencion": "requisitos",
    "categoria": "PACIENTES",
    "subcategoria": "Consultas",
    "tags": [
      "consulta",
      "preparación",
      "indicación_médica",
      "resultados",
      "dolor",
      "duración"
    ]
  },
  {
    "pregunta": "¿Cómo obtengo mis resultados?",
    "respuesta": "Los resultados se entregan en un plazo de 24 a 48 horas después del servicio, vía WhatsApp y correo electrónico. Si prefiere resultados físicos, puede pasar a retirarlos por nuestra oficina.",
    "intencion": "resultados",
    "categoria": "PACIENTES",
    "subcategoria": "Consultas",
    "tags": [
      "consulta",
      "preparación",
      "indicación_médica",
      "resultados",
      "dolor",
      "duración"
    ]
  },
  {
    "pregunta": "¿Duele?",
    "respuesta": "Depende del procedimiento. La consulta y la mayoría de los estudios de diagnóstico (RX, sonografía) no son dolorosos. Los procedimientos intervencionistas se realizan con anestesia local y sedación cuando es necesario para garantizar la comodidad del paciente.\n\n*(Pregunta recurrente en conversaciones reales — pacientes suelen preguntar directamente \"¿duele?\" antes de agendar)*",
    "intencion": "agendar_cita",
    "categoria": "PACIENTES",
    "subcategoria": "Consultas",
    "tags": [
      "consulta",
      "preparación",
      "indicación_médica",
      "resultados",
      "dolor",
      "duración"
    ]
  },
  {
    "pregunta": "¿Cuánto tiempo dura la consulta / el servicio?",
    "respuesta": "La consulta médica domiciliaria dura aproximadamente 30–45 minutos. Los servicios de diagnóstico (RX, sonografía) toman entre 15–30 minutos. Procedimientos más complejos pueden requerir más tiempo y se coordinan previamente.",
    "intencion": "duracion",
    "categoria": "PACIENTES",
    "subcategoria": "Consultas",
    "tags": [
      "consulta",
      "preparación",
      "indicación_médica",
      "resultados",
      "dolor",
      "duración"
    ]
  },
  {
    "pregunta": "¿Los procedimientos requieren consentimiento informado?",
    "respuesta": "Sí. Todo procedimiento invasivo requiere consentimiento informado firmado por el paciente o su representante antes de su realización.",
    "intencion": "general",
    "categoria": "PACIENTES",
    "subcategoria": "Procedimientos",
    "tags": [
      "procedimiento",
      "consentimiento",
      "complicaciones"
    ]
  },
  {
    "pregunta": "¿Qué debo hacer si presento una complicación?",
    "respuesta": "Debe comunicarse inmediatamente con UNIDOLOR. Si la situación representa una emergencia médica, debe acudir al servicio de urgencias más cercano.",
    "intencion": "emergencia",
    "categoria": "PACIENTES",
    "subcategoria": "Procedimientos",
    "tags": [
      "procedimiento",
      "consentimiento",
      "complicaciones"
    ]
  },
  {
    "pregunta": "¿Qué es Mejórate en Casa?",
    "respuesta": "Es la unidad de atención médica domiciliaria de UNIDOLOR. Su objetivo es llevar servicios médicos especializados al domicilio del paciente para evitar traslados innecesarios y mantener la continuidad del tratamiento con altos estándares de calidad.",
    "intencion": "domicilio",
    "categoria": "PACIENTES",
    "subcategoria": "Medicina Domiciliaria",
    "tags": [
      "domicilio",
      "mejórate_en_casa",
      "solicitud",
      "zonas",
      "proceso"
    ]
  },
  {
    "pregunta": "¿Cómo solicito un servicio domiciliario?",
    "respuesta": "Debe proporcionar:\n\n- Nombre del paciente.\n- Teléfono.\n- Dirección.\n- Motivo de consulta.\n- Diagnóstico conocido.\n- Servicio solicitado.\n- Seguro médico cuando aplique.\n\nPosteriormente el equipo coordinará la logística y confirmará la programación.",
    "intencion": "domicilio",
    "categoria": "PACIENTES",
    "subcategoria": "Medicina Domiciliaria",
    "tags": [
      "domicilio",
      "mejórate_en_casa",
      "solicitud",
      "zonas",
      "proceso"
    ]
  },
  {
    "pregunta": "¿Qué zonas cubren?",
    "respuesta": "Cubrimos Santo Domingo, Zona Norte (incluyendo Nagua y Terrenas), Santiago y zonas aledañas. Consúltenos por su ubicación específica.",
    "intencion": "cobertura",
    "categoria": "PACIENTES",
    "subcategoria": "Medicina Domiciliaria",
    "tags": [
      "domicilio",
      "mejórate_en_casa",
      "solicitud",
      "zonas",
      "proceso"
    ]
  },
  {
    "pregunta": "¿Cómo es el proceso de solicitud de un servicio domiciliario?",
    "respuesta": "Basado en los formularios utilizados en conversaciones reales, la secretaria debe recopilar:\n\n1. **Datos del paciente:** nombre completo, edad, dirección completa, teléfono de contacto.\n2. **Acompañamiento:** si vive solo(a) o acompañado(a).\n3. **Motivo principal:** dolor crónico, caída reciente, fractura, dificultad para caminar, debilidad general, postquirúrgico, otros.\n4. **Diagnóstico conocido** y médico tratante.\n5. **Servicio solicitado:** consulta, RX, sonografía, enfermería, laboratorio, etc.\n6. **Seguro médico** (si aplica) para verificar cobertura.\n7. **Disponibilidad de horario** para coordinar la visita.",
    "intencion": "domicilio",
    "categoria": "PACIENTES",
    "subcategoria": "Medicina Domiciliaria",
    "tags": [
      "domicilio",
      "mejórate_en_casa",
      "solicitud",
      "zonas",
      "proceso"
    ]
  },
  {
    "pregunta": "¿Qué es Hemohogar?",
    "respuesta": "Hemohogar es el programa institucional para la realización de transfusiones sanguíneas en el domicilio del paciente o en la clínica, bajo supervisión médica y de enfermería especializada siguiendo protocolos de seguridad.",
    "intencion": "transfusion",
    "categoria": "PACIENTES",
    "subcategoria": "Hemohogar",
    "tags": [
      "hemohogar",
      "transfusión",
      "requisitos",
      "sangre"
    ]
  },
  {
    "pregunta": "¿Qué requisitos existen?",
    "respuesta": "El paciente debe cumplir:\n\n- Estar clínicamente estable.\n- Tener indicación médica de transfusión.\n- Contar con hemograma y estudios recientes.\n- Tener la sangre o hemoderivado autorizado por un Banco de Sangre (Hemohogar NO suministra ni vende sangre).\n- Tener tipificación sanguínea y pruebas cruzadas realizadas.\n- Contar con un cuidador responsable presente durante todo el procedimiento.\n- Tener acceso telefónico y dirección localizable.\n\nNo se realiza transfusión domiciliaria si el paciente presenta sangrado activo, dificultad respiratoria severa, inestabilidad hemodinámica, fiebre o infección grave sin evaluación médica, o reacciones transfusionales graves previas.",
    "intencion": "requisitos",
    "categoria": "PACIENTES",
    "subcategoria": "Hemohogar",
    "tags": [
      "hemohogar",
      "transfusión",
      "requisitos",
      "sangre"
    ]
  },
  {
    "pregunta": "¿Qué es Oncomejórate?",
    "respuesta": "Oncomejórate es el programa institucional destinado a la administración de quimioterapia, inmunoterapia, terapias biológicas e infusiones especializadas en un entorno seguro y controlado.",
    "intencion": "quimioterapia",
    "categoria": "PACIENTES",
    "subcategoria": "Oncomejórate",
    "tags": [
      "oncomejórate",
      "quimioterapia",
      "inmunoterapia",
      "infusiones"
    ]
  },
  {
    "pregunta": "¿Existe un programa especial para adultos mayores?",
    "respuesta": "Sí. UNIDOLOR tiene un programa dirigido a adultos mayores que incluye evaluaciones integrales a domicilio, manejo de dolor crónico, prevención de caídas, cuidado de fracturas, manejo de debilidad general y acompañamiento en postquirúrgicos. El programa requiere una solicitud formal con los datos del paciente y el motivo principal de la visita.\n\n> **Basado en conversaciones reales:** Los motivos más frecuentes de solicitud para adultos mayores son dolor crónico, caídas recientes y dificultad para caminar.",
    "intencion": "agendar_cita",
    "categoria": "PACIENTES",
    "subcategoria": "Programa Adulto Mayor",
    "tags": [
      "adulto_mayor",
      "geriátrico",
      "caídas",
      "fracturas"
    ]
  },
  {
    "pregunta": "¿Qué son los Cuidados Paliativos?",
    "respuesta": "Son una atención médica especializada dirigida a mejorar la calidad de vida de pacientes con enfermedades graves mediante el control de síntomas físicos, emocionales, sociales y espirituales.",
    "intencion": "paliativos",
    "categoria": "PACIENTES",
    "subcategoria": "Cuidados Paliativos",
    "tags": [
      "paliativos",
      "cáncer",
      "enfermedades_avanzadas"
    ]
  },
  {
    "pregunta": "¿Los Cuidados Paliativos son únicamente para pacientes con cáncer?",
    "respuesta": "No. Están indicados para cualquier paciente con enfermedades avanzadas o crónicas que requieran control de síntomas y apoyo integral.",
    "intencion": "paliativos",
    "categoria": "PACIENTES",
    "subcategoria": "Cuidados Paliativos",
    "tags": [
      "paliativos",
      "cáncer",
      "enfermedades_avanzadas"
    ]
  },
  {
    "pregunta": "¿Qué formas de pago aceptan?",
    "respuesta": "Aceptamos:\n\n- Efectivo.\n- Transferencia bancaria (Cuenta Corriente BanReservas No. 9600601779, a nombre de Unidolor SRL, RNC 131080219).\n- Tarjetas de crédito y débito.\n- Otros medios autorizados por la administración.",
    "intencion": "pago",
    "categoria": "PACIENTES",
    "subcategoria": "Facturación",
    "tags": [
      "facturación",
      "pago",
      "precios",
      "cotización",
      "ncf",
      "factura"
    ]
  },
  {
    "pregunta": "¿Cuánto cuesta la consulta?",
    "respuesta": "Los costos de consulta y procedimientos se cotizan de forma personalizada según la condición del paciente, ubicación, materiales requeridos y tipo de procedimiento. Un asesor se comunicará para darle la cotización.",
    "intencion": "precio",
    "categoria": "PACIENTES",
    "subcategoria": "Facturación",
    "tags": [
      "facturación",
      "pago",
      "precios",
      "cotización",
      "ncf",
      "factura"
    ]
  },
  {
    "pregunta": "¿Por qué no publican todos los precios?",
    "respuesta": "Cada servicio es personalizado. El costo final depende de la ubicación del paciente, materiales, personal requerido y tipo de procedimiento. Un asesor le enviará una cotización detallada sin compromiso.",
    "intencion": "precio",
    "categoria": "PACIENTES",
    "subcategoria": "Facturación",
    "tags": [
      "facturación",
      "pago",
      "precios",
      "cotización",
      "ncf",
      "factura"
    ]
  },
  {
    "pregunta": "¿Cómo obtengo mi factura?",
    "respuesta": "Puede solicitar su factura al momento del pago. Si requiere comprobante fiscal (NCF), debe indicarlo al momento de solicitar el servicio e informar su RNC o cédula.",
    "intencion": "factura",
    "categoria": "PACIENTES",
    "subcategoria": "Facturación",
    "tags": [
      "facturación",
      "pago",
      "precios",
      "cotización",
      "ncf",
      "factura"
    ]
  },
  {
    "pregunta": "¿Cómo puedo ayudar al paciente?",
    "respuesta": "Siguiendo las recomendaciones del equipo médico, administrando correctamente los medicamentos, observando signos de alarma y manteniendo comunicación permanente con el equipo tratante.",
    "intencion": "general",
    "categoria": "FAMILIARES",
    "subcategoria": "General",
    "tags": []
  },
  {
    "pregunta": "¿Qué signos de alarma debo vigilar?",
    "respuesta": "Debe contactar al equipo si el paciente presenta: dolor intenso no controlado, fiebre, dificultad para respirar, sangrado, confusión repentina, o cualquier cambio significativo en su estado general. Ante una emergencia, acuda al servicio de urgencias más cercano.",
    "intencion": "emergencia",
    "categoria": "FAMILIARES",
    "subcategoria": "General",
    "tags": []
  },
  {
    "pregunta": "¿Cómo contacto al equipo?",
    "respuesta": "Puede comunicarse mediante WhatsApp al 829-263-4143 o al teléfono 809-636-3656.",
    "intencion": "ubicacion",
    "categoria": "FAMILIARES",
    "subcategoria": "General",
    "tags": []
  },
  {
    "pregunta": "¿Cómo puedo referir un paciente?",
    "respuesta": "Puede enviar la información clínica relevante junto con los estudios disponibles a través de los canales institucionales. El equipo coordinará la evaluación y mantendrá informado al médico referidor cuando corresponda.",
    "intencion": "general",
    "categoria": "MÉDICOS REFERIDORES",
    "subcategoria": "General",
    "tags": []
  },
  {
    "pregunta": "¿Qué información debe acompañar un referido?",
    "respuesta": "Siempre que sea posible:\n\n- Diagnóstico.\n- Motivo del referido.\n- Estudios.\n- Laboratorios.\n- Medicamentos actuales.\n- Información de contacto del paciente.",
    "intencion": "general",
    "categoria": "MÉDICOS REFERIDORES",
    "subcategoria": "General",
    "tags": []
  },
  {
    "pregunta": "¿Qué programas corporativos ofrece UNIDOLOR?",
    "respuesta": "Programas de salud ocupacional, atención domiciliaria, jornadas preventivas, evaluaciones médicas, diagnóstico portátil y programas personalizados para empresas.",
    "intencion": "empresarial",
    "categoria": "EMPRESAS",
    "subcategoria": "General",
    "tags": []
  },
  {
    "pregunta": "¿Cómo solicitar una propuesta?",
    "respuesta": "Puede contactarnos mediante WhatsApp al 829-263-4143 o al teléfono 809-636-3656 para recibir una propuesta personalizada según las necesidades de su empresa.",
    "intencion": "empresarial",
    "categoria": "EMPRESAS",
    "subcategoria": "General",
    "tags": []
  },
  {
    "pregunta": "¿Con qué ARS tienen convenio?",
    "respuesta": "Actualmente UNIDOLOR tiene convenio directo con: **Bupa, La Colonial, Meta Salud, APS, Monumental y Aetna**.",
    "intencion": "seguro",
    "categoria": "ARS",
    "subcategoria": "General",
    "tags": []
  },
  {
    "pregunta": "¿Qué pasa si el paciente tiene otra ARS?",
    "respuesta": "Si el plan del paciente admite reembolso, UNIDOLOR emite una carta para que el paciente gestione el reembolso directamente con su aseguradora.",
    "intencion": "seguro",
    "categoria": "ARS",
    "subcategoria": "General",
    "tags": []
  },
  {
    "pregunta": "¿Qué documentación suele requerirse?",
    "respuesta": "Dependiendo del servicio pueden solicitar:\n\n- Indicación médica.\n- Autorización.\n- Estudios.\n- Diagnóstico.\n- Formulario institucional.\n- Documento de identidad.\n\nLa cobertura debe verificarse con cada aseguradora según el convenio vigente.",
    "intencion": "requisitos",
    "categoria": "ARS",
    "subcategoria": "General",
    "tags": []
  },
  {
    "pregunta": "¿Qué debo verificar antes de un procedimiento?",
    "respuesta": "- Identificación del paciente.\n- Indicación médica.\n- Consentimiento informado.\n- Materiales.\n- Medicamentos.\n- Equipos.\n- Signos vitales.\n- Preparación del paciente.",
    "intencion": "enfermeria",
    "categoria": "ENFERMERÍA",
    "subcategoria": "General",
    "tags": []
  },
  {
    "pregunta": "¿Qué debo documentar?",
    "respuesta": "Toda intervención debe registrar:\n\n- Hora.\n- Procedimiento.\n- Materiales.\n- Medicamentos.\n- Evolución.\n- Observaciones.\n- Incidentes si existieron.",
    "intencion": "enfermeria",
    "categoria": "ENFERMERÍA",
    "subcategoria": "General",
    "tags": []
  },
  {
    "pregunta": "¿Cómo agendar un servicio?",
    "respuesta": "Debe seguir el flujo operativo establecido:\n\n1. Recepción de la solicitud.\n2. Registro de la información del paciente.\n3. Clasificación del servicio (modalidad y tipo).\n4. Verificación de cobertura ARS cuando aplique.\n5. Programación según disponibilidad.\n6. Confirmación con el paciente.\n7. Documentación en el sistema correspondiente.",
    "intencion": "agendar_cita",
    "categoria": "SECRETARIAS",
    "subcategoria": "General",
    "tags": []
  },
  {
    "pregunta": "¿Qué información debe solicitarse?",
    "respuesta": "Información mínima del paciente:\n\n- Nombre completo.\n- Teléfono de contacto.\n- Dirección del servicio.\n- Servicio solicitado.\n- Seguro médico (si aplica).\n- Diagnóstico o motivo de consulta.\n- Médico tratante (si aplica).",
    "intencion": "agendar_cita",
    "categoria": "SECRETARIAS",
    "subcategoria": "General",
    "tags": []
  },
  {
    "pregunta": "Manejo de situaciones comunes en chat",
    "respuesta": "**Paciente pregunta precio antes de agendar:**\n> Indique el precio de la consulta (RD$5,000 primera vez / subsecuente). Para otros servicios, ofrezca una cotización personalizada.\n\n**Paciente pregunta por seguros:**\n> Pregunte \"¿Qué seguro tiene?\". Si está en la lista (Bupa, La Colonial, Meta Salud, APS, Monumental, Aetna), verifique cobertura. Si es otro seguro, ofrezca: \"Podemos emitirle una carta para que solicite reembolso a su seguro, o puede atenderse como privado\".\n> Verifique la agenda. Si hay disponibilidad, confirme. Si no, ofrezca la opción más próxima.\n\n**Paciente con dolor intenso o urgencia:**\n> Priorice la programación. Si el caso es urgente, coordine con el médico disponible más cercano. Si no hay disponibilidad inmediata, indique al paciente que acuda al servicio de urgencias más cercano.\n\n**Paciente se queja de tardanza o incumplimiento:**\n> 1. Escuche sin interrumpir.\n> 2. Disculpe institucionalmente: \"Lamento los inconvenientes causados\".\n> 3. Identifique la causa (logística, comunicación, personal).\n> 4. Ofrezca una solución concreta (reprogramar, descuento, seguimiento prioritario).\n> 5. Escale a gerencia si el paciente persiste insatisfecho.",
    "intencion": "general",
    "categoria": "SECRETARIAS",
    "subcategoria": "General",
    "tags": []
  },
  {
    "pregunta": "¿Qué información necesita Facturación?",
    "respuesta": "- Servicio realizado.\n- Materiales utilizados.\n- Medicamentos.\n- Tiempo del procedimiento.\n- Profesional responsable.\n- Soporte clínico correspondiente.",
    "intencion": "factura",
    "categoria": "FACTURACIÓN",
    "subcategoria": "General",
    "tags": []
  },
  {
    "pregunta": "¿Cuándo se factura un servicio?",
    "respuesta": "Una vez confirmado que el procedimiento fue realizado y toda la documentación obligatoria está completa.",
    "intencion": "factura",
    "categoria": "FACTURACIÓN",
    "subcategoria": "General",
    "tags": []
  },
  {
    "pregunta": "Datos institucionales para facturación",
    "respuesta": "- Razón social: Unidolor SRL\n- RNC: 131080219\n- Cuenta Bancaria: BanReservas No. 9600601779 (Cuenta Corriente)",
    "intencion": "factura",
    "categoria": "FACTURACIÓN",
    "subcategoria": "General",
    "tags": []
  },
  {
    "pregunta": "¿Cómo consultar indicadores operativos?",
    "respuesta": "La gerencia monitorea los siguientes indicadores:\n\n- Tiempo de respuesta a solicitudes.\n- Tiempo de programación.\n- Puntualidad en los servicios.\n- Cumplimiento del servicio programado.\n- Servicios cancelados o reprogramados.\n- Productividad del personal.\n- Satisfacción del paciente.\n- Facturación diaria y mensual.\n- Cuentas por cobrar.",
    "intencion": "general",
    "categoria": "GERENCIA",
    "subcategoria": "General",
    "tags": []
  },
  {
    "pregunta": "¿Cómo medir productividad?",
    "respuesta": "Debe evaluarse la relación entre servicios realizados, recursos utilizados y tiempo invertido, comparado contra los estándares institucionales definidos en los protocolos operativos.",
    "intencion": "general",
    "categoria": "GERENCIA",
    "subcategoria": "General",
    "tags": []
  },
  {
    "pregunta": "¿Qué sistemas utiliza UNIDOLOR?",
    "respuesta": "La operación institucional utiliza las siguientes herramientas:\n\n- NimboX: Gestión clínica (historia clínica, agenda, consultas, procedimientos).\n- Alegra: Administración financiera (facturación, inventario, compras, cuentas por cobrar).\n- WhatsApp Business: Comunicación con pacientes (información, agendamiento, formularios, seguimiento).\n- Google Workspace: Correo electrónico, calendario, documentos.\n- Base de Conocimiento: Documentación oficial de protocolos, procesos y políticas institucionales.\n- ChatBot (en desarrollo): Atención inicial automatizada mediante inteligencia artificial.\n\nLos sistemas se integran progresivamente para reducir duplicidad de información.",
    "intencion": "general",
    "categoria": "TECNOLOGÍA",
    "subcategoria": "General",
    "tags": []
  },
  {
    "pregunta": "¿Cómo acceder a los sistemas?",
    "respuesta": "Cada colaborador tiene acceso según su rol y funciones. Solicite sus credenciales al área de tecnología o administración.",
    "intencion": "general",
    "categoria": "TECNOLOGÍA",
    "subcategoria": "General",
    "tags": []
  },
  {
    "pregunta": "¿Cómo reportar problemas técnicos?",
    "respuesta": "Comuníquese con el área de tecnología o administración para reportar cualquier incidencia con los sistemas institucionales.",
    "intencion": "general",
    "categoria": "TECNOLOGÍA",
    "subcategoria": "General",
    "tags": []
  },
  {
    "pregunta": "¿Para qué utiliza UNIDOLOR Inteligencia Artificial?",
    "respuesta": "Como herramienta de apoyo para:\n\n- Organización del conocimiento.\n- Automatización administrativa.\n- Elaboración de documentos.\n- Apoyo a procesos clínicos.\n- Atención inicial al paciente.\n- Optimización operativa.\n\nLa IA nunca sustituye el juicio clínico del profesional tratante.",
    "intencion": "general",
    "categoria": "INTELIGENCIA ARTIFICIAL",
    "subcategoria": "General",
    "tags": []
  },
  {
    "pregunta": "Reglas para la IA",
    "respuesta": "Toda IA institucional debe cumplir:\n\n1. Utilizar únicamente información documentada en la Base de Conocimiento.\n2. Diferenciar evidencia de opinión.\n3. Identificar incertidumbre cuando exista.\n4. Priorizar documentos oficiales.\n5. Mantener consistencia institucional.\n6. No inventar procesos ni protocolos.\n7. No modificar protocolos sin autorización.\n8. No sustituir el criterio del profesional tratante.",
    "intencion": "general",
    "categoria": "INTELIGENCIA ARTIFICIAL",
    "subcategoria": "General",
    "tags": []
  }
];

export const politicas = {
  "pago": {
    "metodo": "Efectivo, transferencia bancaria, tarjeta (débito/crédito), cheque",
    "cuenta": "9600601779",
    "banco": "BanReservas",
    "titular": "Unidolor SRL",
    "tipo": "Cuenta Corriente",
    "rnc": "131080219"
  },
  "programacion": {
    "plazo": "24 a 48 horas después de confirmación",
    "corte_diario": "4:00 pm"
  },
  "resultados": {
    "plazo": "24 a 48 horas",
    "envio": "WhatsApp y correo electrónico",
    "retiro_fisico": "Ave. Gustavo Mejía Ricart No. 54, Torre Solazar, Business Center, Piso 3, Local 3F, Ensanche Naco, Santo Domingo"
  },
  "cancelacion": {
    "politica": "No ofrecemos reembolsos en efectivo. En su lugar, proporcionamos un crédito por el monto pagado, el cual podrá ser utilizado exclusivamente para futuros servicios dentro de los siguientes 6 meses. Para servicios continuos (ej. enfermería 24/7) se requiere aviso con al menos 1 mes de anticipación.",
    "cotizacion_vigencia": "15 días"
  },
  "oficinas": [
    "Ave. Gustavo Mejía Ricart No. 54, Torre Solazar, Business Center, Piso 3, Local 3F, Ensanche Naco, Santo Domingo"
  ]
};

export const horarios = {
  "clinica": {
    "lunes_a_viernes": "8:00am - 5:00pm",
    "sabado": "8:00am - 12:00pm",
    "domingo": "Cerrado"
  },
  "domicilio": {
    "lunes_a_viernes": "8:00am - 6:00pm",
    "sabado": "Disponibilidad limitada",
    "domingo": "No laboramos"
  },
  "corte_pago": "4:00 pm",
  "programacion_servicios": "24 a 48 horas",
  "entrega_resultados": "24 a 48 horas",
  "zonas_cobertura": [
    "Santo Domingo",
    "Zona Norte (Nagua, Las Terrenas)",
    "Santiago",
    "Zonas aledañas"
  ],
  "contactos": {
    "telefonos": [
      "809-636-3656",
      "829-263-4143"
    ],
    "emails": [
      "info@unidolor.com"
    ],
    "websites": [
      "unidolor.com"
    ]
  },
  "seguros_convenio": [
    "Bupa",
    "La Colonial",
    "Meta Salud",
    "APS",
    "Monumental",
    "Aetna"
  ]
};

export const CATALOGO_COMPLETO = [
  {
    "grupo": "medicina_dolor",
    "titulo": "Medicina del Dolor",
    "total": 2,
    "servicios": [
      {
        "nombre": "Consulta de Manejo Dolor- Dra. Bethania Martinez",
        "descripcion": "",
        "cupsCode": null,
        "preguntar": [
          "¿Dónde se realizaría (domicilio, clínica)?",
          "¿Tipo de dolor, localización, intensidad, tiempo de evolución?",
          "¿Diagnóstico de base o médico tratante?",
          "¿Tratamientos previos (medicamentos, procedimientos)?",
          "¿Tiene estudios de imágenes o laboratorios recientes?",
          "Nombre completo, cédula, dirección, teléfono",
          "¿Tiene seguro médico?"
        ],
        "requiereIndicacionMedica": true,
        "materiales": [],
        "personalRequerido": [
          "Medico especialista en Medicina del Dolor"
        ],
        "tiempoEstimadoMin": 45
      },
      {
        "nombre": "Consultas Manejo de Dolor",
        "descripcion": "CONSULTAS",
        "cupsCode": null,
        "preguntar": [
          "¿Dónde se realizaría (domicilio, clínica)?",
          "¿Tipo de dolor, localización, intensidad, tiempo de evolución?",
          "¿Diagnóstico de base o médico tratante?",
          "¿Tratamientos previos (medicamentos, procedimientos)?",
          "¿Tiene estudios de imágenes o laboratorios recientes?",
          "Nombre completo, cédula, dirección, teléfono",
          "¿Tiene seguro médico?"
        ],
        "requiereIndicacionMedica": true,
        "materiales": [],
        "personalRequerido": [
          "Medico especialista en Medicina del Dolor"
        ],
        "tiempoEstimadoMin": 45
      }
    ]
  },
  {
    "grupo": "sonografia",
    "titulo": "Sonografía / Ecografía",
    "total": 17,
    "servicios": [
      {
        "nombre": "Ultrasonografia Diagnostica de Torax: Pericardio o Pleura",
        "descripcion": "IMAGENES",
        "cupsCode": "90.3.8.10",
        "preguntar": [
          "¿Qué tipo de sonografía necesita?",
          "¿Dónde se realiza (domicilio o clínica)?",
          "¿Tiene indicación médica?",
          "¿Paciente encamado o puede trasladarse?",
          "Nombre completo, cédula, dirección, teléfono"
        ],
        "requiereIndicacionMedica": true,
        "materiales": [],
        "personalRequerido": [
          "Radiólogo o ecografista"
        ],
        "tiempoEstimadoMin": 30
      },
      {
        "nombre": "Ultrasonografía de Abdomen Total: Higado, Páncreas, Vesicula, Vias Biliares, Riñones, Bazo, Grandes Vasos, Pelvis y Flancos",
        "descripcion": "IMAGENES",
        "cupsCode": "90.3.5.04",
        "preguntar": [
          "¿Qué tipo de sonografía necesita?",
          "¿Dónde se realiza (domicilio o clínica)?",
          "¿Tiene indicación médica?",
          "¿Paciente encamado o puede trasladarse?",
          "Nombre completo, cédula, dirección, teléfono"
        ],
        "requiereIndicacionMedica": true,
        "materiales": [],
        "personalRequerido": [
          "Radiólogo o ecografista"
        ],
        "tiempoEstimadoMin": 30
      },
      {
        "nombre": "Ultrasonografia de Vias Urinarias (riñones, Vejiga y Prostata Transabdominal)",
        "descripcion": "IMAGENES",
        "cupsCode": "90.3.8.64",
        "preguntar": [
          "¿Qué tipo de sonografía necesita?",
          "¿Dónde se realiza (domicilio o clínica)?",
          "¿Tiene indicación médica?",
          "¿Paciente encamado o puede trasladarse?",
          "Nombre completo, cédula, dirección, teléfono"
        ],
        "requiereIndicacionMedica": true,
        "materiales": [],
        "personalRequerido": [
          "Radiólogo o ecografista"
        ],
        "tiempoEstimadoMin": 30
      },
      {
        "nombre": "Ultrasonografía Obstétrica Transvaginal",
        "descripcion": "IMAGENES",
        "cupsCode": "87.0.0.03",
        "preguntar": [
          "¿Qué tipo de sonografía necesita?",
          "¿Dónde se realiza (domicilio o clínica)?",
          "¿Tiene indicación médica?",
          "¿Paciente encamado o puede trasladarse?",
          "Nombre completo, cédula, dirección, teléfono"
        ],
        "requiereIndicacionMedica": true,
        "materiales": [],
        "personalRequerido": [
          "Radiólogo o ecografista"
        ],
        "tiempoEstimadoMin": 30
      },
      {
        "nombre": "Ultrasonografía Obstetrica Transabdominal §",
        "descripcion": "IMAGENES",
        "cupsCode": "87.1.0.19",
        "preguntar": [
          "¿Qué tipo de sonografía necesita?",
          "¿Dónde se realiza (domicilio o clínica)?",
          "¿Tiene indicación médica?",
          "¿Paciente encamado o puede trasladarse?",
          "Nombre completo, cédula, dirección, teléfono"
        ],
        "requiereIndicacionMedica": true,
        "materiales": [],
        "personalRequerido": [
          "Radiólogo o ecografista"
        ],
        "tiempoEstimadoMin": 30
      },
      {
        "nombre": "Ultrasonografia Diagnostica Cerebral Transfontanelar con Transductor de 7.mhz o Mas",
        "descripcion": "IMAGENES",
        "cupsCode": "81.0.3.02",
        "preguntar": [
          "¿Qué tipo de sonografía necesita?",
          "¿Dónde se realiza (domicilio o clínica)?",
          "¿Tiene indicación médica?",
          "¿Paciente encamado o puede trasladarse?",
          "Nombre completo, cédula, dirección, teléfono"
        ],
        "requiereIndicacionMedica": true,
        "materiales": [],
        "personalRequerido": [
          "Radiólogo o ecografista"
        ],
        "tiempoEstimadoMin": 30
      },
      {
        "nombre": "Ultrasonografia Diagnostica de Tiroides con Transductor de 7 Mhz o Mas",
        "descripcion": "IMAGENES",
        "cupsCode": "81.2.9.07",
        "preguntar": [
          "¿Qué tipo de sonografía necesita?",
          "¿Dónde se realiza (domicilio o clínica)?",
          "¿Tiene indicación médica?",
          "¿Paciente encamado o puede trasladarse?",
          "Nombre completo, cédula, dirección, teléfono"
        ],
        "requiereIndicacionMedica": true,
        "materiales": [],
        "personalRequerido": [
          "Radiólogo o ecografista"
        ],
        "tiempoEstimadoMin": 30
      },
      {
        "nombre": "Ultrasonografia Diagnostica de Mama, con Transductor de 7 Mhz o Mas",
        "descripcion": "IMAGENES",
        "cupsCode": "83.1.4.03",
        "preguntar": [
          "¿Qué tipo de sonografía necesita?",
          "¿Dónde se realiza (domicilio o clínica)?",
          "¿Tiene indicación médica?",
          "¿Paciente encamado o puede trasladarse?",
          "Nombre completo, cédula, dirección, teléfono"
        ],
        "requiereIndicacionMedica": true,
        "materiales": [],
        "personalRequerido": [
          "Radiólogo o ecografista"
        ],
        "tiempoEstimadoMin": 30
      },
      {
        "nombre": "Ultrasonografia Diagnostica Cerebral Transfontanelar con Analisis Doppler",
        "descripcion": "IMAGENES",
        "cupsCode": "91.2.0.02",
        "preguntar": [
          "¿Qué tipo de sonografía necesita?",
          "¿Dónde se realiza (domicilio o clínica)?",
          "¿Tiene indicación médica?",
          "¿Paciente encamado o puede trasladarse?",
          "Nombre completo, cédula, dirección, teléfono"
        ],
        "requiereIndicacionMedica": true,
        "materiales": [],
        "personalRequerido": [
          "Radiólogo o ecografista"
        ],
        "tiempoEstimadoMin": 30
      },
      {
        "nombre": "Ultrasonografia de Abdomen: Masas Abdominales y de Retroperitoneo",
        "descripcion": "IMAGENES",
        "cupsCode": "86.2.3.33",
        "preguntar": [
          "¿Qué tipo de sonografía necesita?",
          "¿Dónde se realiza (domicilio o clínica)?",
          "¿Tiene indicación médica?",
          "¿Paciente encamado o puede trasladarse?",
          "Nombre completo, cédula, dirección, teléfono"
        ],
        "requiereIndicacionMedica": true,
        "materiales": [],
        "personalRequerido": [
          "Radiólogo o ecografista"
        ],
        "tiempoEstimadoMin": 30
      },
      {
        "nombre": "Ultrasonografía de Abdomen Superior: Higado, Páncreas, Vias Biliares, Riñones, Bazo y Grandes Vasos",
        "descripcion": "IMAGENES",
        "cupsCode": "90.2.2.11",
        "preguntar": [
          "¿Qué tipo de sonografía necesita?",
          "¿Dónde se realiza (domicilio o clínica)?",
          "¿Tiene indicación médica?",
          "¿Paciente encamado o puede trasladarse?",
          "Nombre completo, cédula, dirección, teléfono"
        ],
        "requiereIndicacionMedica": true,
        "materiales": [],
        "personalRequerido": [
          "Radiólogo o ecografista"
        ],
        "tiempoEstimadoMin": 30
      },
      {
        "nombre": "Ultrasonografía de Prostata Transrectal",
        "descripcion": "IMAGENES",
        "cupsCode": "86.2.3.31",
        "preguntar": [
          "¿Qué tipo de sonografía necesita?",
          "¿Dónde se realiza (domicilio o clínica)?",
          "¿Tiene indicación médica?",
          "¿Paciente encamado o puede trasladarse?",
          "Nombre completo, cédula, dirección, teléfono"
        ],
        "requiereIndicacionMedica": true,
        "materiales": [],
        "personalRequerido": [
          "Radiólogo o ecografista"
        ],
        "tiempoEstimadoMin": 30
      },
      {
        "nombre": "Ultrasonografía Pelvica Ginecologica Transabdominal",
        "descripcion": "IMAGENES",
        "cupsCode": "86.2.3.27",
        "preguntar": [
          "¿Qué tipo de sonografía necesita?",
          "¿Dónde se realiza (domicilio o clínica)?",
          "¿Tiene indicación médica?",
          "¿Paciente encamado o puede trasladarse?",
          "Nombre completo, cédula, dirección, teléfono"
        ],
        "requiereIndicacionMedica": true,
        "materiales": [],
        "personalRequerido": [
          "Radiólogo o ecografista"
        ],
        "tiempoEstimadoMin": 30
      },
      {
        "nombre": "Ultrasonografia de Riñones, Bazo, Aorta o Adrenales",
        "descripcion": "IMAGENES",
        "cupsCode": "90.6.8.28",
        "preguntar": [
          "¿Qué tipo de sonografía necesita?",
          "¿Dónde se realiza (domicilio o clínica)?",
          "¿Tiene indicación médica?",
          "¿Paciente encamado o puede trasladarse?",
          "Nombre completo, cédula, dirección, teléfono"
        ],
        "requiereIndicacionMedica": true,
        "materiales": [],
        "personalRequerido": [
          "Radiólogo o ecografista"
        ],
        "tiempoEstimadoMin": 30
      },
      {
        "nombre": "Ultrasonografia Testicular con Analisis Doppler",
        "descripcion": "IMAGENES",
        "cupsCode": "86.2.3.25",
        "preguntar": [
          "¿Qué tipo de sonografía necesita?",
          "¿Dónde se realiza (domicilio o clínica)?",
          "¿Tiene indicación médica?",
          "¿Paciente encamado o puede trasladarse?",
          "Nombre completo, cédula, dirección, teléfono"
        ],
        "requiereIndicacionMedica": true,
        "materiales": [],
        "personalRequerido": [
          "Radiólogo o ecografista"
        ],
        "tiempoEstimadoMin": 30
      },
      {
        "nombre": "Ultrasonografía Pelvica Ginecologica Transvaginal",
        "descripcion": "IMAGENES",
        "cupsCode": "86.2.3.26",
        "preguntar": [
          "¿Qué tipo de sonografía necesita?",
          "¿Dónde se realiza (domicilio o clínica)?",
          "¿Tiene indicación médica?",
          "¿Paciente encamado o puede trasladarse?",
          "Nombre completo, cédula, dirección, teléfono"
        ],
        "requiereIndicacionMedica": true,
        "materiales": [],
        "personalRequerido": [
          "Radiólogo o ecografista"
        ],
        "tiempoEstimadoMin": 30
      },
      {
        "nombre": "Ultrasonografía de Prostata Transabdominal",
        "descripcion": "IMAGENES",
        "cupsCode": "86.2.3.32",
        "preguntar": [
          "¿Qué tipo de sonografía necesita?",
          "¿Dónde se realiza (domicilio o clínica)?",
          "¿Tiene indicación médica?",
          "¿Paciente encamado o puede trasladarse?",
          "Nombre completo, cédula, dirección, teléfono"
        ],
        "requiereIndicacionMedica": true,
        "materiales": [],
        "personalRequerido": [
          "Radiólogo o ecografista"
        ],
        "tiempoEstimadoMin": 30
      }
    ]
  },
  {
    "grupo": "doppler_vascular",
    "titulo": "Doppler Vascular",
    "total": 6,
    "servicios": [
      {
        "nombre": "Doppler de Otros Vasos Perifericos del Cuello Ncoc",
        "descripcion": "IMAGENES",
        "cupsCode": "10",
        "preguntar": [
          "¿Qué área evaluar (extremidad inferior, superior, carótidas)?",
          "¿Cuál es el motivo del estudio (dolor, hinchazón, várices)?",
          "¿Tiene indicación médica?",
          "¿Dónde se realiza (domicilio o clínica)?",
          "Nombre completo, cédula, dirección, teléfono"
        ],
        "requiereIndicacionMedica": true,
        "materiales": [],
        "personalRequerido": [
          "Radiólogo vascular"
        ],
        "tiempoEstimadoMin": 45
      },
      {
        "nombre": "Doppler de Vasos Arteriales de Miembros Superiores",
        "descripcion": "IMAGENES",
        "cupsCode": "10",
        "preguntar": [
          "¿Qué área evaluar (extremidad inferior, superior, carótidas)?",
          "¿Cuál es el motivo del estudio (dolor, hinchazón, várices)?",
          "¿Tiene indicación médica?",
          "¿Dónde se realiza (domicilio o clínica)?",
          "Nombre completo, cédula, dirección, teléfono"
        ],
        "requiereIndicacionMedica": true,
        "materiales": [],
        "personalRequerido": [
          "Radiólogo vascular"
        ],
        "tiempoEstimadoMin": 45
      },
      {
        "nombre": "Doppler de Vasos Arteriales de Miembros Inferiores",
        "descripcion": "IMAGENES",
        "cupsCode": "10",
        "preguntar": [
          "¿Qué área evaluar (extremidad inferior, superior, carótidas)?",
          "¿Cuál es el motivo del estudio (dolor, hinchazón, várices)?",
          "¿Tiene indicación médica?",
          "¿Dónde se realiza (domicilio o clínica)?",
          "Nombre completo, cédula, dirección, teléfono"
        ],
        "requiereIndicacionMedica": true,
        "materiales": [],
        "personalRequerido": [
          "Radiólogo vascular"
        ],
        "tiempoEstimadoMin": 45
      },
      {
        "nombre": "Doppler de Vasos Renales",
        "descripcion": "IMAGENES",
        "cupsCode": "10",
        "preguntar": [
          "¿Qué área evaluar (extremidad inferior, superior, carótidas)?",
          "¿Cuál es el motivo del estudio (dolor, hinchazón, várices)?",
          "¿Tiene indicación médica?",
          "¿Dónde se realiza (domicilio o clínica)?",
          "Nombre completo, cédula, dirección, teléfono"
        ],
        "requiereIndicacionMedica": true,
        "materiales": [],
        "personalRequerido": [
          "Radiólogo vascular"
        ],
        "tiempoEstimadoMin": 45
      },
      {
        "nombre": "Doppler de Vasos Venosos de Miembros Inferiores",
        "descripcion": "IMAGENES",
        "cupsCode": "10",
        "preguntar": [
          "¿Qué área evaluar (extremidad inferior, superior, carótidas)?",
          "¿Cuál es el motivo del estudio (dolor, hinchazón, várices)?",
          "¿Tiene indicación médica?",
          "¿Dónde se realiza (domicilio o clínica)?",
          "Nombre completo, cédula, dirección, teléfono"
        ],
        "requiereIndicacionMedica": true,
        "materiales": [],
        "personalRequerido": [
          "Radiólogo vascular"
        ],
        "tiempoEstimadoMin": 45
      },
      {
        "nombre": "Doppler de Vasos Venosos de Miembros Superiores",
        "descripcion": "IMAGENES",
        "cupsCode": "10",
        "preguntar": [
          "¿Qué área evaluar (extremidad inferior, superior, carótidas)?",
          "¿Cuál es el motivo del estudio (dolor, hinchazón, várices)?",
          "¿Tiene indicación médica?",
          "¿Dónde se realiza (domicilio o clínica)?",
          "Nombre completo, cédula, dirección, teléfono"
        ],
        "requiereIndicacionMedica": true,
        "materiales": [],
        "personalRequerido": [
          "Radiólogo vascular"
        ],
        "tiempoEstimadoMin": 45
      }
    ]
  },
  {
    "grupo": "rayos_x",
    "titulo": "Rayos X",
    "total": 53,
    "servicios": [
      {
        "nombre": "Radiografia de Craneo Simple",
        "descripcion": "IMAGENES",
        "cupsCode": "45.2.4.01",
        "preguntar": [
          "¿Qué área del cuerpo necesita (tórax, columna, extremidad, abdomen)?",
          "¿Dónde se toma la placa (domicilio o clínica)?",
          "¿Tiene indicación médica?",
          "¿Paciente puede movilizarse o está encamado?",
          "Nombre completo, cédula, dirección, teléfono"
        ],
        "requiereIndicacionMedica": true,
        "materiales": [],
        "personalRequerido": [
          "Tecnico de radiología",
          "Radiólogo (lectura)"
        ],
        "tiempoEstimadoMin": 30
      },
      {
        "nombre": "Radiografia de Base de Craneo",
        "descripcion": "IMAGENES",
        "cupsCode": "88.3.3.04",
        "preguntar": [
          "¿Qué área del cuerpo necesita (tórax, columna, extremidad, abdomen)?",
          "¿Dónde se toma la placa (domicilio o clínica)?",
          "¿Tiene indicación médica?",
          "¿Paciente puede movilizarse o está encamado?",
          "Nombre completo, cédula, dirección, teléfono"
        ],
        "requiereIndicacionMedica": true,
        "materiales": [],
        "personalRequerido": [
          "Tecnico de radiología",
          "Radiólogo (lectura)"
        ],
        "tiempoEstimadoMin": 30
      },
      {
        "nombre": "Radiografia de Cara (perfilograma)",
        "descripcion": "IMAGENES",
        "cupsCode": "90.3.8.61",
        "preguntar": [
          "¿Qué área del cuerpo necesita (tórax, columna, extremidad, abdomen)?",
          "¿Dónde se toma la placa (domicilio o clínica)?",
          "¿Tiene indicación médica?",
          "¿Paciente puede movilizarse o está encamado?",
          "Nombre completo, cédula, dirección, teléfono"
        ],
        "requiereIndicacionMedica": true,
        "materiales": [],
        "personalRequerido": [
          "Tecnico de radiología",
          "Radiólogo (lectura)"
        ],
        "tiempoEstimadoMin": 30
      },
      {
        "nombre": "Radiografia de Senos Paranasales",
        "descripcion": "IMAGENES",
        "cupsCode": "90.6.2.22",
        "preguntar": [
          "¿Qué área del cuerpo necesita (tórax, columna, extremidad, abdomen)?",
          "¿Dónde se toma la placa (domicilio o clínica)?",
          "¿Tiene indicación médica?",
          "¿Paciente puede movilizarse o está encamado?",
          "Nombre completo, cédula, dirección, teléfono"
        ],
        "requiereIndicacionMedica": true,
        "materiales": [],
        "personalRequerido": [
          "Tecnico de radiología",
          "Radiólogo (lectura)"
        ],
        "tiempoEstimadoMin": 30
      },
      {
        "nombre": "Radiografia Panoramica de Maxilares, Superior E Inferior (ortopantomografia)",
        "descripcion": "IMAGENES",
        "cupsCode": "90.3.7.03",
        "preguntar": [
          "¿Qué área del cuerpo necesita (tórax, columna, extremidad, abdomen)?",
          "¿Dónde se toma la placa (domicilio o clínica)?",
          "¿Tiene indicación médica?",
          "¿Paciente puede movilizarse o está encamado?",
          "Nombre completo, cédula, dirección, teléfono"
        ],
        "requiereIndicacionMedica": true,
        "materiales": [],
        "personalRequerido": [
          "Tecnico de radiología",
          "Radiólogo (lectura)"
        ],
        "tiempoEstimadoMin": 30
      },
      {
        "nombre": "Radiografia de Articulacion Temporomaxilar (atm)",
        "descripcion": "IMAGENES",
        "cupsCode": "90.3.8.10",
        "preguntar": [
          "¿Qué área del cuerpo necesita (tórax, columna, extremidad, abdomen)?",
          "¿Dónde se toma la placa (domicilio o clínica)?",
          "¿Tiene indicación médica?",
          "¿Paciente puede movilizarse o está encamado?",
          "Nombre completo, cédula, dirección, teléfono"
        ],
        "requiereIndicacionMedica": true,
        "materiales": [],
        "personalRequerido": [
          "Tecnico de radiología",
          "Radiólogo (lectura)"
        ],
        "tiempoEstimadoMin": 30
      },
      {
        "nombre": "Radiografia de Cavum Faringeo",
        "descripcion": "IMAGENES",
        "cupsCode": "90.3.8.13",
        "preguntar": [
          "¿Qué área del cuerpo necesita (tórax, columna, extremidad, abdomen)?",
          "¿Dónde se toma la placa (domicilio o clínica)?",
          "¿Tiene indicación médica?",
          "¿Paciente puede movilizarse o está encamado?",
          "Nombre completo, cédula, dirección, teléfono"
        ],
        "requiereIndicacionMedica": true,
        "materiales": [],
        "personalRequerido": [
          "Tecnico de radiología",
          "Radiólogo (lectura)"
        ],
        "tiempoEstimadoMin": 30
      },
      {
        "nombre": "Radiografia de Columna Cervical",
        "descripcion": "IMAGENES",
        "cupsCode": "90.2.2.20",
        "preguntar": [
          "¿Qué área del cuerpo necesita (tórax, columna, extremidad, abdomen)?",
          "¿Dónde se toma la placa (domicilio o clínica)?",
          "¿Tiene indicación médica?",
          "¿Paciente puede movilizarse o está encamado?",
          "Nombre completo, cédula, dirección, teléfono"
        ],
        "requiereIndicacionMedica": true,
        "materiales": [],
        "personalRequerido": [
          "Tecnico de radiología",
          "Radiólogo (lectura)"
        ],
        "tiempoEstimadoMin": 30
      },
      {
        "nombre": "Radiografia de Columna Union Cervico Dorsal",
        "descripcion": "IMAGENES",
        "cupsCode": "90.6.2.07",
        "preguntar": [
          "¿Qué área del cuerpo necesita (tórax, columna, extremidad, abdomen)?",
          "¿Dónde se toma la placa (domicilio o clínica)?",
          "¿Tiene indicación médica?",
          "¿Paciente puede movilizarse o está encamado?",
          "Nombre completo, cédula, dirección, teléfono"
        ],
        "requiereIndicacionMedica": true,
        "materiales": [],
        "personalRequerido": [
          "Tecnico de radiología",
          "Radiólogo (lectura)"
        ],
        "tiempoEstimadoMin": 30
      },
      {
        "nombre": "Radiografia de Columna Toracica",
        "descripcion": "IMAGENES",
        "cupsCode": "90.3.8.49",
        "preguntar": [
          "¿Qué área del cuerpo necesita (tórax, columna, extremidad, abdomen)?",
          "¿Dónde se toma la placa (domicilio o clínica)?",
          "¿Tiene indicación médica?",
          "¿Paciente puede movilizarse o está encamado?",
          "Nombre completo, cédula, dirección, teléfono"
        ],
        "requiereIndicacionMedica": true,
        "materiales": [],
        "personalRequerido": [
          "Tecnico de radiología",
          "Radiólogo (lectura)"
        ],
        "tiempoEstimadoMin": 30
      },
      {
        "nombre": "Radiografia de Columna Dorsolumbar",
        "descripcion": "IMAGENES",
        "cupsCode": "90.6.4.22",
        "preguntar": [
          "¿Qué área del cuerpo necesita (tórax, columna, extremidad, abdomen)?",
          "¿Dónde se toma la placa (domicilio o clínica)?",
          "¿Tiene indicación médica?",
          "¿Paciente puede movilizarse o está encamado?",
          "Nombre completo, cédula, dirección, teléfono"
        ],
        "requiereIndicacionMedica": true,
        "materiales": [],
        "personalRequerido": [
          "Tecnico de radiología",
          "Radiólogo (lectura)"
        ],
        "tiempoEstimadoMin": 30
      },
      {
        "nombre": "Radiografia de Sacro Coccix",
        "descripcion": "IMAGENES",
        "cupsCode": "90.6.2.49",
        "preguntar": [
          "¿Qué área del cuerpo necesita (tórax, columna, extremidad, abdomen)?",
          "¿Dónde se toma la placa (domicilio o clínica)?",
          "¿Tiene indicación médica?",
          "¿Paciente puede movilizarse o está encamado?",
          "Nombre completo, cédula, dirección, teléfono"
        ],
        "requiereIndicacionMedica": true,
        "materiales": [],
        "personalRequerido": [
          "Tecnico de radiología",
          "Radiólogo (lectura)"
        ],
        "tiempoEstimadoMin": 30
      },
      {
        "nombre": "Radiografia de Torax (p.a. o A.p y Lateral, Decubito Lateral, Oblicuas o Lateral con Bario)",
        "descripcion": "IMAGENES",
        "cupsCode": "90.3.8.62",
        "preguntar": [
          "¿Qué área del cuerpo necesita (tórax, columna, extremidad, abdomen)?",
          "¿Dónde se toma la placa (domicilio o clínica)?",
          "¿Tiene indicación médica?",
          "¿Paciente puede movilizarse o está encamado?",
          "Nombre completo, cédula, dirección, teléfono"
        ],
        "requiereIndicacionMedica": true,
        "materiales": [],
        "personalRequerido": [
          "Tecnico de radiología",
          "Radiólogo (lectura)"
        ],
        "tiempoEstimadoMin": 30
      },
      {
        "nombre": "Radiografia de Esófago",
        "descripcion": "IMAGENES",
        "cupsCode": "90.3.1.13",
        "preguntar": [
          "¿Qué área del cuerpo necesita (tórax, columna, extremidad, abdomen)?",
          "¿Dónde se toma la placa (domicilio o clínica)?",
          "¿Tiene indicación médica?",
          "¿Paciente puede movilizarse o está encamado?",
          "Nombre completo, cédula, dirección, teléfono"
        ],
        "requiereIndicacionMedica": true,
        "materiales": [],
        "personalRequerido": [
          "Tecnico de radiología",
          "Radiólogo (lectura)"
        ],
        "tiempoEstimadoMin": 30
      },
      {
        "nombre": "Radiografia de Abdomen Simple",
        "descripcion": "IMAGENES",
        "cupsCode": "87.1.0.10",
        "preguntar": [
          "¿Qué área del cuerpo necesita (tórax, columna, extremidad, abdomen)?",
          "¿Dónde se toma la placa (domicilio o clínica)?",
          "¿Tiene indicación médica?",
          "¿Paciente puede movilizarse o está encamado?",
          "Nombre completo, cédula, dirección, teléfono"
        ],
        "requiereIndicacionMedica": true,
        "materiales": [],
        "personalRequerido": [
          "Tecnico de radiología",
          "Radiólogo (lectura)"
        ],
        "tiempoEstimadoMin": 30
      },
      {
        "nombre": "Radiografia de Colon por Enema con Doble Contraste",
        "descripcion": "IMAGENES",
        "cupsCode": "87.3.3.33",
        "preguntar": [
          "¿Qué área del cuerpo necesita (tórax, columna, extremidad, abdomen)?",
          "¿Dónde se toma la placa (domicilio o clínica)?",
          "¿Tiene indicación médica?",
          "¿Paciente puede movilizarse o está encamado?",
          "Nombre completo, cédula, dirección, teléfono"
        ],
        "requiereIndicacionMedica": true,
        "materiales": [],
        "personalRequerido": [
          "Tecnico de radiología",
          "Radiólogo (lectura)"
        ],
        "tiempoEstimadoMin": 30
      },
      {
        "nombre": "Radiografia de Vias Digestivas Altas (esofago, Estomago y Duodeno) y Transito Intestinal",
        "descripcion": "IMAGENES",
        "cupsCode": "88.1.3.05",
        "preguntar": [
          "¿Qué área del cuerpo necesita (tórax, columna, extremidad, abdomen)?",
          "¿Dónde se toma la placa (domicilio o clínica)?",
          "¿Tiene indicación médica?",
          "¿Paciente puede movilizarse o está encamado?",
          "Nombre completo, cédula, dirección, teléfono"
        ],
        "requiereIndicacionMedica": true,
        "materiales": [],
        "personalRequerido": [
          "Tecnico de radiología",
          "Radiólogo (lectura)"
        ],
        "tiempoEstimadoMin": 30
      },
      {
        "nombre": "Radiografia de Vias Digestivas Altas (esofago, Estomago y Duodeno) con Doble Contraste",
        "descripcion": "IMAGENES",
        "cupsCode": "87.7.8.61",
        "preguntar": [
          "¿Qué área del cuerpo necesita (tórax, columna, extremidad, abdomen)?",
          "¿Dónde se toma la placa (domicilio o clínica)?",
          "¿Tiene indicación médica?",
          "¿Paciente puede movilizarse o está encamado?",
          "Nombre completo, cédula, dirección, teléfono"
        ],
        "requiereIndicacionMedica": true,
        "materiales": [],
        "personalRequerido": [
          "Tecnico de radiología",
          "Radiólogo (lectura)"
        ],
        "tiempoEstimadoMin": 30
      },
      {
        "nombre": "Radiografia de Colon por Enema o Colon por Ingesta",
        "descripcion": "IMAGENES",
        "cupsCode": "87.2.1.05",
        "preguntar": [
          "¿Qué área del cuerpo necesita (tórax, columna, extremidad, abdomen)?",
          "¿Dónde se toma la placa (domicilio o clínica)?",
          "¿Tiene indicación médica?",
          "¿Paciente puede movilizarse o está encamado?",
          "Nombre completo, cédula, dirección, teléfono"
        ],
        "requiereIndicacionMedica": true,
        "materiales": [],
        "personalRequerido": [
          "Tecnico de radiología",
          "Radiólogo (lectura)"
        ],
        "tiempoEstimadoMin": 30
      },
      {
        "nombre": "Radiografia de Humero",
        "descripcion": "IMAGENES",
        "cupsCode": "89.5.2.01",
        "preguntar": [
          "¿Qué área del cuerpo necesita (tórax, columna, extremidad, abdomen)?",
          "¿Dónde se toma la placa (domicilio o clínica)?",
          "¿Tiene indicación médica?",
          "¿Paciente puede movilizarse o está encamado?",
          "Nombre completo, cédula, dirección, teléfono"
        ],
        "requiereIndicacionMedica": true,
        "materiales": [],
        "personalRequerido": [
          "Tecnico de radiología",
          "Radiólogo (lectura)"
        ],
        "tiempoEstimadoMin": 30
      },
      {
        "nombre": "Radiografia de Hombro",
        "descripcion": "IMAGENES",
        "cupsCode": "87.9.1.11",
        "preguntar": [
          "¿Qué área del cuerpo necesita (tórax, columna, extremidad, abdomen)?",
          "¿Dónde se toma la placa (domicilio o clínica)?",
          "¿Tiene indicación médica?",
          "¿Paciente puede movilizarse o está encamado?",
          "Nombre completo, cédula, dirección, teléfono"
        ],
        "requiereIndicacionMedica": true,
        "materiales": [],
        "personalRequerido": [
          "Tecnico de radiología",
          "Radiólogo (lectura)"
        ],
        "tiempoEstimadoMin": 30
      },
      {
        "nombre": "Radiografia de Pierna Ap y Lateral",
        "descripcion": "IMAGENES",
        "cupsCode": "88.1.1.18",
        "preguntar": [
          "¿Qué área del cuerpo necesita (tórax, columna, extremidad, abdomen)?",
          "¿Dónde se toma la placa (domicilio o clínica)?",
          "¿Tiene indicación médica?",
          "¿Paciente puede movilizarse o está encamado?",
          "Nombre completo, cédula, dirección, teléfono"
        ],
        "requiereIndicacionMedica": true,
        "materiales": [],
        "personalRequerido": [
          "Tecnico de radiología",
          "Radiólogo (lectura)"
        ],
        "tiempoEstimadoMin": 30
      },
      {
        "nombre": "Radiografia de Muñeca",
        "descripcion": "IMAGENES",
        "cupsCode": "0",
        "preguntar": [
          "¿Qué área del cuerpo necesita (tórax, columna, extremidad, abdomen)?",
          "¿Dónde se toma la placa (domicilio o clínica)?",
          "¿Tiene indicación médica?",
          "¿Paciente puede movilizarse o está encamado?",
          "Nombre completo, cédula, dirección, teléfono"
        ],
        "requiereIndicacionMedica": true,
        "materiales": [],
        "personalRequerido": [
          "Tecnico de radiología",
          "Radiólogo (lectura)"
        ],
        "tiempoEstimadoMin": 30
      },
      {
        "nombre": "Radiografia de Femur Ap y Lateral",
        "descripcion": "IMAGENES",
        "cupsCode": "90.3.4.37",
        "preguntar": [
          "¿Qué área del cuerpo necesita (tórax, columna, extremidad, abdomen)?",
          "¿Dónde se toma la placa (domicilio o clínica)?",
          "¿Tiene indicación médica?",
          "¿Paciente puede movilizarse o está encamado?",
          "Nombre completo, cédula, dirección, teléfono"
        ],
        "requiereIndicacionMedica": true,
        "materiales": [],
        "personalRequerido": [
          "Tecnico de radiología",
          "Radiólogo (lectura)"
        ],
        "tiempoEstimadoMin": 30
      },
      {
        "nombre": "Radiografia de Codo",
        "descripcion": "IMAGENES",
        "cupsCode": "91.2.0.04",
        "preguntar": [
          "¿Qué área del cuerpo necesita (tórax, columna, extremidad, abdomen)?",
          "¿Dónde se toma la placa (domicilio o clínica)?",
          "¿Tiene indicación médica?",
          "¿Paciente puede movilizarse o está encamado?",
          "Nombre completo, cédula, dirección, teléfono"
        ],
        "requiereIndicacionMedica": true,
        "materiales": [],
        "personalRequerido": [
          "Tecnico de radiología",
          "Radiólogo (lectura)"
        ],
        "tiempoEstimadoMin": 30
      },
      {
        "nombre": "Radiografia de Pie Ap y Lateral",
        "descripcion": "IMAGENES",
        "cupsCode": "92.2.4.18",
        "preguntar": [
          "¿Qué área del cuerpo necesita (tórax, columna, extremidad, abdomen)?",
          "¿Dónde se toma la placa (domicilio o clínica)?",
          "¿Tiene indicación médica?",
          "¿Paciente puede movilizarse o está encamado?",
          "Nombre completo, cédula, dirección, teléfono"
        ],
        "requiereIndicacionMedica": true,
        "materiales": [],
        "personalRequerido": [
          "Tecnico de radiología",
          "Radiólogo (lectura)"
        ],
        "tiempoEstimadoMin": 30
      },
      {
        "nombre": "Radiografia de Cadera o Articulacion Coxo-femoral (ap, Lateral)",
        "descripcion": "IMAGENES",
        "cupsCode": "92.2.1.00",
        "preguntar": [
          "¿Qué área del cuerpo necesita (tórax, columna, extremidad, abdomen)?",
          "¿Dónde se toma la placa (domicilio o clínica)?",
          "¿Tiene indicación médica?",
          "¿Paciente puede movilizarse o está encamado?",
          "Nombre completo, cédula, dirección, teléfono"
        ],
        "requiereIndicacionMedica": true,
        "materiales": [],
        "personalRequerido": [
          "Tecnico de radiología",
          "Radiólogo (lectura)"
        ],
        "tiempoEstimadoMin": 30
      },
      {
        "nombre": "Radiografia de Cadera Comparativa",
        "descripcion": "IMAGENES",
        "cupsCode": "99.2.5.04",
        "preguntar": [
          "¿Qué área del cuerpo necesita (tórax, columna, extremidad, abdomen)?",
          "¿Dónde se toma la placa (domicilio o clínica)?",
          "¿Tiene indicación médica?",
          "¿Paciente puede movilizarse o está encamado?",
          "Nombre completo, cédula, dirección, teléfono"
        ],
        "requiereIndicacionMedica": true,
        "materiales": [],
        "personalRequerido": [
          "Tecnico de radiología",
          "Radiólogo (lectura)"
        ],
        "tiempoEstimadoMin": 30
      },
      {
        "nombre": "Radiografia de Tobillo Ap Lateral y Rotacion Interna",
        "descripcion": "IMAGENES",
        "cupsCode": "02.0.2.02",
        "preguntar": [
          "¿Qué área del cuerpo necesita (tórax, columna, extremidad, abdomen)?",
          "¿Dónde se toma la placa (domicilio o clínica)?",
          "¿Tiene indicación médica?",
          "¿Paciente puede movilizarse o está encamado?",
          "Nombre completo, cédula, dirección, teléfono"
        ],
        "requiereIndicacionMedica": true,
        "materiales": [],
        "personalRequerido": [
          "Tecnico de radiología",
          "Radiólogo (lectura)"
        ],
        "tiempoEstimadoMin": 30
      },
      {
        "nombre": "Radiografia de Rodilla Ap, Lateral",
        "descripcion": "IMAGENES",
        "cupsCode": "99.2.5.10",
        "preguntar": [
          "¿Qué área del cuerpo necesita (tórax, columna, extremidad, abdomen)?",
          "¿Dónde se toma la placa (domicilio o clínica)?",
          "¿Tiene indicación médica?",
          "¿Paciente puede movilizarse o está encamado?",
          "Nombre completo, cédula, dirección, teléfono"
        ],
        "requiereIndicacionMedica": true,
        "materiales": [],
        "personalRequerido": [
          "Tecnico de radiología",
          "Radiólogo (lectura)"
        ],
        "tiempoEstimadoMin": 30
      },
      {
        "nombre": "Radiografia de Antepie Ap y Oblicua",
        "descripcion": "IMAGENES",
        "cupsCode": "90.1.2.09",
        "preguntar": [
          "¿Qué área del cuerpo necesita (tórax, columna, extremidad, abdomen)?",
          "¿Dónde se toma la placa (domicilio o clínica)?",
          "¿Tiene indicación médica?",
          "¿Paciente puede movilizarse o está encamado?",
          "Nombre completo, cédula, dirección, teléfono"
        ],
        "requiereIndicacionMedica": true,
        "materiales": [],
        "personalRequerido": [
          "Tecnico de radiología",
          "Radiólogo (lectura)"
        ],
        "tiempoEstimadoMin": 30
      },
      {
        "nombre": "Radiografia de Arco Cigomatico",
        "descripcion": "IMAGENES",
        "cupsCode": "90.4.5.08",
        "preguntar": [
          "¿Qué área del cuerpo necesita (tórax, columna, extremidad, abdomen)?",
          "¿Dónde se toma la placa (domicilio o clínica)?",
          "¿Tiene indicación médica?",
          "¿Paciente puede movilizarse o está encamado?",
          "Nombre completo, cédula, dirección, teléfono"
        ],
        "requiereIndicacionMedica": true,
        "materiales": [],
        "personalRequerido": [
          "Tecnico de radiología",
          "Radiólogo (lectura)"
        ],
        "tiempoEstimadoMin": 30
      },
      {
        "nombre": "Radiografia de Articulaciones Acromio Claviculares Comparativas",
        "descripcion": "IMAGENES",
        "cupsCode": "90.2.2.18",
        "preguntar": [
          "¿Qué área del cuerpo necesita (tórax, columna, extremidad, abdomen)?",
          "¿Dónde se toma la placa (domicilio o clínica)?",
          "¿Tiene indicación médica?",
          "¿Paciente puede movilizarse o está encamado?",
          "Nombre completo, cédula, dirección, teléfono"
        ],
        "requiereIndicacionMedica": true,
        "materiales": [],
        "personalRequerido": [
          "Tecnico de radiología",
          "Radiólogo (lectura)"
        ],
        "tiempoEstimadoMin": 30
      },
      {
        "nombre": "Radiografia de Articulaciones Esternoclaviculares",
        "descripcion": "IMAGENES",
        "cupsCode": "90.2.2.04",
        "preguntar": [
          "¿Qué área del cuerpo necesita (tórax, columna, extremidad, abdomen)?",
          "¿Dónde se toma la placa (domicilio o clínica)?",
          "¿Tiene indicación médica?",
          "¿Paciente puede movilizarse o está encamado?",
          "Nombre completo, cédula, dirección, teléfono"
        ],
        "requiereIndicacionMedica": true,
        "materiales": [],
        "personalRequerido": [
          "Tecnico de radiología",
          "Radiólogo (lectura)"
        ],
        "tiempoEstimadoMin": 30
      },
      {
        "nombre": "Radiografia de Calcaneo Axial y Lateral",
        "descripcion": "IMAGENES",
        "cupsCode": "90.3.8.50",
        "preguntar": [
          "¿Qué área del cuerpo necesita (tórax, columna, extremidad, abdomen)?",
          "¿Dónde se toma la placa (domicilio o clínica)?",
          "¿Tiene indicación médica?",
          "¿Paciente puede movilizarse o está encamado?",
          "Nombre completo, cédula, dirección, teléfono"
        ],
        "requiereIndicacionMedica": true,
        "materiales": [],
        "personalRequerido": [
          "Tecnico de radiología",
          "Radiólogo (lectura)"
        ],
        "tiempoEstimadoMin": 30
      },
      {
        "nombre": "Radiografia de Clavicula",
        "descripcion": "IMAGENES",
        "cupsCode": "90.3.8.52",
        "preguntar": [
          "¿Qué área del cuerpo necesita (tórax, columna, extremidad, abdomen)?",
          "¿Dónde se toma la placa (domicilio o clínica)?",
          "¿Tiene indicación médica?",
          "¿Paciente puede movilizarse o está encamado?",
          "Nombre completo, cédula, dirección, teléfono"
        ],
        "requiereIndicacionMedica": true,
        "materiales": [],
        "personalRequerido": [
          "Tecnico de radiología",
          "Radiólogo (lectura)"
        ],
        "tiempoEstimadoMin": 30
      },
      {
        "nombre": "Radiografia de Esternon",
        "descripcion": "IMAGENES",
        "cupsCode": "90.3.5.04",
        "preguntar": [
          "¿Qué área del cuerpo necesita (tórax, columna, extremidad, abdomen)?",
          "¿Dónde se toma la placa (domicilio o clínica)?",
          "¿Tiene indicación médica?",
          "¿Paciente puede movilizarse o está encamado?",
          "Nombre completo, cédula, dirección, teléfono"
        ],
        "requiereIndicacionMedica": true,
        "materiales": [],
        "personalRequerido": [
          "Tecnico de radiología",
          "Radiólogo (lectura)"
        ],
        "tiempoEstimadoMin": 30
      },
      {
        "nombre": "Radiografia de Silla Turca",
        "descripcion": "IMAGENES",
        "cupsCode": "90.3.8.39",
        "preguntar": [
          "¿Qué área del cuerpo necesita (tórax, columna, extremidad, abdomen)?",
          "¿Dónde se toma la placa (domicilio o clínica)?",
          "¿Tiene indicación médica?",
          "¿Paciente puede movilizarse o está encamado?",
          "Nombre completo, cédula, dirección, teléfono"
        ],
        "requiereIndicacionMedica": true,
        "materiales": [],
        "personalRequerido": [
          "Tecnico de radiología",
          "Radiólogo (lectura)"
        ],
        "tiempoEstimadoMin": 30
      },
      {
        "nombre": "Radiografia de Columna Vertebral Total §",
        "descripcion": "IMAGENES",
        "cupsCode": "90.4.1.07",
        "preguntar": [
          "¿Qué área del cuerpo necesita (tórax, columna, extremidad, abdomen)?",
          "¿Dónde se toma la placa (domicilio o clínica)?",
          "¿Tiene indicación médica?",
          "¿Paciente puede movilizarse o está encamado?",
          "Nombre completo, cédula, dirección, teléfono"
        ],
        "requiereIndicacionMedica": true,
        "materiales": [],
        "personalRequerido": [
          "Tecnico de radiología",
          "Radiólogo (lectura)"
        ],
        "tiempoEstimadoMin": 30
      },
      {
        "nombre": "Radiografia de Columna Lumbosacra",
        "descripcion": "IMAGENES",
        "cupsCode": "90.6.3.18",
        "preguntar": [
          "¿Qué área del cuerpo necesita (tórax, columna, extremidad, abdomen)?",
          "¿Dónde se toma la placa (domicilio o clínica)?",
          "¿Tiene indicación médica?",
          "¿Paciente puede movilizarse o está encamado?",
          "Nombre completo, cédula, dirección, teléfono"
        ],
        "requiereIndicacionMedica": true,
        "materiales": [],
        "personalRequerido": [
          "Tecnico de radiología",
          "Radiólogo (lectura)"
        ],
        "tiempoEstimadoMin": 30
      },
      {
        "nombre": "Radiografia de Tejidos Blandos de Cuello",
        "descripcion": "IMAGENES",
        "cupsCode": "90.3.8.45",
        "preguntar": [
          "¿Qué área del cuerpo necesita (tórax, columna, extremidad, abdomen)?",
          "¿Dónde se toma la placa (domicilio o clínica)?",
          "¿Tiene indicación médica?",
          "¿Paciente puede movilizarse o está encamado?",
          "Nombre completo, cédula, dirección, teléfono"
        ],
        "requiereIndicacionMedica": true,
        "materiales": [],
        "personalRequerido": [
          "Tecnico de radiología",
          "Radiólogo (lectura)"
        ],
        "tiempoEstimadoMin": 30
      },
      {
        "nombre": "Radiografia de Reja Costal",
        "descripcion": "IMAGENES",
        "cupsCode": "90.2.2.17",
        "preguntar": [
          "¿Qué área del cuerpo necesita (tórax, columna, extremidad, abdomen)?",
          "¿Dónde se toma la placa (domicilio o clínica)?",
          "¿Tiene indicación médica?",
          "¿Paciente puede movilizarse o está encamado?",
          "Nombre completo, cédula, dirección, teléfono"
        ],
        "requiereIndicacionMedica": true,
        "materiales": [],
        "personalRequerido": [
          "Tecnico de radiología",
          "Radiólogo (lectura)"
        ],
        "tiempoEstimadoMin": 30
      },
      {
        "nombre": "Radiografia de Orbitas",
        "descripcion": "IMAGENES",
        "cupsCode": "90.3.8.36",
        "preguntar": [
          "¿Qué área del cuerpo necesita (tórax, columna, extremidad, abdomen)?",
          "¿Dónde se toma la placa (domicilio o clínica)?",
          "¿Tiene indicación médica?",
          "¿Paciente puede movilizarse o está encamado?",
          "Nombre completo, cédula, dirección, teléfono"
        ],
        "requiereIndicacionMedica": true,
        "materiales": [],
        "personalRequerido": [
          "Tecnico de radiología",
          "Radiólogo (lectura)"
        ],
        "tiempoEstimadoMin": 30
      },
      {
        "nombre": "Radiografia de Maxilar Inferior",
        "descripcion": "IMAGENES",
        "cupsCode": "90.2.2.06",
        "preguntar": [
          "¿Qué área del cuerpo necesita (tórax, columna, extremidad, abdomen)?",
          "¿Dónde se toma la placa (domicilio o clínica)?",
          "¿Tiene indicación médica?",
          "¿Paciente puede movilizarse o está encamado?",
          "Nombre completo, cédula, dirección, teléfono"
        ],
        "requiereIndicacionMedica": true,
        "materiales": [],
        "personalRequerido": [
          "Tecnico de radiología",
          "Radiólogo (lectura)"
        ],
        "tiempoEstimadoMin": 30
      },
      {
        "nombre": "Radiografia de Maxilar Superior",
        "descripcion": "IMAGENES",
        "cupsCode": "90.2.0.24",
        "preguntar": [
          "¿Qué área del cuerpo necesita (tórax, columna, extremidad, abdomen)?",
          "¿Dónde se toma la placa (domicilio o clínica)?",
          "¿Tiene indicación médica?",
          "¿Paciente puede movilizarse o está encamado?",
          "Nombre completo, cédula, dirección, teléfono"
        ],
        "requiereIndicacionMedica": true,
        "materiales": [],
        "personalRequerido": [
          "Tecnico de radiología",
          "Radiólogo (lectura)"
        ],
        "tiempoEstimadoMin": 30
      },
      {
        "nombre": "Radiografia de Dedos en Mano",
        "descripcion": "IMAGENES",
        "cupsCode": "90.2.2.12",
        "preguntar": [
          "¿Qué área del cuerpo necesita (tórax, columna, extremidad, abdomen)?",
          "¿Dónde se toma la placa (domicilio o clínica)?",
          "¿Tiene indicación médica?",
          "¿Paciente puede movilizarse o está encamado?",
          "Nombre completo, cédula, dirección, teléfono"
        ],
        "requiereIndicacionMedica": true,
        "materiales": [],
        "personalRequerido": [
          "Tecnico de radiología",
          "Radiólogo (lectura)"
        ],
        "tiempoEstimadoMin": 30
      },
      {
        "nombre": "Radiografias de Dos Incidencias",
        "descripcion": "IMAGENES",
        "cupsCode": null,
        "preguntar": [
          "¿Qué área del cuerpo necesita (tórax, columna, extremidad, abdomen)?",
          "¿Dónde se toma la placa (domicilio o clínica)?",
          "¿Tiene indicación médica?",
          "¿Paciente puede movilizarse o está encamado?",
          "Nombre completo, cédula, dirección, teléfono"
        ],
        "requiereIndicacionMedica": true,
        "materiales": [],
        "personalRequerido": [
          "Tecnico de radiología",
          "Radiólogo (lectura)"
        ],
        "tiempoEstimadoMin": 30
      },
      {
        "nombre": "Radiografia de Antebrazo",
        "descripcion": "IMAGENES",
        "cupsCode": "90.2.1.04",
        "preguntar": [
          "¿Qué área del cuerpo necesita (tórax, columna, extremidad, abdomen)?",
          "¿Dónde se toma la placa (domicilio o clínica)?",
          "¿Tiene indicación médica?",
          "¿Paciente puede movilizarse o está encamado?",
          "Nombre completo, cédula, dirección, teléfono"
        ],
        "requiereIndicacionMedica": true,
        "materiales": [],
        "personalRequerido": [
          "Tecnico de radiología",
          "Radiólogo (lectura)"
        ],
        "tiempoEstimadoMin": 30
      },
      {
        "nombre": "Radiografia de Transito Intestinal Doble Contraste",
        "descripcion": "IMAGENES",
        "cupsCode": "90.2.2.11",
        "preguntar": [
          "¿Qué área del cuerpo necesita (tórax, columna, extremidad, abdomen)?",
          "¿Dónde se toma la placa (domicilio o clínica)?",
          "¿Tiene indicación médica?",
          "¿Paciente puede movilizarse o está encamado?",
          "Nombre completo, cédula, dirección, teléfono"
        ],
        "requiereIndicacionMedica": true,
        "materiales": [],
        "personalRequerido": [
          "Tecnico de radiología",
          "Radiólogo (lectura)"
        ],
        "tiempoEstimadoMin": 30
      },
      {
        "nombre": "Radiografia de Transito Intestinal Convencional",
        "descripcion": "IMAGENES",
        "cupsCode": "90.6.3.18",
        "preguntar": [
          "¿Qué área del cuerpo necesita (tórax, columna, extremidad, abdomen)?",
          "¿Dónde se toma la placa (domicilio o clínica)?",
          "¿Tiene indicación médica?",
          "¿Paciente puede movilizarse o está encamado?",
          "Nombre completo, cédula, dirección, teléfono"
        ],
        "requiereIndicacionMedica": true,
        "materiales": [],
        "personalRequerido": [
          "Tecnico de radiología",
          "Radiólogo (lectura)"
        ],
        "tiempoEstimadoMin": 30
      },
      {
        "nombre": "Radiografias de Tres Incidencias",
        "descripcion": "IMAGENES",
        "cupsCode": null,
        "preguntar": [
          "¿Qué área del cuerpo necesita (tórax, columna, extremidad, abdomen)?",
          "¿Dónde se toma la placa (domicilio o clínica)?",
          "¿Tiene indicación médica?",
          "¿Paciente puede movilizarse o está encamado?",
          "Nombre completo, cédula, dirección, teléfono"
        ],
        "requiereIndicacionMedica": true,
        "materiales": [],
        "personalRequerido": [
          "Tecnico de radiología",
          "Radiólogo (lectura)"
        ],
        "tiempoEstimadoMin": 30
      },
      {
        "nombre": "Radiografia de Miembro Inferior Ap y Lateral",
        "descripcion": "IMAGENES",
        "cupsCode": "90.3.8.35",
        "preguntar": [
          "¿Qué área del cuerpo necesita (tórax, columna, extremidad, abdomen)?",
          "¿Dónde se toma la placa (domicilio o clínica)?",
          "¿Tiene indicación médica?",
          "¿Paciente puede movilizarse o está encamado?",
          "Nombre completo, cédula, dirección, teléfono"
        ],
        "requiereIndicacionMedica": true,
        "materiales": [],
        "personalRequerido": [
          "Tecnico de radiología",
          "Radiólogo (lectura)"
        ],
        "tiempoEstimadoMin": 30
      },
      {
        "nombre": "Radiografia de Huesos Nasales",
        "descripcion": "IMAGENES",
        "cupsCode": "90.7.1.06",
        "preguntar": [
          "¿Qué área del cuerpo necesita (tórax, columna, extremidad, abdomen)?",
          "¿Dónde se toma la placa (domicilio o clínica)?",
          "¿Tiene indicación médica?",
          "¿Paciente puede movilizarse o está encamado?",
          "Nombre completo, cédula, dirección, teléfono"
        ],
        "requiereIndicacionMedica": true,
        "materiales": [],
        "personalRequerido": [
          "Tecnico de radiología",
          "Radiólogo (lectura)"
        ],
        "tiempoEstimadoMin": 30
      }
    ]
  },
  {
    "grupo": "estudios_cardiacos",
    "titulo": "Estudios Cardíacos",
    "total": 4,
    "servicios": [
      {
        "nombre": "Electrocardiograma de Alta Resolucion [estudio de Potenciales Tardios]",
        "descripcion": "ESTUDIOS",
        "cupsCode": "87.9.1.50",
        "preguntar": [
          "¿Qué estudio necesita (ECG, ecocardiograma, holter, MAPA)?",
          "¿Síntomas (dolor en pecho, palpitaciones, mareos, falta de aire)?",
          "¿Tiene indicación médica?",
          "¿Dónde se realiza (domicilio o clínica)?",
          "Nombre completo, cédula, dirección, teléfono"
        ],
        "requiereIndicacionMedica": true,
        "materiales": [],
        "personalRequerido": [
          "Tecnico de cardiología",
          "Cardiólogo (lectura)"
        ],
        "tiempoEstimadoMin": 60
      },
      {
        "nombre": "Ecocardiograma Modo M y Bidimensional",
        "descripcion": "ESTUDIOS",
        "cupsCode": "86.5.1.01",
        "preguntar": [
          "¿Qué estudio necesita (ECG, ecocardiograma, holter, MAPA)?",
          "¿Síntomas (dolor en pecho, palpitaciones, mareos, falta de aire)?",
          "¿Tiene indicación médica?",
          "¿Dónde se realiza (domicilio o clínica)?",
          "Nombre completo, cédula, dirección, teléfono"
        ],
        "requiereIndicacionMedica": true,
        "materiales": [],
        "personalRequerido": [
          "Tecnico de cardiología",
          "Cardiólogo (lectura)"
        ],
        "tiempoEstimadoMin": 60
      },
      {
        "nombre": "Monitoreo de Presion Arterial Sistemica Sod",
        "descripcion": "ESTUDIOS",
        "cupsCode": "0",
        "preguntar": [
          "¿Qué estudio necesita (ECG, ecocardiograma, holter, MAPA)?",
          "¿Síntomas (dolor en pecho, palpitaciones, mareos, falta de aire)?",
          "¿Tiene indicación médica?",
          "¿Dónde se realiza (domicilio o clínica)?",
          "Nombre completo, cédula, dirección, teléfono"
        ],
        "requiereIndicacionMedica": true,
        "materiales": [],
        "personalRequerido": [
          "Tecnico de cardiología",
          "Cardiólogo (lectura)"
        ],
        "tiempoEstimadoMin": 60
      },
      {
        "nombre": "Electrocardiografia Dinamica (holter)",
        "descripcion": "ESTUDIOS",
        "cupsCode": "88.1.2.40",
        "preguntar": [
          "¿Qué estudio necesita (ECG, ecocardiograma, holter, MAPA)?",
          "¿Síntomas (dolor en pecho, palpitaciones, mareos, falta de aire)?",
          "¿Tiene indicación médica?",
          "¿Dónde se realiza (domicilio o clínica)?",
          "Nombre completo, cédula, dirección, teléfono"
        ],
        "requiereIndicacionMedica": true,
        "materiales": [],
        "personalRequerido": [
          "Tecnico de cardiología",
          "Cardiólogo (lectura)"
        ],
        "tiempoEstimadoMin": 60
      }
    ]
  },
  {
    "grupo": "laboratorio",
    "titulo": "Laboratorio Clínico",
    "total": 8,
    "servicios": [
      {
        "nombre": "Estudio de Coloración Basica en Citologia Vaginal Tumoral Y/o Funcional",
        "descripcion": "ESTUDIOS",
        "cupsCode": null,
        "preguntar": [
          "¿Qué exámenes de laboratorio necesita?",
          "¿Tiene orden médica?",
          "¿Dónde procesamos las muestras (laboratorio de preferencia)?",
          "Dirección para la toma",
          "Nombre completo, cédula, teléfono"
        ],
        "requiereIndicacionMedica": false,
        "materiales": [],
        "personalRequerido": [
          "Flebotomista / enfermera"
        ],
        "tiempoEstimadoMin": 30
      },
      {
        "nombre": "Toma No Quirurgica de Muestra o Tejido Vaginal para Estudio Citologico (ccv)",
        "descripcion": "ESTUDIOS",
        "cupsCode": null,
        "preguntar": [
          "¿Qué exámenes de laboratorio necesita?",
          "¿Tiene orden médica?",
          "¿Dónde procesamos las muestras (laboratorio de preferencia)?",
          "Dirección para la toma",
          "Nombre completo, cédula, teléfono"
        ],
        "requiereIndicacionMedica": false,
        "materiales": [],
        "personalRequerido": [
          "Flebotomista / enfermera"
        ],
        "tiempoEstimadoMin": 30
      },
      {
        "nombre": "Espirometria",
        "descripcion": "CONSULTAS",
        "cupsCode": null,
        "preguntar": [
          "¿Qué exámenes de laboratorio necesita?",
          "¿Tiene orden médica?",
          "¿Dónde procesamos las muestras (laboratorio de preferencia)?",
          "Dirección para la toma",
          "Nombre completo, cédula, teléfono"
        ],
        "requiereIndicacionMedica": false,
        "materiales": [],
        "personalRequerido": [
          "Flebotomista / enfermera"
        ],
        "tiempoEstimadoMin": 30
      },
      {
        "nombre": "Espirometria con Broncodilatador",
        "descripcion": "CONSULTAS",
        "cupsCode": null,
        "preguntar": [
          "¿Qué exámenes de laboratorio necesita?",
          "¿Tiene orden médica?",
          "¿Dónde procesamos las muestras (laboratorio de preferencia)?",
          "Dirección para la toma",
          "Nombre completo, cédula, teléfono"
        ],
        "requiereIndicacionMedica": false,
        "materiales": [],
        "personalRequerido": [
          "Flebotomista / enfermera"
        ],
        "tiempoEstimadoMin": 30
      },
      {
        "nombre": "Biopsia en Hueso No Especifico Via Abierta",
        "descripcion": "HEMOTERAPIA",
        "cupsCode": "77.4.0.01",
        "preguntar": [
          "¿Qué exámenes de laboratorio necesita?",
          "¿Tiene orden médica?",
          "¿Dónde procesamos las muestras (laboratorio de preferencia)?",
          "Dirección para la toma",
          "Nombre completo, cédula, teléfono"
        ],
        "requiereIndicacionMedica": false,
        "materiales": [],
        "personalRequerido": [
          "Flebotomista / enfermera"
        ],
        "tiempoEstimadoMin": 30
      },
      {
        "nombre": "Biopsia Aspiracion Medula Osea",
        "descripcion": "HEMOTERAPIA",
        "cupsCode": "41.3.1.01",
        "preguntar": [
          "¿Qué exámenes de laboratorio necesita?",
          "¿Tiene orden médica?",
          "¿Dónde procesamos las muestras (laboratorio de preferencia)?",
          "Dirección para la toma",
          "Nombre completo, cédula, teléfono"
        ],
        "requiereIndicacionMedica": false,
        "materiales": [],
        "personalRequerido": [
          "Flebotomista / enfermera"
        ],
        "tiempoEstimadoMin": 30
      },
      {
        "nombre": "Biopsia de Hueso en Sitio No Específico Vía Percutánea",
        "descripcion": "HEMOTERAPIA",
        "cupsCode": "77.4.0.02",
        "preguntar": [
          "¿Qué exámenes de laboratorio necesita?",
          "¿Tiene orden médica?",
          "¿Dónde procesamos las muestras (laboratorio de preferencia)?",
          "Dirección para la toma",
          "Nombre completo, cédula, teléfono"
        ],
        "requiereIndicacionMedica": false,
        "materiales": [],
        "personalRequerido": [
          "Flebotomista / enfermera"
        ],
        "tiempoEstimadoMin": 30
      },
      {
        "nombre": "Hemocultivos",
        "descripcion": "",
        "cupsCode": null,
        "preguntar": [
          "¿Qué exámenes de laboratorio necesita?",
          "¿Tiene orden médica?",
          "¿Dónde procesamos las muestras (laboratorio de preferencia)?",
          "Dirección para la toma",
          "Nombre completo, cédula, teléfono"
        ],
        "requiereIndicacionMedica": false,
        "materiales": [],
        "personalRequerido": [
          "Flebotomista / enfermera"
        ],
        "tiempoEstimadoMin": 30
      }
    ]
  },
  {
    "grupo": "procedimientos_intervencionistas",
    "titulo": "Procedimientos Intervencionistas",
    "total": 7,
    "servicios": [
      {
        "nombre": "Sala de Cirugia Menor (sala de Procedimiento)",
        "descripcion": "ESTUDIOS",
        "cupsCode": null,
        "preguntar": [
          "¿Tipo de procedimiento (si lo conoce) o zona del cuerpo?",
          "¿Tiene indicación médica o referimiento?",
          "¿Diagnóstico de base y médico tratante?",
          "¿Estudios de imágenes previos (RMN, TAC, RX, sonografía)?",
          "¿Medicamentos actuales (anticoagulantes, antiagregantes)?",
          "¿Alergias conocidas?",
          "Nombre completo, cédula, dirección, teléfono",
          "¿Tiene seguro médico?"
        ],
        "requiereIndicacionMedica": true,
        "materiales": [
          "Kit de procedimiento",
          "Aguja de punción",
          "Antiséptico",
          "Anestésico local",
          "Equipo de protección"
        ],
        "personalRequerido": [
          "Medico especialista",
          "Enfermera circulante"
        ],
        "tiempoEstimadoMin": 60
      },
      {
        "nombre": "Set de Paracentesis",
        "descripcion": "PARACENTESIS (PALIATIVOS)",
        "cupsCode": null,
        "preguntar": [
          "¿Tipo de procedimiento (si lo conoce) o zona del cuerpo?",
          "¿Tiene indicación médica o referimiento?",
          "¿Diagnóstico de base y médico tratante?",
          "¿Estudios de imágenes previos (RMN, TAC, RX, sonografía)?",
          "¿Medicamentos actuales (anticoagulantes, antiagregantes)?",
          "¿Alergias conocidas?",
          "Nombre completo, cédula, dirección, teléfono",
          "¿Tiene seguro médico?"
        ],
        "requiereIndicacionMedica": true,
        "materiales": [
          "Kit de procedimiento",
          "Aguja de punción",
          "Antiséptico",
          "Anestésico local",
          "Equipo de protección"
        ],
        "personalRequerido": [
          "Medico especialista",
          "Enfermera circulante"
        ],
        "tiempoEstimadoMin": 60
      },
      {
        "nombre": "Toracocentesis",
        "descripcion": "PROCEDIMIENTOS DOMICILIO Y CLINICA CONJUNTOS DE MEDICOS Y ENFERMERAS HONORARIOS SIN MATERIALES GASTABLES (PALIATIVOS)",
        "cupsCode": null,
        "preguntar": [
          "¿Tipo de procedimiento (si lo conoce) o zona del cuerpo?",
          "¿Tiene indicación médica o referimiento?",
          "¿Diagnóstico de base y médico tratante?",
          "¿Estudios de imágenes previos (RMN, TAC, RX, sonografía)?",
          "¿Medicamentos actuales (anticoagulantes, antiagregantes)?",
          "¿Alergias conocidas?",
          "Nombre completo, cédula, dirección, teléfono",
          "¿Tiene seguro médico?"
        ],
        "requiereIndicacionMedica": true,
        "materiales": [
          "Kit de procedimiento",
          "Aguja de punción",
          "Antiséptico",
          "Anestésico local",
          "Equipo de protección"
        ],
        "personalRequerido": [
          "Medico especialista",
          "Enfermera circulante"
        ],
        "tiempoEstimadoMin": 60
      },
      {
        "nombre": "Cambio de PEG",
        "descripcion": "PROCEDIMIENTOS DOMICILIO Y CLINICA CONJUNTOS DE MEDICOS Y ENFERMERAS HONORARIOS SIN MATERIALES GASTABLES (PALIATIVOS)",
        "cupsCode": null,
        "preguntar": [
          "¿Tipo de procedimiento (si lo conoce) o zona del cuerpo?",
          "¿Tiene indicación médica o referimiento?",
          "¿Diagnóstico de base y médico tratante?",
          "¿Estudios de imágenes previos (RMN, TAC, RX, sonografía)?",
          "¿Medicamentos actuales (anticoagulantes, antiagregantes)?",
          "¿Alergias conocidas?",
          "Nombre completo, cédula, dirección, teléfono",
          "¿Tiene seguro médico?"
        ],
        "requiereIndicacionMedica": true,
        "materiales": [
          "Kit de procedimiento",
          "Aguja de punción",
          "Antiséptico",
          "Anestésico local",
          "Equipo de protección"
        ],
        "personalRequerido": [
          "Medico especialista",
          "Enfermera circulante"
        ],
        "tiempoEstimadoMin": 60
      },
      {
        "nombre": "Paracentesis",
        "descripcion": "PROCEDIMIENTOS DOMICILIO Y CLINICA CONJUNTOS DE MEDICOS Y ENFERMERAS HONORARIOS SIN MATERIALES GASTABLES (PALIATIVOS)",
        "cupsCode": null,
        "preguntar": [
          "¿Tipo de procedimiento (si lo conoce) o zona del cuerpo?",
          "¿Tiene indicación médica o referimiento?",
          "¿Diagnóstico de base y médico tratante?",
          "¿Estudios de imágenes previos (RMN, TAC, RX, sonografía)?",
          "¿Medicamentos actuales (anticoagulantes, antiagregantes)?",
          "¿Alergias conocidas?",
          "Nombre completo, cédula, dirección, teléfono",
          "¿Tiene seguro médico?"
        ],
        "requiereIndicacionMedica": true,
        "materiales": [
          "Kit de procedimiento",
          "Aguja de punción",
          "Antiséptico",
          "Anestésico local",
          "Equipo de protección"
        ],
        "personalRequerido": [
          "Medico especialista",
          "Enfermera circulante"
        ],
        "tiempoEstimadoMin": 60
      },
      {
        "nombre": "Artrocentesis",
        "descripcion": "PROCEDIMIENTOS DOMICILIO Y CLINICA CONJUNTOS DE MEDICOS Y ENFERMERAS HONORARIOS SIN MATERIALES GASTABLES (PALIATIVOS)",
        "cupsCode": null,
        "preguntar": [
          "¿Tipo de procedimiento (si lo conoce) o zona del cuerpo?",
          "¿Tiene indicación médica o referimiento?",
          "¿Diagnóstico de base y médico tratante?",
          "¿Estudios de imágenes previos (RMN, TAC, RX, sonografía)?",
          "¿Medicamentos actuales (anticoagulantes, antiagregantes)?",
          "¿Alergias conocidas?",
          "Nombre completo, cédula, dirección, teléfono",
          "¿Tiene seguro médico?"
        ],
        "requiereIndicacionMedica": true,
        "materiales": [
          "Kit de procedimiento",
          "Aguja de punción",
          "Antiséptico",
          "Anestésico local",
          "Equipo de protección"
        ],
        "personalRequerido": [
          "Medico especialista",
          "Enfermera circulante"
        ],
        "tiempoEstimadoMin": 60
      },
      {
        "nombre": "Punción Lumbar",
        "descripcion": "PROCEDIMIENTOS DOMICILIO Y CLINICA CONJUNTOS DE MEDICOS Y ENFERMERAS HONORARIOS SIN MATERIALES GASTABLES (PALIATIVOS)",
        "cupsCode": null,
        "preguntar": [
          "¿Tipo de procedimiento (si lo conoce) o zona del cuerpo?",
          "¿Tiene indicación médica o referimiento?",
          "¿Diagnóstico de base y médico tratante?",
          "¿Estudios de imágenes previos (RMN, TAC, RX, sonografía)?",
          "¿Medicamentos actuales (anticoagulantes, antiagregantes)?",
          "¿Alergias conocidas?",
          "Nombre completo, cédula, dirección, teléfono",
          "¿Tiene seguro médico?"
        ],
        "requiereIndicacionMedica": true,
        "materiales": [
          "Kit de curaciones",
          "Gasas estériles",
          "Guantes",
          "Antiséptico",
          "Jeringas"
        ],
        "personalRequerido": [
          "Enfermera"
        ],
        "tiempoEstimadoMin": 60
      }
    ]
  },
  {
    "grupo": "hemohogar",
    "titulo": "Hemohogar (Transfusiones)",
    "total": 9,
    "servicios": [
      {
        "nombre": "Transfusión Sanguínea en Clínica (honorario)",
        "descripcion": "ESTUDIOS",
        "cupsCode": null,
        "preguntar": [
          "¿Dónde se realiza la transfusión (domicilio o clínica)?",
          "¿Tiene indicación médica y hemograma reciente?",
          "¿La sangre está autorizada por un Banco de Sangre?",
          "¿Pruebas cruzadas realizadas?",
          "¿Cuenta con cuidador responsable presente?",
          "Nombre completo, cédula, dirección, teléfono"
        ],
        "requiereIndicacionMedica": true,
        "materiales": [
          "Sangre autorizada por Banco de Sangre",
          "Equipo de transfusión",
          "Monitoreo"
        ],
        "personalRequerido": [
          "Medico",
          "Enfermera"
        ],
        "tiempoEstimadoMin": 180
      },
      {
        "nombre": "Aplicacion Unidad de Plaquetas",
        "descripcion": "HEMOTERAPIA",
        "cupsCode": "91.2.0.03",
        "preguntar": [
          "¿Dónde se realiza la transfusión (domicilio o clínica)?",
          "¿Tiene indicación médica y hemograma reciente?",
          "¿La sangre está autorizada por un Banco de Sangre?",
          "¿Pruebas cruzadas realizadas?",
          "¿Cuenta con cuidador responsable presente?",
          "Nombre completo, cédula, dirección, teléfono"
        ],
        "requiereIndicacionMedica": true,
        "materiales": [
          "Sangre autorizada por Banco de Sangre",
          "Equipo de transfusión",
          "Monitoreo"
        ],
        "personalRequerido": [
          "Medico",
          "Enfermera"
        ],
        "tiempoEstimadoMin": 180
      },
      {
        "nombre": "Transfusion de Expansor Sanguineo",
        "descripcion": "HEMOTERAPIA",
        "cupsCode": "91.2.0.02",
        "preguntar": [
          "¿Dónde se realiza la transfusión (domicilio o clínica)?",
          "¿Tiene indicación médica y hemograma reciente?",
          "¿La sangre está autorizada por un Banco de Sangre?",
          "¿Pruebas cruzadas realizadas?",
          "¿Cuenta con cuidador responsable presente?",
          "Nombre completo, cédula, dirección, teléfono"
        ],
        "requiereIndicacionMedica": true,
        "materiales": [
          "Sangre autorizada por Banco de Sangre",
          "Equipo de transfusión",
          "Monitoreo"
        ],
        "personalRequerido": [
          "Medico",
          "Enfermera"
        ],
        "tiempoEstimadoMin": 180
      },
      {
        "nombre": "Transfusion de la Unidad de Plasma Fresco Congelado",
        "descripcion": "HEMOTERAPIA",
        "cupsCode": "91.2.0.05",
        "preguntar": [
          "¿Dónde se realiza la transfusión (domicilio o clínica)?",
          "¿Tiene indicación médica y hemograma reciente?",
          "¿La sangre está autorizada por un Banco de Sangre?",
          "¿Pruebas cruzadas realizadas?",
          "¿Cuenta con cuidador responsable presente?",
          "Nombre completo, cédula, dirección, teléfono"
        ],
        "requiereIndicacionMedica": true,
        "materiales": [
          "Sangre autorizada por Banco de Sangre",
          "Equipo de transfusión",
          "Monitoreo"
        ],
        "personalRequerido": [
          "Medico",
          "Enfermera"
        ],
        "tiempoEstimadoMin": 180
      },
      {
        "nombre": "Exanguinotransfusión",
        "descripcion": "HEMOTERAPIA",
        "cupsCode": "91.02.10",
        "preguntar": [
          "¿Dónde se realiza la transfusión (domicilio o clínica)?",
          "¿Tiene indicación médica y hemograma reciente?",
          "¿La sangre está autorizada por un Banco de Sangre?",
          "¿Pruebas cruzadas realizadas?",
          "¿Cuenta con cuidador responsable presente?",
          "Nombre completo, cédula, dirección, teléfono"
        ],
        "requiereIndicacionMedica": true,
        "materiales": [
          "Sangre autorizada por Banco de Sangre",
          "Equipo de transfusión",
          "Monitoreo"
        ],
        "personalRequerido": [
          "Medico",
          "Enfermera"
        ],
        "tiempoEstimadoMin": 180
      },
      {
        "nombre": "Aplicacion de la Unidad Sangre Total",
        "descripcion": "HEMOTERAPIA",
        "cupsCode": "91.2.0.04",
        "preguntar": [
          "¿Dónde se realiza la transfusión (domicilio o clínica)?",
          "¿Tiene indicación médica y hemograma reciente?",
          "¿La sangre está autorizada por un Banco de Sangre?",
          "¿Pruebas cruzadas realizadas?",
          "¿Cuenta con cuidador responsable presente?",
          "Nombre completo, cédula, dirección, teléfono"
        ],
        "requiereIndicacionMedica": true,
        "materiales": [
          "Sangre autorizada por Banco de Sangre",
          "Equipo de transfusión",
          "Monitoreo"
        ],
        "personalRequerido": [
          "Medico",
          "Enfermera"
        ],
        "tiempoEstimadoMin": 180
      },
      {
        "nombre": "Extendido de Sangre Periferica Estudio de Morfologia",
        "descripcion": "HEMOTERAPIA",
        "cupsCode": "90.2.2.06",
        "preguntar": [
          "¿Dónde se realiza la transfusión (domicilio o clínica)?",
          "¿Tiene indicación médica y hemograma reciente?",
          "¿La sangre está autorizada por un Banco de Sangre?",
          "¿Pruebas cruzadas realizadas?",
          "¿Cuenta con cuidador responsable presente?",
          "Nombre completo, cédula, dirección, teléfono"
        ],
        "requiereIndicacionMedica": true,
        "materiales": [
          "Sangre autorizada por Banco de Sangre",
          "Equipo de transfusión",
          "Monitoreo"
        ],
        "personalRequerido": [
          "Medico",
          "Enfermera"
        ],
        "tiempoEstimadoMin": 180
      },
      {
        "nombre": "Administración de concentrado de hematíes",
        "descripcion": "",
        "cupsCode": null,
        "preguntar": [
          "¿Dónde se realiza la transfusión (domicilio o clínica)?",
          "¿Tiene indicación médica y hemograma reciente?",
          "¿La sangre está autorizada por un Banco de Sangre?",
          "¿Pruebas cruzadas realizadas?",
          "¿Cuenta con cuidador responsable presente?",
          "Nombre completo, cédula, dirección, teléfono"
        ],
        "requiereIndicacionMedica": true,
        "materiales": [
          "Sangre autorizada por Banco de Sangre",
          "Equipo de transfusión",
          "Monitoreo"
        ],
        "personalRequerido": [
          "Medico",
          "Enfermera"
        ],
        "tiempoEstimadoMin": 180
      },
      {
        "nombre": "Administración de plaquetas",
        "descripcion": "",
        "cupsCode": null,
        "preguntar": [
          "¿Dónde se realiza la transfusión (domicilio o clínica)?",
          "¿Tiene indicación médica y hemograma reciente?",
          "¿La sangre está autorizada por un Banco de Sangre?",
          "¿Pruebas cruzadas realizadas?",
          "¿Cuenta con cuidador responsable presente?",
          "Nombre completo, cédula, dirección, teléfono"
        ],
        "requiereIndicacionMedica": true,
        "materiales": [
          "Sangre autorizada por Banco de Sangre",
          "Equipo de transfusión",
          "Monitoreo"
        ],
        "personalRequerido": [
          "Medico",
          "Enfermera"
        ],
        "tiempoEstimadoMin": 180
      }
    ]
  },
  {
    "grupo": "enfermeria",
    "titulo": "Enfermería",
    "total": 25,
    "servicios": [
      {
        "nombre": "Oxigeno por Dia",
        "descripcion": "ESTUDIOS",
        "cupsCode": null,
        "preguntar": [
          "¿Qué tipo de atención de enfermería necesita?",
          "¿Horas al día y por cuántos días o semanas (tanda)?",
          "¿Paciente encamado o con movilidad reducida?",
          "¿Tiene cuidador familiar presente?",
          "¿Indicación médica vigente?",
          "¿Tiene los insumos y medicamentos o los proveemos?",
          "¿Dirección de atención y horario preferido?",
          "Nombre completo, cédula, teléfono, seguro"
        ],
        "requiereIndicacionMedica": false,
        "materiales": [
          "Kit de curaciones",
          "Gasas estériles",
          "Guantes",
          "Antiséptico",
          "Jeringas"
        ],
        "personalRequerido": [
          "Enfermera"
        ],
        "tiempoEstimadoMin": 60
      },
      {
        "nombre": "Bomba de Infusion",
        "descripcion": "ESTUDIOS",
        "cupsCode": null,
        "preguntar": [
          "¿Qué tipo de atención de enfermería necesita?",
          "¿Horas al día y por cuántos días o semanas (tanda)?",
          "¿Paciente encamado o con movilidad reducida?",
          "¿Tiene cuidador familiar presente?",
          "¿Indicación médica vigente?",
          "¿Tiene los insumos y medicamentos o los proveemos?",
          "¿Dirección de atención y horario preferido?",
          "Nombre completo, cédula, teléfono, seguro"
        ],
        "requiereIndicacionMedica": false,
        "materiales": [
          "Kit de curaciones",
          "Gasas estériles",
          "Guantes",
          "Antiséptico",
          "Jeringas"
        ],
        "personalRequerido": [
          "Enfermera"
        ],
        "tiempoEstimadoMin": 60
      },
      {
        "nombre": "Curas Estadio I (no Incluye Kit de Material Quirurgico)",
        "descripcion": "ESTUDIOS",
        "cupsCode": null,
        "preguntar": [
          "¿Qué tipo de atención de enfermería necesita?",
          "¿Horas al día y por cuántos días o semanas (tanda)?",
          "¿Paciente encamado o con movilidad reducida?",
          "¿Tiene cuidador familiar presente?",
          "¿Indicación médica vigente?",
          "¿Tiene los insumos y medicamentos o los proveemos?",
          "¿Dirección de atención y horario preferido?",
          "Nombre completo, cédula, teléfono, seguro"
        ],
        "requiereIndicacionMedica": false,
        "materiales": [
          "Kit de curaciones",
          "Gasas estériles",
          "Guantes",
          "Antiséptico",
          "Jeringas"
        ],
        "personalRequerido": [
          "Enfermera"
        ],
        "tiempoEstimadoMin": 60
      },
      {
        "nombre": "Curas Estadio Ii (no Incluye Kit de Material Quirurgico)",
        "descripcion": "ESTUDIOS",
        "cupsCode": null,
        "preguntar": [
          "¿Qué tipo de atención de enfermería necesita?",
          "¿Horas al día y por cuántos días o semanas (tanda)?",
          "¿Paciente encamado o con movilidad reducida?",
          "¿Tiene cuidador familiar presente?",
          "¿Indicación médica vigente?",
          "¿Tiene los insumos y medicamentos o los proveemos?",
          "¿Dirección de atención y horario preferido?",
          "Nombre completo, cédula, teléfono, seguro"
        ],
        "requiereIndicacionMedica": false,
        "materiales": [
          "Kit de curaciones",
          "Gasas estériles",
          "Guantes",
          "Antiséptico",
          "Jeringas"
        ],
        "personalRequerido": [
          "Enfermera"
        ],
        "tiempoEstimadoMin": 60
      },
      {
        "nombre": "Curas Estadio Iii (no Incluye Kit de Material Quirurgico)",
        "descripcion": "ESTUDIOS",
        "cupsCode": null,
        "preguntar": [
          "¿Qué tipo de atención de enfermería necesita?",
          "¿Horas al día y por cuántos días o semanas (tanda)?",
          "¿Paciente encamado o con movilidad reducida?",
          "¿Tiene cuidador familiar presente?",
          "¿Indicación médica vigente?",
          "¿Tiene los insumos y medicamentos o los proveemos?",
          "¿Dirección de atención y horario preferido?",
          "Nombre completo, cédula, teléfono, seguro"
        ],
        "requiereIndicacionMedica": false,
        "materiales": [
          "Kit de curaciones",
          "Gasas estériles",
          "Guantes",
          "Antiséptico",
          "Jeringas"
        ],
        "personalRequerido": [
          "Enfermera"
        ],
        "tiempoEstimadoMin": 60
      },
      {
        "nombre": "Consulta Telefónica Programada de la Enfermera",
        "descripcion": "CONSULTAS TELEMEDICINA (PALIATIVOS)",
        "cupsCode": null,
        "preguntar": [
          "¿Qué tipo de atención de enfermería necesita?",
          "¿Horas al día y por cuántos días o semanas (tanda)?",
          "¿Paciente encamado o con movilidad reducida?",
          "¿Tiene cuidador familiar presente?",
          "¿Indicación médica vigente?",
          "¿Tiene los insumos y medicamentos o los proveemos?",
          "¿Dirección de atención y horario preferido?",
          "Nombre completo, cédula, teléfono, seguro"
        ],
        "requiereIndicacionMedica": false,
        "materiales": [
          "Kit de curaciones",
          "Gasas estériles",
          "Guantes",
          "Antiséptico",
          "Jeringas"
        ],
        "personalRequerido": [
          "Enfermera"
        ],
        "tiempoEstimadoMin": 60
      },
      {
        "nombre": "Consulta Telefónica a Demanda para la Enfermera",
        "descripcion": "CONSULTAS TELEMEDICINA (PALIATIVOS)",
        "cupsCode": null,
        "preguntar": [
          "¿Qué tipo de atención de enfermería necesita?",
          "¿Horas al día y por cuántos días o semanas (tanda)?",
          "¿Paciente encamado o con movilidad reducida?",
          "¿Tiene cuidador familiar presente?",
          "¿Indicación médica vigente?",
          "¿Tiene los insumos y medicamentos o los proveemos?",
          "¿Dirección de atención y horario preferido?",
          "Nombre completo, cédula, teléfono, seguro"
        ],
        "requiereIndicacionMedica": false,
        "materiales": [
          "Kit de curaciones",
          "Gasas estériles",
          "Guantes",
          "Antiséptico",
          "Jeringas"
        ],
        "personalRequerido": [
          "Enfermera"
        ],
        "tiempoEstimadoMin": 60
      },
      {
        "nombre": "Consulta Telefónica Programada de la Enfermera (UHD Pediátrica)",
        "descripcion": "CONSULTAS TELEMEDICINA (PALIATIVOS)",
        "cupsCode": null,
        "preguntar": [
          "¿Qué tipo de atención de enfermería necesita?",
          "¿Horas al día y por cuántos días o semanas (tanda)?",
          "¿Paciente encamado o con movilidad reducida?",
          "¿Tiene cuidador familiar presente?",
          "¿Indicación médica vigente?",
          "¿Tiene los insumos y medicamentos o los proveemos?",
          "¿Dirección de atención y horario preferido?",
          "Nombre completo, cédula, teléfono, seguro"
        ],
        "requiereIndicacionMedica": false,
        "materiales": [
          "Kit de curaciones",
          "Gasas estériles",
          "Guantes",
          "Antiséptico",
          "Jeringas"
        ],
        "personalRequerido": [
          "Enfermera"
        ],
        "tiempoEstimadoMin": 60
      },
      {
        "nombre": "Primera Visita de Enfermería en Domicilio",
        "descripcion": "VISITA DOMICILILARIA (PALIATIVOS)",
        "cupsCode": null,
        "preguntar": [
          "¿Qué tipo de atención de enfermería necesita?",
          "¿Horas al día y por cuántos días o semanas (tanda)?",
          "¿Paciente encamado o con movilidad reducida?",
          "¿Tiene cuidador familiar presente?",
          "¿Indicación médica vigente?",
          "¿Tiene los insumos y medicamentos o los proveemos?",
          "¿Dirección de atención y horario preferido?",
          "Nombre completo, cédula, teléfono, seguro"
        ],
        "requiereIndicacionMedica": false,
        "materiales": [
          "Kit de curaciones",
          "Gasas estériles",
          "Guantes",
          "Antiséptico",
          "Jeringas"
        ],
        "personalRequerido": [
          "Enfermera"
        ],
        "tiempoEstimadoMin": 60
      },
      {
        "nombre": "Visita Urgente de Enfermería en Domicilio",
        "descripcion": "VISITA DOMICILILARIA (PALIATIVOS)",
        "cupsCode": null,
        "preguntar": [
          "¿Qué tipo de atención de enfermería necesita?",
          "¿Horas al día y por cuántos días o semanas (tanda)?",
          "¿Paciente encamado o con movilidad reducida?",
          "¿Tiene cuidador familiar presente?",
          "¿Indicación médica vigente?",
          "¿Tiene los insumos y medicamentos o los proveemos?",
          "¿Dirección de atención y horario preferido?",
          "Nombre completo, cédula, teléfono, seguro"
        ],
        "requiereIndicacionMedica": false,
        "materiales": [
          "Kit de curaciones",
          "Gasas estériles",
          "Guantes",
          "Antiséptico",
          "Jeringas"
        ],
        "personalRequerido": [
          "Enfermera"
        ],
        "tiempoEstimadoMin": 60
      },
      {
        "nombre": "Visita Básica de Enfermería en Domicilio",
        "descripcion": "VISITA DOMICILILARIA (PALIATIVOS)",
        "cupsCode": null,
        "preguntar": [
          "¿Qué tipo de atención de enfermería necesita?",
          "¿Horas al día y por cuántos días o semanas (tanda)?",
          "¿Paciente encamado o con movilidad reducida?",
          "¿Tiene cuidador familiar presente?",
          "¿Indicación médica vigente?",
          "¿Tiene los insumos y medicamentos o los proveemos?",
          "¿Dirección de atención y horario preferido?",
          "Nombre completo, cédula, teléfono, seguro"
        ],
        "requiereIndicacionMedica": false,
        "materiales": [
          "Kit de curaciones",
          "Gasas estériles",
          "Guantes",
          "Antiséptico",
          "Jeringas"
        ],
        "personalRequerido": [
          "Enfermera"
        ],
        "tiempoEstimadoMin": 60
      },
      {
        "nombre": "Cuidados de enfermería en casa dependiendo de las HRS",
        "descripcion": "",
        "cupsCode": null,
        "preguntar": [
          "¿Qué tipo de atención de enfermería necesita?",
          "¿Horas al día y por cuántos días o semanas (tanda)?",
          "¿Paciente encamado o con movilidad reducida?",
          "¿Tiene cuidador familiar presente?",
          "¿Indicación médica vigente?",
          "¿Tiene los insumos y medicamentos o los proveemos?",
          "¿Dirección de atención y horario preferido?",
          "Nombre completo, cédula, teléfono, seguro"
        ],
        "requiereIndicacionMedica": false,
        "materiales": [
          "Kit de curaciones",
          "Gasas estériles",
          "Guantes",
          "Antiséptico",
          "Jeringas"
        ],
        "personalRequerido": [
          "Enfermera"
        ],
        "tiempoEstimadoMin": 60
      },
      {
        "nombre": "Escucha activa y apoyo emocional por la enfermera",
        "descripcion": "",
        "cupsCode": null,
        "preguntar": [
          "¿Qué tipo de atención de enfermería necesita?",
          "¿Horas al día y por cuántos días o semanas (tanda)?",
          "¿Paciente encamado o con movilidad reducida?",
          "¿Tiene cuidador familiar presente?",
          "¿Indicación médica vigente?",
          "¿Tiene los insumos y medicamentos o los proveemos?",
          "¿Dirección de atención y horario preferido?",
          "Nombre completo, cédula, teléfono, seguro"
        ],
        "requiereIndicacionMedica": false,
        "materiales": [
          "Kit de curaciones",
          "Gasas estériles",
          "Guantes",
          "Antiséptico",
          "Jeringas"
        ],
        "personalRequerido": [
          "Enfermera"
        ],
        "tiempoEstimadoMin": 60
      },
      {
        "nombre": "Gestión de ayuda social tramitada por la enfermera",
        "descripcion": "",
        "cupsCode": null,
        "preguntar": [
          "¿Qué tipo de atención de enfermería necesita?",
          "¿Horas al día y por cuántos días o semanas (tanda)?",
          "¿Paciente encamado o con movilidad reducida?",
          "¿Tiene cuidador familiar presente?",
          "¿Indicación médica vigente?",
          "¿Tiene los insumos y medicamentos o los proveemos?",
          "¿Dirección de atención y horario preferido?",
          "Nombre completo, cédula, teléfono, seguro"
        ],
        "requiereIndicacionMedica": false,
        "materiales": [
          "Kit de curaciones",
          "Gasas estériles",
          "Guantes",
          "Antiséptico",
          "Jeringas"
        ],
        "personalRequerido": [
          "Enfermera"
        ],
        "tiempoEstimadoMin": 60
      },
      {
        "nombre": "Cura simple",
        "descripcion": "",
        "cupsCode": null,
        "preguntar": [
          "¿Qué tipo de atención de enfermería necesita?",
          "¿Horas al día y por cuántos días o semanas (tanda)?",
          "¿Paciente encamado o con movilidad reducida?",
          "¿Tiene cuidador familiar presente?",
          "¿Indicación médica vigente?",
          "¿Tiene los insumos y medicamentos o los proveemos?",
          "¿Dirección de atención y horario preferido?",
          "Nombre completo, cédula, teléfono, seguro"
        ],
        "requiereIndicacionMedica": false,
        "materiales": [
          "Kit de curaciones",
          "Gasas estériles",
          "Guantes",
          "Antiséptico",
          "Jeringas"
        ],
        "personalRequerido": [
          "Enfermera"
        ],
        "tiempoEstimadoMin": 60
      },
      {
        "nombre": "Cura compleja",
        "descripcion": "",
        "cupsCode": null,
        "preguntar": [
          "¿Qué tipo de atención de enfermería necesita?",
          "¿Horas al día y por cuántos días o semanas (tanda)?",
          "¿Paciente encamado o con movilidad reducida?",
          "¿Tiene cuidador familiar presente?",
          "¿Indicación médica vigente?",
          "¿Tiene los insumos y medicamentos o los proveemos?",
          "¿Dirección de atención y horario preferido?",
          "Nombre completo, cédula, teléfono, seguro"
        ],
        "requiereIndicacionMedica": false,
        "materiales": [
          "Kit de curaciones",
          "Gasas estériles",
          "Guantes",
          "Antiséptico",
          "Jeringas"
        ],
        "personalRequerido": [
          "Enfermera"
        ],
        "tiempoEstimadoMin": 60
      },
      {
        "nombre": "ECG",
        "descripcion": "",
        "cupsCode": null,
        "preguntar": [
          "¿Qué tipo de atención de enfermería necesita?",
          "¿Horas al día y por cuántos días o semanas (tanda)?",
          "¿Paciente encamado o con movilidad reducida?",
          "¿Tiene cuidador familiar presente?",
          "¿Indicación médica vigente?",
          "¿Tiene los insumos y medicamentos o los proveemos?",
          "¿Dirección de atención y horario preferido?",
          "Nombre completo, cédula, teléfono, seguro"
        ],
        "requiereIndicacionMedica": false,
        "materiales": [
          "Kit de curaciones",
          "Gasas estériles",
          "Guantes",
          "Antiséptico",
          "Jeringas"
        ],
        "personalRequerido": [
          "Enfermera"
        ],
        "tiempoEstimadoMin": 60
      },
      {
        "nombre": "Canalización de vía venosa central por acceso periférico por enfermera",
        "descripcion": "",
        "cupsCode": null,
        "preguntar": [
          "¿Qué tipo de atención de enfermería necesita?",
          "¿Horas al día y por cuántos días o semanas (tanda)?",
          "¿Paciente encamado o con movilidad reducida?",
          "¿Tiene cuidador familiar presente?",
          "¿Indicación médica vigente?",
          "¿Tiene los insumos y medicamentos o los proveemos?",
          "¿Dirección de atención y horario preferido?",
          "Nombre completo, cédula, teléfono, seguro"
        ],
        "requiereIndicacionMedica": false,
        "materiales": [
          "Kit de curaciones",
          "Gasas estériles",
          "Guantes",
          "Antiséptico",
          "Jeringas"
        ],
        "personalRequerido": [
          "Enfermera"
        ],
        "tiempoEstimadoMin": 60
      },
      {
        "nombre": "Acceso y mantenimiento de catéter venoso central (CVC) permanente",
        "descripcion": "",
        "cupsCode": null,
        "preguntar": [
          "¿Qué tipo de atención de enfermería necesita?",
          "¿Horas al día y por cuántos días o semanas (tanda)?",
          "¿Paciente encamado o con movilidad reducida?",
          "¿Tiene cuidador familiar presente?",
          "¿Indicación médica vigente?",
          "¿Tiene los insumos y medicamentos o los proveemos?",
          "¿Dirección de atención y horario preferido?",
          "Nombre completo, cédula, teléfono, seguro"
        ],
        "requiereIndicacionMedica": false,
        "materiales": [
          "Kit de curaciones",
          "Gasas estériles",
          "Guantes",
          "Antiséptico",
          "Jeringas"
        ],
        "personalRequerido": [
          "Enfermera"
        ],
        "tiempoEstimadoMin": 60
      },
      {
        "nombre": "Adiestramiento a los padres para mantenimiento y heparinización de CVC",
        "descripcion": "",
        "cupsCode": null,
        "preguntar": [
          "¿Qué tipo de atención de enfermería necesita?",
          "¿Horas al día y por cuántos días o semanas (tanda)?",
          "¿Paciente encamado o con movilidad reducida?",
          "¿Tiene cuidador familiar presente?",
          "¿Indicación médica vigente?",
          "¿Tiene los insumos y medicamentos o los proveemos?",
          "¿Dirección de atención y horario preferido?",
          "Nombre completo, cédula, teléfono, seguro"
        ],
        "requiereIndicacionMedica": false,
        "materiales": [
          "Kit de curaciones",
          "Gasas estériles",
          "Guantes",
          "Antiséptico",
          "Jeringas"
        ],
        "personalRequerido": [
          "Enfermera"
        ],
        "tiempoEstimadoMin": 60
      },
      {
        "nombre": "nutricion enteral",
        "descripcion": "",
        "cupsCode": null,
        "preguntar": [
          "¿Qué tipo de atención de enfermería necesita?",
          "¿Horas al día y por cuántos días o semanas (tanda)?",
          "¿Paciente encamado o con movilidad reducida?",
          "¿Tiene cuidador familiar presente?",
          "¿Indicación médica vigente?",
          "¿Tiene los insumos y medicamentos o los proveemos?",
          "¿Dirección de atención y horario preferido?",
          "Nombre completo, cédula, teléfono, seguro"
        ],
        "requiereIndicacionMedica": false,
        "materiales": [
          "Kit de curaciones",
          "Gasas estériles",
          "Guantes",
          "Antiséptico",
          "Jeringas"
        ],
        "personalRequerido": [
          "Enfermera"
        ],
        "tiempoEstimadoMin": 60
      },
      {
        "nombre": "MORFINA",
        "descripcion": "",
        "cupsCode": null,
        "preguntar": [
          "¿Qué tipo de atención de enfermería necesita?",
          "¿Horas al día y por cuántos días o semanas (tanda)?",
          "¿Paciente encamado o con movilidad reducida?",
          "¿Tiene cuidador familiar presente?",
          "¿Indicación médica vigente?",
          "¿Tiene los insumos y medicamentos o los proveemos?",
          "¿Dirección de atención y horario preferido?",
          "Nombre completo, cédula, teléfono, seguro"
        ],
        "requiereIndicacionMedica": false,
        "materiales": [
          "Kit de curaciones",
          "Gasas estériles",
          "Guantes",
          "Antiséptico",
          "Jeringas"
        ],
        "personalRequerido": [
          "Enfermera"
        ],
        "tiempoEstimadoMin": 60
      },
      {
        "nombre": "FENTANIL",
        "descripcion": "",
        "cupsCode": null,
        "preguntar": [
          "¿Qué tipo de atención de enfermería necesita?",
          "¿Horas al día y por cuántos días o semanas (tanda)?",
          "¿Paciente encamado o con movilidad reducida?",
          "¿Tiene cuidador familiar presente?",
          "¿Indicación médica vigente?",
          "¿Tiene los insumos y medicamentos o los proveemos?",
          "¿Dirección de atención y horario preferido?",
          "Nombre completo, cédula, teléfono, seguro"
        ],
        "requiereIndicacionMedica": false,
        "materiales": [
          "Kit de curaciones",
          "Gasas estériles",
          "Guantes",
          "Antiséptico",
          "Jeringas"
        ],
        "personalRequerido": [
          "Enfermera"
        ],
        "tiempoEstimadoMin": 60
      },
      {
        "nombre": "TRAMADOL",
        "descripcion": "",
        "cupsCode": null,
        "preguntar": [
          "¿Qué tipo de atención de enfermería necesita?",
          "¿Horas al día y por cuántos días o semanas (tanda)?",
          "¿Paciente encamado o con movilidad reducida?",
          "¿Tiene cuidador familiar presente?",
          "¿Indicación médica vigente?",
          "¿Tiene los insumos y medicamentos o los proveemos?",
          "¿Dirección de atención y horario preferido?",
          "Nombre completo, cédula, teléfono, seguro"
        ],
        "requiereIndicacionMedica": false,
        "materiales": [
          "Kit de curaciones",
          "Gasas estériles",
          "Guantes",
          "Antiséptico",
          "Jeringas"
        ],
        "personalRequerido": [
          "Enfermera"
        ],
        "tiempoEstimadoMin": 60
      },
      {
        "nombre": "CODEINA",
        "descripcion": "",
        "cupsCode": null,
        "preguntar": [
          "¿Qué tipo de atención de enfermería necesita?",
          "¿Horas al día y por cuántos días o semanas (tanda)?",
          "¿Paciente encamado o con movilidad reducida?",
          "¿Tiene cuidador familiar presente?",
          "¿Indicación médica vigente?",
          "¿Tiene los insumos y medicamentos o los proveemos?",
          "¿Dirección de atención y horario preferido?",
          "Nombre completo, cédula, teléfono, seguro"
        ],
        "requiereIndicacionMedica": false,
        "materiales": [
          "Kit de curaciones",
          "Gasas estériles",
          "Guantes",
          "Antiséptico",
          "Jeringas"
        ],
        "personalRequerido": [
          "Enfermera"
        ],
        "tiempoEstimadoMin": 60
      }
    ]
  },
  {
    "grupo": "consultas_medicas",
    "titulo": "Consultas Médicas",
    "total": 34,
    "servicios": [
      {
        "nombre": "Consulta Medicina Especializada",
        "descripcion": "CONSULTAS",
        "cupsCode": "0",
        "preguntar": [
          "¿Dónde desea la consulta (domicilio, clínica, intrahospitalaria)?",
          "¿Es primera vez o subsecuente?",
          "¿Qué especialidad o motivo de consulta?",
          "Nombre completo del paciente, cédula, edad, dirección, teléfono",
          "¿Tiene estudios previos (imágenes, laboratorios)?",
          "¿Tiene seguro médico?"
        ],
        "requiereIndicacionMedica": false,
        "materiales": [],
        "personalRequerido": [
          "Medico general o especialista"
        ],
        "tiempoEstimadoMin": 30
      },
      {
        "nombre": "Cardiologia",
        "descripcion": "CONSULTAS",
        "cupsCode": null,
        "preguntar": [
          "¿Dónde desea la consulta (domicilio, clínica, intrahospitalaria)?",
          "¿Es primera vez o subsecuente?",
          "¿Qué especialidad o motivo de consulta?",
          "Nombre completo del paciente, cédula, edad, dirección, teléfono",
          "¿Tiene estudios previos (imágenes, laboratorios)?",
          "¿Tiene seguro médico?"
        ],
        "requiereIndicacionMedica": false,
        "materiales": [],
        "personalRequerido": [
          "Medico general o especialista"
        ],
        "tiempoEstimadoMin": 30
      },
      {
        "nombre": "Neumologia",
        "descripcion": "CONSULTAS",
        "cupsCode": null,
        "preguntar": [
          "¿Dónde desea la consulta (domicilio, clínica, intrahospitalaria)?",
          "¿Es primera vez o subsecuente?",
          "¿Qué especialidad o motivo de consulta?",
          "Nombre completo del paciente, cédula, edad, dirección, teléfono",
          "¿Tiene estudios previos (imágenes, laboratorios)?",
          "¿Tiene seguro médico?"
        ],
        "requiereIndicacionMedica": false,
        "materiales": [],
        "personalRequerido": [
          "Medico general o especialista"
        ],
        "tiempoEstimadoMin": 30
      },
      {
        "nombre": "Gastroenterologia",
        "descripcion": "CONSULTAS",
        "cupsCode": null,
        "preguntar": [
          "¿Dónde desea la consulta (domicilio, clínica, intrahospitalaria)?",
          "¿Es primera vez o subsecuente?",
          "¿Qué especialidad o motivo de consulta?",
          "Nombre completo del paciente, cédula, edad, dirección, teléfono",
          "¿Tiene estudios previos (imágenes, laboratorios)?",
          "¿Tiene seguro médico?"
        ],
        "requiereIndicacionMedica": false,
        "materiales": [],
        "personalRequerido": [
          "Medico general o especialista"
        ],
        "tiempoEstimadoMin": 30
      },
      {
        "nombre": "Endocrinologia",
        "descripcion": "CONSULTAS",
        "cupsCode": null,
        "preguntar": [
          "¿Dónde desea la consulta (domicilio, clínica, intrahospitalaria)?",
          "¿Es primera vez o subsecuente?",
          "¿Qué especialidad o motivo de consulta?",
          "Nombre completo del paciente, cédula, edad, dirección, teléfono",
          "¿Tiene estudios previos (imágenes, laboratorios)?",
          "¿Tiene seguro médico?"
        ],
        "requiereIndicacionMedica": false,
        "materiales": [],
        "personalRequerido": [
          "Medico general o especialista"
        ],
        "tiempoEstimadoMin": 30
      },
      {
        "nombre": "Oncologia",
        "descripcion": "CONSULTAS",
        "cupsCode": null,
        "preguntar": [
          "¿Dónde desea la consulta (domicilio, clínica, intrahospitalaria)?",
          "¿Es primera vez o subsecuente?",
          "¿Qué especialidad o motivo de consulta?",
          "Nombre completo del paciente, cédula, edad, dirección, teléfono",
          "¿Tiene estudios previos (imágenes, laboratorios)?",
          "¿Tiene seguro médico?"
        ],
        "requiereIndicacionMedica": false,
        "materiales": [],
        "personalRequerido": [
          "Medico general o especialista"
        ],
        "tiempoEstimadoMin": 30
      },
      {
        "nombre": "Neurologia",
        "descripcion": "CONSULTAS",
        "cupsCode": null,
        "preguntar": [
          "¿Dónde desea la consulta (domicilio, clínica, intrahospitalaria)?",
          "¿Es primera vez o subsecuente?",
          "¿Qué especialidad o motivo de consulta?",
          "Nombre completo del paciente, cédula, edad, dirección, teléfono",
          "¿Tiene estudios previos (imágenes, laboratorios)?",
          "¿Tiene seguro médico?"
        ],
        "requiereIndicacionMedica": false,
        "materiales": [],
        "personalRequerido": [
          "Medico general o especialista"
        ],
        "tiempoEstimadoMin": 30
      },
      {
        "nombre": "Vascular",
        "descripcion": "CONSULTAS",
        "cupsCode": null,
        "preguntar": [
          "¿Dónde desea la consulta (domicilio, clínica, intrahospitalaria)?",
          "¿Es primera vez o subsecuente?",
          "¿Qué especialidad o motivo de consulta?",
          "Nombre completo del paciente, cédula, edad, dirección, teléfono",
          "¿Tiene estudios previos (imágenes, laboratorios)?",
          "¿Tiene seguro médico?"
        ],
        "requiereIndicacionMedica": false,
        "materiales": [],
        "personalRequerido": [
          "Medico general o especialista"
        ],
        "tiempoEstimadoMin": 30
      },
      {
        "nombre": "Psicologia",
        "descripcion": "CONSULTAS",
        "cupsCode": null,
        "preguntar": [
          "¿Dónde desea la consulta (domicilio, clínica, intrahospitalaria)?",
          "¿Es primera vez o subsecuente?",
          "¿Qué especialidad o motivo de consulta?",
          "Nombre completo del paciente, cédula, edad, dirección, teléfono",
          "¿Tiene estudios previos (imágenes, laboratorios)?",
          "¿Tiene seguro médico?"
        ],
        "requiereIndicacionMedica": false,
        "materiales": [],
        "personalRequerido": [
          "Medico general o especialista"
        ],
        "tiempoEstimadoMin": 30
      },
      {
        "nombre": "Urologia",
        "descripcion": "CONSULTAS",
        "cupsCode": null,
        "preguntar": [
          "¿Dónde desea la consulta (domicilio, clínica, intrahospitalaria)?",
          "¿Es primera vez o subsecuente?",
          "¿Qué especialidad o motivo de consulta?",
          "Nombre completo del paciente, cédula, edad, dirección, teléfono",
          "¿Tiene estudios previos (imágenes, laboratorios)?",
          "¿Tiene seguro médico?"
        ],
        "requiereIndicacionMedica": false,
        "materiales": [],
        "personalRequerido": [
          "Medico general o especialista"
        ],
        "tiempoEstimadoMin": 30
      },
      {
        "nombre": "Ginecologia",
        "descripcion": "CONSULTAS",
        "cupsCode": null,
        "preguntar": [
          "¿Dónde desea la consulta (domicilio, clínica, intrahospitalaria)?",
          "¿Es primera vez o subsecuente?",
          "¿Qué especialidad o motivo de consulta?",
          "Nombre completo del paciente, cédula, edad, dirección, teléfono",
          "¿Tiene estudios previos (imágenes, laboratorios)?",
          "¿Tiene seguro médico?"
        ],
        "requiereIndicacionMedica": false,
        "materiales": [],
        "personalRequerido": [
          "Medico general o especialista"
        ],
        "tiempoEstimadoMin": 30
      },
      {
        "nombre": "Domicilio",
        "descripcion": "CONSULTAS",
        "cupsCode": null,
        "preguntar": [
          "¿Dónde desea la consulta (domicilio, clínica, intrahospitalaria)?",
          "¿Es primera vez o subsecuente?",
          "¿Qué especialidad o motivo de consulta?",
          "Nombre completo del paciente, cédula, edad, dirección, teléfono",
          "¿Tiene estudios previos (imágenes, laboratorios)?",
          "¿Tiene seguro médico?"
        ],
        "requiereIndicacionMedica": false,
        "materiales": [],
        "personalRequerido": [
          "Medico general o especialista"
        ],
        "tiempoEstimadoMin": 30
      },
      {
        "nombre": "Telemedicina",
        "descripcion": "CONSULTAS",
        "cupsCode": null,
        "preguntar": [
          "¿Dónde desea la consulta (domicilio, clínica, intrahospitalaria)?",
          "¿Es primera vez o subsecuente?",
          "¿Qué especialidad o motivo de consulta?",
          "Nombre completo del paciente, cédula, edad, dirección, teléfono",
          "¿Tiene estudios previos (imágenes, laboratorios)?",
          "¿Tiene seguro médico?"
        ],
        "requiereIndicacionMedica": false,
        "materiales": [],
        "personalRequerido": [
          "Medico general o especialista"
        ],
        "tiempoEstimadoMin": 30
      },
      {
        "nombre": "Evaluacion Preventiva",
        "descripcion": "CONSULTAS",
        "cupsCode": null,
        "preguntar": [
          "¿Dónde desea la consulta (domicilio, clínica, intrahospitalaria)?",
          "¿Es primera vez o subsecuente?",
          "¿Qué especialidad o motivo de consulta?",
          "Nombre completo del paciente, cédula, edad, dirección, teléfono",
          "¿Tiene estudios previos (imágenes, laboratorios)?",
          "¿Tiene seguro médico?"
        ],
        "requiereIndicacionMedica": false,
        "materiales": [],
        "personalRequerido": [
          "Medico general o especialista"
        ],
        "tiempoEstimadoMin": 30
      },
      {
        "nombre": "Interconsulta",
        "descripcion": "CONSULTAS",
        "cupsCode": null,
        "preguntar": [
          "¿Dónde desea la consulta (domicilio, clínica, intrahospitalaria)?",
          "¿Es primera vez o subsecuente?",
          "¿Qué especialidad o motivo de consulta?",
          "Nombre completo del paciente, cédula, edad, dirección, teléfono",
          "¿Tiene estudios previos (imágenes, laboratorios)?",
          "¿Tiene seguro médico?"
        ],
        "requiereIndicacionMedica": false,
        "materiales": [],
        "personalRequerido": [
          "Medico general o especialista"
        ],
        "tiempoEstimadoMin": 30
      },
      {
        "nombre": "Consulta Medico General",
        "descripcion": "PALIATIVOS",
        "cupsCode": null,
        "preguntar": [
          "¿Dónde desea la consulta (domicilio, clínica, intrahospitalaria)?",
          "¿Es primera vez o subsecuente?",
          "¿Qué especialidad o motivo de consulta?",
          "Nombre completo del paciente, cédula, edad, dirección, teléfono",
          "¿Tiene estudios previos (imágenes, laboratorios)?",
          "¿Tiene seguro médico?"
        ],
        "requiereIndicacionMedica": false,
        "materiales": [],
        "personalRequerido": [
          "Medico general o especialista"
        ],
        "tiempoEstimadoMin": 30
      },
      {
        "nombre": "Consulta Psicologia",
        "descripcion": "PALIATIVOS",
        "cupsCode": null,
        "preguntar": [
          "¿Dónde desea la consulta (domicilio, clínica, intrahospitalaria)?",
          "¿Es primera vez o subsecuente?",
          "¿Qué especialidad o motivo de consulta?",
          "Nombre completo del paciente, cédula, edad, dirección, teléfono",
          "¿Tiene estudios previos (imágenes, laboratorios)?",
          "¿Tiene seguro médico?"
        ],
        "requiereIndicacionMedica": false,
        "materiales": [],
        "personalRequerido": [
          "Medico general o especialista"
        ],
        "tiempoEstimadoMin": 30
      },
      {
        "nombre": "Consulta Subsecuente",
        "descripcion": "PALIATIVOS",
        "cupsCode": null,
        "preguntar": [
          "¿Dónde desea la consulta (domicilio, clínica, intrahospitalaria)?",
          "¿Es primera vez o subsecuente?",
          "¿Qué especialidad o motivo de consulta?",
          "Nombre completo del paciente, cédula, edad, dirección, teléfono",
          "¿Tiene estudios previos (imágenes, laboratorios)?",
          "¿Tiene seguro médico?"
        ],
        "requiereIndicacionMedica": false,
        "materiales": [],
        "personalRequerido": [
          "Medico general o especialista"
        ],
        "tiempoEstimadoMin": 30
      },
      {
        "nombre": "Consulta Primera Vez Pacientes Oncológicos y No Oncológicos",
        "descripcion": "PALIATIVOS",
        "cupsCode": null,
        "preguntar": [
          "¿Dónde desea la consulta (domicilio, clínica, intrahospitalaria)?",
          "¿Es primera vez o subsecuente?",
          "¿Qué especialidad o motivo de consulta?",
          "Nombre completo del paciente, cédula, edad, dirección, teléfono",
          "¿Tiene estudios previos (imágenes, laboratorios)?",
          "¿Tiene seguro médico?"
        ],
        "requiereIndicacionMedica": false,
        "materiales": [],
        "personalRequerido": [
          "Medico general o especialista"
        ],
        "tiempoEstimadoMin": 30
      },
      {
        "nombre": "Consultas Primera Vez Pacientes Pediátricos Oncológicos.",
        "descripcion": "PALIATIVOS",
        "cupsCode": null,
        "preguntar": [
          "¿Dónde desea la consulta (domicilio, clínica, intrahospitalaria)?",
          "¿Es primera vez o subsecuente?",
          "¿Qué especialidad o motivo de consulta?",
          "Nombre completo del paciente, cédula, edad, dirección, teléfono",
          "¿Tiene estudios previos (imágenes, laboratorios)?",
          "¿Tiene seguro médico?"
        ],
        "requiereIndicacionMedica": false,
        "materiales": [],
        "personalRequerido": [
          "Medico general o especialista"
        ],
        "tiempoEstimadoMin": 30
      },
      {
        "nombre": "Consulta Telefónica Programada del Médico",
        "descripcion": "CONSULTAS TELEMEDICINA (PALIATIVOS)",
        "cupsCode": null,
        "preguntar": [
          "¿Dónde desea la consulta (domicilio, clínica, intrahospitalaria)?",
          "¿Es primera vez o subsecuente?",
          "¿Qué especialidad o motivo de consulta?",
          "Nombre completo del paciente, cédula, edad, dirección, teléfono",
          "¿Tiene estudios previos (imágenes, laboratorios)?",
          "¿Tiene seguro médico?"
        ],
        "requiereIndicacionMedica": false,
        "materiales": [],
        "personalRequerido": [
          "Medico general o especialista"
        ],
        "tiempoEstimadoMin": 30
      },
      {
        "nombre": "Consulta Telefónica a Demanda para el Médico",
        "descripcion": "CONSULTAS TELEMEDICINA (PALIATIVOS)",
        "cupsCode": null,
        "preguntar": [
          "¿Dónde desea la consulta (domicilio, clínica, intrahospitalaria)?",
          "¿Es primera vez o subsecuente?",
          "¿Qué especialidad o motivo de consulta?",
          "Nombre completo del paciente, cédula, edad, dirección, teléfono",
          "¿Tiene estudios previos (imágenes, laboratorios)?",
          "¿Tiene seguro médico?"
        ],
        "requiereIndicacionMedica": false,
        "materiales": [],
        "personalRequerido": [
          "Medico general o especialista"
        ],
        "tiempoEstimadoMin": 30
      },
      {
        "nombre": "Seguimiento Programado (paciente No Ingresado): Consulta Telefónica",
        "descripcion": "CONSULTAS TELEMEDICINA (PALIATIVOS)",
        "cupsCode": null,
        "preguntar": [
          "¿Dónde desea la consulta (domicilio, clínica, intrahospitalaria)?",
          "¿Es primera vez o subsecuente?",
          "¿Qué especialidad o motivo de consulta?",
          "Nombre completo del paciente, cédula, edad, dirección, teléfono",
          "¿Tiene estudios previos (imágenes, laboratorios)?",
          "¿Tiene seguro médico?"
        ],
        "requiereIndicacionMedica": false,
        "materiales": [],
        "personalRequerido": [
          "Medico general o especialista"
        ],
        "tiempoEstimadoMin": 30
      },
      {
        "nombre": "Visita Básica Médica en Domicilio",
        "descripcion": "VISITA DOMICILILARIA (PALIATIVOS)",
        "cupsCode": null,
        "preguntar": [
          "¿Dónde desea la consulta (domicilio, clínica, intrahospitalaria)?",
          "¿Es primera vez o subsecuente?",
          "¿Qué especialidad o motivo de consulta?",
          "Nombre completo del paciente, cédula, edad, dirección, teléfono",
          "¿Tiene estudios previos (imágenes, laboratorios)?",
          "¿Tiene seguro médico?"
        ],
        "requiereIndicacionMedica": false,
        "materiales": [
          "Kit de curaciones",
          "Gasas estériles",
          "Guantes",
          "Antiséptico",
          "Jeringas"
        ],
        "personalRequerido": [
          "Enfermera"
        ],
        "tiempoEstimadoMin": 60
      },
      {
        "nombre": "Visita Urgente Médica en Domicilio",
        "descripcion": "VISITA DOMICILILARIA (PALIATIVOS)",
        "cupsCode": null,
        "preguntar": [
          "¿Dónde desea la consulta (domicilio, clínica, intrahospitalaria)?",
          "¿Es primera vez o subsecuente?",
          "¿Qué especialidad o motivo de consulta?",
          "Nombre completo del paciente, cédula, edad, dirección, teléfono",
          "¿Tiene estudios previos (imágenes, laboratorios)?",
          "¿Tiene seguro médico?"
        ],
        "requiereIndicacionMedica": false,
        "materiales": [
          "Kit de curaciones",
          "Gasas estériles",
          "Guantes",
          "Antiséptico",
          "Jeringas"
        ],
        "personalRequerido": [
          "Enfermera"
        ],
        "tiempoEstimadoMin": 60
      },
      {
        "nombre": "Visita Básica Médica en Domicilio ( Más Procedimiento sin Materiales Gastables)",
        "descripcion": "VISITA DOMICILILARIA (PALIATIVOS)",
        "cupsCode": null,
        "preguntar": [
          "¿Dónde desea la consulta (domicilio, clínica, intrahospitalaria)?",
          "¿Es primera vez o subsecuente?",
          "¿Qué especialidad o motivo de consulta?",
          "Nombre completo del paciente, cédula, edad, dirección, teléfono",
          "¿Tiene estudios previos (imágenes, laboratorios)?",
          "¿Tiene seguro médico?"
        ],
        "requiereIndicacionMedica": false,
        "materiales": [
          "Kit de procedimiento",
          "Aguja de punción",
          "Antiséptico",
          "Anestésico local",
          "Equipo de protección"
        ],
        "personalRequerido": [
          "Medico especialista",
          "Enfermera circulante"
        ],
        "tiempoEstimadoMin": 60
      },
      {
        "nombre": "Visita Urgente Médica en Domicilio Más Procedimiento",
        "descripcion": "VISITA DOMICILILARIA (PALIATIVOS)",
        "cupsCode": null,
        "preguntar": [
          "¿Dónde desea la consulta (domicilio, clínica, intrahospitalaria)?",
          "¿Es primera vez o subsecuente?",
          "¿Qué especialidad o motivo de consulta?",
          "Nombre completo del paciente, cédula, edad, dirección, teléfono",
          "¿Tiene estudios previos (imágenes, laboratorios)?",
          "¿Tiene seguro médico?"
        ],
        "requiereIndicacionMedica": false,
        "materiales": [
          "Kit de procedimiento",
          "Aguja de punción",
          "Antiséptico",
          "Anestésico local",
          "Equipo de protección"
        ],
        "personalRequerido": [
          "Medico especialista",
          "Enfermera circulante"
        ],
        "tiempoEstimadoMin": 60
      },
      {
        "nombre": "CONSULTA PRE-ANESTÉSICA",
        "descripcion": "",
        "cupsCode": null,
        "preguntar": [
          "¿Dónde desea la consulta (domicilio, clínica, intrahospitalaria)?",
          "¿Es primera vez o subsecuente?",
          "¿Qué especialidad o motivo de consulta?",
          "Nombre completo del paciente, cédula, edad, dirección, teléfono",
          "¿Tiene estudios previos (imágenes, laboratorios)?",
          "¿Tiene seguro médico?"
        ],
        "requiereIndicacionMedica": false,
        "materiales": [],
        "personalRequerido": [
          "Medico general o especialista"
        ],
        "tiempoEstimadoMin": 30
      },
      {
        "nombre": "Anestesia Regional",
        "descripcion": "",
        "cupsCode": null,
        "preguntar": [
          "¿Dónde desea la consulta (domicilio, clínica, intrahospitalaria)?",
          "¿Es primera vez o subsecuente?",
          "¿Qué especialidad o motivo de consulta?",
          "Nombre completo del paciente, cédula, edad, dirección, teléfono",
          "¿Tiene estudios previos (imágenes, laboratorios)?",
          "¿Tiene seguro médico?"
        ],
        "requiereIndicacionMedica": false,
        "materiales": [],
        "personalRequerido": [
          "Medico general o especialista"
        ],
        "tiempoEstimadoMin": 30
      },
      {
        "nombre": "Anestesia general Endovenoso (TIVA)",
        "descripcion": "",
        "cupsCode": null,
        "preguntar": [
          "¿Dónde desea la consulta (domicilio, clínica, intrahospitalaria)?",
          "¿Es primera vez o subsecuente?",
          "¿Qué especialidad o motivo de consulta?",
          "Nombre completo del paciente, cédula, edad, dirección, teléfono",
          "¿Tiene estudios previos (imágenes, laboratorios)?",
          "¿Tiene seguro médico?"
        ],
        "requiereIndicacionMedica": false,
        "materiales": [],
        "personalRequerido": [
          "Medico general o especialista"
        ],
        "tiempoEstimadoMin": 30
      },
      {
        "nombre": "Sedación Consciente",
        "descripcion": "",
        "cupsCode": null,
        "preguntar": [
          "¿Dónde desea la consulta (domicilio, clínica, intrahospitalaria)?",
          "¿Es primera vez o subsecuente?",
          "¿Qué especialidad o motivo de consulta?",
          "Nombre completo del paciente, cédula, edad, dirección, teléfono",
          "¿Tiene estudios previos (imágenes, laboratorios)?",
          "¿Tiene seguro médico?"
        ],
        "requiereIndicacionMedica": false,
        "materiales": [],
        "personalRequerido": [
          "Medico general o especialista"
        ],
        "tiempoEstimadoMin": 30
      },
      {
        "nombre": "Sedo – Analgesia",
        "descripcion": "",
        "cupsCode": null,
        "preguntar": [
          "¿Dónde desea la consulta (domicilio, clínica, intrahospitalaria)?",
          "¿Es primera vez o subsecuente?",
          "¿Qué especialidad o motivo de consulta?",
          "Nombre completo del paciente, cédula, edad, dirección, teléfono",
          "¿Tiene estudios previos (imágenes, laboratorios)?",
          "¿Tiene seguro médico?"
        ],
        "requiereIndicacionMedica": false,
        "materiales": [],
        "personalRequerido": [
          "Medico general o especialista"
        ],
        "tiempoEstimadoMin": 30
      },
      {
        "nombre": "Anestesia Pediátrica",
        "descripcion": "",
        "cupsCode": null,
        "preguntar": [
          "¿Dónde desea la consulta (domicilio, clínica, intrahospitalaria)?",
          "¿Es primera vez o subsecuente?",
          "¿Qué especialidad o motivo de consulta?",
          "Nombre completo del paciente, cédula, edad, dirección, teléfono",
          "¿Tiene estudios previos (imágenes, laboratorios)?",
          "¿Tiene seguro médico?"
        ],
        "requiereIndicacionMedica": false,
        "materiales": [],
        "personalRequerido": [
          "Medico general o especialista"
        ],
        "tiempoEstimadoMin": 30
      },
      {
        "nombre": "Anestesia Ambulatoria",
        "descripcion": "",
        "cupsCode": null,
        "preguntar": [
          "¿Dónde desea la consulta (domicilio, clínica, intrahospitalaria)?",
          "¿Es primera vez o subsecuente?",
          "¿Qué especialidad o motivo de consulta?",
          "Nombre completo del paciente, cédula, edad, dirección, teléfono",
          "¿Tiene estudios previos (imágenes, laboratorios)?",
          "¿Tiene seguro médico?"
        ],
        "requiereIndicacionMedica": false,
        "materiales": [],
        "personalRequerido": [
          "Medico general o especialista"
        ],
        "tiempoEstimadoMin": 30
      }
    ]
  },
  {
    "grupo": "terapias",
    "titulo": "Terapias",
    "total": 7,
    "servicios": [
      {
        "nombre": "Nutricion",
        "descripcion": "CONSULTAS",
        "cupsCode": null,
        "preguntar": [
          "¿Qué tipo de terapia necesita (física, respiratoria, nutrición)?",
          "¿Condición o diagnóstico del paciente?",
          "¿Limitación funcional o necesidad específica?",
          "¿Frecuencia deseada (veces por semana)?",
          "¿Tiene indicación médica?",
          "Nombre completo, cédula, dirección, teléfono"
        ],
        "requiereIndicacionMedica": true,
        "materiales": [],
        "personalRequerido": [
          "Terapeuta físico / respiratorio / nutricionista"
        ],
        "tiempoEstimadoMin": 45
      },
      {
        "nombre": "Geriatria",
        "descripcion": "CONSULTAS",
        "cupsCode": null,
        "preguntar": [
          "¿Qué tipo de terapia necesita (física, respiratoria, nutrición)?",
          "¿Condición o diagnóstico del paciente?",
          "¿Limitación funcional o necesidad específica?",
          "¿Frecuencia deseada (veces por semana)?",
          "¿Tiene indicación médica?",
          "Nombre completo, cédula, dirección, teléfono"
        ],
        "requiereIndicacionMedica": true,
        "materiales": [],
        "personalRequerido": [
          "Terapeuta físico / respiratorio / nutricionista"
        ],
        "tiempoEstimadoMin": 45
      },
      {
        "nombre": "Evaluación Cardiovascular Pre Quirúrgica",
        "descripcion": "CONSULTAS",
        "cupsCode": null,
        "preguntar": [
          "¿Qué tipo de terapia necesita (física, respiratoria, nutrición)?",
          "¿Condición o diagnóstico del paciente?",
          "¿Limitación funcional o necesidad específica?",
          "¿Frecuencia deseada (veces por semana)?",
          "¿Tiene indicación médica?",
          "Nombre completo, cédula, dirección, teléfono"
        ],
        "requiereIndicacionMedica": true,
        "materiales": [],
        "personalRequerido": [
          "Medico general o especialista"
        ],
        "tiempoEstimadoMin": 30
      },
      {
        "nombre": "Consulta de Nutrición",
        "descripcion": "CONSULTAS",
        "cupsCode": null,
        "preguntar": [
          "¿Qué tipo de terapia necesita (física, respiratoria, nutrición)?",
          "¿Condición o diagnóstico del paciente?",
          "¿Limitación funcional o necesidad específica?",
          "¿Frecuencia deseada (veces por semana)?",
          "¿Tiene indicación médica?",
          "Nombre completo, cédula, dirección, teléfono"
        ],
        "requiereIndicacionMedica": true,
        "materiales": [],
        "personalRequerido": [
          "Medico general o especialista"
        ],
        "tiempoEstimadoMin": 30
      },
      {
        "nombre": "Evaluaciones Pre-quirúrgicas",
        "descripcion": "CONSULTAS",
        "cupsCode": null,
        "preguntar": [
          "¿Qué tipo de terapia necesita (física, respiratoria, nutrición)?",
          "¿Condición o diagnóstico del paciente?",
          "¿Limitación funcional o necesidad específica?",
          "¿Frecuencia deseada (veces por semana)?",
          "¿Tiene indicación médica?",
          "Nombre completo, cédula, dirección, teléfono"
        ],
        "requiereIndicacionMedica": true,
        "materiales": [],
        "personalRequerido": [
          "Terapeuta físico / respiratorio / nutricionista"
        ],
        "tiempoEstimadoMin": 45
      },
      {
        "nombre": "Consulta Terapia Fisica",
        "descripcion": "PALIATIVOS",
        "cupsCode": null,
        "preguntar": [
          "¿Qué tipo de terapia necesita (física, respiratoria, nutrición)?",
          "¿Condición o diagnóstico del paciente?",
          "¿Limitación funcional o necesidad específica?",
          "¿Frecuencia deseada (veces por semana)?",
          "¿Tiene indicación médica?",
          "Nombre completo, cédula, dirección, teléfono"
        ],
        "requiereIndicacionMedica": true,
        "materiales": [],
        "personalRequerido": [
          "Terapeuta físico / respiratorio / nutricionista"
        ],
        "tiempoEstimadoMin": 45
      },
      {
        "nombre": "Consulta Terapia Ventilatoria",
        "descripcion": "PALIATIVOS",
        "cupsCode": null,
        "preguntar": [
          "¿Qué tipo de terapia necesita (física, respiratoria, nutrición)?",
          "¿Condición o diagnóstico del paciente?",
          "¿Limitación funcional o necesidad específica?",
          "¿Frecuencia deseada (veces por semana)?",
          "¿Tiene indicación médica?",
          "Nombre completo, cédula, dirección, teléfono"
        ],
        "requiereIndicacionMedica": true,
        "materiales": [],
        "personalRequerido": [
          "Terapeuta físico / respiratorio / nutricionista"
        ],
        "tiempoEstimadoMin": 45
      }
    ]
  },
  {
    "grupo": "cuidados_paliativos",
    "titulo": "Cuidados Paliativos",
    "total": 2,
    "servicios": [
      {
        "nombre": "Cuidados Paliativos",
        "descripcion": "CONSULTAS",
        "cupsCode": null,
        "preguntar": [
          "¿Dónde se requiere la atención (domicilio, clínica)?",
          "¿Diagnóstico de base y médico tratante?",
          "¿Estado actual del paciente (consciente, encamado, síntomas)?",
          "¿Tiene cuidador familiar responsable?",
          "¿Qué tipo de atención necesita (control de síntomas, sedación, apoyo)?",
          "¿Tiene indicación médica de cuidados paliativos?",
          "Nombre completo, cédula, dirección, teléfono"
        ],
        "requiereIndicacionMedica": true,
        "materiales": [],
        "personalRequerido": [
          "Medico paliativista",
          "Enfermera"
        ],
        "tiempoEstimadoMin": 60
      },
      {
        "nombre": "Consulta Medica Especializada Cuidados Paliativos Manejo de Dolor Geriatria Nutricion Gastroenterologia Hematologia Cardiologia Medicina Interna Neumologia Medicina Familiar",
        "descripcion": "PALIATIVOS",
        "cupsCode": null,
        "preguntar": [
          "¿Dónde se requiere la atención (domicilio, clínica)?",
          "¿Diagnóstico de base y médico tratante?",
          "¿Estado actual del paciente (consciente, encamado, síntomas)?",
          "¿Tiene cuidador familiar responsable?",
          "¿Qué tipo de atención necesita (control de síntomas, sedación, apoyo)?",
          "¿Tiene indicación médica de cuidados paliativos?",
          "Nombre completo, cédula, dirección, teléfono"
        ],
        "requiereIndicacionMedica": true,
        "materiales": [],
        "personalRequerido": [
          "Medico paliativista",
          "Enfermera"
        ],
        "tiempoEstimadoMin": 60
      }
    ]
  },
  {
    "grupo": "hospitalizacion_domiciliaria",
    "titulo": "Hospitalización Domiciliaria",
    "total": 1,
    "servicios": [
      {
        "nombre": "Honorario en Hospitalizacion por Dia",
        "descripcion": "CONSULTAS",
        "cupsCode": null,
        "preguntar": [
          "¿Diagnóstico y estado actual del paciente?",
          "¿Qué nivel de atención requiere (enfermería 4h, 8h, 12h, 24h)?",
          "¿Tiene médico tratante y cuidador familiar?",
          "¿Qué medicamentos o equipos necesita?",
          "¿Tiene seguro médico?",
          "Nombre completo, cédula, dirección, teléfono"
        ],
        "requiereIndicacionMedica": true,
        "materiales": [],
        "personalRequerido": [
          "Medico",
          "Enfermera",
          "Cuidadora"
        ],
        "tiempoEstimadoMin": 480
      }
    ]
  },
  {
    "grupo": "oncomejorate",
    "titulo": "Oncomejórate (Quimioterapia)",
    "total": 14,
    "servicios": [
      {
        "nombre": "Quimioterapia de Inducción",
        "descripcion": "HEMOTERAPIA",
        "cupsCode": "99.2.5.01",
        "preguntar": [
          "¿Dónde se realiza el tratamiento (domicilio o clínica)?",
          "¿Diagnóstico oncológico y protocolo de tratamiento?",
          "¿Tiene acceso venoso central (PICC, port-a-cath)?",
          "¿Médico oncólogo tratante?",
          "¿Qué medicamentos o protocolo específico?",
          "Nombre completo, cédula, dirección, teléfono"
        ],
        "requiereIndicacionMedica": true,
        "materiales": [
          "Acceso venoso central (PICC, port-a-cath)",
          "Medicamento oncológico",
          "Equipo de infusión"
        ],
        "personalRequerido": [
          "Medico oncólogo",
          "Enfermera oncóloga"
        ],
        "tiempoEstimadoMin": 240
      },
      {
        "nombre": "Infusion de Quimioterapia Intraarterial Regional o en Cavidades",
        "descripcion": "Atenciones de alto costo Y de maximo nivel de complejidad - Tratamiento Cáncer de Adultos",
        "cupsCode": "99.2.5.10",
        "preguntar": [
          "¿Dónde se realiza el tratamiento (domicilio o clínica)?",
          "¿Diagnóstico oncológico y protocolo de tratamiento?",
          "¿Tiene acceso venoso central (PICC, port-a-cath)?",
          "¿Médico oncólogo tratante?",
          "¿Qué medicamentos o protocolo específico?",
          "Nombre completo, cédula, dirección, teléfono"
        ],
        "requiereIndicacionMedica": true,
        "materiales": [
          "Acceso venoso central (PICC, port-a-cath)",
          "Medicamento oncológico",
          "Equipo de infusión"
        ],
        "personalRequerido": [
          "Medico oncólogo",
          "Enfermera oncóloga"
        ],
        "tiempoEstimadoMin": 240
      },
      {
        "nombre": "Colocacion de Cateter Peritoneal Implantable Intraarterial para Quimioterapia",
        "descripcion": "Atenciones de alto costo Y de maximo nivel de complejidad - Tratamiento Cáncer de Adultos",
        "cupsCode": "54.9.0.04",
        "preguntar": [
          "¿Dónde se realiza el tratamiento (domicilio o clínica)?",
          "¿Diagnóstico oncológico y protocolo de tratamiento?",
          "¿Tiene acceso venoso central (PICC, port-a-cath)?",
          "¿Médico oncólogo tratante?",
          "¿Qué medicamentos o protocolo específico?",
          "Nombre completo, cédula, dirección, teléfono"
        ],
        "requiereIndicacionMedica": true,
        "materiales": [
          "Acceso venoso central (PICC, port-a-cath)",
          "Medicamento oncológico",
          "Equipo de infusión"
        ],
        "personalRequerido": [
          "Medico oncólogo",
          "Enfermera oncóloga"
        ],
        "tiempoEstimadoMin": 240
      },
      {
        "nombre": "Retiro de Cateter Peritoneal Implantable Intraarterial para Quimioterapia",
        "descripcion": "Atenciones de alto costo Y de maximo nivel de complejidad - Tratamiento Cáncer de Adultos",
        "cupsCode": "54.9.0.11",
        "preguntar": [
          "¿Dónde se realiza el tratamiento (domicilio o clínica)?",
          "¿Diagnóstico oncológico y protocolo de tratamiento?",
          "¿Tiene acceso venoso central (PICC, port-a-cath)?",
          "¿Médico oncólogo tratante?",
          "¿Qué medicamentos o protocolo específico?",
          "Nombre completo, cédula, dirección, teléfono"
        ],
        "requiereIndicacionMedica": true,
        "materiales": [
          "Acceso venoso central (PICC, port-a-cath)",
          "Medicamento oncológico",
          "Equipo de infusión"
        ],
        "personalRequerido": [
          "Medico oncólogo",
          "Enfermera oncóloga"
        ],
        "tiempoEstimadoMin": 240
      },
      {
        "nombre": "Poliquimioterapia de Bajo Riesgo",
        "descripcion": "Atenciones de alto costo Y de maximo nivel de complejidad - Tratamiento Cáncer de Adultos",
        "cupsCode": "99.2.5.04",
        "preguntar": [
          "¿Dónde se realiza el tratamiento (domicilio o clínica)?",
          "¿Diagnóstico oncológico y protocolo de tratamiento?",
          "¿Tiene acceso venoso central (PICC, port-a-cath)?",
          "¿Médico oncólogo tratante?",
          "¿Qué medicamentos o protocolo específico?",
          "Nombre completo, cédula, dirección, teléfono"
        ],
        "requiereIndicacionMedica": true,
        "materiales": [
          "Acceso venoso central (PICC, port-a-cath)",
          "Medicamento oncológico",
          "Equipo de infusión"
        ],
        "personalRequerido": [
          "Medico oncólogo",
          "Enfermera oncóloga"
        ],
        "tiempoEstimadoMin": 240
      },
      {
        "nombre": "Medicamento Oncologico",
        "descripcion": "Atenciones de alto costo Y de maximo nivel de complejidad - Tratamiento Cáncer de Adultos",
        "cupsCode": null,
        "preguntar": [
          "¿Dónde se realiza el tratamiento (domicilio o clínica)?",
          "¿Diagnóstico oncológico y protocolo de tratamiento?",
          "¿Tiene acceso venoso central (PICC, port-a-cath)?",
          "¿Médico oncólogo tratante?",
          "¿Qué medicamentos o protocolo específico?",
          "Nombre completo, cédula, dirección, teléfono"
        ],
        "requiereIndicacionMedica": true,
        "materiales": [
          "Acceso venoso central (PICC, port-a-cath)",
          "Medicamento oncológico",
          "Equipo de infusión"
        ],
        "personalRequerido": [
          "Medico oncólogo",
          "Enfermera oncóloga"
        ],
        "tiempoEstimadoMin": 240
      },
      {
        "nombre": "Colocacion de Puerto para Quimioterapia",
        "descripcion": "Atenciones de alto costo Y de maximo nivel de complejidad - Tratamiento Cáncer de Adultos",
        "cupsCode": null,
        "preguntar": [
          "¿Dónde se realiza el tratamiento (domicilio o clínica)?",
          "¿Diagnóstico oncológico y protocolo de tratamiento?",
          "¿Tiene acceso venoso central (PICC, port-a-cath)?",
          "¿Médico oncólogo tratante?",
          "¿Qué medicamentos o protocolo específico?",
          "Nombre completo, cédula, dirección, teléfono"
        ],
        "requiereIndicacionMedica": true,
        "materiales": [
          "Acceso venoso central (PICC, port-a-cath)",
          "Medicamento oncológico",
          "Equipo de infusión"
        ],
        "personalRequerido": [
          "Medico oncólogo",
          "Enfermera oncóloga"
        ],
        "tiempoEstimadoMin": 240
      },
      {
        "nombre": "Sala de Quimioterapia",
        "descripcion": "Atenciones de alto costo Y de maximo nivel de complejidad - Tratamiento Cáncer de Adultos",
        "cupsCode": "S2.2.2.22",
        "preguntar": [
          "¿Dónde se realiza el tratamiento (domicilio o clínica)?",
          "¿Diagnóstico oncológico y protocolo de tratamiento?",
          "¿Tiene acceso venoso central (PICC, port-a-cath)?",
          "¿Médico oncólogo tratante?",
          "¿Qué medicamentos o protocolo específico?",
          "Nombre completo, cédula, dirección, teléfono"
        ],
        "requiereIndicacionMedica": true,
        "materiales": [
          "Acceso venoso central (PICC, port-a-cath)",
          "Medicamento oncológico",
          "Equipo de infusión"
        ],
        "personalRequerido": [
          "Medico oncólogo",
          "Enfermera oncóloga"
        ],
        "tiempoEstimadoMin": 240
      },
      {
        "nombre": "Quimioterapia Intratecal",
        "descripcion": "Atenciones de alto costo Y de maximo nivel de complejidad - Tratamiento Cáncer de Adultos",
        "cupsCode": "99.2.5.02",
        "preguntar": [
          "¿Dónde se realiza el tratamiento (domicilio o clínica)?",
          "¿Diagnóstico oncológico y protocolo de tratamiento?",
          "¿Tiene acceso venoso central (PICC, port-a-cath)?",
          "¿Médico oncólogo tratante?",
          "¿Qué medicamentos o protocolo específico?",
          "Nombre completo, cédula, dirección, teléfono"
        ],
        "requiereIndicacionMedica": true,
        "materiales": [
          "Acceso venoso central (PICC, port-a-cath)",
          "Medicamento oncológico",
          "Equipo de infusión"
        ],
        "personalRequerido": [
          "Medico oncólogo",
          "Enfermera oncóloga"
        ],
        "tiempoEstimadoMin": 240
      },
      {
        "nombre": "Quimioterapia de Induccion",
        "descripcion": "Atenciones de alto costo Y de maximo nivel de complejidad - Tratamiento Cáncer de Pediatrico",
        "cupsCode": "99.2.5.03",
        "preguntar": [
          "¿Dónde se realiza el tratamiento (domicilio o clínica)?",
          "¿Diagnóstico oncológico y protocolo de tratamiento?",
          "¿Tiene acceso venoso central (PICC, port-a-cath)?",
          "¿Médico oncólogo tratante?",
          "¿Qué medicamentos o protocolo específico?",
          "Nombre completo, cédula, dirección, teléfono"
        ],
        "requiereIndicacionMedica": true,
        "materiales": [
          "Acceso venoso central (PICC, port-a-cath)",
          "Medicamento oncológico",
          "Equipo de infusión"
        ],
        "personalRequerido": [
          "Medico oncólogo",
          "Enfermera oncóloga"
        ],
        "tiempoEstimadoMin": 240
      },
      {
        "nombre": "Poliquimioterapia de Bajo Riesgo Ciclo de Tratamiento",
        "descripcion": "Atenciones de alto costo Y de maximo nivel de complejidad - Medicamentos de Alto Costo para Tratamiento Oncologico",
        "cupsCode": "99.2.5.04",
        "preguntar": [
          "¿Dónde se realiza el tratamiento (domicilio o clínica)?",
          "¿Diagnóstico oncológico y protocolo de tratamiento?",
          "¿Tiene acceso venoso central (PICC, port-a-cath)?",
          "¿Médico oncólogo tratante?",
          "¿Qué medicamentos o protocolo específico?",
          "Nombre completo, cédula, dirección, teléfono"
        ],
        "requiereIndicacionMedica": true,
        "materiales": [
          "Acceso venoso central (PICC, port-a-cath)",
          "Medicamento oncológico",
          "Equipo de infusión"
        ],
        "personalRequerido": [
          "Medico oncólogo",
          "Enfermera oncóloga"
        ],
        "tiempoEstimadoMin": 240
      },
      {
        "nombre": "Quimioterapia < 2 horas",
        "descripcion": "",
        "cupsCode": null,
        "preguntar": [
          "¿Dónde se realiza el tratamiento (domicilio o clínica)?",
          "¿Diagnóstico oncológico y protocolo de tratamiento?",
          "¿Tiene acceso venoso central (PICC, port-a-cath)?",
          "¿Médico oncólogo tratante?",
          "¿Qué medicamentos o protocolo específico?",
          "Nombre completo, cédula, dirección, teléfono"
        ],
        "requiereIndicacionMedica": true,
        "materiales": [
          "Acceso venoso central (PICC, port-a-cath)",
          "Medicamento oncológico",
          "Equipo de infusión"
        ],
        "personalRequerido": [
          "Medico oncólogo",
          "Enfermera oncóloga"
        ],
        "tiempoEstimadoMin": 240
      },
      {
        "nombre": "Quimioterapia 2 – 5 horas",
        "descripcion": "",
        "cupsCode": null,
        "preguntar": [
          "¿Dónde se realiza el tratamiento (domicilio o clínica)?",
          "¿Diagnóstico oncológico y protocolo de tratamiento?",
          "¿Tiene acceso venoso central (PICC, port-a-cath)?",
          "¿Médico oncólogo tratante?",
          "¿Qué medicamentos o protocolo específico?",
          "Nombre completo, cédula, dirección, teléfono"
        ],
        "requiereIndicacionMedica": true,
        "materiales": [
          "Acceso venoso central (PICC, port-a-cath)",
          "Medicamento oncológico",
          "Equipo de infusión"
        ],
        "personalRequerido": [
          "Medico oncólogo",
          "Enfermera oncóloga"
        ],
        "tiempoEstimadoMin": 240
      },
      {
        "nombre": "Quimioterapia >5 horas",
        "descripcion": "",
        "cupsCode": null,
        "preguntar": [
          "¿Dónde se realiza el tratamiento (domicilio o clínica)?",
          "¿Diagnóstico oncológico y protocolo de tratamiento?",
          "¿Tiene acceso venoso central (PICC, port-a-cath)?",
          "¿Médico oncólogo tratante?",
          "¿Qué medicamentos o protocolo específico?",
          "Nombre completo, cédula, dirección, teléfono"
        ],
        "requiereIndicacionMedica": true,
        "materiales": [
          "Acceso venoso central (PICC, port-a-cath)",
          "Medicamento oncológico",
          "Equipo de infusión"
        ],
        "personalRequerido": [
          "Medico oncólogo",
          "Enfermera oncóloga"
        ],
        "tiempoEstimadoMin": 240
      }
    ]
  }
];
