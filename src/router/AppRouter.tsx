import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { LoginPage, RecoveryPasswordPage, NewPasswordPage } from '@/domains/auth';
import { ProtectedRoute } from './ProtectedRoute';
import { PublicRoute } from './PublicRoute';

import { MainLayout } from '../components';
import {  
  TransactionsRouter, 
  InventoryRouter,
  AccountingRouter,
  FinancialClosingRouter,
  FinancialStatementsRouter,
  SettingsRouter,
} from '@/domains';
import { AUTH_ROUTES, MAIN_ROUTES } from '@/router';

/**
 * Componente principal de enrutamiento de la aplicación
 * Define todas las rutas disponibles y su configuración
 */
export const AppRouter: React.FC = () => {
  return (
    <Routes>

      {/* Rutas públicas */}
      <Route path={AUTH_ROUTES.AUTH} element={<PublicRoute />} >
        <Route path={AUTH_ROUTES.LOGIN} element={<LoginPage />} />
        <Route path={AUTH_ROUTES.RECOVERY_PASSWORD} element={<RecoveryPasswordPage />} />
        <Route path={AUTH_ROUTES.NEW_PASSWORD} element={<NewPasswordPage />} />
        <Route index element={<Navigate to={`${AUTH_ROUTES.AUTH}/${AUTH_ROUTES.LOGIN}`} replace />} />
      </Route>

      {/* Rutas privadas */}
      <Route element={<ProtectedRoute />}>
        <Route path={MAIN_ROUTES.HOME} element={<MainLayout />}>
          <Route path={`${MAIN_ROUTES.TRANSACTIONS}/*`} element={<TransactionsRouter />} />
          <Route path={`${MAIN_ROUTES.INVENTORY}/*`} element={<InventoryRouter />} />
          <Route path={`${MAIN_ROUTES.ACCOUNTING}/*`} element={<AccountingRouter />} />
          <Route path={`${MAIN_ROUTES.FINANCIAL_CLOSING}/*`} element={<FinancialClosingRouter />} />
          <Route path={`${MAIN_ROUTES.FINANCIAL_STATEMENTS}/*`} element={<FinancialStatementsRouter />} />
          <Route path={`${MAIN_ROUTES.SETTINGS}/*`} element={<SettingsRouter />} />
        </Route>
      </Route>

      {/* Ruta 404 - Redirecciona al login */}
      <Route path="*" element={<Navigate to={`${AUTH_ROUTES.AUTH}/${AUTH_ROUTES.LOGIN}`} replace />} />
    </Routes>
  );
};

export default AppRouter;