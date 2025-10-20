import { Suspense } from "react";
import { Routes, Route } from "react-router-dom";
import Home from "./components/home";
import ProductDetail from "./pages/ProductDetail";
import CategoryPage from "./pages/CategoryPage";
import NotFound from "./pages/NotFound";

function App() {
  return (
    <Suspense fallback={<p>Loading...</p>}>
      <>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/produto/:slug" element={<ProductDetail />} />
          <Route path="/categoria/:slug" element={<CategoryPage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </>
    </Suspense>
  );
}

export default App;