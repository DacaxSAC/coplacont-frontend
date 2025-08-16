import { apiClient } from "../../../shared/services/apiService";
import { INVENTORY_ENDPOINTS } from './endpoints';

export const inventoryApi = {
    getInventory: () => apiClient.get(INVENTORY_ENDPOINTS.GET_INVENTORY),
    getInventoryByWarehouseAndProduct: (idAlmacen: number, idProducto: number) => apiClient.get(INVENTORY_ENDPOINTS.GET_INVENTORY_BY_WAREHOUSE_AND_PRODUCT.replace(':idAlmacen', idAlmacen.toString()).replace(':idProducto', idProducto.toString())),
    getInventoryByWarehouse: (idAlmacen: number) => apiClient.get(INVENTORY_ENDPOINTS.GET_INVENTORY_BY_WAREHOUSE.replace(':idAlmacen', idAlmacen.toString())),
    createInventory: (payload: { idAlmacen: number; idProducto: number; stockActual: number }) => apiClient.post(INVENTORY_ENDPOINTS.CREATE_INVENTORY, payload),
    /**
     * Obtiene los movimientos del kardex para un inventario específico en un rango de fechas
     * @param idInventario - ID del inventario
     * @param fechaInicio - Fecha de inicio en formato YYYY-MM-DD
     * @param fechaFin - Fecha de fin en formato YYYY-MM-DD
     */
    getKardexMovements: (idInventario: number, fechaInicio: string, fechaFin: string) => 
        apiClient.get(`${INVENTORY_ENDPOINTS.GET_KARDEX_MOVEMENTS}?idInventario=${idInventario}&fechaInicio=${fechaInicio}&fechaFin=${fechaFin}`),
} as const;

export type InventoryApi = typeof inventoryApi;
