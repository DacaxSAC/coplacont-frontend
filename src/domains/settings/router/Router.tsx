import { Route, Routes } from "react-router-dom";

import { 
    UsersRouter,
    ParamsRouter,
    AccountingPeriodRouter,
    ValuationMethodsRouter,
    DashboardRouter
} from '../pages';
import { SETTINGS_ROUTES } from '../../../router';

/**
 * Router principal del módulo de configuración
 * Define todas las rutas disponibles para el módulo de settings
 */
export const Router = () => {
  return (
    <Routes>
      <Route path="/" element={<DashboardRouter />} />
      <Route path={SETTINGS_ROUTES.USERS} element={<UsersRouter />} />
      <Route path={SETTINGS_ROUTES.PARAMS} element={<ParamsRouter />} />
      <Route path={`${SETTINGS_ROUTES.ACCOUNTING_PERIODS}/*`} element={<AccountingPeriodRouter />} />
      <Route path={`${SETTINGS_ROUTES.VALUATION_METHODS}/*`} element={<ValuationMethodsRouter />} />
    </Routes>
  );
};