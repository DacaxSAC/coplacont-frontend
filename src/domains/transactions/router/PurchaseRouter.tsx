import { Route, Routes } from "react-router-dom";
import { HomePurchasePage, RegisterPurchasePage } from "../pages/purchases";

export const PurchaseRouter = () => {
  return (
    <Routes>
      <Route path="/" element={<HomePurchasePage />} />
      <Route path="/registrar" element={<RegisterPurchasePage />} />
    </Routes>
  );
};