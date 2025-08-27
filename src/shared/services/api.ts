import axios from 'axios';
import type { AxiosInstance, AxiosResponse } from 'axios';

/**
 * Configuración base para las peticiones HTTP
 */
const API_CONFIG = {
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api',
  timeout: parseInt(import.meta.env.VITE_API_TIMEOUT || '20000'),
  headers: {
    'Content-Type': 'application/json',
  },
};

/**
 * Instancia de axios configurada para el proyecto
 */
export const apiClient: AxiosInstance = axios.create(API_CONFIG);

/**
 * Interceptor para agregar el token JWT a las peticiones
 */
apiClient.interceptors.request.use(
  (config) => {
    // Obtener el token del localStorage si existe
    const token = localStorage.getItem('jwt');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

/**
 * Interceptor para manejar respuestas y errores globalmente
 */
apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  (error) => {
    // Manejar errores de autenticación
    if (error.response?.status === 401) {
      // Token expirado o inválido - limpiar todos los datos de autenticación
      localStorage.removeItem('jwt');
      localStorage.removeItem('user');
      localStorage.removeItem('persona');
      localStorage.removeItem('roles');
      
      // Limpiar también datos duplicados
      const duplicateKeys = ['_token', 'auth_user', 'token', 'authToken'];
      duplicateKeys.forEach(key => {
        localStorage.removeItem(key);
      });
      
      // Redirigir al login si es necesario
      window.location.href = '/auth/login';
    }
    
    return Promise.reject(error);
  }
);

/**
 * Tipos para las respuestas de la API
 */
export interface ApiResponse<T = unknown> {
  data: T;
  message?: string;
  success: boolean;
}

/**
 * Tipos para los errores de la API
 */
export interface ApiError {
  message: string;
  status: number;
  errors?: Record<string, string[]>;
}

/**
 * Función helper para manejar errores de la API
 */
export const handleApiError = (error: unknown): ApiError => {
  // Type guard para verificar si es un error de axios
  if (error && typeof error === 'object' && 'response' in error) {
    const axiosError = error as { response: { data?: { message?: string; errors?: Record<string, string[]> }; status: number } };
    // El servidor respondió con un código de error
    return {
      message: axiosError.response.data?.message || 'Error en el servidor',
      status: axiosError.response.status,
      errors: axiosError.response.data?.errors,
    };
  } else if (error && typeof error === 'object' && 'request' in error) {
    // La petición fue hecha pero no se recibió respuesta
    return {
      message: 'No se pudo conectar con el servidor',
      status: 0,
    };
  } else {
    // Error en la configuración de la petición
    const errorMessage = error && typeof error === 'object' && 'message' in error 
      ? (error as { message: string }).message 
      : 'Error inesperado';
    return {
      message: errorMessage,
      status: 0,
    };
  }
};