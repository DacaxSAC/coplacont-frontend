import React from "react";
import { Route, Routes } from "react-router-dom";

import { 
    SalesRouter, 
    PurchaseRouter,
    CashRouter,
    ManualJournalEntryRouter,
    PayrollRouter,
} from '../pages'

export const Router : React.FC = () => {
  return (
    <Routes>
      <Route path="/sales" element={<SalesRouter />} />
      <Route path="/purchases" element={<PurchaseRouter />} />
      <Route path="/cash" element={<CashRouter />} />
      <Route path="/manual-journal-entry" element={<ManualJournalEntryRouter />} />
      <Route path="/payroll" element={<PayrollRouter />} />
    </Routes>
  );
};