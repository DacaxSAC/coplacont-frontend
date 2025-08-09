import React from 'react';
import { Navigate } from 'react-router-dom';

import { useAuth } from '../domains/auth';
import { Loader } from '@/components';

import { type IRouteProps } from '@/router';

/**
 * Componente para rutas públicas que solo deben ser accesibles sin autenticación
 * Redirige a la página principal si el usuario ya está autenticado
 */
export const PublicRoute: React.FC<IRouteProps> = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <Loader />
  }

  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};