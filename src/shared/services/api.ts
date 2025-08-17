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
      // Token expirado o inválido
      localStorage.removeItem('jwt');
      localStorage.removeItem('user');
      // Redirigir al login si es necesario
      window.location.href = '/auth/login';
    }
    
    return Promise.reject(error);
  }
);

/**
 * Tipos para las respuestas de la API
 */
export interface ApiResponse<T = any> {
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
export const handleApiError = (error: any): ApiError => {
  if (error.response) {
    // El servidor respondió con un código de error
    return {
      message: error.response.data?.message || 'Error en el servidor',
      status: error.response.status,
      errors: error.response.data?.errors,
    };
  } else if (error.request) {
    // La petición fue hecha pero no se recibió respuesta
    return {
      message: 'No se pudo conectar con el servidor',
      status: 0,
    };
  } else {
    // Error en la configuración de la petición
    return {
      message: error.message || 'Error inesperado',
      status: 0,
    };
  }
};