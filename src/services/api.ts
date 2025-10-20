import { API_CONFIG, API_ENDPOINTS } from '../config/api';

export interface Product {
  id: string;
  title: string;
  slug: string;
  description: string;
  price: number;
  originalPrice?: number;
  discount?: number;
  rating: number;
  reviewCount: number;
  inStock: boolean;
  images: string[];
  categoryId: string;
  brandId: string;
  createdAt: string;
  updatedAt: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  image?: string;
  parentId?: string;
}

export interface Brand {
  id: string;
  name: string;
  logo: string;
  slug: string;
}

// Generic fetch wrapper with error handling
async function fetchData<T>(endpoint: string): Promise<T> {
  try {
    const response = await fetch(`${API_CONFIG.BASE_URL}${endpoint}`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching data:', error);
    throw error;
  }
}

export const api = {
  // Products
  // Products
  getProducts: async (): Promise<Product[]> => {
    return fetchData<Product[]>(API_ENDPOINTS.PRODUCTS);
  },
  
  getProductBySlug: async (slug: string): Promise<Product> => {
    return fetchData<Product>(API_ENDPOINTS.PRODUCT_BY_SLUG(slug));
  },
  
  // Categories
  getCategories: async (): Promise<Category[]> => {
    return fetchData<Category[]>(API_ENDPOINTS.CATEGORIES);
  },
  
  getCategoryBySlug: async (slug: string): Promise<Category> => {
    return fetchData<Category>(API_ENDPOINTS.CATEGORY_BY_SLUG(slug));
  },
  
  // Brands
  getBrands: async (): Promise<Brand[]> => {
    return fetchData<Brand[]>(API_ENDPOINTS.BRANDS);
  },
  
  getBrandBySlug: async (slug: string): Promise<Brand> => {
    return fetchData<Brand>(API_ENDPOINTS.BRAND_BY_SLUG(slug));
  },
  
  // Search
  searchProducts: async (query: string): Promise<Product[]> => {
    return fetchData<Product[]>(API_ENDPOINTS.SEARCH(query));
  },
  
  // Featured Products
  getFeaturedProducts: async (limit: number = 8): Promise<Product[]> => {
    return fetchData<Product[]>(API_ENDPOINTS.FEATURED_PRODUCTS(limit));
  },
  
  // Special Offers
  getSpecialOffers: async (limit: number = 4): Promise<Product[]> => {
    return fetchData<Product[]>(API_ENDPOINTS.PRODUCT_OFFERS(limit));
  },
  
  // Related Products
  getRelatedProducts: async (productId: string, limit: number = 4): Promise<Product[]> => {
    return fetchData<Product[]>(API_ENDPOINTS.RELATED_PRODUCTS(productId, limit));
  }
};

export default api;
