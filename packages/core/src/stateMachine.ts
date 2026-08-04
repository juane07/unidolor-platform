import { institutionalConfig } from './institutionalConfig.js';
import type { EstadoFlujo } from './types.js';

/**
 * Máquina de estados del flujo operativo de UNIDOLOR (Cerebro 04_OPERATIONS.md).
 *
 * Valida transiciones entre los 13 pasos del flujo + estado terminal 'perdido'.
 * Fuente de verdad: institutionalConfig.stateMachineFlujo.
 */

const { stateMachineFlujo } = institutionalConfig;

const ESTADOS: readonly EstadoFlujo[] = stateMachineFlujo.estados;
const TRANSICIONES: Readonly<Record<EstadoFlujo, readonly EstadoFlujo[]>> = stateMachineFlujo.transiciones;
const TERMINAL: readonly EstadoFlujo[] = stateMachineFlujo.terminal;

export function isEstadoValido(estado: string): estado is EstadoFlujo {
  return (ESTADOS as readonly string[]).includes(estado);
}

export function puedeTransicionar(desde: string, hacia: string): boolean {
  if (!isEstadoValido(desde) || !isEstadoValido(hacia)) return false;
  if (desde === hacia) return true;
  const permitidas = TRANSICIONES[desde] ?? [];
  return permitidas.includes(hacia as EstadoFlujo);
}

export function esTerminal(estado: string): boolean {
  return (TERMINAL as readonly string[]).includes(estado);
}

/** Devuelve los estados a los que se puede avanzar desde 'desde'. */
export function proximosEstados(desde: EstadoFlujo): readonly EstadoFlujo[] {
  return TRANSICIONES[desde] ?? [];
}

/** Validación para controladores: devuelve null si ok, o mensaje de error. */
export function validarTransicion(desde: string, hacia: string): string | null {
  if (!isEstadoValido(hacia)) {
    return `Estado '${hacia}' no es válido. Estados válidos: ${ESTADOS.join(', ')}`;
  }
  if (!isEstadoValido(desde)) {
    return `Estado actual '${desde}' no es válido.`;
  }
  if (desde === hacia) return null;
  if (!puedeTransicionar(desde, hacia)) {
    return `Transición inválida: '${desde}' -> '${hacia}'. Permitidas: ${
      proximosEstados(desde as EstadoFlujo).join(', ') || 'ninguna (estado terminal)'
    }`;
  }
  return null;
}

export { ESTADOS, TRANSICIONES, TERMINAL };
