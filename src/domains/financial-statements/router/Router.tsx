import React from "react";
import { Route, Routes } from "react-router-dom";

import { 
    BalanceSheetRouter, 
    IncomeStatementRouter,
    CashFlowStatementRouter,
    StatementOfChangesInEquityRouter,
} from '../pages'

export const Router : React.FC = () => {
  return (
    <Routes>
      <Route path="/balance-sheet" element={<BalanceSheetRouter />} />
      <Route path="/income-statement" element={<IncomeStatementRouter />} />
      <Route path="/cash-flow-statement" element={<CashFlowStatementRouter />} />
      <Route path="/statement-of-changes-in-equity" element={<StatementOfChangesInEquityRouter />} />
    </Routes>
  );
};