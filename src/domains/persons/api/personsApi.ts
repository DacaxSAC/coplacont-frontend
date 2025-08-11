import { apiClient } from "../../../shared/services/apiService";
import { PERSONS_ENDPOINTS } from "./endpoints";

export const personsApi = {
    getClients: () => apiClient.get(PERSONS_ENDPOINTS.GET_CLIENTS),
    getSuppliers: () => apiClient.get(PERSONS_ENDPOINTS.GET_SUPPLIERS),
} as const;
