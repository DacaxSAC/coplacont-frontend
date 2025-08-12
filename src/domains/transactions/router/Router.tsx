import React from "react";
import { Route, Routes } from "react-router-dom";

import { 
    SalesRouter, 
    PurchaseRouter,
    CashRouter,
    ManualJournalEntryRouter,
    PayrollRouter,
} from '../pages'
import { TRANSACTIONS_ROUTES } from '@/router';

export const Router : React.FC = () => {
  return (
    <Routes>
      <Route path={TRANSACTIONS_ROUTES.SALES} element={<SalesRouter />} />
      <Route path={TRANSACTIONS_ROUTES.PURCHASES} element={<PurchaseRouter />} />
      <Route path={TRANSACTIONS_ROUTES.CASH} element={<CashRouter />} />
      <Route path={TRANSACTIONS_ROUTES.MANUAL_JOURNAL_ENTRY} element={<ManualJournalEntryRouter />} />
      <Route path={TRANSACTIONS_ROUTES.PAYROLL} element={<PayrollRouter />} />
    </Routes>
  );
};