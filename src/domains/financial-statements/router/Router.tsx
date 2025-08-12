import React from "react";
import { Route, Routes } from "react-router-dom";

import { 
    BalanceSheetRouter, 
    IncomeStatementRouter,
    CashFlowStatementRouter,
    StatementOfChangesInEquityRouter,
} from '../pages'
import { FINANCIAL_STATEMENTS_ROUTES } from '@/router';

export const Router : React.FC = () => {
  return (
    <Routes>
      <Route path={FINANCIAL_STATEMENTS_ROUTES.BALANCE_SHEET} element={<BalanceSheetRouter />} />
      <Route path={FINANCIAL_STATEMENTS_ROUTES.INCOME_STATEMENT} element={<IncomeStatementRouter />} />
      <Route path={FINANCIAL_STATEMENTS_ROUTES.CASH_FLOW_STATEMENT} element={<CashFlowStatementRouter />} />
      <Route path={FINANCIAL_STATEMENTS_ROUTES.STATEMENT_OF_CHANGES_IN_EQUITY} element={<StatementOfChangesInEquityRouter />} />
    </Routes>
  );
};