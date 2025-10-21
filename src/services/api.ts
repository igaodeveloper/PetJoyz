import { API_CONFIG, API_ENDPOINTS } from '../config/api';
import { getAuthToken } from '../lib/auth';

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

// Robust request wrapper with auth header and dev-only fallback
async function request<T>(endpoint: string, options?: { method?: string; body?: any; headers?: Record<string,string> }): Promise<T> {
  const method = options?.method?.toUpperCase() || 'GET';
  const url = `${API_CONFIG.BASE_URL}${endpoint}`;
  const headers: Record<string,string> = {
    'Accept': 'application/json',
    ...(options?.headers || {})
  };

  const token = getAuthToken();
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const fetchOptions: RequestInit = { method, headers };
  if (options?.body != null) {
    headers['Content-Type'] = 'application/json';
    fetchOptions.body = JSON.stringify(options.body);
  }

  try {
    const res = await fetch(url, fetchOptions);
    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }
    return await res.json();
  } catch (err: any) {
    // Re-throw so caller can handle errors; do not provide fallback data here
    throw err;
  }
}

export const api = {
  // Products
  // Products
  getProducts: async (): Promise<Product[]> => {
    return request<Product[]>(API_ENDPOINTS.PRODUCTS);
  },
  
  getProductBySlug: async (slug: string): Promise<Product> => {
    return request<Product>(API_ENDPOINTS.PRODUCT_BY_SLUG(slug));
  },
  
  // Categories
  getCategories: async (): Promise<Category[]> => {
    return request<Category[]>(API_ENDPOINTS.CATEGORIES);
  },
  
  getCategoryBySlug: async (slug: string): Promise<Category> => {
    return request<Category>(API_ENDPOINTS.CATEGORY_BY_SLUG(slug));
  },
  
  // Brands
  getBrands: async (): Promise<Brand[]> => {
    return request<Brand[]>(API_ENDPOINTS.BRANDS);
  },
  
  getBrandBySlug: async (slug: string): Promise<Brand> => {
    return request<Brand>(API_ENDPOINTS.BRAND_BY_SLUG(slug));
  },
  
  // Search
  searchProducts: async (query: string): Promise<Product[]> => {
    return request<Product[]>(API_ENDPOINTS.SEARCH(query));
  },
  
  // Featured Products
  getFeaturedProducts: async (limit: number = 8): Promise<Product[]> => {
    return request<Product[]>(API_ENDPOINTS.FEATURED_PRODUCTS(limit));
  },
  
  // Special Offers
  getSpecialOffers: async (limit: number = 4): Promise<Product[]> => {
    return request<Product[]>(API_ENDPOINTS.PRODUCT_OFFERS(limit));
  },
  
  // Related Products
  getRelatedProducts: async (productId: string, limit: number = 4): Promise<Product[]> => {
    return request<Product[]>(API_ENDPOINTS.RELATED_PRODUCTS(productId, limit));
  }
  ,
  // Admin / CRUD operations (assumes API supports these endpoints)
  createProduct: async (payload: Partial<Product>): Promise<Product> => {
    const response = await fetch(`${API_CONFIG.BASE_URL}${API_ENDPOINTS.PRODUCTS}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    if (!response.ok) throw new Error('Failed to create product');
    return await response.json();
  },

  updateProduct: async (id: string, payload: Partial<Product>): Promise<Product> => {
    const response = await fetch(`${API_CONFIG.BASE_URL}${API_ENDPOINTS.PRODUCTS}/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    if (!response.ok) throw new Error('Failed to update product');
    return await response.json();
  },

  deleteProduct: async (id: string): Promise<void> => {
    const response = await fetch(`${API_CONFIG.BASE_URL}${API_ENDPOINTS.PRODUCTS}/${id}`, {
      method: 'DELETE'
    });
    if (!response.ok) throw new Error('Failed to delete product');
    return;
  },

  // Simple auth placeholder (to be replaced by real auth)
  adminLogin: async (username: string, password: string): Promise<{ token: string }> => {
    // This is a placeholder that calls a login endpoint if available
    try {
      const res = await fetch(`${API_CONFIG.BASE_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });
      if (!res.ok) throw new Error('Login failed');
      return await res.json();
    } catch (e) {
      // fallback: fake token for local dev
      return { token: 'dev-token' };
    }
  }
};

export default api;
