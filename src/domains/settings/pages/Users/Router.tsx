import { Route, Routes } from "react-router-dom";

import { MainPage, RegisterPage } from '.'

export const Router = () => {
  return (
    <Routes>
      <Route path="/" element={<MainPage />} />
      <Route path="/register" element={<RegisterPage />} />
    </Routes>
  );
};