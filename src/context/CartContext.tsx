import { useEffect, useState, type ReactNode } from 'react';
import { cartService } from '../services/cartService';
import { useAuth } from '../hooks/useAuth';
import type { AddToCartRequest, Cart } from '../types';
import { CartContext } from '../hooks/useCart';

export interface CartContextType {
  cart: Cart | null;
  itemCount: number;
  isLoading: boolean;
  addItem: (item: AddToCartRequest) => Promise<void>;
  updateItem: (itemIndex: number, quantity: number) => Promise<void>;
  removeItem: (itemIndex: number) => Promise<void>;
  clearCart: () => Promise<void>;
}

export function CartProvider({ children }: { children: ReactNode }) {
  const { isAuthenticated } = useAuth();
  const [cart, setCart] = useState<Cart | null>(null);
  const [isLoading, setIsLoading] = useState(() => isAuthenticated);
  const [prevIsAuthenticated, setPrevIsAuthenticated] = useState(isAuthenticated);

  // Adjust state during rendering when auth changes (React recommended pattern).
  // Avoids calling setState synchronously inside useEffect.
  if (prevIsAuthenticated !== isAuthenticated) {
    setPrevIsAuthenticated(isAuthenticated);
    if (!isAuthenticated) {
      setCart(null);
      setIsLoading(false);
    } else {
      setIsLoading(true);
    }
  }

  useEffect(() => {
    if (isAuthenticated) {
      cartService.getCart()
        .then(setCart)
        .catch(() => setCart(null))
        .finally(() => setIsLoading(false));
    }
  }, [isAuthenticated]);

  const addItem = async (item: AddToCartRequest) => {
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
