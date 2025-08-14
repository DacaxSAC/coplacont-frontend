import  { WarehouseApi } from '../api';
import type { Warehouse, CreateWarehousePayload, UpdateWarehousePayload } from '../types';


export class WarehouseService {
    static async getAll(): Promise<Warehouse[]> {
        const response = await WarehouseApi.getWarehouses();
        return response.data;
    }
        
    static async getById(id: number): Promise<Warehouse> {
        const response = await WarehouseApi.getWarehouse(id);
        return response.data;
    }

    static async create(warehouse: CreateWarehousePayload): Promise<Warehouse> {
        const response = await WarehouseApi.postWarehouse(warehouse);   
        return response.data;
    }

    static async update(id: number, warehouse: UpdateWarehousePayload): Promise<Warehouse> {
        const response = await WarehouseApi.patchWarehouse(id, warehouse);
        return response.data;
    }

    static async delete(id: number): Promise<void> {
        await WarehouseApi.deleteWarehouse(id);
    }

    static async getByName(name: string): Promise<Warehouse[]> {
        const response = await WarehouseApi.getWarehouseByName(name);
        return response.data;
    }

    static async getByLocation(location: string): Promise<Warehouse[]> {
        const response = await WarehouseApi.getWarehouseByLocation(location);
        return response.data;
    }
    
    static async getByResponsible(responsible: string): Promise<Warehouse[]> {  
        const response = await WarehouseApi.getWarehouseByResponsible(responsible);
        return response.data;
    }

    static async getByMinCapacity(minCapacity: number): Promise<Warehouse[]> {
        const response = await WarehouseApi.getWarehouseByMinCapacity(minCapacity);
        return response.data;
    }
}   
