import { handleApiError } from "@/shared";
import { inventoryApi } from "../api/inventoryApi";
import type { InventoryResponse } from "./types";

/**
 * Servicio de transacciones
 * Maneja todas las operaciones relacionadas con las transacciones de ventas
 */
export class InventoryService {
  /**
   * Obtiene el inventario por almacen y producto
   * @param idAlmacen - ID del almacen
   * @param idProducto - ID del producto
   * @returns Promise con la respuesta del servidor
   */
  static async getInventoryByWarehouseAndProduct(idAlmacen: number, idProducto: number): Promise<InventoryResponse> {
    try {
      const response = await inventoryApi.getInventoryByWarehouseAndProduct(idAlmacen, idProducto);
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  }

  
}
