export { institutionalConfig } from './institutionalConfig.js';
export {
  ESTADOS,
  TRANSICIONES,
  TERMINAL,
  isEstadoValido,
  puedeTransicionar,
  esTerminal,
  proximosEstados,
  validarTransicion,
} from './stateMachine.js';
export type {
  EstadoFlujo,
  ModalidadServicio,
  TipoServicio,
  Prioridad,
  InstitucionInfo,
  ConfiguracionFacturacion,
  ConfiguracionApp,
  StateMachineFlujo,
  ConfiguracionBot,
  InstitutionalConfig,
} from './types.js';
