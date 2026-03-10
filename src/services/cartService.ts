import api from './api';
import type { Cart, CartItem } from '../types';

export const cartService = {
  async getCart(): Promise<Cart> {
    const response = await api.get<Cart>('/cart');
    return response.data;
  },

  async addItem(item: Omit<CartItem, 'productName' | 'productImage'>): Promise<Cart> {
    const response = await api.post<Cart>('/cart/items', item);
    return response.data;
  },

  async updateItem(itemIndex: number, quantity: number): Promise<Cart> {
    const response = await api.put<Cart>(`/cart/items/${itemIndex}`, { quantity });
    return response.data;
  },

  async removeItem(itemIndex: number): Promise<Cart> {
    const response = await api.delete<Cart>(`/cart/items/${itemIndex}`);
    return response.data;
  },

  async clearCart(): Promise<void> {
    await api.delete('/cart');
  },
};
