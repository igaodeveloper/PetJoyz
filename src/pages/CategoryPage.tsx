import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ChevronDown, SlidersHorizontal } from 'lucide-react';
import Footer from '../components/Footer';
import ProductCard from '../components/ProductCard';
import { Button } from '../components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Sheet, SheetContent, SheetTrigger } from '../components/ui/sheet';
import { Checkbox } from '../components/ui/checkbox';
import { Slider } from '../components/ui/slider';
import productsData from '../data/products.json';
import categoriesData from '../data/categories.json';

export default function CategoryPage() {
  const { slug } = useParams();
  const category = categoriesData.find(c => c.slug === slug);
  const [priceRange, setPriceRange] = useState([0, 50000]);
  const [sortBy, setSortBy] = useState('popular');

  const filteredProducts = productsData.filter(p => p.category === slug);

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case 'price-asc':
        return a.price - b.price;
      case 'price-desc':
        return b.price - a.price;
      case 'rating':
        return b.rating - a.rating;
      default:
        return b.reviewCount - a.reviewCount;
    }
  });

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(price / 100);
  };

  const FilterSection = () => (
    <div className="space-y-6">
      <div>
        <h3 className="font-semibold text-deep-navy mb-4">Faixa de Preço</h3>
        <Slider
          value={priceRange}
          onValueChange={setPriceRange}
          max={50000}
          step={1000}
          className="mb-4"
        />
        <div className="flex justify-between text-sm text-gray-600">
          <span>{formatPrice(priceRange[0])}</span>
          <span>{formatPrice(priceRange[1])}</span>
        </div>
      </div>

      <div>
        <h3 className="font-semibold text-deep-navy mb-4">Porte do Pet</h3>
        <div className="space-y-3">
          {['Pequeno', 'Médio', 'Grande'].map((size) => (
            <div key={size} className="flex items-center gap-2">
              <Checkbox id={size} />
              <label htmlFor={size} className="text-sm cursor-pointer">{size}</label>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h3 className="font-semibold text-deep-navy mb-4">Material</h3>
        <div className="space-y-3">
          {['Eco-friendly', 'Plástico', 'Tecido', 'Borracha'].map((material) => (
            <div key={material} className="flex items-center gap-2">
              <Checkbox id={material} />
              <label htmlFor={material} className="text-sm cursor-pointer">{material}</label>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h3 className="font-semibold text-deep-navy mb-4">Avaliação</h3>
        <div className="space-y-3">
          {[5, 4, 3].map((rating) => (
            <div key={rating} className="flex items-center gap-2">
              <Checkbox id={`rating-${rating}`} />
              <label htmlFor={`rating-${rating}`} className="text-sm cursor-pointer">
                {rating}+ estrelas
              </label>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-soft-cream">

      {/* Category Hero */}
      <div className="bg-gradient-to-r from-joy-orange to-peach-blush py-12">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-2 text-sm text-white/80 mb-4">
            <Link to="/" className="hover:text-white">Home</Link>
            <span>/</span>
            <span className="text-white capitalize">{category?.name || slug}</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-3">
            {category?.name || slug} {category?.icon}
          </h1>
          <p className="text-lg text-white/90">{category?.description}</p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <p className="text-gray-600">
            {sortedProducts.length} produtos encontrados
          </p>
          <div className="flex items-center gap-4">
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Ordenar por" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="popular">Mais Vendidos</SelectItem>
                <SelectItem value="rating">Melhor Avaliados</SelectItem>
                <SelectItem value="price-asc">Menor Preço</SelectItem>
                <SelectItem value="price-desc">Maior Preço</SelectItem>
              </SelectContent>
            </Select>

            {/* Mobile Filter Button */}
            <Sheet>
              <SheetTrigger asChild className="lg:hidden">
                <Button variant="outline" size="icon">
                  <SlidersHorizontal className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-80 bg-white">
                <h2 className="text-xl font-bold text-deep-navy mb-6">Filtros</h2>
                <FilterSection />
              </SheetContent>
            </Sheet>
          </div>
        </div>

        <div className="grid lg:grid-cols-4 gap-8">
          {/* Desktop Filters */}
          <aside className="hidden lg:block">
            <div className="bg-white rounded-petjoy p-6 shadow-petjoy-soft sticky top-24">
              <h2 className="text-xl font-bold text-deep-navy mb-6">Filtros</h2>
              <FilterSection />
            </div>
          </aside>

          {/* Products Grid */}
          <div className="lg:col-span-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {sortedProducts.map((product) => (
                <ProductCard key={product.id} {...product} />
              ))}
            </div>

            {sortedProducts.length === 0 && (
              <div className="text-center py-16">
                <p className="text-2xl text-gray-600 mb-4">Nenhum produto encontrado</p>
                <Link to="/">
                  <Button className="bg-joy-orange hover:bg-aqua-mint text-white">
                    Voltar para Home
                  </Button>
                </Link>
              </div>
            )}

            {sortedProducts.length > 0 && (
              <div className="text-center mt-12">
                <Button
                  variant="outline"
                  className="border-2 border-joy-orange text-joy-orange hover:bg-joy-orange hover:text-white"
                >
                  Carregar Mais Produtos
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
