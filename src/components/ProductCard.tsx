import { Link } from 'react-router-dom';
import { Star, ShoppingCart } from 'lucide-react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Card, CardContent } from './ui/card';

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

  return (
    <Card className="group overflow-hidden border-0 shadow-petjoy-soft hover:shadow-petjoy-crisp transition-all duration-300 hover:-translate-y-1.5 bg-white">
      <Link to={`/produto/${slug}`}>
        <div className="relative overflow-hidden aspect-square bg-soft-cream">
          <img
            src={images[0]}
            alt={title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            loading="lazy"
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
                className={`${
                  badge === 'Novo'
                    ? 'bg-joy-orange text-white'
                    : 'bg-deep-navy text-white'
                }`}
              >
                {badge}
              </Badge>
            ))}
          </div>
        </div>
      </Link>

      <CardContent className="p-4">
        <Link to={`/produto/${slug}`}>
          <h3 className="font-primary font-semibold text-deep-navy mb-2 line-clamp-2 group-hover:text-joy-orange transition-colors">
            {title}
          </h3>
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
          <div className="mt-3">
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
          </div>
          <Button
            size="sm"
            className="bg-joy-orange hover:bg-aqua-mint text-white rounded-petjoy transition-all duration-300"
          >
            <ShoppingCart className="h-4 w-4 mr-1" />
            Adicionar
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
