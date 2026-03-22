import api from './api';
import type { AuthResponse, LoginRequest, RegisterRequest, User } from '../types';

function storeTokens(response: AuthResponse) {
  localStorage.setItem('accessToken', response.accessToken);
  if (response.refreshToken) {
    localStorage.setItem('refreshToken', response.refreshToken);
  }
}

export const authService = {
  async register(data: RegisterRequest): Promise<AuthResponse> {
    const response = await api.post<AuthResponse>('/auth/register', data);
    storeTokens(response.data);
    return response.data;
  },

  async login(data: LoginRequest): Promise<AuthResponse> {
    const response = await api.post<AuthResponse>('/auth/login', data);
    storeTokens(response.data);
    return response.data;
  },

  async logout(): Promise<void> {
    try {
      await api.post('/auth/logout');
    } finally {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
    }
  },

  async refresh(): Promise<AuthResponse> {
    const refreshToken = localStorage.getItem('refreshToken');
    if (!refreshToken) throw new Error('No refresh token');
    const response = await api.post<AuthResponse>('/auth/refresh', { refreshToken });
    storeTokens(response.data);
    return response.data;
  },

  async getMe(): Promise<User> {
    const response = await api.get<User>('/users/me');
    return response.data;
  },

  isAuthenticated(): boolean {
    return !!localStorage.getItem('accessToken');
  },

  async googleAuth(credential: string): Promise<AuthResponse> {
    const response = await api.post<AuthResponse>('/auth/google', { credential });
    storeTokens(response.data);
    return response.data;
  },
};
