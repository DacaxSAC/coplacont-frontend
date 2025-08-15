import { Route, Routes } from "react-router-dom";

import { 
    UsersRouter,
    ParamsRouter
} from '../pages';
import { SETTINGS_ROUTES } from '../../../router';

export const Router = () => {
  return (
    <Routes>
      <Route path={SETTINGS_ROUTES.USERS} element={<UsersRouter />} />
      <Route path={SETTINGS_ROUTES.PARAMS} element={<ParamsRouter />} />
    </Routes>
  );
};