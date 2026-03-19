import type { OrderStatus } from '../types';

export const STATUS_BADGE: Record<OrderStatus, { label: string; classes: string }> = {
  PENDING:   { label: 'Pending',   classes: 'bg-yellow-100 text-yellow-800' },
  CONFIRMED: { label: 'Confirmed', classes: 'bg-blue-100 text-blue-800' },
  SHIPPED:   { label: 'Shipped',   classes: 'bg-purple-100 text-purple-800' },
  DELIVERED: { label: 'Delivered', classes: 'bg-green-100 text-green-800' },
  CANCELLED: { label: 'Cancelled', classes: 'bg-red-100 text-red-800' },
};
