import {personsApi} from '../api/personsApi';

export class PersonsService {
    static async getClients() {
        const response = await personsApi.getClients();
        return response.data;
    }
    static async getSuppliers() {
        const response = await personsApi.getSuppliers();
        return response.data;
    }
}
