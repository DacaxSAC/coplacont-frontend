import { apiClient } from "../../../shared/services/apiService";
import { INVENTORY_ENDPOINTS } from './endpoints';

export const inventoryApi = {
    getInventories: () => apiClient.get(INVENTORY_ENDPOINTS.GET_INVENTORY),
    getInventoryByWarehouseAndProduct: (idAlmacen: number, idProducto: number) => apiClient.get(INVENTORY_ENDPOINTS.GET_INVENTORY_BY_WAREHOUSE_AND_PRODUCT.replace(':idAlmacen', idAlmacen.toString()).replace(':idProducto', idProducto.toString())),
} as const;

export type InventoryApi = typeof inventoryApi;
