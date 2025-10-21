import { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Filter, Search, X, ChevronDown, ChevronUp, Loader2 } from 'lucide-react';
import ProductCard from '../components/ProductCard';
import { Button } from '../components/ui/button';
import AnimatedSection from '../components/AnimatedSection';
import { Input } from '../components/ui/input';
import { Checkbox } from '../components/ui/checkbox';
import { Label } from '../components/ui/label';
import { Slider } from '../components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { api, Product, Category, Brand } from '../services/api';

type PriceRange = [number, number];

interface FilterOption {
  id: string;
  name: string;
  slug: string;
  productCount: number;
}

export default function ProductsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Data states
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<FilterOption[]>([]);
  const [brands, setBrands] = useState<FilterOption[]>([]);
  
  // UI states
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [priceRange, setPriceRange] = useState<PriceRange>([0, 1000]);
  const [sortOption, setSortOption] = useState('featured');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  // Load initial data
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        
        // Fetch all data in parallel
        const [productsResponse, categoriesResponse, brandsResponse] = await Promise.all([
          api.getProducts(),
          api.getCategories(),
          api.getBrands()
        ]);
        
        // Process products
        setProducts(productsResponse);
        setFilteredProducts(productsResponse);
        
        // Process categories with product counts
        const processedCategories = categoriesResponse.map(category => ({
          id: category.id,
          name: category.name,
          slug: category.slug,
          productCount: productsResponse.filter(p => p.categoryId === category.id).length
        }));
        setCategories(processedCategories);
        
        // Process brands with product counts
        const processedBrands = brandsResponse.map(brand => ({
          id: brand.id,
          name: brand.name,
          slug: brand.slug,
          productCount: productsResponse.filter(p => p.brandId === brand.id).length
        }));
        setBrands(processedBrands);
        
        // Set initial price range based on products
        if (productsResponse.length > 0) {
          const prices = productsResponse.map(p => p.price);
          const minPrice = Math.floor(Math.min(...prices) / 100) * 100;
          const maxPrice = Math.ceil(Math.max(...prices) / 100) * 100;
          setPriceRange([minPrice, maxPrice]);
        }
        
        setError(null);
      } catch (err) {
        console.error('Error loading data:', err);
        setError('Erro ao carregar os dados. Por favor, tente novamente mais tarde.');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, []);

  // Apply filters when filters change
  useEffect(() => {
    if (isLoading) return;
    
    const filtered = products.filter(product => {
      // Apply search filter
      if (searchQuery) {
        const searchLower = searchQuery.toLowerCase();
        const matchesSearch = 
          product.title.toLowerCase().includes(searchLower) ||
          product.description.toLowerCase().includes(searchLower);
        
        if (!matchesSearch) return false;
      }
      
      // Filter by price range
      if (product.price < priceRange[0] || product.price > priceRange[1]) {
        return false;
      }
      
      // Filter by categories if any are selected
      if (selectedCategories.length > 0 && !selectedCategories.includes(product.categoryId)) {
        return false;
      }
      
      // Filter by brands if any are selected
      if (selectedBrands.length > 0 && !selectedBrands.includes(product.brandId)) {
        return false;
      }
      
      return true;
    });
    
    // Apply sorting
    const sortedProducts = [...filtered].sort((a, b) => {
      switch (sortOption) {
        case 'price-asc':
          return a.price - b.price;
        case 'price-desc':
          return b.price - a.price;
        case 'name-asc':
          return a.title.localeCompare(b.title);
        case 'name-desc':
          return b.title.localeCompare(a.title);
        case 'rating':
          return b.rating - a.rating;
        default: // 'featured'
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }
    });
    
    setFilteredProducts(sortedProducts);
  }, [products, searchQuery, priceRange, selectedCategories, selectedBrands, sortOption, isLoading]);

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
    setSearchQuery('');
    setSelectedCategories([]);
    setSelectedBrands([]);
    
    // Reset price range to min/max
    if (products.length > 0) {
      const prices = products.map(p => p.price);
      const minPrice = Math.floor(Math.min(...prices) / 100) * 100;
      const maxPrice = Math.ceil(Math.max(...prices) / 100) * 100;
      setPriceRange([minPrice, maxPrice]);
    } else {
      setPriceRange([0, 1000]);
    }
    
    setSortOption('featured');
  };
  
  // Format price for display
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(price / 100);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
          <p className="text-lg">Carregando produtos...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center p-6 bg-red-50 rounded-lg max-w-md">
          <h2 className="text-xl font-bold text-red-600 mb-2">Erro ao carregar</h2>
          <p className="text-red-700 mb-4">{error}</p>
          <Button 
            variant="outline" 
            onClick={() => window.location.reload()}
            className="border-red-300 text-red-700 hover:bg-red-50"
          >
            Tentar novamente
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white">
      <div>
        {/* Mobile filter dialog */}
        <div className="relative z-40 lg:hidden">
          <div className={`fixed inset-0 bg-black bg-opacity-25 ${mobileFiltersOpen ? 'block' : 'hidden'}`} />
          <div className="fixed inset-0 z-40 flex">
            <div className="relative ml-auto flex h-full w-full max-w-xs flex-col overflow-y-auto bg-white py-4 pb-12 shadow-xl">
              <div className="flex items-center justify-between px-4">
                <h2 className="text-lg font-medium text-gray-900">Filtros</h2>
                <button
                  type="button"
                  className="-mr-2 flex h-10 w-10 items-center justify-center rounded-md bg-white p-2 text-gray-400"
                  onClick={() => setMobileFiltersOpen(false)}
                >
                  <span className="sr-only">Fechar menu</span>
                  <X className="h-6 w-6" aria-hidden="true" />
                </button>
              </div>

              {/* Filters */}
              <div className="mt-4 border-t border-gray-200">
                <h3 className="sr-only">Categorias</h3>
                <ul role="list" className="px-2 py-3 font-medium text-gray-900">
                  {categories.map((category) => (
                    <li key={category.id}>
                      <div className="flex items-center">
                        <Checkbox
                          id={`mobile-category-${category.id}`}
                          checked={selectedCategories.includes(category.id)}
                          onCheckedChange={(checked) => handleCategoryChange(category.id, checked as boolean)}
                          className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                        />
                        <label
                          htmlFor={`mobile-category-${category.id}`}
                          className="ml-3 min-w-0 flex-1 text-gray-600"
                        >
                          {category.name}
                        </label>
                        <span className="ml-2 text-sm text-gray-500">
                          {category.productCount}
                        </span>
                      </div>
                    </li>
                  ))}
                </ul>

                <div className="border-t border-gray-200 px-4 py-6">
                  <h3 className="-mx-2 -my-3 flow-root">
                    <button
                      type="button"
                      className="flex w-full items-center justify-between bg-white px-2 py-3 text-gray-400 hover:text-gray-500"
                      aria-expanded="false"
                    >
                      <span className="font-medium text-gray-900">Preço</span>
                      <span className="ml-6 flex items-center">
                        <ChevronDown className="h-5 w-5" aria-hidden="true" />
                      </span>
                    </button>
                  </h3>
                  <div className="pt-6">
                    <div className="space-y-4">
                      <Slider
                        value={priceRange}
                        min={0}
                        max={Math.ceil(priceRange[1] / 1000) * 1000}
                        step={10}
                        onValueChange={handlePriceChange}
                        className="w-full"
                      />
                      <div className="flex justify-between text-sm text-gray-500">
                        <span>{formatPrice(priceRange[0])}</span>
                        <span>{formatPrice(priceRange[1])}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="border-t border-gray-200 px-4 py-6">
                  <h3 className="-mx-2 -my-3 flow-root">
                    <button
                      type="button"
                      className="flex w-full items-center justify-between bg-white px-2 py-3 text-gray-400 hover:text-gray-500"
                      aria-expanded="false"
                    >
                      <span className="font-medium text-gray-900">Marcas</span>
                      <span className="ml-6 flex items-center">
                        <ChevronDown className="h-5 w-5" aria-hidden="true" />
                      </span>
                    </button>
                  </h3>
                  <div className="pt-6">
                    <div className="space-y-4">
                      {brands.map((brand) => (
                        <div key={brand.id} className="flex items-center">
                          <Checkbox
                            id={`mobile-brand-${brand.id}`}
                            checked={selectedBrands.includes(brand.id)}
                            onCheckedChange={(checked) => handleBrandChange(brand.id, checked as boolean)}
                            className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                          />
                          <label
                            htmlFor={`mobile-brand-${brand.id}`}
                            className="ml-3 text-sm text-gray-600"
                          >
                            {brand.name}
                          </label>
                          <span className="ml-2 text-sm text-gray-500">
                            ({brand.productCount})
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <AnimatedSection className="flex items-baseline justify-between border-b border-gray-200 pb-6 pt-10">
            <h1 className="text-4xl font-bold tracking-tight text-gray-900">Produtos</h1>

            <div className="flex items-center">
              <div className="relative inline-block text-left">
                <div>
                  <Select
                    value={sortOption}
                    onValueChange={(value) => setSortOption(value)}
                  >
                    <SelectTrigger className="w-[200px]">
                      <SelectValue placeholder="Ordenar por" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="featured">Destaque</SelectItem>
                      <SelectItem value="price-asc">Preço: Menor para maior</SelectItem>
                      <SelectItem value="price-desc">Preço: Maior para menor</SelectItem>
                      <SelectItem value="name-asc">Nome: A-Z</SelectItem>
                      <SelectItem value="name-desc">Nome: Z-A</SelectItem>
                      <SelectItem value="rating">Avaliações</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <button
                type="button"
                className="-m-2 ml-4 p-2 text-gray-400 hover:text-gray-500 sm:ml-6 lg:hidden"
                onClick={() => setMobileFiltersOpen(true)}
              >
                <span className="sr-only">Filtros</span>
                <Filter className="h-5 w-5" aria-hidden="true" />
              </button>
            </div>
          </AnimatedSection>

          <AnimatedSection className="pb-24 pt-6" stagger>
            <section aria-labelledby="products-heading">
              <div className="grid grid-cols-1 gap-x-8 gap-y-10 lg:grid-cols-4">
                {/* Filters */}
                <div className="hidden lg:block">
                  <div className="space-y-6 border-b border-gray-200 pb-6">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-medium text-gray-900">Filtros</h3>
                      <button
                        type="button"
                        onClick={clearFilters}
                        className="text-sm font-medium text-primary hover:text-primary/80"
                      >
                        Limpar tudo
                      </button>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <label htmlFor="search" className="sr-only">
                          Buscar produtos
                        </label>
                        <div className="relative">
                          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                            <Search className="h-5 w-5 text-gray-400" aria-hidden="true" />
                          </div>
                          <input
                            id="search"
                            name="search"
                            className="block w-full rounded-md border-0 bg-white py-1.5 pl-10 pr-3 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary sm:text-sm sm:leading-6"
                            placeholder="Buscar produtos..."
                            type="search"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="border-b border-gray-200 py-6">
                    <h3 className="-my-3 flow-root">
                      <button
                        type="button"
                        className="flex w-full items-center justify-between bg-white py-3 text-sm text-gray-400 hover:text-gray-500"
                        aria-controls="filter-section-0"
                        aria-expanded="false"
                      >
                        <span className="font-medium text-gray-900">Categorias</span>
                        <span className="ml-6 flex items-center">
                          <ChevronDown className="h-5 w-5" aria-hidden="true" />
                        </span>
                      </button>
                    </h3>
                    <div className="pt-6" id="filter-section-0">
                      <div className="space-y-4">
                        {categories.map((category) => (
                          <div key={category.id} className="flex items-center">
                            <Checkbox
                              id={`category-${category.id}`}
                              checked={selectedCategories.includes(category.id)}
                              onCheckedChange={(checked) => handleCategoryChange(category.id, checked as boolean)}
                              className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                            />
                            <label
                              htmlFor={`category-${category.id}`}
                              className="ml-3 text-sm text-gray-600"
                            >
                              {category.name}
                            </label>
                            <span className="ml-2 text-sm text-gray-500">
                              ({category.productCount})
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="border-b border-gray-200 py-6">
                    <h3 className="-my-3 flow-root">
                      <button
                        type="button"
                        className="flex w-full items-center justify-between bg-white py-3 text-sm text-gray-400 hover:text-gray-500"
                        aria-controls="filter-section-1"
                        aria-expanded="false"
                      >
                        <span className="font-medium text-gray-900">Preço</span>
                        <span className="ml-6 flex items-center">
                          <ChevronDown className="h-5 w-5" aria-hidden="true" />
                        </span>
                      </button>
                    </h3>
                    <div className="pt-6" id="filter-section-1">
                      <div className="space-y-4">
                        <Slider
                          value={priceRange}
                          min={0}
                          max={Math.ceil(priceRange[1] / 1000) * 1000}
                          step={10}
                          onValueChange={handlePriceChange}
                          className="w-full"
                        />
                        <div className="flex justify-between text-sm text-gray-500">
                          <span>{formatPrice(priceRange[0])}</span>
                          <span>{formatPrice(priceRange[1])}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="border-b border-gray-200 py-6">
                    <h3 className="-my-3 flow-root">
                      <button
                        type="button"
                        className="flex w-full items-center justify-between bg-white py-3 text-sm text-gray-400 hover:text-gray-500"
                        aria-controls="filter-section-2"
                        aria-expanded="false"
                      >
                        <span className="font-medium text-gray-900">Marcas</span>
                        <span className="ml-6 flex items-center">
                          <ChevronDown className="h-5 w-5" aria-hidden="true" />
                        </span>
                      </button>
                    </h3>
                    <div className="pt-6" id="filter-section-2">
                      <div className="space-y-4">
                        {brands.map((brand) => (
                          <div key={brand.id} className="flex items-center">
                            <Checkbox
                              id={`brand-${brand.id}`}
                              checked={selectedBrands.includes(brand.id)}
                              onCheckedChange={(checked) => handleBrandChange(brand.id, checked as boolean)}
                              className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                            />
                            <label
                              htmlFor={`brand-${brand.id}`}
                              className="ml-3 text-sm text-gray-600"
                            >
                              {brand.name}
                            </label>
                            <span className="ml-2 text-sm text-gray-500">
                              ({brand.productCount})
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Product grid */}
                <div className="lg:col-span-3">
                  {filteredProducts.length > 0 ? (
                    <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:gap-x-8">
                      {filteredProducts.map((product) => (
                        <div key={product.id}>
                          <ProductCard
                            id={product.id}
                            title={product.title}
                            slug={product.slug}
                            price={product.price}
                            originalPrice={product.originalPrice}
                            discount={product.discount}
                            images={product.images}
                            rating={product.rating}
                            reviewCount={product.reviewCount}
                            showDiscountBadge={!!product.discount}
                          />
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="flex h-96 flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 p-12 text-center">
                      <p className="mt-1 text-sm text-gray-500">Nenhum produto encontrado com os filtros selecionados.</p>
                      <div className="mt-6">
                        <Button
                          type="button"
                          variant="outline"
                          onClick={clearFilters}
                        >
                          Limpar filtros
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </section>
          </AnimatedSection>
        </main>
      </div>
    </div>
  );
}
