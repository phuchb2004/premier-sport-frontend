import api from './api';
import type {
  AnalyticsDto,
  CreateProductRequest,
  Order,
  OrderStatus,
  PageResponse,
  Product,
  UpdateProductRequest,
  User,
} from '../types';

export const adminService = {
  // --- Users ---
  async getUsers(params: { email?: string; page?: number; size?: number } = {}): Promise<PageResponse<User>> {
    const response = await api.get<PageResponse<User>>('/users', { params });
    return response.data;
  },

  async updateUserRole(id: string, role: 'USER' | 'ADMIN'): Promise<User> {
    const response = await api.put<User>(`/users/${id}/role`, { role });
    return response.data;
  },

  async updateUserStatus(id: string, enabled: boolean): Promise<User> {
    const response = await api.put<User>(`/users/${id}/status`, { enabled });
    return response.data;
  },

  // --- Orders ---
  async getOrdersAdmin(params: {
    page?: number;
    size?: number;
    status?: OrderStatus;
  } = {}): Promise<PageResponse<Order>> {
    const response = await api.get<PageResponse<Order>>('/orders/admin/all', { params });
    return response.data;
  },

  async getOrderAdmin(id: string): Promise<Order> {
    const response = await api.get<Order>(`/orders/${id}`);
    return response.data;
  },

  async updateOrderStatus(id: string, status: OrderStatus): Promise<Order> {
    const response = await api.put<Order>(`/orders/admin/${id}/status`, { status });
    return response.data;
  },

  // --- Analytics ---
  async getAnalytics(): Promise<AnalyticsDto> {
    const response = await api.get<AnalyticsDto>('/orders/admin/analytics');
    return response.data;
  },

  // --- Products ---
  async getProductById(id: string): Promise<Product> {
    const response = await api.get<Product>(`/products/id/${id}`);
    return response.data;
  },

  async createProduct(data: CreateProductRequest): Promise<Product> {
    const response = await api.post<Product>('/products', data);
    return response.data;
  },

  async updateProduct(id: string, data: UpdateProductRequest): Promise<Product> {
    const response = await api.put<Product>(`/products/${id}`, data);
    return response.data;
  },

  async deleteProduct(id: string): Promise<void> {
    await api.delete(`/products/${id}`);
  },

  async toggleFeatured(id: string, isFeatured: boolean): Promise<Product> {
    const response = await api.put<Product>(`/products/${id}`, { isFeatured });
    return response.data;
  },

  // --- S3 Image Upload ---
  async getPresignedUrl(filename: string): Promise<{ presignedUrl: string; publicUrl: string; key: string }> {
    const response = await api.get<{ presignedUrl: string; publicUrl: string; key: string }>(
      '/products/admin/presigned-url',
      { params: { filename } }
    );
    return response.data;
  },

  async uploadImageToS3(presignedUrl: string, file: File): Promise<void> {
    await fetch(presignedUrl, {
      method: 'PUT',
      body: file,
      headers: { 'Content-Type': file.type },
    });
  },
};
