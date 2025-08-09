import React from 'react';
import { Navigate } from 'react-router-dom';

import { Loader } from '@/components'
import { useAuth } from '@/domains/auth';

import type { IRouteProps } from '@/router';;

/**
 * Componente para proteger rutas que requieren autenticación
 * Redirige al login si el usuario no está autenticado
 */
export const ProtectedRoute: React.FC<IRouteProps> = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <Loader />
  }

  if (!isAuthenticated) {
    return <Navigate to="/auth/login" replace />;
  }

  return <>{children}</>;
};

