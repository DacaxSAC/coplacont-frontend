import { handleApiError } from "@/shared";
import { inventoryApi } from "../api/inventoryApi";
import type { InventoryItem, KardexResponse } from "./types";

/**
 * Servicio de transacciones
 * Maneja todas las operaciones relacionadas con las transacciones de ventas
 */
export class InventoryService {
  /**
   * Obtiene el inventario por almacen y producto
   * @param idAlmacen - ID del almacen
   * @param idProducto - ID del producto
   * @returns Promise con el item de inventario específico
   */
  static async getInventoryByWarehouseAndProduct(idAlmacen: number, idProducto: number): Promise<InventoryItem> {
    try {
      const response = await inventoryApi.getInventoryByWarehouseAndProduct(idAlmacen, idProducto);
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  }

  /**
   * Obtiene el inventario
   * @returns Promise con la respuesta del servidor
   */
  static async getInventory(): Promise<InventoryItem[]> {
    try {
      const response = await inventoryApi.getInventory();
      console.log('en el servicio?')
      console.log(response);
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  }

  /**
   * Obtiene el inventario por almacén
   * @param idAlmacen - ID del almacén
   * @returns Promise con la respuesta del servidor
   */
  static async getInventoryByWarehouse(idAlmacen: number): Promise<InventoryItem[]> {
    try {
      const response = await inventoryApi.getInventoryByWarehouse(idAlmacen);
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  }

  /**
   * Crea un nuevo item de inventario
   * @param payload - Datos del inventario a crear
   * @returns Promise con la respuesta del servidor
   */
  static async createInventory(payload: { idAlmacen: number; idProducto: number; stockActual: number }): Promise<InventoryItem> {
    try {
      const response = await inventoryApi.createInventory(payload);
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  }

  /**
   * Obtiene los movimientos del kardex para un inventario específico en un rango de fechas
   * @param idInventario - ID del inventario
   * @param fechaInicio - Fecha de inicio en formato YYYY-MM-DD
   * @param fechaFin - Fecha de fin en formato YYYY-MM-DD
   * @returns Promise con la respuesta completa del kardex
   */
  static async getKardexMovements(idInventario: number, fechaInicio: string, fechaFin: string): Promise<KardexResponse> {
    try {
      const response = await inventoryApi.getKardexMovements(idInventario, fechaInicio, fechaFin);
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  }

  
}
