import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { orderService } from '../services/orderService';
import type { Order, OrderStatus } from '../types';

const STATUS_BADGE: Record<OrderStatus, { label: string; classes: string }> = {
  PENDING:   { label: 'Pending',   classes: 'bg-yellow-100 text-yellow-800' },
  CONFIRMED: { label: 'Confirmed', classes: 'bg-blue-100 text-blue-800' },
  SHIPPED:   { label: 'Shipped',   classes: 'bg-purple-100 text-purple-800' },
  DELIVERED: { label: 'Delivered', classes: 'bg-green-100 text-green-800' },
  CANCELLED: { label: 'Cancelled', classes: 'bg-red-100 text-red-800' },
};

export default function OrderConfirmationPage() {
  const { id } = useParams<{ id: string }>();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!id) return;
    orderService.getOrder(id)
      .then(setOrder)
      .catch(() => setError('Order not found.'))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-64">
        <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center">
        <p className="text-red-600">{error || 'Order not found.'}</p>
        <Link to="/orders" className="mt-4 inline-block text-blue-600 hover:underline">View all orders</Link>
      </div>
    );
  }

  const badge = STATUS_BADGE[order.status];
  const addr = order.shippingAddress;

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      {/* Success banner */}
      <div className="bg-green-50 border border-green-200 rounded-xl p-6 text-center mb-8">
        <div className="text-4xl mb-3">✅</div>
        <h1 className="text-2xl font-bold text-green-800">Order Confirmed!</h1>
        <p className="text-green-700 mt-1">Thank you for your purchase.</p>
        <p className="text-sm text-green-600 mt-2 font-medium">Order #{order.orderNumber}</p>
      </div>

      {/* Status */}
      <div className="bg-white rounded-xl border border-gray-200 p-5 mb-4 flex items-center justify-between">
        <span className="text-gray-700 font-medium">Status</span>
        <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${badge.classes}`}>
          {badge.label}
        </span>
      </div>

      {/* Items */}
      <div className="bg-white rounded-xl border border-gray-200 p-5 mb-4">
        <h2 className="font-semibold text-gray-900 mb-4">Items</h2>
        <div className="space-y-3">
          {order.items.map((item, i) => (
            <div key={i} className="flex justify-between text-sm">
              <div>
                <span className="font-medium text-gray-900">{item.productName}</span>
                <span className="text-gray-500 ml-2">Size: {item.size}</span>
                <span className="text-gray-500 ml-2">× {item.quantity}</span>
              </div>
              <span className="font-medium text-gray-900">
                £{(item.unitPrice * item.quantity).toFixed(2)}
              </span>
            </div>
          ))}
        </div>
        <div className="border-t border-gray-200 mt-4 pt-3 flex justify-between font-semibold text-gray-900">
          <span>Total</span>
          <span>£{order.total.toFixed(2)}</span>
        </div>
      </div>

      {/* Shipping address */}
      <div className="bg-white rounded-xl border border-gray-200 p-5 mb-6">
        <h2 className="font-semibold text-gray-900 mb-2">Shipping Address</h2>
        <address className="not-italic text-sm text-gray-600 leading-relaxed">
          {addr.street}<br />
          {addr.city}, {addr.state} {addr.postalCode}<br />
          {addr.country}
        </address>
      </div>

      <div className="flex gap-4">
        <Link
          to="/orders"
          className="flex-1 text-center border border-gray-300 text-gray-700 py-2.5 rounded-lg font-medium hover:bg-gray-50"
        >
          View Order History
        </Link>
        <Link
          to="/products"
          className="flex-1 text-center bg-blue-600 text-white py-2.5 rounded-lg font-medium hover:bg-blue-700"
        >
          Continue Shopping
        </Link>
      </div>
    </div>
  );
}
