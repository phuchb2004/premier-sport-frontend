import { useEffect, useState, useCallback } from 'react';
import { adminService } from '../services/adminService';
import { useAuth } from '../hooks/useAuth';
import type { PageResponse, User } from '../types';

export default function AdminUsersPage() {
  const { user: me } = useAuth();
  const [data, setData] = useState<PageResponse<User> | null>(null);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [actionError, setActionError] = useState('');

  const fetch = useCallback(() => {
    setLoading(true);
    adminService
      .getUsers({ email: search || undefined, page, size: 20 })
      .then(setData)
      .catch(() => setError('Failed to load users'))
      .finally(() => setLoading(false));
  }, [search, page]);

  useEffect(() => {
    fetch();
  }, [fetch]);

  const handleRoleToggle = async (u: User) => {
    setActionError('');
    const newRole = u.role === 'ADMIN' ? 'USER' : 'ADMIN';
    try {
      const updated = await adminService.updateUserRole(u.id, newRole);
      setData((prev) => prev ? {
        ...prev,
        content: prev.content.map((x) => (x.id === updated.id ? updated : x)),
      } : prev);
    } catch {
      setActionError('Failed to update role');
    }
  };

  const handleStatusToggle = async (u: User) => {
    setActionError('');
    if (u.id === me?.id) {
      setActionError('You cannot disable your own account');
      return;
    }
    try {
      const updated = await adminService.updateUserStatus(u.id, !u.enabled);
      setData((prev) => prev ? {
        ...prev,
        content: prev.content.map((x) => (x.id === updated.id ? updated : x)),
      } : prev);
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
      setActionError(msg || 'Failed to update status');
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(0);
    fetch();
  };

  return (
    <div className="space-y-4">
      {/* Search */}
      <form onSubmit={handleSearch} className="flex gap-2">
        <input
          type="text"
          placeholder="Search by email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
        />
        <button
          type="submit"
          className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700 transition-colors"
        >
          Search
        </button>
      </form>

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
                    <th className="text-left px-4 py-3 font-medium text-gray-500">Name</th>
                    <th className="text-left px-4 py-3 font-medium text-gray-500">Email</th>
                    <th className="text-left px-4 py-3 font-medium text-gray-500">Role</th>
                    <th className="text-left px-4 py-3 font-medium text-gray-500">Status</th>
                    <th className="text-left px-4 py-3 font-medium text-gray-500">Joined</th>
                    <th className="text-left px-4 py-3 font-medium text-gray-500">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {data?.content.map((u) => (
                    <tr key={u.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 font-medium text-gray-900">
                        {u.firstName} {u.lastName}
                      </td>
                      <td className="px-4 py-3 text-gray-600">{u.email}</td>
                      <td className="px-4 py-3">
                        <span
                          className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${
                            u.role === 'ADMIN'
                              ? 'bg-purple-100 text-purple-800'
                              : 'bg-gray-100 text-gray-700'
                          }`}
                        >
                          {u.role}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${
                            u.enabled !== false
                              ? 'bg-green-100 text-green-800'
                              : 'bg-red-100 text-red-800'
                          }`}
                        >
                          {u.enabled !== false ? 'Active' : 'Disabled'}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-gray-500 whitespace-nowrap">
                        {new Date(u.createdAt).toLocaleDateString('en-GB')}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleRoleToggle(u)}
                            className="text-xs px-2.5 py-1 rounded-lg bg-purple-50 text-purple-700 hover:bg-purple-100 transition-colors font-medium"
                          >
                            {u.role === 'ADMIN' ? '→ USER' : '→ ADMIN'}
                          </button>
                          <button
                            onClick={() => handleStatusToggle(u)}
                            disabled={u.id === me?.id}
                            className={`text-xs px-2.5 py-1 rounded-lg font-medium transition-colors ${
                              u.id === me?.id
                                ? 'opacity-40 cursor-not-allowed bg-gray-100 text-gray-500'
                                : u.enabled !== false
                                ? 'bg-red-50 text-red-700 hover:bg-red-100'
                                : 'bg-green-50 text-green-700 hover:bg-green-100'
                            }`}
                          >
                            {u.enabled !== false ? 'Disable' : 'Enable'}
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
                {data.totalElements} users · page {data.number + 1} of {data.totalPages}
              </p>
              <div className="flex gap-2">
                <button
                  disabled={page === 0}
                  onClick={() => setPage((p) => p - 1)}
                  className="px-3 py-1.5 text-sm rounded-lg border border-gray-300 disabled:opacity-40 hover:bg-gray-50 transition-colors"
                >
                  Previous
                </button>
                <button
                  disabled={page >= (data.totalPages - 1)}
                  onClick={() => setPage((p) => p + 1)}
                  className="px-3 py-1.5 text-sm rounded-lg border border-gray-300 disabled:opacity-40 hover:bg-gray-50 transition-colors"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
