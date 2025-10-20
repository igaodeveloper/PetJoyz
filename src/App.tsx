import { Suspense } from "react";
import { Routes, Route } from "react-router-dom";
import Home from "./components/home";
import ProductDetail from "./pages/ProductDetail";
import CategoryPage from "./pages/CategoryPage";
import ProductsPage from "./pages/ProductsPage";
import OfertasPage from "./pages/OfertasPage";
import SobrePage from "./pages/SobrePage";
import CartPage from "./pages/CartPage";
import NotFound from "./pages/NotFound";
import Header from "./components/Header";
import FavoritosPage from "./pages/FavoritosPage";
import PaymentPage from "./pages/PaymentPage";

function App() {
  return (
    <Suspense fallback={<p>Loading...</p>}>
      <>
        <Header />
        <main className="min-h-screen">
          <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/produtos" element={<ProductsPage />} />
          <Route path="/ofertas" element={<OfertasPage />} />
          <Route path="/sobre" element={<SobrePage />} />
          <Route path="/carrinho" element={<CartPage />} />
          <Route path="/pagamento" element={<PaymentPage />} />
          <Route path="/favoritos" element={<FavoritosPage />} />
          <Route path="/produto/:slug" element={<ProductDetail />} />
          <Route path="/categoria/:slug" element={<CategoryPage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
        </main>
      </>
    </Suspense>
  );
}

export default App;