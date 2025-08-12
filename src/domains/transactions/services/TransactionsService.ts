import { handleApiError } from "@/shared";
import { transactionsApi } from "../api/transactionsApi";
import type { RegisterSalePayload } from "./types";

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
  static async getSales() {
    try {
      const response = await transactionsApi.getSales();
      return response;
    } catch (error) {
      throw handleApiError(error);
    }
  }

  /**
   * Obtiene todas las compras
   * @returns Promise con la lista de compras
   */
  static async getPurchases() {
    try {
      const response = await transactionsApi.getPurchases();
      return response;
    } catch (error) {
      throw handleApiError(error);
    }
  }
}
