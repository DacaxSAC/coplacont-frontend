import { Route, Routes } from "react-router-dom";

import { 
    ProductsRouter,
    CategoriesRouter,
    WarehouseRouter,
} from '../pages';

import { MANTEINERS_ROUTES } from '@/router';

export const Router = () => {
  return (
    <Routes>
      <Route path={MANTEINERS_ROUTES.PRODUCTS} element={<ProductsRouter />} />
      <Route path={MANTEINERS_ROUTES.CATEGORIES} element={<CategoriesRouter />} />
      <Route path={MANTEINERS_ROUTES.WAREHOUSES} element={<WarehouseRouter />} />
    </Routes> 
  );
};