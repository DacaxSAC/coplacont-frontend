import { apiClient, handleApiError } from '@/shared';
import { type ILoginRequest, type ILoginResponse, type IAuthUser, authApi } from '@/domains/auth';

/**
 * Servicio de autenticación
 * Maneja todas las operaciones relacionadas con la autenticación de usuarios
 */
export class AuthService {

  static async login(credentials: ILoginRequest): Promise<ILoginResponse> {
    try {
      const response = await authApi.login(credentials);

      const { jwt, email } = response.data;
      localStorage.setItem('jwt', jwt);
      localStorage.setItem('user', JSON.stringify({ email }));

      return response.data;
    } catch (error) {
      const apiError = handleApiError(error);
      throw new Error(apiError.message);
    }
  }

  static logout(): void {
    localStorage.removeItem('jwt');
    localStorage.removeItem('user');
  }

  static async recoverPassword(email: string): Promise<{ success: boolean, message: string }> {
    const response = await authApi.recoverPassword({ email });
    return response.data;
  }

  static async validateResetToken(token: string): Promise<{ success: boolean, message: string, userId?: number }> {
    const response = await authApi.validateResetToken({ token });
    return response.data;
  }

  static async resetPassword(token: string, password: string): Promise<{ success: boolean, message: string }> {
    const response = await authApi.resetPassword({ token, password });
    return response.data;
  }

  static getToken(): string | null {
    return localStorage.getItem('jwt');
  }

  static getUser(): IAuthUser | null {
    const userStr = localStorage.getItem('user');
    if (!userStr) return null;

    try {
      return JSON.parse(userStr);
    } catch {
      return null;
    }
  }

  static isAuthenticated(): boolean {
    const token = this.getToken();
    const user = this.getUser();
    return !!(token && user);
  }

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