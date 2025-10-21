import { Heart, Home, Star } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '../components/ui/button';
import ProductCard from '../components/ProductCard';
import { useEffect, useState } from 'react';
import api from '../services/api';

// Wishlist will come from API or user context. For now, start empty and try to load if endpoint exists.
const emptyWishlist: any[] = [];

export default function FavoritosPage() {
  const [wishlistItems, setWishlistItems] = useState<any[]>(emptyWishlist);

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      try {
        // If you have a wishlist endpoint, call it here. Placeholder: empty
        // const data = await api.getWishlist();
        const data: any[] = [];
        if (mounted) setWishlistItems(data);
      } catch (e) {
        if (mounted) setWishlistItems([]);
      }
    };
    load();
    return () => { mounted = false; };
  }, []);

  return (
    <div className="min-h-screen bg-soft-cream py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <motion.h1 
            className="text-4xl font-bold text-deep-navy mb-4"
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            Meus Favoritos
          </motion.h1>
          <motion.p 
            className="text-lg text-deep-navy/80 max-w-2xl mx-auto"
            initial={{ y: -10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            Aqui estão todos os itens que você salvou para comprar depois. Não perca as ofertas especiais!
          </motion.p>
        </div>

        {wishlistItems.length > 0 ? (
          <motion.div 
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            {wishlistItems.map((product) => (
              <ProductCard 
                key={product.id}
id={product.id}
                slug={product.slug}
                title={product.title}
                price={product.price}
                originalPrice={product.originalPrice}
                discount={product.originalPrice ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100) : 0}
                images={product.images}
                rating={product.rating}
                reviewCount={product.reviewCount}
                badges={product.badges}
                showDiscountBadge={product.showDiscountBadge}
              />
            ))}
          </motion.div>
        ) : (
          <motion.div 
            className="text-center py-20 bg-white rounded-xl shadow-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div className="w-24 h-24 mx-auto mb-6 bg-rose-50 rounded-full flex items-center justify-center">
              <Heart className="h-12 w-12 text-rose-400" strokeWidth={1.5} />
            </div>
            <h3 className="text-2xl font-medium text-deep-navy mb-2">Sua lista de desejos está vazia</h3>
            <p className="text-deep-navy/70 mb-6 max-w-md mx-auto">
              Você ainda não adicionou nenhum produto aos seus favoritos. Explore nossa loja e adicione seus itens preferidos!
            </p>
            <Button asChild>
              <Link to="/produtos" className="inline-flex items-center gap-2">
                <Home className="h-4 w-4" />
                Ir para a loja
              </Link>
            </Button>
          </motion.div>
        )}
      </div>
    </div>
  );
}
