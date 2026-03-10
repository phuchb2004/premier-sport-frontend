import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { cartService } from '../services/cartService';
import { useAuth } from './AuthContext';
import type { Cart, CartItem } from '../types';

interface CartContextType {
  cart: Cart | null;
  itemCount: number;
  isLoading: boolean;
  addItem: (item: Omit<CartItem, 'productName' | 'productImage'>) => Promise<void>;
  updateItem: (itemIndex: number, quantity: number) => Promise<void>;
  removeItem: (itemIndex: number) => Promise<void>;
  clearCart: () => Promise<void>;
}

const CartContext = createContext<CartContextType | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const { isAuthenticated } = useAuth();
  const [cart, setCart] = useState<Cart | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      setIsLoading(true);
      cartService.getCart()
        .then(setCart)
        .catch(() => setCart(null))
        .finally(() => setIsLoading(false));
    } else {
      setCart(null);
    }
  }, [isAuthenticated]);

  const addItem = async (item: Omit<CartItem, 'productName' | 'productImage'>) => {
    const updated = await cartService.addItem(item);
    setCart(updated);
  };

  const updateItem = async (itemIndex: number, quantity: number) => {
    const updated = await cartService.updateItem(itemIndex, quantity);
    setCart(updated);
  };

  const removeItem = async (itemIndex: number) => {
    const updated = await cartService.removeItem(itemIndex);
    setCart(updated);
  };

  const clearCart = async () => {
    await cartService.clearCart();
    setCart(null);
  };

  const itemCount = cart?.items.reduce((sum, item) => sum + item.quantity, 0) ?? 0;

  return (
    <CartContext.Provider value={{ cart, itemCount, isLoading, addItem, updateItem, removeItem, clearCart }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within CartProvider');
  return context;
}
