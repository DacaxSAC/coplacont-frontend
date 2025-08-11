import { personsApi } from '../api/personsApi';
import type { PersonsApiResponse } from './types';


export class PersonsService {
    static async getClients(): Promise<PersonsApiResponse> {
        const response = await personsApi.getClients();
        return response.data;
    }
    static async getSuppliers(): Promise<PersonsApiResponse> {
        const response = await personsApi.getSuppliers();
        return response.data;
    }
}
