// Configuración institucional centralizada - UNIDOLOR
// Fuente única: paquete @unidolor/core (monorepo packages/core).
// Este archivo es un re-export de compatibilidad con getters para el frontend.

import { institutionalConfig as coreInstitutionalConfig } from '@unidolor/core';

export const institutionalConfig = coreInstitutionalConfig;

// Helpers para acceso rápido
export const getInstitucion = () => institutionalConfig.institucion;
export const getMarcas = () => institutionalConfig.marcas;
export const getSegurosConvenio = () => institutionalConfig.segurosConvenio;
export const getConfigFacturacion = () => institutionalConfig.configuracionFacturacion;
export const getCanalesEntrada = () => institutionalConfig.canalesEntrada;
export const getModalidadesServicio = () => institutionalConfig.modalidadesServicio;
export const getTiposServicio = () => institutionalConfig.tiposServicio;
export const getPrioridades = () => institutionalConfig.prioridades;
export const getEtapasPipeline = () => institutionalConfig.etapasPipeline;
export const getTiposCita = () => institutionalConfig.tiposCita;
export const getInfoMinimaPaciente = () => institutionalConfig.informacionMinimaPaciente;
export const getPasosFlujo = () => institutionalConfig.pasosFlujoOperativo;
export const getRolesOperativos = () => institutionalConfig.rolesOperativos;
export const getClasificacionServicio = () => institutionalConfig.clasificacionServicio;

export default institutionalConfig;
