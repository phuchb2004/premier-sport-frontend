import { useState, type FormEvent } from 'react';
import { useAuth } from '../hooks/useAuth';
import { userService } from '../services/userService';
import type { Address } from '../types';

type Tab = 'profile' | 'password' | 'addresses';

export default function ProfilePage() {
  const { user, login } = useAuth();
  const [activeTab, setActiveTab] = useState<Tab>('profile');

  // Profile form
  const [profileForm, setProfileForm] = useState({
    firstName: user?.firstName ?? '',
    lastName: user?.lastName ?? '',
  });
  const [profileStatus, setProfileStatus] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [profileLoading, setProfileLoading] = useState(false);

  // Password form
  const [pwForm, setPwForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [pwStatus, setPwStatus] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [pwLoading, setPwLoading] = useState(false);

  // Address form
  const [addrForm, setAddrForm] = useState<Omit<Address, 'id'>>({
    street: '', city: '', state: '', postalCode: '', country: '', isDefault: false,
  });
  const [addrStatus, setAddrStatus] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [addrLoading, setAddrLoading] = useState(false);
  const [showAddrForm, setShowAddrForm] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleProfileSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setProfileLoading(true);
    setProfileStatus(null);
    try {
      await userService.updateProfile(profileForm);
      setProfileStatus({ type: 'success', message: 'Profile updated successfully.' });
      // Re-fetch user to update AuthContext
      const updated = await userService.getMe();
      // Refresh local user state by re-login is not ideal; we just show success
      void updated;
    } catch {
      setProfileStatus({ type: 'error', message: 'Failed to update profile. Please try again.' });
    } finally {
      setProfileLoading(false);
    }
  };

  const handlePasswordSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (pwForm.newPassword !== pwForm.confirmPassword) {
      setPwStatus({ type: 'error', message: 'New passwords do not match.' });
      return;
    }
    if (pwForm.newPassword.length < 8) {
      setPwStatus({ type: 'error', message: 'Password must be at least 8 characters.' });
      return;
    }
    setPwLoading(true);
    setPwStatus(null);
    try {
      await userService.changePassword({
        currentPassword: pwForm.currentPassword,
        newPassword: pwForm.newPassword,
      });
      setPwStatus({ type: 'success', message: 'Password changed successfully.' });
      setPwForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch {
      setPwStatus({ type: 'error', message: 'Incorrect current password.' });
    } finally {
      setPwLoading(false);
    }
  };

  const handleAddAddress = async (e: FormEvent) => {
    e.preventDefault();
    setAddrLoading(true);
    setAddrStatus(null);
    try {
      await userService.addAddress(addrForm);
      setAddrStatus({ type: 'success', message: 'Address added.' });
      setAddrForm({ street: '', city: '', state: '', postalCode: '', country: '', isDefault: false });
      setShowAddrForm(false);
      // Trigger a re-fetch
      window.location.reload();
    } catch {
      setAddrStatus({ type: 'error', message: 'Failed to add address.' });
    } finally {
      setAddrLoading(false);
    }
  };

  const handleRemoveAddress = async (addressId: string) => {
    setDeletingId(addressId);
    try {
      await userService.removeAddress(addressId);
      window.location.reload();
    } catch {
      setAddrStatus({ type: 'error', message: 'Failed to remove address.' });
    } finally {
      setDeletingId(null);
    }
  };

  const tabs: { id: Tab; label: string }[] = [
    { id: 'profile', label: 'Profile Info' },
    { id: 'password', label: 'Change Password' },
    { id: 'addresses', label: 'Addresses' },
  ];

  return (
    <div className="max-w-2xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">My Account</h1>

      {/* Tabs */}
      <div className="flex border-b border-gray-200 mb-8 gap-1">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2.5 text-sm font-medium rounded-t-lg transition-colors ${
              activeTab === tab.id
                ? 'text-green-600 border-b-2 border-green-600 bg-green-50'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Profile Info */}
      {activeTab === 'profile' && (
        <form onSubmit={handleProfileSubmit} className="space-y-5">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center text-2xl font-bold text-green-700">
              {user?.firstName?.charAt(0).toUpperCase()}
            </div>
            <div>
              <p className="font-semibold text-gray-900">{user?.firstName} {user?.lastName}</p>
              <p className="text-sm text-gray-500">{user?.email}</p>
              <span className={`inline-block mt-1 text-xs px-2 py-0.5 rounded-full font-medium ${
                user?.role === 'ADMIN' ? 'bg-purple-100 text-purple-700' : 'bg-green-100 text-green-700'
              }`}>
                {user?.role}
              </span>
            </div>
          </div>

          {profileStatus && (
            <div className={`px-4 py-3 rounded-lg text-sm ${
              profileStatus.type === 'success'
                ? 'bg-green-50 border border-green-200 text-green-700'
                : 'bg-red-50 border border-red-200 text-red-700'
            }`}>
              {profileStatus.message}
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">First Name</label>
              <input
                type="text"
                required
                value={profileForm.firstName}
                onChange={(e) => setProfileForm({ ...profileForm, firstName: e.target.value })}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Last Name</label>
              <input
                type="text"
                required
                value={profileForm.lastName}
                onChange={(e) => setProfileForm({ ...profileForm, lastName: e.target.value })}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 text-sm"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Email address</label>
            <input
              type="email"
              disabled
              value={user?.email ?? ''}
              className="w-full px-4 py-2.5 border border-gray-200 rounded-xl bg-gray-50 text-gray-500 text-sm cursor-not-allowed"
            />
            <p className="text-xs text-gray-400 mt-1">Email cannot be changed.</p>
          </div>

          <button
            type="submit"
            disabled={profileLoading}
            className="bg-green-600 text-white px-6 py-2.5 rounded-xl font-semibold hover:bg-green-700 transition-colors disabled:opacity-60 disabled:cursor-not-allowed text-sm"
          >
            {profileLoading ? 'Saving...' : 'Save Changes'}
          </button>
        </form>
      )}

      {/* Change Password */}
      {activeTab === 'password' && (
        <form onSubmit={handlePasswordSubmit} className="space-y-5">
          {pwStatus && (
            <div className={`px-4 py-3 rounded-lg text-sm ${
              pwStatus.type === 'success'
                ? 'bg-green-50 border border-green-200 text-green-700'
                : 'bg-red-50 border border-red-200 text-red-700'
            }`}>
              {pwStatus.message}
            </div>
          )}

          {[
            { id: 'currentPassword', label: 'Current Password', key: 'currentPassword' as const },
            { id: 'newPassword', label: 'New Password', key: 'newPassword' as const },
            { id: 'confirmPassword', label: 'Confirm New Password', key: 'confirmPassword' as const },
          ].map(({ id, label, key }) => (
            <div key={id}>
              <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1.5">{label}</label>
              <input
                id={id}
                type="password"
                required
                value={pwForm[key]}
                onChange={(e) => setPwForm({ ...pwForm, [key]: e.target.value })}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 text-sm"
                placeholder="••••••••"
              />
            </div>
          ))}

          <button
            type="submit"
            disabled={pwLoading}
            className="bg-green-600 text-white px-6 py-2.5 rounded-xl font-semibold hover:bg-green-700 transition-colors disabled:opacity-60 disabled:cursor-not-allowed text-sm"
          >
            {pwLoading ? 'Updating...' : 'Update Password'}
          </button>
        </form>
      )}

      {/* Addresses */}
      {activeTab === 'addresses' && (
        <div className="space-y-4">
          {addrStatus && (
            <div className={`px-4 py-3 rounded-lg text-sm ${
              addrStatus.type === 'success'
                ? 'bg-green-50 border border-green-200 text-green-700'
                : 'bg-red-50 border border-red-200 text-red-700'
            }`}>
              {addrStatus.message}
            </div>
          )}

          {user?.addresses && user.addresses.length > 0 ? (
            <div className="space-y-3">
              {user.addresses.map((addr) => (
                <div
                  key={addr.id ?? addr.street}
                  className="flex items-start justify-between p-4 border border-gray-200 rounded-xl bg-white"
                >
                  <div className="text-sm text-gray-700 space-y-0.5">
                    {addr.isDefault && (
                      <span className="inline-block text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-medium mb-1">
                        Default
                      </span>
                    )}
                    <p className="font-medium">{addr.street}</p>
                    <p>{addr.city}{addr.state ? `, ${addr.state}` : ''} {addr.postalCode}</p>
                    <p>{addr.country}</p>
                  </div>
                  {addr.id && (
                    <button
                      onClick={() => handleRemoveAddress(addr.id!)}
                      disabled={deletingId === addr.id}
                      className="ml-4 text-sm text-red-500 hover:text-red-700 disabled:opacity-50 shrink-0"
                    >
                      {deletingId === addr.id ? 'Removing...' : 'Remove'}
                    </button>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-500">No saved addresses yet.</p>
          )}

          {!showAddrForm ? (
            <button
              onClick={() => setShowAddrForm(true)}
              className="mt-2 flex items-center gap-2 text-sm font-medium text-green-600 hover:text-green-700"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Add New Address
            </button>
          ) : (
            <form onSubmit={handleAddAddress} className="border border-gray-200 rounded-xl p-5 space-y-4 mt-4">
              <h3 className="font-semibold text-gray-800 text-sm">New Address</h3>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Street</label>
                <input
                  type="text" required
                  value={addrForm.street}
                  onChange={(e) => setAddrForm({ ...addrForm, street: e.target.value })}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 text-sm"
                  placeholder="123 Main St"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                  <input
                    type="text" required
                    value={addrForm.city}
                    onChange={(e) => setAddrForm({ ...addrForm, city: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">State / County</label>
                  <input
                    type="text"
                    value={addrForm.state}
                    onChange={(e) => setAddrForm({ ...addrForm, state: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 text-sm"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Postal Code</label>
                  <input
                    type="text" required
                    value={addrForm.postalCode}
                    onChange={(e) => setAddrForm({ ...addrForm, postalCode: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Country</label>
                  <input
                    type="text" required
                    value={addrForm.country}
                    onChange={(e) => setAddrForm({ ...addrForm, country: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 text-sm"
                    placeholder="United Kingdom"
                  />
                </div>
              </div>
              <label className="flex items-center gap-2 text-sm text-gray-700">
                <input
                  type="checkbox"
                  checked={addrForm.isDefault}
                  onChange={(e) => setAddrForm({ ...addrForm, isDefault: e.target.checked })}
                  className="rounded text-green-600"
                />
                Set as default address
              </label>
              <div className="flex gap-3 pt-1">
                <button
                  type="submit"
                  disabled={addrLoading}
                  className="bg-green-600 text-white px-5 py-2 rounded-xl font-medium text-sm hover:bg-green-700 disabled:opacity-60"
                >
                  {addrLoading ? 'Saving...' : 'Save Address'}
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddrForm(false)}
                  className="px-5 py-2 rounded-xl font-medium text-sm text-gray-600 hover:bg-gray-100 border border-gray-300"
                >
                  Cancel
                </button>
              </div>
            </form>
          )}
        </div>
      )}
    </div>
  );
}
