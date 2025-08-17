/**
 * Interface para los datos mensuales del reporte de costo de ventas
 */
export interface DatosMensuales {
  mes: number;
  nombreMes: string;
  comprasTotales: string;
  salidasTotales: string;
  inventarioFinal: string;
}

/**
 * Interface para las sumatorias del reporte de costo de ventas
 */
export interface Sumatorias {
  totalComprasAnual: string;
  totalSalidasAnual: string;
  inventarioFinalAnual: string;
}

/**
 * Interface para el reporte completo de costo de ventas
 */
export interface CostOfSalesStatement {
  año: number;
  almacen: string;
  producto: string;
  datosMensuales: DatosMensuales[];
  sumatorias: Sumatorias;
  fechaGeneracion: string;
}