import { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Filter, Search, X, ArrowDown, ArrowUp, ChevronDown, ChevronUp, ChevronRight } from 'lucide-react';
import ProductCard from '../components/ProductCard';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Checkbox } from '../components/ui/checkbox';
import { Label } from '../components/ui/label';
import { Slider } from '../components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import productsData from '../data/products.json';
import categoriesData from '../data/categories.json';
import brandsData from '../data/brands.json';

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
  variants: Array<{
    size?: string;
    color?: string;
  }>;
};

type FilterOption = {
  id: string;
  label: string;
  count: number;
};

type PriceRange = [number, number];

export default function ProductsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  
  // Sample brands data
  const brands = [
    { id: 'royal-canin', label: 'Royal Canin' },
    { id: 'whiskas', label: 'Whiskas' },
    { id: 'pedigree', label: 'Pedigree' },
    { id: 'hills', label: 'Hills Science Diet' },
    { id: 'purina', label: 'Purina' },
  ].map(brand => ({
    ...brand,
    count: Math.floor(Math.random() * 50) + 10 // Random count for demo
  }));
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [priceRange, setPriceRange] = useState<PriceRange>([0, 1000]);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOption, setSortOption] = useState('featured');
  const [isCategoryOpen, setIsCategoryOpen] = useState(true);
  const [isPriceOpen, setIsPriceOpen] = useState(true);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [isBrandOpen, setIsBrandOpen] = useState(true);

  // Get all unique categories from products
  const categories = Array.from(new Set(productsData.map(p => p.category)))
    .map(category => ({
      id: category,
      label: categoriesData.find(c => c.id === category)?.name || category,
      count: productsData.filter(p => p.category === category).length
    }));

  // Apply filters
  const filteredProducts = productsData.filter(product => {
    // Filter by search query
    if (searchQuery && !product.title.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    
    // Filter by price range
    if (product.price < priceRange[0] * 100 || product.price > priceRange[1] * 100) {
      return false;
    }
    
    // Filter by categories if any are selected
    if (selectedCategories.length > 0 && !selectedCategories.includes(product.category)) {
      return false;
    }
    
    // Filter by brands if any are selected
    if (selectedBrands.length > 0 && !selectedBrands.some(brand => product.badges.includes(brand))) {
      return false;
    }
    
    return true;
  });

  // Sort products
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortOption) {
      case 'price-asc':
        return a.price - b.price;
      case 'price-desc':
        return b.price - a.price;
      case 'rating':
        return b.rating - a.rating;
      case 'reviews':
        return b.reviewCount - a.reviewCount;
      default: // 'featured'
        return 0; // Keep original order for featured
    }
  });

  // Handle filter changes
  const handlePriceChange = (value: number[]) => {
    setPriceRange([value[0], value[1]]);
  };

  const handleCategoryChange = (categoryId: string, isChecked: boolean) => {
    setSelectedCategories(prev => 
      isChecked 
        ? [...prev, categoryId] 
        : prev.filter(id => id !== categoryId)
    );
  };

  const handleBrandChange = (brandId: string, isChecked: boolean) => {
    setSelectedBrands(prev => 
      isChecked 
        ? [...prev, brandId] 
        : prev.filter(id => id !== brandId)
    );
  };

  const clearFilters = () => {
    setPriceRange([0, 1000]);
    setSearchQuery('');
    setSelectedCategories([]);
    setSelectedBrands([]);
  };

  // Format price for display
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(price);
  };

  return (
    <div className="bg-soft-cream min-h-screen">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-baseline justify-between border-b border-gray-200 pb-6 pt-12">
          <h1 className="text-4xl font-bold tracking-tight text-deep-navy">
            Nossos Produtos
          </h1>

          <div className="flex items-center">
            <div className="relative w-64">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <Input
                type="text"
                placeholder="Buscar produtos..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-petjoy focus:ring-2 focus:ring-joy-orange focus:border-transparent"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            <div className="ml-4">
              <Select onValueChange={setSortOption} defaultValue="featured">
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Ordenar por" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="featured">Destaques</SelectItem>
                  <SelectItem value="price-asc">Preço: Menor para maior</SelectItem>
                  <SelectItem value="price-desc">Preço: Maior para menor</SelectItem>
                  <SelectItem value="rating">Melhores avaliações</SelectItem>
                  <SelectItem value="reviews">Mais vendidos</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <Button 
              variant="outline" 
              className="ml-4 lg:hidden"
              onClick={() => setMobileFiltersOpen(true)}
            >
              <Filter className="h-4 w-4 mr-2" />
              Filtros
            </Button>
          </div>
        </div>

        <section className="pb-24 pt-6">
          <div className="grid grid-cols-1 gap-x-8 gap-y-10 lg:grid-cols-4">
            {/* Filters - Desktop */}
            <div className="hidden lg:block">
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-medium text-deep-navy">Filtros</h2>
                  {(priceRange[0] > 0 || priceRange[1] < 1000) && (
                    <button 
                      type="button" 
                      className="text-sm font-medium text-joy-orange hover:text-aqua-mint"
                      onClick={clearFilters}
                    >
                      Limpar tudo
                    </button>
                  )}
                </div>

                {/* Categories */}
                <div className="border-b border-gray-200 pb-6">
                  <button 
                    type="button" 
                    className="flex w-full items-center justify-between py-3 text-sm text-gray-400 hover:text-gray-500"
                    onClick={() => setIsCategoryOpen(!isCategoryOpen)}
                  >
                    <span className="font-medium text-gray-900">Categorias</span>
                    {isCategoryOpen ? (
                      <ChevronUp className="h-5 w-5" />
                    ) : (
                      <ChevronDown className="h-5 w-5" />
                    )}
                  </button>
                  
                  {isCategoryOpen && (
                    <div className="pt-4 space-y-4">
                      {categories.map((category) => (
                        <div key={category.id} className="flex items-center">
                          <Checkbox 
                            id={`category-${category.id}`} 
                            className="h-4 w-4 rounded border-gray-300 text-joy-orange focus:ring-joy-orange"
                            checked={selectedCategories.includes(category.id)}
                            onCheckedChange={(checked) => handleCategoryChange(category.id, checked as boolean)}
                          />
                          <Label 
                            htmlFor={`category-${category.id}`} 
                            className="ml-3 text-sm text-gray-600 cursor-pointer hover:text-deep-navy"
                          >
                            {category.label} <span className="text-gray-400 ml-1">({category.count})</span>
                          </Label>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Price Range */}
                <div className="border-b border-gray-200 pb-6">
                  <button 
                    type="button" 
                    className="flex w-full items-center justify-between py-3 text-sm text-gray-400 hover:text-gray-500"
                    onClick={() => setIsPriceOpen(!isPriceOpen)}
                  >
                    <span className="font-medium text-gray-900">Faixa de Preço</span>
                    {isPriceOpen ? (
                      <ChevronUp className="h-5 w-5" />
                    ) : (
                      <ChevronDown className="h-5 w-5" />
                    )}
                  </button>
                  
                  {isPriceOpen && (
                    <div className="pt-4 space-y-4">
                      <div className="px-1">
                        <Slider
                          min={0}
                          max={1000}
                          step={10}
                          value={priceRange}
                          onValueChange={handlePriceChange}
                          className="py-4"
                        />
                        <div className="flex justify-between text-sm text-gray-600">
                          <span>{formatPrice(priceRange[0])}</span>
                          <span>{formatPrice(priceRange[1])}</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Brands */}
                <div className="border-b border-gray-200 pb-6">
                  <button 
                    type="button" 
                    className="flex w-full items-center justify-between py-3 text-sm text-gray-400 hover:text-gray-500"
                    onClick={() => setIsBrandOpen(!isBrandOpen)}
                  >
                    <span className="font-medium text-gray-900">Marcas</span>
                    {isBrandOpen ? (
                      <ChevronUp className="h-5 w-5" />
                    ) : (
                      <ChevronDown className="h-5 w-5" />
                    )}
                  </button>
                  
                  {isBrandOpen && (
                    <div className="pt-4 space-y-4">
                      {brands.map((brand) => (
                        <div key={brand.id} className="flex items-center">
                          <Checkbox 
                            id={`brand-${brand.id}`} 
                            className="h-4 w-4 rounded border-gray-300 text-joy-orange focus:ring-joy-orange"
                            checked={selectedBrands.includes(brand.id)}
                            onCheckedChange={(checked) => handleBrandChange(brand.id, checked as boolean)}
                          />
                          <Label 
                            htmlFor={`brand-${brand.id}`} 
                            className="ml-3 text-sm text-gray-600 cursor-pointer hover:text-deep-navy"
                          >
                            {brand.label} <span className="text-gray-400 ml-1">({brand.count})</span>
                          </Label>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Product grid */}
            <div className="lg:col-span-3">
              {sortedProducts.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {sortedProducts.map((product) => (
                    <ProductCard key={product.id} {...product} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <p className="text-lg text-gray-500">Nenhum produto encontrado com os filtros selecionados.</p>
                  <Button 
                    variant="outline" 
                    className="mt-4 text-joy-orange border-joy-orange hover:bg-joy-orange/10"
                    onClick={clearFilters}
                  >
                    Limpar filtros
                  </Button>
                </div>
              )}
            </div>
          </div>
        </section>
      </div>

      {/* Mobile filter dialog */}
      <div className={`fixed inset-0 z-40 lg:hidden ${mobileFiltersOpen ? 'block' : 'hidden'}`}>
        <div className="fixed inset-0 bg-black bg-opacity-25" onClick={() => setMobileFiltersOpen(false)} />
        
        <div className="fixed inset-y-0 left-0 z-50 flex w-full max-w-xs flex-col overflow-y-auto bg-white pb-12 shadow-xl">
          <div className="flex items-center justify-between px-4 py-4 border-b">
            <h2 className="text-lg font-medium text-gray-900">Filtros</h2>
            <button
              type="button"
              className="-mr-2 flex h-10 w-10 items-center justify-center rounded-md bg-white p-2 text-gray-400"
              onClick={() => setMobileFiltersOpen(false)}
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          <div className="p-4 space-y-6">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <Input
                type="text"
                placeholder="Buscar produtos..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-petjoy focus:ring-2 focus:ring-joy-orange focus:border-transparent"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            {/* Categories */}
            <div>
              <button 
                type="button" 
                className="flex w-full items-center justify-between py-3 text-sm text-gray-900"
                onClick={() => setIsCategoryOpen(!isCategoryOpen)}
              >
                <span className="font-medium">Categorias</span>
                {isCategoryOpen ? (
                  <ChevronUp className="h-5 w-5" />
                ) : (
                  <ChevronDown className="h-5 w-5" />
                )}
              </button>
              
              {isCategoryOpen && (
                <div className="pt-2 space-y-3">
                  {categories.map((category) => (
                    <div key={category.id} className="flex items-center">
                      <Checkbox 
                        id={`mobile-category-${category.id}`} 
                        className="h-4 w-4 rounded border-gray-300 text-joy-orange focus:ring-joy-orange"
                        checked={selectedCategories.includes(category.id)}
                        onCheckedChange={(checked) => handleCategoryChange(category.id, checked as boolean)}
                      />
                      <Label 
                        htmlFor={`mobile-category-${category.id}`} 
                        className="ml-3 text-sm text-gray-600 cursor-pointer hover:text-deep-navy"
                      >
                        {category.label} <span className="text-gray-400 ml-1">({category.count})</span>
                      </Label>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Price Range */}
            <div>
              <button 
                type="button" 
                className="flex w-full items-center justify-between py-3 text-sm text-gray-900"
                onClick={() => setIsPriceOpen(!isPriceOpen)}
              >
                <span className="font-medium">Faixa de Preço</span>
                {isPriceOpen ? (
                  <ChevronUp className="h-5 w-5" />
                ) : (
                  <ChevronDown className="h-5 w-5" />
                )}
              </button>
              
              {isPriceOpen && (
                <div className="pt-2 space-y-4">
                  <div className="px-1">
                    <Slider
                      min={0}
                      max={1000}
                      step={10}
                      value={priceRange}
                      onValueChange={handlePriceChange}
                      className="py-4"
                    />
                    <div className="flex justify-between text-sm text-gray-600">
                      <span>{formatPrice(priceRange[0])}</span>
                      <span>{formatPrice(priceRange[1])}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Brands */}
            <div>
              <button 
                type="button" 
                className="flex w-full items-center justify-between py-3 text-sm text-gray-900"
                onClick={() => setIsBrandOpen(!isBrandOpen)}
              >
                <span className="font-medium">Marcas</span>
                {isBrandOpen ? (
                  <ChevronUp className="h-5 w-5" />
                ) : (
                  <ChevronDown className="h-5 w-5" />
                )}
              </button>
              
              {isBrandOpen && (
                <div className="pt-2 space-y-3">
                  {brands.map((brand) => (
                    <div key={brand.id} className="flex items-center">
                      <Checkbox 
                        id={`mobile-brand-${brand.id}`} 
                        className="h-4 w-4 rounded border-gray-300 text-joy-orange focus:ring-joy-orange"
                        checked={selectedBrands.includes(brand.id)}
                        onCheckedChange={(checked) => handleBrandChange(brand.id, checked as boolean)}
                      />
                      <Label 
                        htmlFor={`mobile-brand-${brand.id}`} 
                        className="ml-3 text-sm text-gray-600 cursor-pointer hover:text-deep-navy"
                      >
                        {brand.label} <span className="text-gray-400 ml-1">({brand.count})</span>
                      </Label>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Apply Filters Button */}
            <div className="pt-4 border-t">
              <Button 
                className="w-full bg-joy-orange hover:bg-aqua-mint text-white"
                onClick={() => setMobileFiltersOpen(false)}
              >
                Aplicar Filtros
              </Button>
              
              {(selectedCategories.length > 0 || selectedBrands.length > 0 || priceRange[0] > 0 || priceRange[1] < 1000) && (
                <Button 
                  variant="outline" 
                  className="w-full mt-2 text-joy-orange border-joy-orange hover:bg-joy-orange/10"
                  onClick={clearFilters}
                >
                  Limpar filtros
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
