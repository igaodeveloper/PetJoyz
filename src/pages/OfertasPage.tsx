import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { Filter, Search, X, ArrowDown, ArrowUp, ChevronDown, ChevronUp, ChevronRight, Clock, Zap, Tag, Check, Star, ArrowRight, Truck } from 'lucide-react';
import ProductCard from '../components/ProductCard';
import { Button } from '../components/ui/button';
import AnimatedSection from '../components/AnimatedSection';
import { buttonElevate } from '@/lib/animations'
import { Input } from '../components/ui/input';
import { Checkbox } from '../components/ui/checkbox';
import { Label } from '../components/ui/label';
import { Slider } from '../components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import api from '../services/api';

// Type definitions for the JSON data
interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  icon: string;
  count?: number; // Optional count for display purposes
}

interface Brand {
  id: string;
  name: string;
  count: number;
  slug?: string;
  logo?: string;
}

// Type assertions for the imported JSON data
const typedCategories: Category[] = [];
let typedBrands: Brand[] = [];

interface Product {
  id: string;
  title: string;
  slug: string;
  description: string;
  price: number;
  currency: string;
  images: string[];
  category: string;
  badges: string[];
  tags: string[];
  rating: number;
  reviewCount: number;
  stock: number;
  variants: {
    id: string;
    name: string;
    price: number;
    stock: number;
    [key: string]: any;
  }[];
  // Optional fields with default values
  originalPrice?: number;
  discount?: number;
  brand?: string;
  image?: string; // For backward compatibility
}

interface FilterOption {
  id: string;
  label: string;
  count: number;
}

// Função para formatar o preço com valor padrão
const formatPrice = (price: number | undefined) => {
  if (price === undefined) return 'R$ 0,00';
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(price / 100);
};

