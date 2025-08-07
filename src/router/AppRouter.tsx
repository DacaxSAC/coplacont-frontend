import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { HomePage } from '../pages/HomePage';
import { LoginPage } from '../pages/LoginPage';

/**
 * Componente principal de enrutamiento de la aplicación
 * Define todas las rutas disponibles y su configuración
 */
export const AppRouter: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Ruta principal - Página de inicio */}
        <Route path="/" element={<HomePage />} />
        
        {/* Rutas de autenticación */}
        <Route path="/auth/login" element={<LoginPage />} />
        
        {/* Redirección para rutas de auth sin especificar */}
        <Route path="/auth" element={<Navigate to="/auth/login" replace />} />
        
        {/* Ruta 404 - Redirecciona a la página principal */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRouter;