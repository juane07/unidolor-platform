import type { InstitutionalConfig } from './types.js';

/**
 * Configuración institucional de UNIDOLOR — fuente única compartida
 * por CRM, ChatBot y conocimiento (Cerebro).
 */
export const institutionalConfig: InstitutionalConfig = {
  institucion: {
    nombre: 'UNIDOLOR',
    nombreComercial: 'Alegro X',
    razonSocial: 'Unidolor SRL',
    rnc: '131080219',
    direccion:
      'Ave. Gustavo Mejía Ricart No. 54, Torre Solazar, Business Center, Piso 3, Local 3F, Ensanche Naco, Santo Domingo',
    ciudad: 'Santo Domingo',
    pais: 'República Dominicana',
    telefono: '809-636-3656',
    whatsapp: '829-263-4143',
    email: 'info@unidolor.com',
    website: 'https://unidolor.com',
    horario: 'Lunes a viernes 8:00 AM - 6:00 PM | Sábados disponibilidad limitada',
    zonaCobertura: [
      'Santo Domingo',
      'Zona Norte (Nagua, Las Terrenas)',
      'Santiago',
      'Zonas aledañas',
    ],
    cuentaBancaria: {
      banco: 'BanReservas',
      tipo: 'Cuenta Corriente',
      numero: '9600601779',
      titular: 'Unidolor SRL',
    },
  },

  marcas: [
    'UNIDOLOR',
    'Mejórate en Casa®',
    'Hemohogar®',
    'Oncomejórate',
    'Mujer Plena',
  ],

  segurosConvenio: ['Bupa', 'La Colonial', 'Meta Salud', 'APS', 'Monumental', 'Aetna'],

  configuracionFacturacion: {
    itbisSalud: 0,
    itbisGeneral: 18,
    itbisRetencion: 18,
    isrRetencion: 15,
    ncfTipos: ['01', '02', '03', '04', '11'],
    prefijoFactura: 'FAC-',
    prefijoCotizacion: 'COT-',
    prefijoNotaCredito: 'NC-',
    prefijoPago: 'PAG-',
  },

  configuracionApp: {
    fechaFormato: 'DD/MM/YYYY',
    idioma: 'es_do',
    pais: 'DO',
    zonaHoraria: 'America/Santo_Domingo',
    multiSucursal: true,
    industria: 'salud',
  },

  canalesEntrada: [
    'WhatsApp',
    'Teléfono',
    'Referimiento médico',
    'Página web',
    'Redes sociales',
    'Correo electrónico',
    'Visita presencial',
    'Empresas',
    'ARS',
    'Hospitales',
    'Médicos referidores',
  ],

  modalidadesServicio: ['Clínica', 'Domicilio', 'Telemedicina'],

  tiposServicio: [
    'Consulta',
    'Procedimiento',
    'Diagnóstico',
    'Enfermería',
    'Hospitalización domiciliaria',
    'Programa especial',
  ],

  prioridades: ['Emergente', 'Urgente', 'Preferente', 'Programado'],

  rolesOperativos: [
    'Dirección Médica',
    'Gerencia de Operaciones',
    'Coordinación',
    'Secretarias',
    'Médicos',
    'Enfermería',
    'Facturación',
    'Compras',
    'Inventario',
  ],

  informacionMinimaPaciente: [
    'nombreCompleto',
    'documentoIdentidad',
    'fechaNacimiento',
    'sexo',
    'telefono',
    'direccion',
    'referenciaUbicacion',
    'contactoAlterno',
    'seguroMedico',
    'medicoTratante',
    'diagnosticoConocido',
    'servicioSolicitado',
    'prioridad',
    'responsablePago',
  ],

  pasosFlujoOperativo: [
    'Solicitud del servicio',
    'Recepción de información',
    'Verificación de datos',
    'Clasificación del caso',
    'Cotización o autorización',
    'Programación',
    'Confirmación',
    'Preparación',
    'Ejecución',
    'Documentación',
    'Facturación',
    'Seguimiento',
    'Cierre del caso',
  ],

  stateMachineFlujo: {
    estados: [
      'cotizacion',
      'cita_solicitada',
      'cita_programada',
      'visita',
      'orden_servicio',
      'factura',
      'seguimiento',
      'perdido',
    ],
    transiciones: {
      cotizacion: ['cita_solicitada', 'perdido'],
      cita_solicitada: ['cita_programada', 'perdido'],
      cita_programada: ['visita', 'perdido'],
      visita: ['orden_servicio', 'perdido'],
      orden_servicio: ['factura', 'perdido'],
      factura: ['seguimiento', 'perdido'],
      seguimiento: [],
      perdido: [],
    },
    terminal: ['seguimiento', 'perdido'],
  },

  etapasPipeline: [
    'cotizacion',
    'cita_solicitada',
    'cita_programada',
    'visita',
    'orden_servicio',
    'factura',
    'seguimiento',
    'perdido',
  ],

  tiposCita: ['primera_vez', 'seguimiento', 'urgencia'],

  clasificacionServicio: {
    modalidades: ['clinica', 'domicilio', 'telemedicina'],
    tiposServicio: [
      'consulta',
      'procedimiento',
      'diagnostico',
      'enfermeria',
      'hospitalizacion_domiciliaria',
      'programa_especial',
    ],
    atributos: [
      'clinico',
      'administrativo',
      'diagnostico',
      'terapeutico',
      'preventivo',
      'domiciliario',
      'hospitalario',
      'ambulatorio',
      'empresarial',
      'telemedicina',
    ],
    prioridades: ['emergente', 'urgente', 'preferente', 'programado'],
  },

  configuracionBot: {
    webhookApiKey: 'unidolor-webhook-key-2026',
    endpoint: '/api/webhook/bot',
    camposRequeridos: [
      'nombre',
      'telefono',
      'direccion',
      'servicio',
      'seguro',
      'afiliado',
      'notas',
      'fuente',
    ],
  },
};
