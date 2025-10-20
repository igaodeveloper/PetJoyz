// API Configuration
export const API_CONFIG = {
  BASE_URL: import.meta.env.VITE_API_URL || 'https://api.petjoyz.com.br/api',
  TIMEOUT: 10000, // 10 seconds
  // Add other API-related configurations here
};

// API Endpoints
export const API_ENDPOINTS = {
  // Product endpoints
  PRODUCTS: '/products',
  PRODUCT_BY_SLUG: (slug: string) => `/products/slug/${slug}`,
  FEATURED_PRODUCTS: (limit: number = 8) => `/products/featured?limit=${limit}`,
  PRODUCT_OFFERS: (limit: number = 4) => `/products/offers?limit=${limit}`,
  RELATED_PRODUCTS: (productId: string, limit: number = 4) => 
    `/products/${productId}/related?limit=${limit}`,
  
  // Category endpoints
  CATEGORIES: '/categories',
  CATEGORY_BY_SLUG: (slug: string) => `/categories/slug/${slug}`,
  
  // Brand endpoints
  BRANDS: '/brands',
  BRAND_BY_SLUG: (slug: string) => `/brands/slug/${slug}`,
  
  // Search endpoint
  SEARCH: (query: string) => `/search?q=${encodeURIComponent(query)}`,
  
  // Add other endpoints as needed
};
