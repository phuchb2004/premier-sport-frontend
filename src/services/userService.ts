import api from './api';
import type { Address, User } from '../types';

export const userService = {
  async getMe(): Promise<User> {
    const response = await api.get<User>('/users/me');
    return response.data;
  },

  async updateProfile(data: { firstName: string; lastName: string }): Promise<User> {
    const response = await api.put<User>('/users/me', data);
    return response.data;
  },

  async changePassword(data: { currentPassword: string; newPassword: string }): Promise<void> {
    await api.put('/users/me/password', data);
  },

  async addAddress(address: Omit<Address, 'id'>): Promise<User> {
    const response = await api.post<User>('/users/me/addresses', address);
    return response.data;
  },

  async removeAddress(addressId: string): Promise<User> {
    const response = await api.delete<User>(`/users/me/addresses/${addressId}`);
    return response.data;
  },
};
