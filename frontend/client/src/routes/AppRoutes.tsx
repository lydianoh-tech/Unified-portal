import { Routes, Route } from "react-router-dom";
import PublicLayout from "../layouts/PublicLayout";
import HomePage from "../pages/Home/HomePage";
import ProductPage from "../pages/Product/ProductPage";

export default function AppRoutes() {
  return (
    <Routes>
      {/* Public Website */}
      <Route element={<PublicLayout />}>
        <Route path="/" element={<HomePage />} />

        <Route
          path="/products/:productId"
          element={<ProductPage />}
        />
      </Route>
    </Routes>
  );
}