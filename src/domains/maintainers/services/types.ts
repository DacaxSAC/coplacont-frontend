/**
 * Interface para la categoría de un producto
 */
export interface Category {
  id: number;
  nombre: string;
  descripcion: string;
  estado: boolean;
  fechaCreacion: string;
  fechaActualizacion: string;
}

/**
 * Interface para un producto
 */
export interface Product {
  id: number;
  descripcion: string;
  unidadMedida: string;
  codigo: string;
  precio: string;
  stockMinimo: number;
  estado: boolean;
  categoria: Category;
  fechaCreacion: string;
  fechaActualizacion: string;
}

/**
 * Interface para un almacén
 */
export interface Warehouse {
  id: number;
  nombre: string;
  ubicacion: string;
  descripcion: string;
  capacidadMaxima: number;
  responsable: string;
  telefono: string;
  estado: boolean;
  fechaCreacion: string;
  fechaActualizacion: string;
}
