/** Tipos base compartidos del ecosistema Unidolor (Cerebro + CRM + ChatBot). */

export type EstadoFlujo =
  | 'solicitud'
  | 'recepcion_informacion'
  | 'verificacion_datos'
  | 'clasificacion_caso'
  | 'cotizacion_autorizacion'
  | 'programacion'
  | 'confirmacion'
  | 'preparacion'
  | 'ejecucion'
  | 'documentacion'
  | 'facturacion'
  | 'seguimiento'
  | 'cierre_caso'
  | 'perdido';

export type ModalidadServicio = 'clinica' | 'domicilio' | 'telemedicina';

export type TipoServicio =
  | 'consulta'
  | 'procedimiento'
  | 'diagnostico'
  | 'enfermeria'
  | 'hospitalizacion_domiciliaria'
  | 'programa_especial';

export type Prioridad = 'emergente' | 'urgente' | 'preferente' | 'programado';

export interface InstitucionInfo {
  nombre: string;
  nombreComercial: string;
  razonSocial: string;
  rnc: string;
  direccion: string;
  ciudad: string;
  pais: string;
  telefono: string;
  whatsapp: string;
  email: string;
  website: string;
  horario: string;
  zonaCobertura: string[];
  cuentaBancaria: {
    banco: string;
    tipo: string;
    numero: string;
    titular: string;
  };
}

export interface ConfiguracionFacturacion {
  itbisSalud: number;
  itbisGeneral: number;
  itbisRetencion: number;
  isrRetencion: number;
  ncfTipos: string[];
  prefijoFactura: string;
  prefijoCotizacion: string;
  prefijoNotaCredito: string;
  prefijoPago: string;
}

export interface ConfiguracionApp {
  fechaFormato: string;
  idioma: string;
  pais: string;
  zonaHoraria: string;
  multiSucursal: boolean;
  industria: string;
}

export interface StateMachineFlujo {
  estados: EstadoFlujo[];
  transiciones: Record<EstadoFlujo, EstadoFlujo[]>;
  terminal: EstadoFlujo[];
}

export interface ConfiguracionBot {
  webhookApiKey: string;
  endpoint: string;
  camposRequeridos: string[];
}

export interface InstitutionalConfig {
  institucion: InstitucionInfo;
  marcas: string[];
  segurosConvenio: string[];
  configuracionFacturacion: ConfiguracionFacturacion;
  configuracionApp: ConfiguracionApp;
  canalesEntrada: string[];
  modalidadesServicio: string[];
  tiposServicio: string[];
  prioridades: string[];
  rolesOperativos: string[];
  informacionMinimaPaciente: string[];
  pasosFlujoOperativo: string[];
  stateMachineFlujo: StateMachineFlujo;
  etapasPipeline: string[];
  tiposCita: string[];
  clasificacionServicio: {
    modalidades: ModalidadServicio[];
    tiposServicio: TipoServicio[];
    atributos: string[];
    prioridades: Prioridad[];
  };
  configuracionBot: ConfiguracionBot;
}