const OfertasPage = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000]);
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState('discount-desc');
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoriesWithCounts, setCategoriesWithCounts] = useState<Category[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  
  // Estado para a contagem regressiva
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  // Configurar contagem regressiva
  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date();
      // Definir o fim da oferta para 7 dias a partir de agora
      const endDate = new Date(now);
      endDate.setDate(now.getDate() + 7);
      
      const difference = endDate.getTime() - now.getTime();
      
      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60)
        });
      }
    };

    const timer = setInterval(calculateTimeLeft, 1000);
    calculateTimeLeft();
    return () => clearInterval(timer);
  }, []);

  // Carregar produtos em oferta
  useEffect(() => {
    let mounted = true;
    const loadProducts = async () => {
      try {
        setLoading(true);
        // fetch products, categories, brands
        const [allProducts, categories, brands] = await Promise.all([
          api.getSpecialOffers(200).catch(() => []),
          api.getCategories().catch(() => []),
          api.getBrands().catch(() => [])
        ]);

        if (!mounted) return;

        // normalize brands and categories
        const cats = (categories as any[]) || [];
        const bds = (brands as any[]) || [];

        // Map products to expected Product shape and compute discounts
        const discountedProducts = (allProducts as any[])
          .filter((product) => (product.discount || 0) > 0)
          .map((product) => ({
            ...product,
            originalPrice: product.originalPrice ?? 0,
            discount: product.discount ?? 0,
            image: product.images?.[0] || '',
            badges: product.badges || [],
            tags: product.tags || [],
            variants: product.variants || [],
            reviewCount: product.reviewCount || 0,
            rating: product.rating || 0,
            stock: product.stock || 0
          })) as Product[];

        const sortedByDiscount = [...discountedProducts].sort((a, b) => (b.discount || 0) - (a.discount || 0));

        const categoryCounts: { [key: string]: number } = {};
        sortedByDiscount.forEach(product => {
          categoryCounts[product.category] = (categoryCounts[product.category] || 0) + 1;
        });

        const updatedCategories = cats.map((category: any) => ({
          ...category,
          count: categoryCounts[category.id] || 0
        }));

        setCategoriesWithCounts(updatedCategories as Category[]);
        setBrands(bds as Brand[]);
        setFeaturedProducts(sortedByDiscount.slice(0, 4));
        setProducts(sortedByDiscount);
      } catch (e) {
        // fallback to empty
        if (mounted) {
          setCategoriesWithCounts([]);
          setFeaturedProducts([]);
          setProducts([]);
        }
      } finally {
        if (mounted) setLoading(false);
      }
    };

    loadProducts();
    return () => { mounted = false; };
  }, []);

  // Função para alternar filtro de marca
  const handleBrandToggle = (brandId: string) => {
    setSelectedBrands(prev => 
      prev.includes(brandId) 
        ? prev.filter(id => id !== brandId)
        : [...prev, brandId]
    );
  };

  // Função para alternar filtro de categoria
  const handleCategoryToggle = (categoryId: string) => {
    setSelectedCategories(prev => 
      prev.includes(categoryId)
        ? prev.filter(id => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  // Filtrar produtos com base nos filtros selecionados
  const filteredProducts = useCallback(() => {
    return products.filter(product => {
      // Ensure brand is a string before comparison
      const productBrand = typeof product.brand === 'string' ? product.brand : '';
      const matchesBrand = selectedBrands.length === 0 || 
                         (productBrand && selectedBrands.includes(productBrand));
      
      // Ensure category is a string before comparison
      const productCategory = typeof product.category === 'string' ? product.category : '';
      const matchesCategory = selectedCategories.length === 0 || 
                           (productCategory && selectedCategories.includes(productCategory));
      
      // Ensure price is a number
      const productPrice = typeof product.price === 'number' ? product.price : 0;
      const matchesPrice = productPrice >= priceRange[0] && productPrice <= priceRange[1];
      
      // Ensure search comparisons are done with strings
      const searchTerm = typeof searchQuery === 'string' ? searchQuery.toLowerCase() : '';
      const productTitle = typeof product.title === 'string' ? product.title.toLowerCase() : '';
      const productDescription = typeof product.description === 'string' ? product.description.toLowerCase() : '';
      
      const matchesSearch = searchTerm === '' || 
                         productTitle.includes(searchTerm) ||
                         productDescription.includes(searchTerm);
      
      return matchesBrand && matchesCategory && matchesPrice && matchesSearch;
    });
  }, [products, selectedBrands, selectedCategories, priceRange, searchQuery]);

  // Ordenar produtos
  const sortedProducts = useCallback(() => {
    const filtered = filteredProducts();
    
    return [...filtered].sort((a, b) => {
      // Ensure all values are numbers before comparison
      const aPrice = typeof a.price === 'number' ? a.price : 0;
      const bPrice = typeof b.price === 'number' ? b.price : 0;
      const aDiscount = typeof a.discount === 'number' ? a.discount : 0;
      const bDiscount = typeof b.discount === 'number' ? b.discount : 0;
      const aRating = typeof a.rating === 'number' ? a.rating : 0;
      const bRating = typeof b.rating === 'number' ? b.rating : 0;
      
      switch (sortBy) {
        case 'price-asc':
          return Number(aPrice) - Number(bPrice);
        case 'price-desc':
          return Number(bPrice) - Number(aPrice);
        case 'discount-desc':
          return Number(bDiscount) - Number(aDiscount);
        case 'rating-desc':
          return Number(bRating) - Number(aRating);
        default:
          return 0;
      }
    });
  }, [filteredProducts, sortBy]);

  // Componente de loading
  const LoadingSkeleton = () => (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {[...Array(6)].map((_, i) => (
        <div key={i} className="bg-white rounded-xl overflow-hidden shadow-petjoy-soft animate-pulse">
          <div className="aspect-square bg-gray-200"></div>
          <div className="p-4 space-y-3">
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            <div className="h-6 bg-gray-200 rounded w-1/3 mt-2"></div>
          </div>
        </div>
      ))}
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-soft-cream pt-32 pb-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <div className="w-20 h-2 bg-joy-orange/20 rounded-full mx-auto mb-4"></div>
            <h1 className="text-4xl font-bold text-deep-navy mb-4">Ofertas Especiais</h1>
            <div className="w-48 h-3 bg-gray-200 rounded-full mx-auto"></div>
          </div>
          <LoadingSkeleton />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-soft-cream pt-28 pb-16">
      {/* Banner de Ofertas */}
      <AnimatedSection>
        <div className="bg-gradient-to-r from-joy-orange to-coral-red text-white py-6">
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row items-center justify-between">
              <div className="flex items-center mb-4 md:mb-0">
                <Zap className="h-8 w-8 mr-3 animate-pulse" />
                <h2 className="text-2xl font-bold">PROMOÇÕES RELÂMPAGO</h2>
              </div>
              <div className="flex items-center space-x-2 md:space-x-6">
                <div className="text-center">
                  <div className="text-2xl font-bold bg-white/20 rounded-lg px-3 py-1 min-w-[50px]">
                    {timeLeft.days}
                  </div>
                  <div className="text-xs mt-1">DIAS</div>
                </div>
                <div className="text-2xl font-bold">:</div>
                <div className="text-center">
                  <div className="text-2xl font-bold bg-white/20 rounded-lg px-3 py-1 min-w-[50px]">
                    {timeLeft.hours.toString().padStart(2, '0')}
                  </div>
                  <div className="text-xs mt-1">HORAS</div>
                </div>
                <div className="text-2xl font-bold">:</div>
                <div className="text-center">
                  <div className="text-2xl font-bold bg-white/20 rounded-lg px-3 py-1 min-w-[50px]">
                    {timeLeft.minutes.toString().padStart(2, '0')}
                  </div>
                  <div className="text-xs mt-1">MIN</div>
                </div>
                <div className="text-2xl font-bold">:</div>
                <div className="text-center">
                  <div className="text-2xl font-bold bg-white/20 rounded-lg px-3 py-1 min-w-[50px]">
                    {timeLeft.seconds.toString().padStart(2, '0')}
                  </div>
                  <div className="text-xs mt-1">SEG</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </AnimatedSection>

      <div className="container mx-auto px-4 mt-8">
        {/* Page Header */}
        <AnimatedSection className="text-center mb-12">
        <div className="text-center mb-12">
          <span className="inline-block bg-joy-orange/10 text-joy-orange text-sm font-medium px-4 py-1.5 rounded-full mb-4">
            <Zap className="inline-block h-4 w-4 mr-1 -mt-0.5" /> Ofertas Exclusivas
          </span>
          <h1 className="text-4xl md:text-5xl font-bold text-deep-navy mb-4">Ofertas Especiais</h1>
          <p className="text-lg text-forest-green max-w-2xl mx-auto">
            Aproveite nossas melhores ofertas em produtos selecionados para o seu pet. Descontos imperdíveis por tempo limitado!
          </p>
          
          {/* Barra de pesquisa */}
          <div className="max-w-2xl mx-auto mt-8 relative">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <Input
                type="text"
                placeholder="Buscar ofertas..."
                className="pl-10 pr-4 py-6 text-base rounded-xl border-2 border-gray-200 focus:border-joy-orange focus:ring-0"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              {searchQuery && (
                <button 
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-joy-orange"
                >
                  <X className="h-5 w-5" />
                </button>
              )}
            </div>
          </div>
        </div>
        </AnimatedSection>

        {/* Destaques */}
        {featuredProducts.length > 0 && (
          <AnimatedSection className="mb-12">
            <div className="mb-12">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-deep-navy flex items-center">
                  <Zap className="h-6 w-6 text-joy-orange mr-2" />
                  Destaques da Semana
                </h2>
                <Link
                  to="/produtos"
                  className="text-joy-orange hover:text-deep-navy font-medium flex items-center transition-colors"
                >
                  Ver todos <ArrowRight className="ml-1 h-4 w-4" />
                </Link>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                {featuredProducts.map((product) => (
                  <div key={product.id} className="group relative overflow-hidden bg-white rounded-xl shadow-petjoy-soft hover:shadow-petjoy-crisp transition-all duration-300 hover:-translate-y-1">
                    <div className="absolute top-4 left-4 z-10">
                      <span className="bg-coral-red text-white text-xs font-bold px-3 py-1 rounded-full">
                        {Math.round(product.discount ?? 0)}% OFF
                      </span>
                    </div>
                    <Link to={`/produto/${product.slug}`} className="block">
                      <div className="relative overflow-hidden aspect-square bg-soft-cream">
                        <img
                          src={product.image || product.images?.[0] || ''}
                          alt={product.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          loading="lazy"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.src = '/images/placeholder-product.jpg';
                          }}
                        />
                      </div>
                    </Link>
                    <div className="p-4">
                      <Link to={`/produto/${product.slug}`}>
                        <h3 className="font-medium text-deep-navy mb-1 line-clamp-1 group-hover:text-joy-orange transition-colors">
                          {product.title}
                        </h3>
                      </Link>
                      <div className="flex items-center gap-1 mb-2">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`h-3 w-3 ${
                              i < Math.floor(product.rating)
                                ? 'fill-peach-blush text-peach-blush'
                                : 'text-gray-300'
                            }`}
                          />
                        ))}
                      </div>
                      <div className="flex items-baseline gap-2">
                        <span className="text-lg font-bold text-deep-navy">
                          {formatPrice(product.price)}
                        </span>
                        {product.originalPrice && (
                          <span className="text-sm text-forest-green line-through">
                            {formatPrice(product.originalPrice)}
                          </span>
                        )}
                      </div>
                      <div className="mt-3 flex items-center justify-between">
                        <span className="inline-flex items-center text-xs text-forest-green">
                          <Truck className="h-3 w-3 mr-1" /> Frete grátis
                        </span>
                        <Button 
                  size="sm" 
                  className="bg-joy-orange text-white text-sm"
                  motionProps={buttonElevate}
                >
                          Comprar agora
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </AnimatedSection>
        )}

        {/* Main Content */}
        <div className="lg:flex gap-8">
          {/* Filters Sidebar */}
          <div className="lg:w-1/4 mb-8 lg:mb-0">
            <div className="bg-white p-6 rounded-xl shadow-petjoy-soft sticky top-32">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-deep-navy flex items-center">
                  <Filter className="h-5 w-5 mr-2 text-joy-orange" />
                  Filtros
                </h2>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-joy-orange hover:bg-joy-orange/10"
                  onClick={() => {
                    setSelectedBrands([]);
                    setSelectedCategories([]);
                    setPriceRange([0, 1000]);
                    setSearchQuery('');
                  }}
                >
                  <X className="h-4 w-4 mr-1" /> Limpar tudo
                </Button>
              </div>

              {/* Categories Filter */}
              <div className="mb-8">
                <h3 className="font-medium text-deep-navy mb-4 flex items-center">
                  <Tag className="h-4 w-4 mr-2 text-joy-orange" />
                  Categorias
                </h3>
                <div className="space-y-3 max-h-60 overflow-y-auto pr-2">
                  {categoriesWithCounts.length > 0 ? categoriesWithCounts.map((category) => (
                    <div key={category.id} className="flex items-center">
                      <Checkbox
                        id={`category-${category.id}`}
                        checked={selectedCategories.includes(category.id)}
                        onCheckedChange={() => handleCategoryToggle(category.id)}
                        className="h-4 w-4 rounded border-forest-green/50 data-[state=checked]:bg-joy-orange data-[state=checked]:border-joy-orange"
                      />
                      <Label
                        htmlFor={`category-${category.id}`}
                        className="ml-3 text-sm font-medium text-forest-green leading-none cursor-pointer flex-1 flex justify-between"
                      >
                        <span>{category.name}</span>
                        <span className="text-deep-navy/60">({category.count})</span>
                      </Label>
                    </div>
                  )) : null}
                </div>
              </div>

              {/* Price Range Filter */}
              <div className="mb-8">
                <h3 className="font-medium text-deep-navy mb-4 flex items-center">
                  <Tag className="h-4 w-4 mr-2 text-joy-orange" />
                  Faixa de Preço
                </h3>
                <div className="px-2">
                  <Slider
                    value={priceRange}
                    onValueChange={(value) => setPriceRange(value as [number, number])}
                    min={0}
                    max={1000}
                    step={10}
                    className="mb-4"
                  />
                  <div className="flex justify-between text-sm text-forest-green">
                    <span>{formatPrice(priceRange[0])}</span>
                    <span>{formatPrice(priceRange[1])}</span>
                  </div>
                </div>
              </div>

              {/* Brands Filter */}
              <div className="mb-8">
                <h3 className="font-medium text-deep-navy mb-4 flex items-center">
                  <Tag className="h-4 w-4 mr-2 text-joy-orange" />
                  Marcas
                </h3>
                <div className="space-y-3 max-h-60 overflow-y-auto pr-2">
                  {brands.map((brand) => (
                    <div key={brand.id} className="flex items-center">
                      <Checkbox
                        id={`brand-${brand.id}`}
                        checked={selectedBrands.includes(brand.id)}
                        onCheckedChange={() => handleBrandToggle(brand.id)}
                        className="h-4 w-4 rounded border-forest-green/50 data-[state=checked]:bg-joy-orange data-[state=checked]:border-joy-orange"
                      />
                      <Label
                        htmlFor={`brand-${brand.id}`}
                        className="ml-3 text-sm font-medium text-forest-green leading-none cursor-pointer flex-1 flex justify-between"
                      >
                        <span>{brand.name}</span>
                        <span className="text-deep-navy/60">({brand.count})</span>
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-4 bg-soft-cream/50 rounded-lg border border-joy-orange/20">
                <div className="flex items-start">
                  <div className="flex-shrink-0 mt-0.5">
                    <Check className="h-4 w-4 text-joy-orange" />
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-forest-green">
                      <span className="font-medium">Frete grátis</span> em compras acima de R$ 100,00
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Products Grid */}
          <div className="lg:w-3/4">
            {/* Sort and Results Info */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4 bg-white p-4 rounded-xl shadow-petjoy-soft">
              <div>
                <p className="text-forest-green">
                  Mostrando <span className="font-bold text-deep-navy">{filteredProducts().length}</span> {filteredProducts().length === 1 ? 'oferta' : 'ofertas'}
                  {selectedBrands.length > 0 && (
                    <span className="text-deep-navy/80"> em {selectedBrands.length} {selectedBrands.length === 1 ? 'marca' : 'marcas'}</span>
                  )}
                </p>
                {selectedBrands.length > 0 || selectedCategories.length > 0 || priceRange[0] > 0 || priceRange[1] < 1000 ? (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {selectedBrands.map(brandId => {
                      const brand = brands.find(b => b.id === brandId);
                      return brand ? (
                        <span 
                          key={brandId}
                          className="inline-flex items-center bg-joy-orange/10 text-joy-orange text-xs px-2.5 py-1 rounded-full"
                        >
                          {brand.name}
                          <button 
                            onClick={() => handleBrandToggle(brandId)}
                            className="ml-1.5 text-joy-orange/70 hover:text-joy-orange"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </span>
                      ) : null;
                    })}
                    {selectedCategories.map(categoryId => {
                      const category = categoriesWithCounts.find(c => c.id === categoryId);
                      return category ? (
                        <span 
                          key={categoryId}
                          className="inline-flex items-center bg-forest-green/10 text-forest-green text-xs px-2.5 py-1 rounded-full"
                        >
                          {category.name}
                          <button 
                            onClick={() => handleCategoryToggle(categoryId)}
                            className="ml-1.5 text-forest-green/70 hover:text-forest-green"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </span>
                      ) : null;
                    })}
                    {(priceRange[0] > 0 || priceRange[1] < 1000) && (
                      <span className="inline-flex items-center bg-deep-navy/10 text-deep-navy text-xs px-2.5 py-1 rounded-full">
                        {formatPrice(priceRange[0])} - {formatPrice(priceRange[1])}
                        <button 
                          onClick={() => setPriceRange([0, 1000])}
                          className="ml-1.5 text-deep-navy/70 hover:text-deep-navy"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </span>
                    )}
                  </div>
                ) : null}
              </div>
              <div className="flex items-center gap-2">
                <Label htmlFor="sort" className="text-forest-green whitespace-nowrap text-sm">
                  Ordenar por:
                </Label>
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-[180px] bg-white border-forest-green/20 hover:border-joy-orange/50">
                    <SelectValue placeholder="Selecione" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="discount-desc" className="focus:bg-joy-orange/10">Maior Desconto</SelectItem>
                    <SelectItem value="price-asc" className="focus:bg-joy-orange/10">Menor Preço</SelectItem>
                    <SelectItem value="price-desc" className="focus:bg-joy-orange/10">Maior Preço</SelectItem>
                    <SelectItem value="rating-desc" className="focus:bg-joy-orange/10">Melhor Avaliados</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Products Grid */}
            {filteredProducts().length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mt-8">
                {filteredProducts().map((product) => (
                  <ProductCard 
                    key={product.id}
                    id={product.id}
                    title={product.title}
                    slug={product.slug}
                    price={product.price}
                    originalPrice={product.originalPrice}
                    discount={product.discount}
                    images={product.images}
                    rating={product.rating}
                    reviewCount={product.reviewCount}
                    badges={product.badges}
                  />
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-xl p-12 text-center shadow-petjoy-soft">
                <div className="w-20 h-20 bg-joy-orange/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Search className="h-10 w-10 text-joy-orange" />
                </div>
                <h3 className="text-xl font-semibold text-deep-navy mb-2">Nenhuma oferta encontrada</h3>
                <p className="text-forest-green mb-6 max-w-md mx-auto">
                  Não encontramos produtos que correspondam aos filtros selecionados. Tente ajustar os filtros ou limpar tudo para ver todas as ofertas disponíveis.
                </p>
                <div className="flex gap-3 justify-center">
                  <Button
                    variant="outline"
                    className="border-joy-orange text-joy-orange hover:bg-joy-orange/10"
                    onClick={() => {
                      setSelectedBrands([]);
                      setSelectedCategories([]);
                      setPriceRange([0, 1000]);
                      setSearchQuery('');
                    }}
                  >
                    <X className="h-4 w-4 mr-1" /> Limpar Filtros
                  </Button>
                  <Link to="/produtos">
                    <Button className="bg-joy-orange hover:bg-joy-orange/90 text-white">
                      Ver todos os produtos
                    </Button>
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Newsletter */}
        <div className="mt-16 bg-gradient-to-r from-joy-orange/5 to-coral-red/5 rounded-2xl p-8 md:p-12 text-center">
          <div className="max-w-2xl mx-auto">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-joy-orange/10 rounded-full mb-6">
              <Zap className="h-8 w-8 text-joy-orange" />
            </div>
            <h3 className="text-2xl md:text-3xl font-bold text-deep-navy mb-3">Não perca nossas ofertas!</h3>
            <p className="text-forest-green mb-6 max-w-lg mx-auto">
              Cadastre-se para receber ofertas exclusivas, descontos especiais e atualizações de produtos em primeira mão.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <Input 
                type="email" 
                placeholder="Seu melhor e-mail" 
                className="flex-1 bg-white border-gray-200 focus:border-joy-orange focus:ring-joy-orange/50"
              />
              <Button className="bg-joy-orange hover:bg-joy-orange/90 text-white whitespace-nowrap">
                Quero receber ofertas
              </Button>
            </div>
            <p className="text-xs text-gray-500 mt-3">
              Ao se inscrever, você concorda com nossa Política de Privacidade.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OfertasPage;
