import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { adminService } from '../services/adminService';
import type { Order, OrderStatus } from '../types';

type ValidTransitions = Record<OrderStatus, OrderStatus[]>;

const VALID_TRANSITIONS: ValidTransitions = {
  PENDING: ['CONFIRMED', 'CANCELLED'],
  CONFIRMED: ['SHIPPED', 'CANCELLED'],
  SHIPPED: ['DELIVERED'],
  DELIVERED: [],
  CANCELLED: [],
};

const statusColors: Record<OrderStatus, string> = {
  PENDING: 'bg-yellow-100 text-yellow-800',
  CONFIRMED: 'bg-blue-100 text-blue-800',
  SHIPPED: 'bg-purple-100 text-purple-800',
  DELIVERED: 'bg-green-100 text-green-800',
  CANCELLED: 'bg-red-100 text-red-800',
};

function fmt(n: number) {
  return `${n.toLocaleString('vi-VN')}₫`;
}

export default function AdminOrderDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [updating, setUpdating] = useState(false);
  const [updateError, setUpdateError] = useState('');

  useEffect(() => {
    if (!id) return;
    adminService
      .getOrderAdmin(id)
      .then(setOrder)
      .catch(() => setError('Order not found'))
      .finally(() => setLoading(false));
  }, [id]);

  const handleStatusChange = async (newStatus: OrderStatus) => {
    if (!order) return;
    setUpdating(true);
    setUpdateError('');
    try {
      const updated = await adminService.updateOrderStatus(order.id, newStatus);
      setOrder(updated);
    } catch {
      setUpdateError('Failed to update status');
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <div className="w-8 h-8 border-4 border-green-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600 mb-4">{error || 'Order not found'}</p>
        <Link to="/admin/orders" className="text-green-600 hover:underline">← Back to orders</Link>
      </div>
    );
  }

  const nextStates = VALID_TRANSITIONS[order.status] ?? [];

  return (
    <div className="max-w-3xl space-y-6">
      <div className="flex items-center gap-3">
        <Link to="/admin/orders" className="text-sm text-gray-500 hover:text-gray-700">← Orders</Link>
        <span className="text-gray-300">/</span>
        <span className="text-sm font-mono font-medium text-gray-900">{order.orderNumber}</span>
      </div>

      {/* Header card */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h2 className="text-lg font-bold text-gray-900 font-mono">{order.orderNumber}</h2>
            <p className="text-sm text-gray-500 mt-0.5">
              {new Date(order.createdAt).toLocaleString('en-GB')}
            </p>
          </div>

          <div className="flex flex-col items-end gap-2">
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${statusColors[order.status]}`}>
              {order.status}
            </span>

            {/* Status update */}
            {nextStates.length > 0 && (
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-500">Update:</span>
                <div className="flex gap-1">
                  {nextStates.map((s) => (
                    <button
                      key={s}
                      disabled={updating}
                      onClick={() => handleStatusChange(s)}
                      className="text-xs px-3 py-1.5 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium transition-colors disabled:opacity-50"
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            )}
            {updateError && <p className="text-xs text-red-600">{updateError}</p>}
          </div>
        </div>
      </div>

      {/* Items */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h3 className="font-semibold text-gray-900 mb-4">Items</h3>
        <div className="space-y-3">
          {order.items.map((item, i) => (
            <div key={i} className="flex items-center gap-3">
              {item.productImage && (
                <img
                  src={item.productImage}
                  alt={item.productName}
                  className="w-12 h-12 rounded-lg object-cover border border-gray-200"
                />
              )}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">{item.productName}</p>
                <p className="text-xs text-gray-500">Size: {item.size} · Qty: {item.quantity}</p>
              </div>
              <p className="text-sm font-medium">{fmt(item.unitPrice * item.quantity)}</p>
            </div>
          ))}
        </div>
        <div className="border-t border-gray-100 mt-4 pt-4 flex justify-end">
          <p className="text-base font-bold text-gray-900">Total: {fmt(order.total)}</p>
        </div>
      </div>

      {/* Shipping address */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h3 className="font-semibold text-gray-900 mb-3">Shipping Address</h3>
        <address className="text-sm text-gray-700 not-italic space-y-0.5">
          <p>{order.shippingAddress.street}</p>
          <p>{order.shippingAddress.city}{order.shippingAddress.state ? `, ${order.shippingAddress.state}` : ''}</p>
          <p>{order.shippingAddress.postalCode}</p>
          <p>{order.shippingAddress.country}</p>
        </address>
      </div>
    </div>
  );
}
