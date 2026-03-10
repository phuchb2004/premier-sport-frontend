import { lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import { ProtectedRoute } from './ProtectedRoute';
import { AdminRoute } from './AdminRoute';
import { Spinner } from '../components/Spinner';

// Pages - lazy loaded
const HomePage = lazy(() => import('../pages/HomePage'));
const LoginPage = lazy(() => import('../pages/LoginPage'));
const RegisterPage = lazy(() => import('../pages/RegisterPage'));
const AboutPage = lazy(() => import('../pages/AboutPage'));

export function AppRoutes() {
  return (
    <Suspense fallback={<Spinner />}>
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/about" element={<AboutPage />} />

        {/* Protected user routes - placeholder pages for sprint 2+ */}
        <Route element={<ProtectedRoute />}>
          <Route path="/cart" element={<div className="p-8 text-center">Cart — Sprint 3</div>} />
          <Route path="/checkout" element={<div className="p-8 text-center">Checkout — Sprint 3</div>} />
          <Route path="/orders" element={<div className="p-8 text-center">Orders — Sprint 3</div>} />
          <Route path="/orders/:id" element={<div className="p-8 text-center">Order Detail — Sprint 3</div>} />
        </Route>

        {/* Admin routes */}
        <Route element={<AdminRoute />}>
          <Route path="/admin" element={<div className="p-8 text-center">Admin Dashboard — Sprint 4</div>} />
          <Route path="/admin/products" element={<div className="p-8 text-center">Admin Products — Sprint 4</div>} />
          <Route path="/admin/orders" element={<div className="p-8 text-center">Admin Orders — Sprint 4</div>} />
          <Route path="/admin/users" element={<div className="p-8 text-center">Admin Users — Sprint 4</div>} />
        </Route>

        {/* Product routes - Sprint 2 */}
        <Route path="/products" element={<div className="p-8 text-center">Products — Sprint 2</div>} />
        <Route path="/products/:category" element={<div className="p-8 text-center">Category — Sprint 2</div>} />
        <Route path="/products/:category/:slug" element={<div className="p-8 text-center">Product Detail — Sprint 2</div>} />

        {/* 404 */}
        <Route path="*" element={<div className="p-8 text-center text-gray-500">404 — Page not found</div>} />
      </Routes>
    </Suspense>
  );
}
