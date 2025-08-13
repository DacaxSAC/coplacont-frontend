import { handleApiError } from "@/shared";
import { transactionsApi } from "../api/transactionsApi";
import type { RegisterSalePayload } from "./types";
import type{ Transaction } from "./types";

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

  /**
   * Obtiene todas las ventas
   * @returns Promise con la lista de ventas
   */
  static async getSales(): Promise<Transaction[]> {
    try {
      const response = await transactionsApi.getSales();
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  }


  /**
   * Obtiene el siguiente número de correlativo para una operación
   * @param tipoOperacion - Tipo de operación (VENTA o COMPRA)
   * @returns Promise con el número de correlativo
   */
  static async getCorrelative(tipoOperacion: 'venta' | 'compra'): Promise<{ correlativo: string }> {
    try {
      const response = await transactionsApi.getSiguienteCorrelative(tipoOperacion);
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  }

  /**
   * Obtiene todas las compras
   * @returns Promise con la lista de compras
   */
  static async getPurchases(): Promise<Transaction[]> {
    try {
      const response = await transactionsApi.getPurchases();
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  }
}
