import { entitiesApi } from '../../api/entitiesApi';
import type { Entidad } from './types';

export class EntitiesService {
    static async getClients(): Promise<Entidad[]> {
        const response = await entitiesApi.getClients();
        return response.data.data;
    }
    static async getSuppliers(): Promise<Entidad[]> {
        const response = await entitiesApi.getSuppliers();
        return response.data.data;
    }
}