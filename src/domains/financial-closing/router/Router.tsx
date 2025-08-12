import { Route, Routes } from "react-router-dom";

import { 
    AccountingWorksheetRouter,
    ClosingAdjustmentRouter,
    TrialBalanceRouter
} from '../pages';

export const Router = () => {
  return (
    <Routes>
      <Route path="/accounting-worksheet" element={<AccountingWorksheetRouter />} />
      <Route path="/closing-adjustment" element={<ClosingAdjustmentRouter />} />
      <Route path="/trial-balance" element={<TrialBalanceRouter />} />
    </Routes>
  );
};