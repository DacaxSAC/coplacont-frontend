import { maintainersApi } from "../api/maintainersApi";
import type { Product, Warehouse } from "./types";

export class MaintainersService {
    static async getProducts(): Promise<Product[]> {
        const response = await maintainersApi.getProducts();
        return response.data;
    }

    static async getWarehouses(): Promise<Warehouse[]> {
        const response = await maintainersApi.getWarehouses();
        return response.data;
    }
}
