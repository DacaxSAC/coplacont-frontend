import { apiClient } from "../../../shared/services/apiService";
import { MAINTAINERS_ENDPOINTS } from './endpoints';

export const maintainersApi = {
    getProducts: () => apiClient.get(MAINTAINERS_ENDPOINTS.GET_PRODUCTS),
    getWarehouses: () => apiClient.get(MAINTAINERS_ENDPOINTS.GET_ALMACENES),
} as const;

export type MaintainersApi = typeof maintainersApi;
