import { useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { productService } from '../services/productService';
import { adminService } from '../services/adminService';
import type { PageResponse, Product } from '../types';

function fmt(n: number) {
  return `${n.toLocaleString('vi-VN')}₫`;
}

export default function AdminProductsPage() {
  const [data, setData] = useState<PageResponse<Product> | null>(null);
  const [page, setPage] = useState(0);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [actionError, setActionError] = useState('');

  const fetch = useCallback(() => {
    setLoading(true);
    productService
      .getProducts({ search: search || undefined, page, size: 20 })
      .then(setData)
      .catch(() => setError('Failed to load products'))
      .finally(() => setLoading(false));
  }, [search, page]);

  useEffect(() => {
    fetch();
  }, [fetch]);

  const handleFeaturedToggle = async (product: Product) => {
    setActionError('');
    try {
      const updated = await adminService.toggleFeatured(product.id, !product.isFeatured);
      setData((prev) => prev ? {
        ...prev,
        content: prev.content.map((p) => (p.id === updated.id ? updated : p)),
      } : prev);
    } catch {
      setActionError('Failed to update product');
    }
  };

  const handleDelete = async (id: string) => {
    setActionError('');
    try {
      await adminService.deleteProduct(id);
      setDeleteId(null);
      fetch();
    } catch {
      setActionError('Failed to delete product');
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(0);
    fetch();
  };

  return (
    <div className="space-y-4">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-3">
        <form onSubmit={handleSearch} className="flex gap-2 flex-1 min-w-[200px]">
          <input
            type="text"
            placeholder="Search products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
          />
          <button
            type="submit"
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors"
          >
            Search
          </button>
        </form>
        <Link
          to="/admin/products/new"
          className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700 transition-colors flex items-center gap-1.5 whitespace-nowrap"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          New Product
        </Link>
      </div>

      {actionError && (
        <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg px-4 py-2 text-sm">
          {actionError}
        </div>
      )}

      {error && <div className="text-red-600 text-center py-8">{error}</div>}

      {loading ? (
        <div className="flex justify-center py-12">
          <div className="w-8 h-8 border-4 border-green-600 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <>
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="text-left px-4 py-3 font-medium text-gray-500">Product</th>
                    <th className="text-left px-4 py-3 font-medium text-gray-500">Category</th>
                    <th className="text-left px-4 py-3 font-medium text-gray-500">Price</th>
                    <th className="text-left px-4 py-3 font-medium text-gray-500">Stock</th>
                    <th className="text-left px-4 py-3 font-medium text-gray-500">Featured</th>
                    <th className="text-left px-4 py-3 font-medium text-gray-500">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {data?.content.length === 0 && (
                    <tr>
                      <td colSpan={6} className="px-4 py-8 text-center text-gray-500">
                        No products found
                      </td>
                    </tr>
                  )}
                  {data?.content.map((product) => (
                    <tr key={product.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          {product.images[0] && (
                            <img
                              src={product.images[0]}
                              alt={product.name}
                              className="w-10 h-10 rounded-lg object-cover border border-gray-200 flex-shrink-0"
                            />
                          )}
                          <div>
                            <p className="font-medium text-gray-900 truncate max-w-[180px]">{product.name}</p>
                            <p className="text-xs text-gray-500">{product.brand}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span className="inline-block px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-700">
                          {product.category}
                        </span>
                      </td>
                      <td className="px-4 py-3 font-medium">
                        {product.salePrice ? (
                          <div>
                            <span className="text-green-600">{fmt(product.salePrice)}</span>
                            <span className="text-gray-400 line-through ml-1 text-xs">{fmt(product.price)}</span>
                          </div>
                        ) : fmt(product.price)}
                      </td>
                      <td className="px-4 py-3 text-gray-600">{product.stock}</td>
                      <td className="px-4 py-3">
                        <button
                          onClick={() => handleFeaturedToggle(product)}
                          className={`w-10 h-5 rounded-full transition-colors relative ${
                            product.isFeatured ? 'bg-green-500' : 'bg-gray-200'
                          }`}
                          title={product.isFeatured ? 'Featured — click to unfeature' : 'Not featured — click to feature'}
                        >
                          <span
                            className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${
                              product.isFeatured ? 'translate-x-5' : ''
                            }`}
                          />
                        </button>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <Link
                            to={`/admin/products/${product.id}/edit`}
                            className="text-xs px-2.5 py-1 rounded-lg bg-blue-50 text-blue-700 hover:bg-blue-100 font-medium transition-colors"
                          >
                            Edit
                          </Link>
                          <button
                            onClick={() => setDeleteId(product.id)}
                            className="text-xs px-2.5 py-1 rounded-lg bg-red-50 text-red-700 hover:bg-red-100 font-medium transition-colors"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Pagination */}
          {data && data.totalPages > 1 && (
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-500">
                {data.totalElements} products · page {data.number + 1} of {data.totalPages}
              </p>
              <div className="flex gap-2">
                <button
                  disabled={page === 0}
                  onClick={() => setPage((p) => p - 1)}
                  className="px-3 py-1.5 text-sm rounded-lg border border-gray-300 disabled:opacity-40 hover:bg-gray-50"
                >
                  Previous
                </button>
                <button
                  disabled={page >= (data.totalPages - 1)}
                  onClick={() => setPage((p) => p + 1)}
                  className="px-3 py-1.5 text-sm rounded-lg border border-gray-300 disabled:opacity-40 hover:bg-gray-50"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </>
      )}

      {/* Delete confirmation dialog */}
      {deleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full mx-4 shadow-xl">
            <h3 className="font-bold text-gray-900 text-lg">Delete product?</h3>
            <p className="text-sm text-gray-600 mt-2">
              This action cannot be undone. The product will be permanently removed.
            </p>
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setDeleteId(null)}
                className="flex-1 px-4 py-2 rounded-lg border border-gray-300 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(deleteId)}
                className="flex-1 px-4 py-2 rounded-lg bg-red-600 text-white text-sm font-medium hover:bg-red-700 transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
