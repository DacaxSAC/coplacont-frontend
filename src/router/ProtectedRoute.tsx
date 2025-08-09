import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../domains/auth';

/**
 * Props para el componente ProtectedRoute
 */
interface ProtectedRouteProps {
  /** Componente hijo a renderizar si está autenticado */
  children: React.ReactNode;
}

/**
 * Componente para proteger rutas que requieren autenticación
 * Redirige al login si el usuario no está autenticado
 */
export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
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

  // Si no está autenticado, redirigir al login
  if (!isAuthenticated) {
    return <Navigate to="/auth/login" replace />;
  }

  // Si está autenticado, mostrar el componente hijo
  return <>{children}</>;
};