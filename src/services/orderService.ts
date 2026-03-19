import api from './api';
import type { Order } from '../types';

export interface CreateOrderRequest {
  shippingAddress: {
    street: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  };
}

export const orderService = {
  async createOrder(request: CreateOrderRequest): Promise<Order> {
    const response = await api.post<Order>('/orders', request);
    return response.data;
  },

  async getMyOrders(): Promise<Order[]> {
    const response = await api.get<Order[]>('/orders');
    return response.data;
  },

  async getOrder(id: string): Promise<Order> {
    const response = await api.get<Order>(`/orders/${id}`);
    return response.data;
  },

  async createPaymentIntent(orderId: string): Promise<{ clientSecret: string }> {
    const response = await api.post<{ clientSecret: string }>(`/orders/${orderId}/pay`);
    return response.data;
  },
};
