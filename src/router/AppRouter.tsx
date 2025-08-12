import React, { Fragment } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { LoginPage, RecoveryPasswordPage, NewPasswordPage } from '@/domains/auth';
import { ProtectedRoute } from './ProtectedRoute';
import { PublicRoute } from './PublicRoute';

import { MainLayout } from '../components/templates/MainLayout';
import {  
  TransactionsRouter, 
  SettingsRouter 
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
      </Route>

      {/* Rutas privadas */}
      <Route element={<ProtectedRoute />}>
        <Route element={<MainLayout />}>
          <Route path="/" element={<Fragment />} />

          <Route path="/transactions/*" element={<TransactionsRouter />} />

          {/* Inventario */}
          <Route path="/productos" element={<ProductPage />} />
          <Route path="/kardex" element={<KardexPage />} />
          <Route path="/ajustes-inventario" element={<InventoryAdjustment />} />

          {/* Contabilidad */}
          <Route path="/plan-cuentas" element={<ChartOfAccountPage />} />
          <Route path="/libro-diario" element={<GeneralJournalPage />} />
          <Route path="/libro-mayor" element={<GeneralLedgerPage />} />
          <Route path="/libro-inventario-balance" element={<InventoryAndBalanceStatementPage />} />

          {/* Cierre Contable */}
          <Route path="/hoja-trabajo" element={<AccountingWorksheetPage />} />
          <Route path="/hoja-comprobacion" element={<TrialBalancePage />} />
          <Route path="/ajustes-cierre" element={<ClosingAdjustmentPage />} />

          {/* Estados financieros */}
          <Route path="/balance-general" element={<BalanceSheetPage />} />
          <Route path="/estado-resultados" element={<IncomeStatementPage />} />
          <Route path="/flujo-efectivo" element={<CashFlowStatementPage />} />
          <Route path="/estado-patrimonio" element={<StatementOfChangesInEquityPage />} />

          <Route path="/settings/*" element={<SettingsRouter />} />

          {/* Rutas de autenticación */}
          <Route path="/auth/login" element={<LoginPage />} />
          <Route path="/auth/recovery-password" element={<RecoveryPasswordPage />} />
          <Route path="/auth/new-password" element={<NewPasswordPage />} />
        </Route>
      </Route>

      {/* Redirección para rutas de auth sin especificar */}
      <Route path="/auth" element={<Navigate to="/auth/login" replace />} />

      {/* Ruta 404 - Redirecciona a la página principal */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default AppRouter;