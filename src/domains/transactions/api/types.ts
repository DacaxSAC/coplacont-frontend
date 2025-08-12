/**
 * Interface para los totales de una transacción
 */
export interface TransactionTotals {
  idTotal: number;
  totalGravada: string;
  totalExonerada: string;
  totalInafecta: string;
  totalIgv: string;
  totalIsc: string;
  totalGeneral: string;
}

/**
 * Interface para una transacción (venta o compra)
 */
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
}

/**
 * Interface para la respuesta de la API de ventas
 */
export interface SalesApiResponse {
  success: boolean;
  message: string;
  data: Transaction[];
}

/**
 * Interface para la respuesta de la API de compras
 */
export interface PurchasesApiResponse {
  success: boolean;
  message: string;
  data: Transaction[];
}