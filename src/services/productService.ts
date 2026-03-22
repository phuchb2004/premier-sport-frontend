import api from './api';
import type { PageResponse, Product, ProductCategory, SearchSuggestionsResponse } from '../types';

export interface ProductFilters {
  category?: ProductCategory;
  search?: string;
  page?: number;
  size?: number;
  sort?: string;
}

export const productService = {
  async getProducts(filters: ProductFilters = {}): Promise<PageResponse<Product>> {
    const response = await api.get<PageResponse<Product>>('/products', { params: filters });
    return response.data;
  },

  async getProductBySlug(slug: string): Promise<Product> {
    const response = await api.get<Product>(`/products/${slug}`);
    return response.data;
  },

  async getFeaturedProducts(): Promise<Product[]> {
    const response = await api.get<Product[]>('/products/featured');
    return response.data;
  },

  async getCategories(): Promise<{ category: string; count: number }[]> {
    const response = await api.get<{ category: string; count: number }[]>('/products/categories');
    return response.data;
  },

  async searchSuggestions(q: string, signal?: AbortSignal): Promise<SearchSuggestionsResponse> {
    const response = await api.get<SearchSuggestionsResponse>(
      '/products/search/suggestions',
      { params: { q }, signal }
    );
    return response.data;
  },
};
