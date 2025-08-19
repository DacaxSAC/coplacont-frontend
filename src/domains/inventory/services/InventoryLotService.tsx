import { inventoryLotApi } from "../api/inventoryLotApi";

/**
 * Servicio para la gestión de lotes de inventario
 */
export class InventoryLotService {
  /**
   * Crear un nuevo lote de inventario
   */
  static async createInventoryLot(payload: {
    idInventario: number;
    fechaIngreso: string;
    fechaVencimiento?: string;
    cantidadInicial: number;
    cantidadActual: number;
    costoUnitario: number;
    numeroLote?: string;
    observaciones?: string;
    estado?: boolean;
  }) {
    try {
      const response = await inventoryLotApi.createInventoryLot(payload);
      return response.data;
    } catch (error) {
      console.error("Error creating inventory lot:", error);
      throw error;
    }
  }

  /**
   * Obtener todos los lotes
   */
  static async getAllLots() {
    try {
      const response = await inventoryLotApi.getAllLots();
      return response.data;
    } catch (error) {
      console.error("Error fetching all lots:", error);
      throw error;
    }
  }

  /**
   * Obtener lotes por inventario
   */
  static async getLotsByInventory(idInventario: number) {
    try {
      const response = await inventoryLotApi.getLotsByInventory(idInventario);
      return response.data;
    } catch (error) {
      console.error("Error fetching lots by inventory:", error);
      throw error;
    }
  }

  /**
   * Obtener lotes activos
   */
  static async getActiveLots(idInventario?: number) {
    try {
      const response = await inventoryLotApi.getActiveLots(idInventario);
      return response.data;
    } catch (error) {
      console.error("Error fetching active lots:", error);
      throw error;
    }
  }
}