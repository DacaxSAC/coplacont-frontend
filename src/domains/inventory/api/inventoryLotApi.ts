import { apiClient } from "@/shared";

/**
 * API para la gestión de lotes de inventario
 */
export const inventoryLotApi = {
  /**
   * Crear un nuevo lote de inventario
   */
  createInventoryLot: (payload: {
    idInventario: number;
    fechaIngreso: string;
    fechaVencimiento?: string;
    cantidadInicial: number;
    cantidadActual: number;
    costoUnitario: number;
    numeroLote?: string;
    observaciones?: string;
    estado?: boolean;
  }) => {
    return apiClient.post("/inventario-lote", payload);
  },

  /**
   * Obtener todos los lotes
   */
  getAllLots: () => {
    return apiClient.get("/api/inventario-lote");
  },

  /**
   * Obtener lotes por inventario
   */
  getLotsByInventory: (idInventario: number) => {
    return apiClient.get(`/api/inventario-lote/inventario/${idInventario}`);
  },

  /**
   * Obtener lotes activos
   */
  getActiveLots: (idInventario?: number) => {
    const params = idInventario ? `?idInventario=${idInventario}` : "";
    return apiClient.get(`/api/inventario-lote/reportes/activos${params}`);
  },
};