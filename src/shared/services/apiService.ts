import axios from 'axios';
import type { AxiosInstance, AxiosResponse } from 'axios';
import type { IApiError } from '@/shared';

/**
 * Configuración base para las peticiones HTTP
 */
const API_CONFIG = {
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api',
  timeout: parseInt(import.meta.env.VITE_API_TIMEOUT || '10000'),
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
    const token = localStorage.getItem('jwt');
    if (token) config.headers.Authorization = `Bearer ${token}`;
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
    if (error.response?.status === 401) {
      localStorage.removeItem('jwt');
      localStorage.removeItem('user');
      window.location.href = '/auth/login';
    }
    return Promise.reject(error);
  }
);

/**
 * Función helper para manejar errores de la API
 */
export const handleApiError = (error: any): IApiError => {
  if (error.response) {
    return {
      message: error.response.data?.message || 'Error en el servidor',
      status: error.response.status,
      errors: error.response.data?.errors,
    };
  } else if (error.request) {
    return {
      message: 'No se pudo conectar con el servidor',
      status: 0,
    };
  } else {
    return {
      message: error.message || 'Error inesperado',
      status: 0,
    };
  }
};