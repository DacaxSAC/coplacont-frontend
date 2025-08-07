/**
 * Tipos relacionados con la autenticación
 */

/**
 * Datos de entrada para el login
 */
export interface LoginRequest {
  email: string;
  contrasena: string;
}

/**
 * Respuesta del endpoint de login
 */
export interface LoginResponse {
  email: string;
  jwt: string;
}

/**
 * Información del usuario autenticado
 */
export interface AuthUser {
  email: string;
  roles?: Array<{
    id: number;
    nombre: string;
  }>;
  permissions?: string[];
}

/**
 * Estado de autenticación de la aplicación
 */
export interface AuthState {
  user: AuthUser | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}