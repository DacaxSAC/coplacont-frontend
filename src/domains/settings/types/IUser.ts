/**
 * Tipos de documento disponibles
 */
export type DocumentType = 'DNI' | 'RUC' | 'PASAPORTE' | 'CARNET_EXTRANJERIA';

/**
 * Tipos de usuario disponibles
 */
export type UserType = 'Administrador' | 'Contador' | 'Contribuyente';

/**
 * Interface para los datos de persona
 */
export interface Persona {
  id?: number;
  primerNombre: string;
  segundoNombre?: string;
  primerApellido: string;
  segundoApellido?: string;
  fechaNacimiento: Date;
  telefono: string;
  dni: string;
  tipoDocumento?: string;
  direccion?: string;
}

/**
 * Interface para el usuario completo
 */
export interface User {
  id: number;
  email: string;
  habilitado?: boolean;
  persona: Persona;
  roles?: string[];
  resetPasswordToken?: string | null;
}

/**
 * Interface para roles
 */
export interface Role {
  id: number;
  nombre: string;
  descripcion?: string;
}

/**
 * Payload para crear un usuario
 */
export type CreateUserPayload = {
  email: string;
  idRol: number;
  createPersonaDto: {
    primerNombre: string;
    segundoNombre?: string;
    primerApellido: string;
    segundoApellido?: string;
    fechaNacimiento: Date;
    telefono: string;
    dni: string;
    tipoDocumento?: string;
    direccion?: string;
  };
};

/**
 * Payload para actualizar un usuario
 */
export type UpdateUserPayload = {
  email?: string;
  habilitado?: boolean;
  persona?: Partial<Persona>;
};

/**
 * Opciones para el ComboBox de tipos de documento
 */
export const documentTypeOptions = [
  { label: 'DNI', value: 'DNI' },
  { label: 'RUC', value: 'RUC' },
  { label: 'Pasaporte', value: 'PASAPORTE' },
  { label: 'Carnet de Extranjería', value: 'CARNET_EXTRANJERIA' },
];

/**
 * Opciones para el ComboBox de tipos de usuario
 */
export const userTypeOptions = [
  { label: 'Administrador', value: 'Administrador' },
  { label: 'Contador', value: 'Contador' },
  { label: 'Contribuyente', value: 'Contribuyente' },
];