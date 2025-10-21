import { Suspense } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import { motion } from 'framer-motion'
import { pageVariants } from './lib/animations'
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
import AdminLogin from './pages/admin/AdminLogin';
import AdminLayout from './pages/admin/AdminLayout';
import Dashboard from './pages/admin/Dashboard';
import ProductsAdmin from './pages/admin/ProductsAdmin';
import ProductForm from './pages/admin/ProductForm';
import { isAuthenticated } from './lib/auth';

function App() {
  const location = useLocation()

  return (
    <Suspense fallback={<p>Loading...</p>}>
      <>
        <Header />
        <main className="min-h-screen">
          <motion.div
            key={location.pathname}
            initial="initial"
            animate="in"
            exit="out"
            variants={pageVariants}
          >
            <Routes location={location} key={location.pathname}>
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
          {/* Admin Routes */}
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin" element={isAuthenticated() ? <AdminLayout /> : <AdminLogin /> }>
            <Route index element={<Dashboard />} />
            <Route path="products" element={<ProductsAdmin />} />
            <Route path="products/new" element={<ProductForm />} />
            <Route path="products/:id/edit" element={<ProductForm />} />
          </Route>
            </Routes>
          </motion.div>
        </main>
      </>
    </Suspense>
  );
}

export default App;