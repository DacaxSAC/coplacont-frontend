import { Route, Routes } from "react-router-dom";

import {
  ChartOfAccountRouter,
  GeneralJournalRouter,
  GeneralLedgerRouter,
  InventoryAndBalanceStatementRouter,
} from '../pages';

export const Router = () => {
  return (
    <Routes>
      <Route path="/chart-of-account" element={<ChartOfAccountRouter />} />
      <Route path="/general-journal" element={<GeneralJournalRouter />} />
      <Route path="/general-ledger" element={<GeneralLedgerRouter />} />
      <Route path="/inventory-and-balance-statement" element={<InventoryAndBalanceStatementRouter />} />
    </Routes>
  );
};