import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { HomePage } from '../pages/HomePage';
import { LoginPage, RecoveryPasswordPage, NewPasswordPage } from '../domains/auth/pages';
import { ProtectedRoute } from './ProtectedRoute';
import { PublicRoute } from './PublicRoute';

/**
 * Componente principal de enrutamiento de la aplicación
 * Define todas las rutas disponibles y su configuración
 */
export const AppRouter: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Ruta principal - Página de inicio (protegida) */}
        <Route 
          path="/" 
          element={
            <ProtectedRoute>
              <HomePage />
            </ProtectedRoute>
          } 
        />
        
        {/* Rutas de autenticación (solo para usuarios no autenticados) */}
        <Route 
          path="/auth/login" 
          element={
            <PublicRoute>
              <LoginPage />
            </PublicRoute>
          } 
        />
        <Route 
          path="/auth/recovery-password" 
          element={
            <PublicRoute>
              <RecoveryPasswordPage />
            </PublicRoute>
          } 
        />
        <Route 
          path="/auth/new-password" 
          element={
            <PublicRoute>
              <NewPasswordPage />
            </PublicRoute>
          } 
        />
        
        {/* Redirección para rutas de auth sin especificar */}
        <Route path="/auth" element={<Navigate to="/auth/login" replace />} />
        
        {/* Ruta 404 - Redirecciona según el estado de autenticación */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRouter;