import { Route, Routes } from "react-router-dom";
import { PurchasePage } from "../pages";
import {  RegisterPurchasePage } from "../pages/purchases";

export const PurchaseRouter = () => {
  return (
    <Routes>
      <Route path="/" element={<PurchasePage />} />
      <Route path="/registrar" element={<RegisterPurchasePage />} />
    </Routes>
  );
};