/**
 * Métodos de valoración disponibles
 */
export const MetodoValoracion = {
  PROMEDIO: 'PROMEDIO',
  FIFO: 'FIFO'
} as const;

export type MetodoValoracion = typeof MetodoValoracion[keyof typeof MetodoValoracion];

/**
 * Estados de periodo contable
 */
export const EstadoPeriodo = {
  ACTIVO: 'ACTIVO',
  CERRADO: 'CERRADO'
} as const;

export type EstadoPeriodo = typeof EstadoPeriodo[keyof typeof EstadoPeriodo];

/**
 * Interfaz para la configuración de periodo contable
 */
export interface ConfiguracionPeriodo {
  id: number;
  año: number;
  fechaInicio: string;
  fechaFin: string;
  activo: boolean;
  cerrado: boolean;
  usuarioCierre: string | null;
  observaciones: string;
  persona: {
    id: number;
    razonSocial: string;
    ruc: string;
  };
  descripcion: string;
  fechaCreacion: string;
  fechaActualizacion: string;
}

/**
 * DTO para crear un nuevo periodo contable
 */
export interface CreateConfiguracionPeriodoDto {
  año: number;
  fechaInicio: string;
  fechaFin: string;
  idPersona: number;
  observaciones: string;
}

/**
 * DTO para actualizar un periodo contable
 */
export interface UpdateConfiguracionPeriodoDto {
  año?: number;
  fechaInicio?: string;
  fechaFin?: string;
  activo?: boolean;
  cerrado?: boolean;
  observaciones?: string;
}

/**
 * DTO para actualizar solo el método de valoración
 */
export interface UpdateMetodoValoracionDto {
  metodoValoracion: MetodoValoracion;
}

/**
 * Interfaz para filtros de búsqueda de periodos
 */
export interface PeriodoFilters {
  anio?: number;
  mes?: number;
  estado?: EstadoPeriodo;
  metodoValoracion?: MetodoValoracion;
}

/**
 * Interfaz para respuesta paginada de periodos
 */
export interface PeriodosResponse {
  data: ConfiguracionPeriodo[];
  total: number;
  page: number;
  limit: number;
}

/**
 * Interfaz para opciones de select
 */
export interface SelectOption {
  value: string | number;
  label: string;
}

/**
 * Constantes para opciones de select
 */
export const METODO_VALORACION_OPTIONS: SelectOption[] = [
  { value: MetodoValoracion.PROMEDIO, label: 'Promedio Ponderado' },
  { value: MetodoValoracion.FIFO, label: 'FIFO (Primero en Entrar, Primero en Salir)' }
];

export const ESTADO_PERIODO_OPTIONS: SelectOption[] = [
  { value: EstadoPeriodo.ACTIVO, label: 'Activo' },
  { value: EstadoPeriodo.CERRADO, label: 'Cerrado' }
];

/**
 * Utilidades para formateo
 */
export const formatPeriodoLabel = (periodo: ConfiguracionPeriodo): string => {
  return periodo.descripcion;
};

export const formatMetodoValoracion = (metodo: MetodoValoracion): string => {
  const option = METODO_VALORACION_OPTIONS.find(opt => opt.value === metodo);
  return option?.label || metodo;
};

export const formatEstadoPeriodo = (estado: EstadoPeriodo): string => {
  const option = ESTADO_PERIODO_OPTIONS.find(opt => opt.value === estado);
  return option?.label || estado;
};