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

  async confirmPayment(orderId: string, paymentMethod: 'VIETQR' | 'MOMO'): Promise<Order> {
    const response = await api.post<Order>(`/orders/${orderId}/confirm-payment`, { paymentMethod });
    return response.data;
  },
};
