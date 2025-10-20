import { Heart, Home, Star } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import ProductCard from '@/components/ProductCard';

// TODO: replace this placeholder with real wishlist data from user context or API
const wishlistItems = [
  {
    id: '1',
    slug: 'racao-premium-para-caes',
    title: 'Ração Premium para Cães',
    price: 12990, // Price in cents
    originalPrice: 14990,
    images: ['/images/produto1.jpg'],
    rating: 4.8,
    reviewCount: 156,
    badges: ['Novo', 'Oferta'],
    showDiscountBadge: true
  },
  {
    id: '2',
    slug: 'brinquedo-para-gatos',
    title: 'Brinquedo para Gatos',
    price: 4590, // Price in cents
    images: ['/images/produto2.jpg'],
    rating: 4.5,
    reviewCount: 89,
    badges: ['Mais Vendido']
  },
  // Add more mock items as needed
];

export default function FavoritosPage() {
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
