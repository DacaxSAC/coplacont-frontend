import type { Entidad } from "@/domains/maintainers/services";

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
  fechaVencimiento?: string; // Opcional
  detalles: SaleDetail[];
}

export interface RegisterPurchasePayload {
  correlativo: string;
  idPersona: number;
  tipoOperacion: string;
  tipoComprobante: string;
  fechaEmision: string;
  moneda: string;
  tipoCambio: number;
  serie: string;
  numero: string;
  fechaVencimiento?: string; // Opcional
  idComprobanteAfecto?: number; // Opcional para compras
  detalles: SaleDetail[];
}

export interface TransactionTotals {
  idTotal: number;
  totalGravada: string;
  totalExonerada: string;
  totalInafecta: string;
  totalIgv: string;
  totalIsc: string;
  totalGeneral: string;
}

export interface Transaction {
  idComprobante: number;
  correlativo: string;
  tipoOperacion: 'venta' | 'compra';
  tipoComprobante: string;
  fechaEmision: string;
  moneda: string;
  tipoCambio: string;
  serie: string;
  numero: string;
  fechaVencimiento: string;
  totales: TransactionTotals;
  detalles: Detail[];
  persona: Entidad;
}

export interface Detail{
  cantidad: string;
  descripcion: string;
  idDetalle: number;
  igv: string;
  isc: string;
  precioUnitario: string;
  total: string;
  subtotal: string;
  unidadMedida: string;
}

export interface SalesApiResponse {
  success: boolean;
  message: string;
  data: Transaction[];
}

export interface PurchasesApiResponse {
  success: boolean;
  message: string;
  data: Transaction[];
}