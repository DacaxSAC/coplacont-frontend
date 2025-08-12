export interface SaleDetail {
  cantidad: number;
  unidadMedida: string;
  precioUnitario: number;
  subtotal: number;
  igv: number;
  isc: number;
  total: number;
  descripcion: string;
}

export interface RegisterSalePayload {
  correlativo: string;
  idPersona: number;
  tipoOperacion: string;
  tipoComprobante: string;
  fechaEmision: string;
  moneda: string;
  tipoCambio: number;
  serie: string;
  numero: string;
  fechaVencimiento: string;
  detalles: SaleDetail[];
}