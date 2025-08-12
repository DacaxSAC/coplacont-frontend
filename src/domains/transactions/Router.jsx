import { Route, Routes } from "react-router-dom";

import { 
    SalesRouter, 
    PurchaseRouter,
    CashRouter,
    ManualJournalEntryRouter,
    PayrollRouter,
} from '.'
s
export const Router = () => {
  return (
    <Routes>
      <Route path="/sales" element={<SalesRouter />} />
      <Route path="/purchase" element={<PurchaseRouter />} />
      <Route path="/cash" element={<CashRouter />} />
      <Route path="/manual-journal-entry" element={<ManualJournalEntryRouter />} />
      <Route path="/payroll" element={<PayrollRouter />} />
    </Routes>
  );
};