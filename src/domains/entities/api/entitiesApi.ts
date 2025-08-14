import { apiClient } from "../../../shared/services/apiService";
import { ENTITIES_ENDPOINTS } from "./endpoints";
import type { EntidadesApiResponse } from "../service/types";

export const entitiesApi = {
    getClients: () => apiClient.get<EntidadesApiResponse>(ENTITIES_ENDPOINTS.GET_CLIENTS),
    getSuppliers: () => apiClient.get<EntidadesApiResponse>(ENTITIES_ENDPOINTS.GET_SUPPLIERS),
} as const;
