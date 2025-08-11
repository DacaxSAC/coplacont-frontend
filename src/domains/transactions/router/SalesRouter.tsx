import { Route, Routes } from "react-router-dom";
import { HomeSalePage, RegisterSalePage } from "../pages/sales";

export const SalesRouter = () => {
  return (
    <Routes>
      <Route path="/" element={<HomeSalePage />} />
      <Route path="/registrar" element={<RegisterSalePage />} />
    </Routes>
  );
};