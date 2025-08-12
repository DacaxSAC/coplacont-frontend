import { Route, Routes } from "react-router-dom";

import { MainPage, RegisterPage } from '.'
import { COMMON_ROUTES } from '@/router';

export const Router = () => {
  return (
    <Routes>
      <Route path={COMMON_ROUTES.MAIN} element={<MainPage />} />
      <Route path={COMMON_ROUTES.REGISTER} element={<RegisterPage />} />
    </Routes>
  );
};