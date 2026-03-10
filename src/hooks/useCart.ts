import { createContext, useContext } from 'react';
import type { CartContextType } from '../context/CartContext';

export const CartContext = createContext<CartContextType | null>(null);

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within CartProvider');
  return context;
}
