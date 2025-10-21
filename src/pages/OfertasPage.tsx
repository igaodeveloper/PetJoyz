import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Filter, Search, X, ArrowDown, ArrowUp, ChevronDown, ChevronUp, ChevronRight, Clock, Zap, Tag, Check, Star, ArrowRight, Truck } from 'lucide-react';
import ProductCard from '../components/ProductCard';
import { Button } from '../components/ui/button';
import AnimatedSection from '../components/AnimatedSection';
import { buttonElevate } from '../lib/animations';
import { Input } from '../components/ui/input';
import { Checkbox } from '../components/ui/checkbox';
import { Label } from '../components/ui/label';
import { Slider } from '../components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import api from '../services/api';

// Type for time left in countdown
interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

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

interface ProductVariant {
  id: string;
  name: string;
  price: number;
  stock: number;
  [key: string]: any;
}

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
  variants: ProductVariant[];
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

const OfertasPage: React.FC = () => {
  // State declarations with proper types
  const [products, setProducts] = useState<Product[]>([]);
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000]);
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<string>('discount-desc');
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [categoriesWithCounts, setCategoriesWithCounts] = useState<Category[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  
  // Countdown timer state
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  // Countdown timer effect
  useEffect(() => {
    const calculateTimeLeft = (): void => {
      const difference = +new Date('2025-12-31') - +new Date();
      let timeLeft: TimeLeft = {
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0
      };

      if (difference > 0) {
        timeLeft = {
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60)
        };
      }

      setTimeLeft(timeLeft);
    };

    const timer = setInterval(calculateTimeLeft, 1000);
    // Initial call to set the time immediately
    calculateTimeLeft();
    // Cleanup interval on component unmount
    return () => clearInterval(timer);
  }, []);

  // Load products on component mount
  useEffect(() => {
    let isMounted = true;
    
    const loadProducts = async (): Promise<void> => {
      try {
        setLoading(true);
        
        // Fetch products, categories, and brands in parallel
        const [allProducts, categories, brands] = await Promise.all([
          api.getSpecialOffers(200).catch<unknown[]>(() => []),
          api.getCategories().catch<unknown[]>(() => []),
          api.getBrands().catch<unknown[]>(() => [])
        ]);

        if (!isMounted) return;

        // Type assertions for API responses
        const cats = Array.isArray(categories) ? categories : [];
        const bds = Array.isArray(brands) ? brands : [];

        // Process and filter products
        const discountedProducts = (Array.isArray(allProducts) ? allProducts : [])
          .filter((product: any) => (product?.discount || 0) > 0)
          .map((product: any): Product => ({
            id: String(product.id || ''),
            title: String(product.title || ''),
            slug: String(product.slug || ''),
            description: String(product.description || ''),
            price: Number(product.price) || 0,
            currency: 'BRL',
            images: Array.isArray(product.images) ? product.images : [],
            category: String(product.category || ''),
            badges: Array.isArray(product.badges) ? product.badges : [],
            tags: Array.isArray(product.tags) ? product.tags : [],
            rating: Number(product.rating) || 0,
            reviewCount: Number(product.reviewCount) || 0,
            stock: Number(product.stock) || 0,
            variants: Array.isArray(product.variants) ? product.variants : [],
            originalPrice: Number(product.originalPrice) || 0,
            discount: Number(product.discount) || 0,
            brand: String(product.brand || ''),
            image: product.images?.[0] || ''
          }));

        // Sort products by discount
        const sortedByDiscount = [...discountedProducts].sort(
          (a, b) => (b.discount || 0) - (a.discount || 0)
        );

        // Calculate category counts
        const categoryCounts: Record<string, number> = {};
        sortedByDiscount.forEach(product => {
          if (product.category) {
            categoryCounts[product.category] = (categoryCounts[product.category] || 0) + 1;
          }
        });

        // Update categories with counts
        const updatedCategories = cats
          .filter((cat: any) => cat?.id)
          .map((category: any) => ({
            id: String(category.id),
            name: String(category.name || ''),
            slug: String(category.slug || ''),
            description: String(category.description || ''),
            icon: String(category.icon || ''),
            count: categoryCounts[String(category.id)] || 0
          }));

        // Update brands with proper typing
        const formattedBrands = bds
          .filter((brand: any) => brand?.id)
          .map((brand: any) => ({
            id: String(brand.id),
            name: String(brand.name || ''),
            count: Number(brand.count) || 0,
            slug: String(brand.slug || ''),
            logo: String(brand.logo || '')
          }));

        // Update state
        setCategoriesWithCounts(updatedCategories);
        setBrands(formattedBrands);
        setFeaturedProducts(sortedByDiscount.slice(0, 4));
        setProducts(sortedByDiscount);
      } catch (error) {
        console.error('Error loading products:', error);
        if (isMounted) {
          setCategoriesWithCounts([]);
          setFeaturedProducts([]);
          setProducts([]);
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    loadProducts().catch(console.error);
    
    // Cleanup function
    return () => {
      isMounted = false;
    };
  }, []);

  // Toggle brand filter
  const handleBrandToggle = (brandId: string): void => {
    setSelectedBrands(prev => 
      prev.includes(brandId) 
        ? prev.filter(id => id !== brandId)
        : [...prev, brandId]
    );
    // Reset to first page when filters change
    // setCurrentPage(1);
  };

  // Toggle category filter
  const handleCategoryToggle = (categoryId: string): void => {
    setSelectedCategories(prev => 
      prev.includes(categoryId)
        ? prev.filter(id => id !== categoryId)
        : [...prev, categoryId]
    );
    // Reset to first page when filters change
    // setCurrentPage(1);
  };

  // Filtrar produtos com base nos filtros selecionados
  const getFilteredProducts = useCallback((): Product[] => {
    if (!products) return [];
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

  // Get filtered products
  const filtered = useMemo(() => getFilteredProducts(), [
    products, 
    selectedBrands, 
    selectedCategories, 
    priceRange, 
    searchQuery
  ]);

  // Sort filtered products
  const filteredProducts: Product[] = useMemo(() => {
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
          return aPrice - bPrice;
        case 'price-desc':
          return bPrice - aPrice;
        case 'discount-desc':
          return bDiscount - aDiscount;
        case 'rating-desc':
          return bRating - aRating;
        default:
          return 0;
      }
    });
  }, [filtered, sortBy]);

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
              <div className="text-center md:text-left mb-4 md:mb-0">
                <h1 className="text-2xl md:text-3xl font-bold mb-2">Ofertas Relâmpago</h1>
                <p className="text-orange-100">Descontos imperdíveis por tempo limitado</p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm px-6 py-3 rounded-full">
                <div className="flex items-center space-x-1">
                  <Clock className="h-5 w-5 text-white/90" />
                  <span className="font-mono text-xl font-bold tracking-wider">
                    {timeLeft?.days || 0}d {timeLeft?.hours || 0}h {timeLeft?.minutes || 0}m {timeLeft?.seconds || 0}s
                  </span>
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
                          src={product.image || product.images?.[0] || '/images/placeholder-product.jpg'}
                          alt={product.title || 'Produto'}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          loading="lazy"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.src = '/images/placeholder-product.jpg';
                            target.alt = 'Imagem não disponível';
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
                  Mostrando <span className="font-bold text-deep-navy">{filteredProducts.length}</span> {filteredProducts.length === 1 ? 'oferta' : 'ofertas'}
                  {selectedBrands.length > 0 && (
                    <span className="text-deep-navy/80"> em {selectedBrands.length} {selectedBrands.length === 1 ? 'marca' : 'marcas'}</span>
                  )}
                </p>
                {(selectedBrands.length > 0 || selectedCategories.length > 0 || priceRange[0] > 0 || priceRange[1] < 1000) && (
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
                )}
              </div>
            </div>
            <div className="flex items-center gap-2">
              <label htmlFor="sort" className="text-sm font-medium text-deep-navy mr-2 whitespace-nowrap">
                Ordenar por:
              </label>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-[180px] border-deep-navy/20 focus:ring-2 focus:ring-joy-orange/50 focus:border-joy-orange">
                  <SelectValue placeholder="Selecione" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="discount-desc">Maior desconto</SelectItem>
                  <SelectItem value="price-asc">Menor preço</SelectItem>
                  <SelectItem value="price-desc">Maior preço</SelectItem>
                  <SelectItem value="name-asc">Nome (A-Z)</SelectItem>
                  <SelectItem value="name-desc">Nome (Z-A)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Products Grid */}
            {filteredProducts.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mt-8">
                {filteredProducts.map((product: Product) => (
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
                <p className="text-gray-600 mb-4">Nenhum produto encontrado com os filtros atuais.</p>
                <Button 
                  variant="outline" 
                  className="border-joy-orange text-joy-orange hover:bg-joy-orange/10"
                  onClick={() => {
                    setSelectedBrands([]);
                    setSelectedCategories([]);
                  }}
                >
                  Limpar filtros
                </Button>
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
                aria-label="Digite seu e-mail para receber ofertas"
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
