import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { adminService } from '../services/adminService';
import type { AnalyticsDto } from '../types';

function fmt(n: number) {
  return `${n.toLocaleString('vi-VN')}₫`;
}

function TrendBadge({ current, previous }: { current: number; previous: number }) {
  if (previous === 0) return null;
  const pct = ((current - previous) / previous) * 100;
  const up = pct >= 0;
  return (
    <span className={`inline-flex items-center gap-1 text-xs font-medium ${up ? 'text-green-600' : 'text-red-600'}`}>
      {up ? (
        <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
        </svg>
      ) : (
        <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
        </svg>
      )}
      {Math.abs(pct).toFixed(1)}% vs yesterday
    </span>
  );
}

const statusColors: Record<string, string> = {
  PENDING: 'bg-yellow-100 text-yellow-800',
  CONFIRMED: 'bg-blue-100 text-blue-800',
  SHIPPED: 'bg-purple-100 text-purple-800',
  DELIVERED: 'bg-green-100 text-green-800',
  CANCELLED: 'bg-red-100 text-red-800',
};

export default function AdminDashboardPage() {
  const [analytics, setAnalytics] = useState<AnalyticsDto | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    adminService
      .getAnalytics()
      .then(setAnalytics)
      .catch(() => setError('Failed to load analytics'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="w-8 h-8 border-4 border-green-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (error || !analytics) {
    return <div className="text-red-600 text-center py-12">{error || 'No data'}</div>;
  }

  const stats = [
    {
      label: 'Total Orders',
      value: analytics.totalOrders.toLocaleString(),
      sub: <TrendBadge current={analytics.ordersToday} previous={analytics.ordersPreviousPeriod} />,
    },
    {
      label: 'Total Revenue',
      value: fmt(analytics.totalRevenue),
      sub: <TrendBadge current={analytics.revenueToday} previous={analytics.revenuePreviousPeriod} />,
    },
    {
      label: 'Orders Today',
      value: analytics.ordersToday.toLocaleString(),
      sub: null,
    },
    {
      label: 'Revenue Today',
      value: fmt(analytics.revenueToday),
      sub: null,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Stats cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s) => (
          <div key={s.label} className="bg-white rounded-xl border border-gray-200 p-5">
            <p className="text-sm text-gray-500">{s.label}</p>
            <p className="text-2xl font-bold text-gray-900 mt-1">{s.value}</p>
            {s.sub && <div className="mt-1">{s.sub}</div>}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Top products */}
        <div className="bg-white rounded-xl border border-gray-200 p-5 lg:col-span-1">
          <h2 className="font-semibold text-gray-900 mb-4">Top 5 Products</h2>
          {analytics.topProducts.length === 0 ? (
            <p className="text-sm text-gray-500">No sales yet</p>
          ) : (
            <ol className="space-y-3">
              {analytics.topProducts.map((p, i) => (
                <li key={p.productId} className="flex items-center gap-3">
                  <span className="w-6 h-6 rounded-full bg-green-100 text-green-700 text-xs font-bold flex items-center justify-center flex-shrink-0">
                    {i + 1}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">{p.productName}</p>
                    <p className="text-xs text-gray-500">{p.totalQuantity} sold · {fmt(p.totalRevenue)}</p>
                  </div>
                </li>
              ))}
            </ol>
          )}
        </div>

        {/* Recent orders */}
        <div className="bg-white rounded-xl border border-gray-200 p-5 lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-gray-900">Recent Orders</h2>
            <Link to="/admin/orders" className="text-sm text-green-600 hover:text-green-700 font-medium">
              View all
            </Link>
          </div>
          {analytics.recentOrders.length === 0 ? (
            <p className="text-sm text-gray-500">No orders yet</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-xs text-gray-500 border-b border-gray-100">
                    <th className="pb-2 font-medium">Order</th>
                    <th className="pb-2 font-medium">Customer</th>
                    <th className="pb-2 font-medium">Total</th>
                    <th className="pb-2 font-medium">Status</th>
                    <th className="pb-2 font-medium">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {analytics.recentOrders.map((order) => (
                    <tr key={order.id} className="hover:bg-gray-50">
                      <td className="py-2.5">
                        <Link
                          to={`/admin/orders/${order.id}`}
                          className="font-medium text-green-600 hover:text-green-700"
                        >
                          {order.orderNumber}
                        </Link>
                      </td>
                      <td className="py-2.5 text-gray-600 truncate max-w-[120px]">{order.userId}</td>
                      <td className="py-2.5 font-medium">{fmt(order.total)}</td>
                      <td className="py-2.5">
                        <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${statusColors[order.status] ?? 'bg-gray-100 text-gray-700'}`}>
                          {order.status}
                        </span>
                      </td>
                      <td className="py-2.5 text-gray-500 whitespace-nowrap">
                        {new Date(order.createdAt).toLocaleDateString('en-GB')}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
