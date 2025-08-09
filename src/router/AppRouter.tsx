import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { LoginPage, RecoveryPasswordPage, NewPasswordPage } from '../domains/auth/pages';
import { ProtectedRoute } from './ProtectedRoute';
import { PublicRoute } from './PublicRoute';

import { MainLayout } from '../components/templates/MainLayout';
import { PurchasePage, CashPage, ManualJournalEntry, PayrollPage, SalePage } from '@/domains/transactions';
import { ProductPage, KardexPage, InventoryAdjustment } from '@/domains/inventory'
import { TrialBalancePage, AccountingWorksheetPage, ClosingAdjustmentPage } from '@/domains/financial-closing';
import { AccountingPeriodPage, ParamsPage, UserAndRolesPage } from '@/domains/settings';
import { ChartOfAccountPage, GeneralJournalPage, GeneralLedgerPage, InventoryAndBalanceStatementPage } from '@/domains/accounting';
import { BalanceSheetPage, IncomeStatementPage, CashFlowStatementPage, StatementOfChangesInEquityPage } from '@/domains/financial-statements';

/**
 * Componente principal de enrutamiento de la aplicación
 * Define todas las rutas disponibles y su configuración
 */
export const AppRouter: React.FC = () => {
  return (
    <Routes>
      <ProtectedRoute>
        <Route element={<MainLayout />}>
          <Route path="/" element={<div>Home</div>} />

          {/* Transacciones */}
          <Route path="/compras" element={<PurchasePage />} />
          <Route path="/ventas" element={<SalePage />} />
          <Route path="/caja" element={<CashPage />} />
          <Route path="/asientos-manuales" element={<ManualJournalEntry />} />
          <Route path="/planillas" element={<PayrollPage />} />

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

          {/* Configuración */}
          <Route path="/periodos-contables" element={<AccountingPeriodPage />} />
          <Route path="/usuarios-roles" element={<UserAndRolesPage />} />
          <Route path="/parametros" element={<ParamsPage />} />

          {/* Rutas de autenticación */}
          <Route path="/auth/login" element={<LoginPage />} />
          <Route path="/auth/recovery-password" element={<RecoveryPasswordPage />} />
          <Route path="/auth/new-password" element={<NewPasswordPage />} />
        </Route>
      </ProtectedRoute>

      <PublicRoute>
        <Route path="/auth/login" element={<LoginPage />} />
        <Route path="/auth/recovery-password" element={<RecoveryPasswordPage />} />
        <Route path="/auth/new-password" element={<NewPasswordPage />} />
      </PublicRoute>

      {/* Redirección para rutas de auth sin especificar */}
      <Route path="/auth" element={<Navigate to="/auth/login" replace />} />

      {/* Ruta 404 - Redirecciona a la página principal */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default AppRouter;