import { handleApiError } from "@/shared";
import { financialStatementsApi } from "../../api/financialStatementsApi";
import type { CostOfSalesParams } from "../../api/financialStatementsApi";
import type { CostOfSalesStatement } from "./types";

/**
 * Servicio de transacciones
 * Maneja todas las operaciones relacionadas con las transacciones de ventas
 */
export class CostOfSalesStatementService {
  /**
   * Obtiene el reporte de costo de ventas
   * @param params - Parámetros del reporte (año, idAlmacen, idProducto)
   * @returns Promise con el reporte de costo de ventas
   */
  static async getCostOfSalesStatement(params: CostOfSalesParams): Promise<CostOfSalesStatement> {
    try {
      const response = await financialStatementsApi.getCostOfSalesStatement(params);
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  }  
}
