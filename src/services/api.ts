import axios, { AxiosError } from 'axios';
import type { ApiError } from '../types';

const api = axios.create({
  baseURL: '/api/v1',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor - attach token from localStorage if present
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor - unwrap ApiResponse<T> envelope; handle 401
api.interceptors.response.use(
  (response) => {
    // Backend wraps every response in { success, message, data, timestamp }.
    // Unwrap transparently so services can type against the inner data directly.
    if (
      response.data !== null &&
      typeof response.data === 'object' &&
      'success' in response.data &&
      'data' in response.data
    ) {
      response.data = (response.data as { data: unknown }).data;
    }
    return response;
  },
  (error: AxiosError<ApiError>) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('accessToken');
      // Notify AuthContext to clear user state without a hard page reload
      window.dispatchEvent(new Event('auth:logout'));
    }
    return Promise.reject(error);
  }
);

export default api;
