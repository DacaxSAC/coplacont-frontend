import { Route, Routes } from "react-router-dom";

import { 
    UsersRouter,
    ParamsRouter,
    AccountingPeriodRouter
} from '../pages';

export const Router = () => {
  return (
    <Routes>
      <Route path="/users" element={<UsersRouter />} />
      <Route path="/params" element={<ParamsRouter />} />
      <Route path="/accounting-periods" element={<AccountingPeriodRouter />} />
    </Routes>
  );
};