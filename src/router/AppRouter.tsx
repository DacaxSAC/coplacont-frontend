import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { LoginPage, RecoveryPasswordPage, NewPasswordPage } from '../domains/auth/pages';
import { ProtectedRoute } from './ProtectedRoute';
import { PublicRoute } from './PublicRoute';

import { MainLayout } from '../components/templates/MainLayout';
import PurchasePage from '../domains/transactions/pages/PurchasePage';
import CashPage from '@/domains/transactions/pages/CashPage';
import ManualJournalEntry from '@/domains/transactions/pages/ManualJournalEntryPage';
import PayrollPage from '@/domains/transactions/pages/PayrollPage';
import SalePage from '@/domains/transactions/pages/SalePage';
import ProductPage from '@/domains/inventory/pages/ProductPage';
import KardexPage from '@/domains/inventory/pages/KardexPage';
import InventoryAdjustment from '@/domains/inventory/pages/InventoryAdjustmentPage';
import GeneralJournalPage from '@/domains/accounting/pages/GeneralJournalPage';
import GeneralLedgerPage from '@/domains/accounting/pages/GeneralLedgerPage';
import InventoryAndBalanceStatementPage from '@/domains/accounting/pages/InventoryAndBalanceStatementPage';
import ChartOfAccountPage from '@/domains/accounting/pages/ChartOfAccountPage';
import TrialBalancePage from '@/domains/financial-closing/pages/TrialBalancePage';
import AccountingWorksheetPage from '@/domains/financial-closing/pages/AccountingWorksheetPage';
import ClosingAdjustmentPage from '@/domains/financial-closing/pages/ClosingAdjustmentPage';
import BalanceSheetPage from '@/domains/financial-statements/pages/BalanceSheetPage';
import IncomeStatementPage from '@/domains/financial-statements/pages/IncomeStatementPage';
import CashFlowStatementPage from '@/domains/financial-statements/pages/CashFlowStatementPage';
import StatementOfChangesInEquityPage from '@/domains/financial-statements/pages/StatementOfChangesInEquityPage';
import AccountingPeriodPage from '@/domains/settings/pages/AccountingPeriodPage';
import UserAndRolesPage from '@/domains/settings/pages/UserAndRolesPage';
import ParamsPage from '@/domains/settings/pages/ParamsPage';

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