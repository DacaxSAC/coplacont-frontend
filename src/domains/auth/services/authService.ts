import { handleApiError } from '../../../shared/services/api';
import type { LoginRequest, AuthUser } from '../types/auth.types';

import { authApi } from '../api/authApi';

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
  static async login(credentials: LoginRequest): Promise<{success: boolean, message: string, email?: string, jwt?: string}> {
    try {
      const response = await authApi.login(credentials);
      const data = response.data;
      
      return {
        success: data.success, 
        message: data.message,
        email: data.email,
        jwt: data.jwt
      };
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

  static async recoverPassword(email: string): Promise<{success: boolean, message: string}> {
    const response = await authApi.recoverPassword({email});
    return response.data;
  }

  static async validateResetToken(token: string): Promise<{success: boolean, message: string, userId?: number}> {
    const response = await authApi.validateResetToken({token});
    return response.data;
  }

  static async resetPassword(token: string, password: string): Promise<{success: boolean, message: string}> {
    const response = await authApi.resetPassword({token, password});
    return response.data;
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