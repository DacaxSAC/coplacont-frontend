import { Route, Routes } from "react-router-dom";

import { 
    ProductRouter,
    KardexRouter,
    InventoryAdjusmentRouter
} from '../pages';

export const Router = () => {
  return (
    <Routes>
      <Route path="/product" element={<ProductRouter />} />
      <Route path="/kardex" element={<KardexRouter />} />
      <Route path="/inventoryAdjusment" element={<InventoryAdjusmentRouter />} />
    </Routes>
  );
};