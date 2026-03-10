import { useEffect, useState, type ReactNode } from 'react';
import { authService } from '../services/authService';
import type { User, LoginRequest, RegisterRequest } from '../types';
import { AuthContext } from '../hooks/useAuth';

export interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (data: LoginRequest) => Promise<void>;
  register: (data: RegisterRequest) => Promise<void>;
  logout: () => Promise<void>;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(() => authService.isAuthenticated());

  useEffect(() => {
    if (authService.isAuthenticated()) {
      authService.getMe()
        .then(setUser)
        .catch(() => localStorage.removeItem('accessToken'))
        .finally(() => setIsLoading(false));
    }
  }, []);

  const login = async (data: LoginRequest) => {
    const response = await authService.login(data);
    setUser(response.user);
  };

  const register = async (data: RegisterRequest) => {
    const response = await authService.register(data);
    setUser(response.user);
  };

  const logout = async () => {
    await authService.logout();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, isLoading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
