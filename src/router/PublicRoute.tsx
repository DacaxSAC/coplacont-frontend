import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../domains/auth';

/**
 * Props para el componente PublicRoute
 */
interface PublicRouteProps {
  /** Componente hijo a renderizar si no está autenticado */
  children: React.ReactNode;
}

/**
 * Componente para rutas públicas que solo deben ser accesibles sin autenticación
 * Redirige a la página principal si el usuario ya está autenticado
 */
export const PublicRoute: React.FC<PublicRouteProps> = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();

  // Mostrar loading mientras se verifica la autenticación
  if (isLoading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh' 
      }}>
        Cargando...
      </div>
    );
  }

  // Si está autenticado, redirigir a la página principal
  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  // Si no está autenticado, mostrar el componente hijo
  return <>{children}</>;
};