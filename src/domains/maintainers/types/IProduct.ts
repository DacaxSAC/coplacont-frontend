import type { Category } from './ICategory';

/**
 * Interface para un producto
 */
export interface Product {
  id: number;
  descripcion: string;
  unidadMedida: string;
  codigo: string;
  precio: string;
  tipo: 'producto' | 'servicio';
  stockMinimo: number;
  estado: boolean;
  categoria: Category;
  fechaCreacion: string;
  fechaActualizacion: string;
}

/**
 * Interface para crear un producto
 */
export interface CreateProductPayload {
  descripcion: string;
  unidadMedida: string;
  codigo: string;
  precio: string;
  tipo: 'producto' | 'servicio';
  stockMinimo: number;
  estado: boolean;
  categoriaId: number;
}

/**
 * Interface para actualizar un producto
 */
export interface UpdateProductPayload {
  descripcion?: string;
  unidadMedida?: string;
  codigo?: string;
  precio?: string;
  tipo?: 'producto' | 'servicio';
  stockMinimo?: number;
  estado?: boolean;
  categoriaId?: number;
}
