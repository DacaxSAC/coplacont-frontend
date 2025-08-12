import React, { Fragment } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { LoginPage, RecoveryPasswordPage, NewPasswordPage } from '@/domains/auth';
import { ProtectedRoute } from './ProtectedRoute';
import { PublicRoute } from './PublicRoute';

import { MainLayout } from '../components/templates/MainLayout';
import {  
  TransactionsRouter, 
  InventoryRouter,
  AccountingRouter,
  FinancialClosingRouter,
  FinancialStatementsRouter,
  SettingsRouter,
} from '@/domains';

/**
 * Componente principal de enrutamiento de la aplicación
 * Define todas las rutas disponibles y su configuración
 */
export const AppRouter: React.FC = () => {
  return (
    <Routes>

      {/* Rutas públicas */}
      <Route element={<PublicRoute />} >
        <Route path="/auth/login" element={<LoginPage />} />
        <Route path="/auth/recovery-password" element={<RecoveryPasswordPage />} />
        <Route path="/auth/new-password" element={<NewPasswordPage />} />
        <Route path="/auth" element={<Navigate to="/auth/login" replace />} />
      </Route>

      {/* Rutas privadas */}
      <Route element={<ProtectedRoute />}>
        <Route path="/" element={<MainLayout />}>
          <Route path="/transactions/*" element={<TransactionsRouter />} />
          <Route path="/inventory/*" element={<InventoryRouter />} />
          <Route path="/accounting/*" element={<AccountingRouter />} />
          <Route path="/financial-closing/*" element={<FinancialClosingRouter />} />
          <Route path="/financial-statements/*" element={<FinancialStatementsRouter />} />
          <Route path="/settings/*" element={<SettingsRouter />} />
        </Route>
      </Route>

      {/* Ruta 404 - Redirecciona a la página principal */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default AppRouter;