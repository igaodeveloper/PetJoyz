export const fallbackProducts = [
  {
    id: 'prod-1',
    title: 'Ração Premium para Cães',
    slug: 'racao-premium-para-caes',
    description: 'Ração completa e balanceada',
    price: 12990,
    originalPrice: 14990,
    discount: 13,
    rating: 4.8,
    reviewCount: 156,
    inStock: true,
    images: ['/images/produto1.jpg'],
    categoryId: 'cat-1',
    brandId: 'brand-1',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'prod-2',
    title: 'Brinquedo para Gatos',
    slug: 'brinquedo-para-gatos',
    description: 'Divertido e seguro',
    price: 4590,
    rating: 4.5,
    reviewCount: 89,
    inStock: true,
    images: ['/images/produto2.jpg'],
    categoryId: 'cat-2',
    brandId: 'brand-2',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }
];

export const fallbackCategories = [
  { id: 'cat-1', name: 'Acessórios', slug: 'acessorios', description: 'Acessórios para pets' },
  { id: 'cat-2', name: 'Brinquedos', slug: 'brinquedos', description: 'Diversão para pets' }
];
