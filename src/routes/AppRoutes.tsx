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
const ProductsPage = lazy(() => import('../pages/ProductsPage'));
const ProductDetailPage = lazy(() => import('../pages/ProductDetailPage'));
const CartPage = lazy(() => import('../pages/CartPage'));
const CheckoutPage = lazy(() => import('../pages/CheckoutPage'));
const OrderHistoryPage = lazy(() => import('../pages/OrderHistoryPage'));
const OrderConfirmationPage = lazy(() => import('../pages/OrderConfirmationPage'));

export function AppRoutes() {
  return (
    <Suspense fallback={<Spinner />}>
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/about" element={<AboutPage />} />

        {/* Product routes */}
        <Route path="/products" element={<ProductsPage />} />
        <Route path="/products/:category" element={<ProductsPage />} />
        <Route path="/products/:category/:slug" element={<ProductDetailPage />} />

        {/* Protected user routes */}
        <Route element={<ProtectedRoute />}>
          <Route path="/cart" element={<CartPage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/orders" element={<OrderHistoryPage />} />
          <Route path="/orders/:id" element={<OrderConfirmationPage />} />
        </Route>

        {/* Admin routes */}
        <Route element={<AdminRoute />}>
          <Route path="/admin" element={<div className="p-8 text-center">Admin Dashboard — Sprint 4</div>} />
          <Route path="/admin/products" element={<div className="p-8 text-center">Admin Products — Sprint 4</div>} />
          <Route path="/admin/orders" element={<div className="p-8 text-center">Admin Orders — Sprint 4</div>} />
          <Route path="/admin/users" element={<div className="p-8 text-center">Admin Users — Sprint 4</div>} />
        </Route>

        {/* 404 */}
        <Route path="*" element={<div className="p-8 text-center text-gray-500">404 — Page not found</div>} />
      </Routes>
    </Suspense>
  );
}
