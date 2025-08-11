import { handleApiError } from '@/shared';
import { transactionsApi } from '../api/transactionsApi';

interface SaleDetail {
  cantidad: number;
  unidadMedida: string;
  precioUnitario: number;
  subtotal: number;
  igv: number;
  isc: number;
  total: number;
  descripcion: string;
}

interface RegisterSalePayload {
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

/**
 * Servicio de transacciones
 * Maneja todas las operaciones relacionadas con las transacciones de ventas
 */
export class TransactionsService {
  /**
   * Registra una nueva venta
   * @param payload - Datos de la venta a registrar
   * @returns Promise con la respuesta del servidor
   */
  static async registerSale(payload: RegisterSalePayload) {
    try {
      const response = await transactionsApi.registerSale(payload);
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  }
}