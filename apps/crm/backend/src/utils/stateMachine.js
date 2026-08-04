/**
 * Máquina de estados del flujo operativo de UNIDOLOR (Cerebro 04_OPERATIONS.md).
 * Fuente única: paquete @unidolor/core (monorepo packages/core).
 * Re-export de compatibilidad para los imports con el alias '@/utils/stateMachine'.
 */
const {
  ESTADOS,
  TRANSICIONES,
  TERMINAL,
  isEstadoValido,
  puedeTransicionar,
  esTerminal,
  proximosEstados,
  validarTransicion,
} = require('@unidolor/core');

module.exports = {
  ESTADOS,
  TRANSICIONES,
  TERMINAL,
  isEstadoValido,
  puedeTransicionar,
  esTerminal,
  proximosEstados,
  validarTransicion,
};
