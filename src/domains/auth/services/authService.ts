import { apiClient, handleApiError } from '../../../shared/services/api';
import type { LoginRequest, LoginResponse, AuthUser } from '../types/auth.types';
import type { ApiError } from '../../../shared/services/api';

/**
 * Servicio de autenticación
 * Maneja todas las operaciones relacionadas con la autenticación de usuarios
 */
export class AuthService {
  /**
   * Realiza el login del usuario
   * @param credentials - Credenciales de login (email y contraseña)
   * @returns Promise con la respuesta del login
   */
  static async login(credentials: LoginRequest): Promise<LoginResponse> {
    try {
      const response = await apiClient.post<LoginResponse>('/auth/login', credentials);
      
      // Guardar el token y información del usuario en localStorage
      const { jwt, email } = response.data;
      localStorage.setItem('jwt', jwt);
      localStorage.setItem('user', JSON.stringify({ email }));
      
      return response.data;
    } catch (error) {
      const apiError = handleApiError(error);
      throw new Error(apiError.message);
    }
  }

  /**
   * Cierra la sesión del usuario
   */
  static logout(): void {
    localStorage.removeItem('jwt');
    localStorage.removeItem('user');
  }

  /**
   * Obtiene el token almacenado
   * @returns Token JWT o null si no existe
   */
  static getToken(): string | null {
    return localStorage.getItem('jwt');
  }

  /**
   * Obtiene la información del usuario almacenada
   * @returns Información del usuario o null si no existe
   */
  static getUser(): AuthUser | null {
    const userStr = localStorage.getItem('user');
    if (!userStr) return null;
    
    try {
      return JSON.parse(userStr);
    } catch {
      return null;
    }
  }

  /**
   * Verifica si el usuario está autenticado
   * @returns true si el usuario está autenticado
   */
  static isAuthenticated(): boolean {
    const token = this.getToken();
    const user = this.getUser();
    return !!(token && user);
  }

  /**
   * Decodifica el JWT para obtener información del payload
   * @param token - Token JWT
   * @returns Payload decodificado o null si el token es inválido
   */
  static decodeToken(token: string): any {
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      );
      return JSON.parse(jsonPayload);
    } catch {
      return null;
    }
  }

  /**
   * Verifica si el token ha expirado
   * @param token - Token JWT
   * @returns true si el token ha expirado
   */
  static isTokenExpired(token: string): boolean {
    const decoded = this.decodeToken(token);
    if (!decoded || !decoded.exp) return true;
    
    const currentTime = Date.now() / 1000;
    return decoded.exp < currentTime;
  }
}