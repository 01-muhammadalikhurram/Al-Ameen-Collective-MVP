import { useQuery } from '@tanstack/react-query';
import { apiClient } from '../lib/api';

export interface ProductMedia {
  url: string;
  alt_text: string | null;
}

export interface ProductItem {
  id: string;
  product_code: string;
  color: string;
  selling_price: string;
  media: ProductMedia | null;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  fabric: string;
  category: string;
  season: string;
  items: ProductItem[];
}

export interface Pagination {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface ProductsResponse {
  products: Product[];
  pagination: Pagination;
}

export interface ProductFilters {
  category?: string;
  season?: string;
  search?: string;
  page?: number;
  limit?: number;
}

// Fetch all products with filters
export const fetchProducts = async (filters?: ProductFilters): Promise<ProductsResponse> => {
  const response = await apiClient.get('/products', { params: filters });
  return (response as any).data as ProductsResponse;
};

// Fetch single product by slug
export const fetchProduct = async (slug: string): Promise<Product> => {
  const response = await apiClient.get(`/products/${slug}`);
  return (response as any).data as Product;
};

// Hook for fetching a list of products
export const useProducts = (filters?: ProductFilters) => {
  return useQuery({
    queryKey: ['products', filters],
    queryFn: () => fetchProducts(filters),
  });
};

// Hook for fetching a single product
export const useProduct = (slug: string) => {
  return useQuery({
    queryKey: ['product', slug],
    queryFn: () => fetchProduct(slug),
    enabled: !!slug,
  });
};
