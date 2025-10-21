import { Link } from 'react-router-dom';
import { Star, ShoppingCart, Check } from 'lucide-react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Card, CardContent } from './ui/card';
import { useCart } from '@/hooks/useCart';
import { useState, useRef } from 'react';
import { motion } from 'framer-motion'
import { pop, fadeInUp } from '@/lib/animations'
import { useRevealOnScroll } from '@/hooks/useRevealOnScroll'

interface ProductCardProps {
  id: string;
  title: string;
  slug: string;
  price: number;
  originalPrice?: number;
  discount?: number;
  images: string[];
  rating: number;
  reviewCount: number;
  badges?: string[];
  showDiscountBadge?: boolean;
}

export default function ProductCard({
  id,
  title,
  slug,
  price,
  originalPrice,
  discount = 0,
  images,
  rating,
  reviewCount,
  badges = [],
  showDiscountBadge = false,
}: ProductCardProps) {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(price / 100);
  };

  const { addToCart, getItemQuantity } = useCart();
  const [isAdded, setIsAdded] = useState(false);
  const ref = useRef<HTMLDivElement>(null)
  const controls = useRevealOnScroll(ref)

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    addToCart({
      id,
      name: title,
      price: price,
      image: images[0],
    });
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2000);
  };

  const quantityInCart = getItemQuantity(id);

  return (
    <motion.div ref={ref} initial="hidden" animate={controls} variants={fadeInUp} className="group">
      <Card className="overflow-hidden border-0 shadow-petjoy-soft hover:shadow-petjoy-crisp transition-all duration-300 bg-white">
        <Link to={`/produto/${slug}`} className="block">
          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.995 }} className="relative overflow-hidden aspect-square bg-soft-cream">
            <motion.img
              src={images[0]}
              alt={title}
              className="w-full h-full object-cover"
              loading="lazy"
              initial={{ scale: 1 }}
              whileHover={{ scale: 1.06, transition: { duration: 0.35 } }}
            />
            <div className="absolute top-3 left-3 flex flex-col gap-2">
              {showDiscountBadge && discount > 0 && (
                <Badge className="bg-coral-red text-white text-sm font-bold">
                  {Math.round(discount)}% OFF
                </Badge>
              )}
              {badges.map((badge) => (
                <Badge
                  key={badge}
                  className={`$ {badge === 'Novo' ? 'bg-joy-orange text-white' : 'bg-deep-navy text-white'}`}
                >
                  {badge}
                </Badge>
              ))}
            </div>
          </motion.div>
        </Link>

        <CardContent className="p-4">
          <Link to={`/produto/${slug}`} className="block mb-2">
            <motion.h3 className="font-primary font-semibold text-deep-navy line-clamp-2" whileHover={{ color: '#FF9A3D' }}>
              {title}
            </motion.h3>
          </Link>

          <div className="flex items-center gap-1 mb-3">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`h-4 w-4 ${
                  i < Math.floor(rating)
                    ? 'fill-peach-blush text-peach-blush'
                    : 'text-gray-300'
                }`}
              />
            ))}
            <span className="text-sm text-gray-600 ml-1">({reviewCount})</span>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-2xl font-bold text-deep-navy">
                {formatPrice(price)}
              </span>
              {showDiscountBadge && originalPrice && originalPrice > price && (
                <span className="text-sm text-forest-green line-through">
                  {formatPrice(originalPrice)}
                </span>
              )}
            </div>
            <Button
              onClick={handleAddToCart}
              className={`${isAdded ? 'bg-green-500 hover:bg-green-600' : 'bg-joy-orange hover:bg-joy-orange/90'} text-white transition-colors`}
              size="sm"
            >
              {isAdded ? (
                <Check className="h-4 w-4 mr-1" />
              ) : (
                <ShoppingCart className="h-4 w-4 mr-1" />
              )}
              {isAdded ? 'Adicionado' : quantityInCart > 0 ? `(${quantityInCart})` : 'Adicionar'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
