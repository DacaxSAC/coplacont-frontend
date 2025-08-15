import type { Product, Warehouse } from "@/domains/maintainers/types";

/**
 * Interface para un lote de inventario
 */
export interface Lote {
  id: string;
  numero: string;
  fechaVencimiento?: string;
  cantidad: string;
  fechaCreacion: string;
  fechaActualizacion: string;
}

/**
 * Interface para un item de inventario
 */
export interface InventoryItem {
  id: string;
  stockActual: string;
  almacen: Warehouse;
  producto: Product;
  fechaCreacion: string;
  fechaActualizacion: string;
  lotes: Lote[];
}

/**
 * Interface para la respuesta de inventario
 */
export interface InventoryResponse {
  success: boolean;
  message: string;
  data: InventoryItem[];
}