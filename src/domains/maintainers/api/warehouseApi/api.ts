import { apiClient } from "@/shared";
import { ENDPOINTS } from './endpoints';
import type { CreateWarehousePayload, UpdateWarehousePayload, Warehouse } from "../../types";

export const Api = {
    getWarehouses: () => apiClient.get<Warehouse[]>(ENDPOINTS.GET_WAREHOUSES),
    getWarehouse: (id: number) => apiClient.get<Warehouse>(ENDPOINTS.GET_WAREHOUSE.replace(':id', id.toString())),
    postWarehouse: (data: CreateWarehousePayload) => apiClient.post<Warehouse>(ENDPOINTS.POST_WAREHOUSE, data),
    patchWarehouse: (id: number, data: UpdateWarehousePayload) => apiClient.patch(ENDPOINTS.PATCH_WAREHOUSE.replace(':id', id.toString()), data),
    deleteWarehouse: (id: number) => apiClient.delete(ENDPOINTS.DELETE_WAREHOUSE.replace(':id', id.toString())),
    getWarehouseByName: (name: string) => apiClient.get<Warehouse[]>(ENDPOINTS.GET_WAREHOUSE_BY_NAME.replace(':nombre', name)),
    getWarehouseByLocation: (location: string) => apiClient.get<Warehouse[]>(ENDPOINTS.GET_WAREHOUSE_BY_LOCATION.replace(':ubicacion', location)),
    getWarehouseByResponsible: (responsible: string) => apiClient.get<Warehouse[]>(ENDPOINTS.GET_WAREHOUSE_BY_RESPONSIBLE.replace(':responsable', responsible)),
    getWarehouseByMinCapacity: (minCapacity: number) => apiClient.get<Warehouse[]>(ENDPOINTS.GET_WAREHOUSE_BY_MIN_CAPACITY.replace(':minCapacidad', minCapacity.toString())),
} as const;