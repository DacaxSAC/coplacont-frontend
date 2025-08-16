import { apiClient } from "../../../shared/services/apiService";
import { INVENTORY_ENDPOINTS } from './endpoints';

export const inventoryApi = {
    getInventory: () => apiClient.get(INVENTORY_ENDPOINTS.GET_INVENTORY),
    getInventoryByWarehouseAndProduct: (idAlmacen: number, idProducto: number) => apiClient.get(INVENTORY_ENDPOINTS.GET_INVENTORY_BY_WAREHOUSE_AND_PRODUCT.replace(':idAlmacen', idAlmacen.toString()).replace(':idProducto', idProducto.toString())),
    getInventoryByWarehouse: (idAlmacen: number) => apiClient.get(INVENTORY_ENDPOINTS.GET_INVENTORY_BY_WAREHOUSE.replace(':idAlmacen', idAlmacen.toString())),
    createInventory: (payload: { idAlmacen: number; idProducto: number; stockActual: number }) => apiClient.post(INVENTORY_ENDPOINTS.CREATE_INVENTORY, payload),
    getKardexMovements: (productId: number) => apiClient.get(INVENTORY_ENDPOINTS.GET_KARDEX_MOVEMENTS.replace(':id', productId.toString())),
} as const;

export type InventoryApi = typeof inventoryApi;
