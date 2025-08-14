import { apiClient } from "@/shared";
import { ENTITIES_ENDPOINTS } from "./endpoints";
import type { EntidadesApiResponse } from "../../services/entitiesService";
import type { EntidadParcial } from "../../services/entitiesService";

export const entitiesApi = {
    getClients: () => apiClient.get<EntidadesApiResponse>(ENTITIES_ENDPOINTS.GET_CLIENTS),
    getSuppliers: () => apiClient.get<EntidadesApiResponse>(ENTITIES_ENDPOINTS.GET_SUPPLIERS),
    postEntidad: (data: EntidadParcial) => apiClient.post(ENTITIES_ENDPOINTS.POST_ENTIDAD, data),
} as const;
