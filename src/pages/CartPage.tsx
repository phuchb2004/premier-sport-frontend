import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../hooks/useCart';
import { useLanguage } from '../context/LanguageContext';

const DELIVERY_COST = 50000;

export default function CartPage() {
  const { cart, isLoading, updateItem, removeItem } = useCart();
  const navigate = useNavigate();
  const { t } = useLanguage();

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-64">
        <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const items = cart?.items ?? [];
  const subtotal = items.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);
  const total = items.length > 0 ? subtotal + DELIVERY_COST : 0;

  if (items.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center">
        <div className="text-6xl mb-6">🛒</div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">{t.cartEmptyTitle}</h1>
        <p className="text-gray-500 mb-8">{t.cartEmptyMessage}</p>
        <Link
          to="/products"
          className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
        >
          {t.cartContinueShopping}
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-8">{t.cartPageTitle}</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart items */}
        <div className="lg:col-span-2 space-y-4">
          {items.map((item, index) => (
            <div key={`${item.productId}-${item.size}-${index}`}
              className="flex gap-4 bg-white rounded-xl border border-gray-200 p-4">
              {item.productImage ? (
                <img
                  src={item.productImage}
                  alt={item.productName}
                  className="w-24 h-24 object-cover rounded-lg flex-shrink-0 bg-gray-100"
                />
              ) : (
                <div className="w-24 h-24 rounded-lg bg-gray-100 flex-shrink-0 flex items-center justify-center text-gray-400 text-sm">
                  {t.cartNoImage}
                </div>
              )}

              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-gray-900 truncate">{item.productName}</h3>
                <p className="text-sm text-gray-500 mt-0.5">{t.cartSizePrefix}{item.size}{item.color ? ` · ${item.color}` : ''}</p>
                <p className="text-sm font-medium text-gray-900 mt-1">{item.unitPrice.toLocaleString('vi-VN')}₫ {t.cartEach}</p>
              </div>

              <div className="flex flex-col items-end justify-between">
                <p className="font-semibold text-gray-900">
                  {(item.unitPrice * item.quantity).toLocaleString('vi-VN')}₫
                </p>

                <div className="flex items-center gap-2">
                  <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden">
                    <button
                      onClick={() => item.quantity > 1 && updateItem(index, item.quantity - 1)}
                      disabled={item.quantity <= 1}
                      className="px-3 py-1 text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                      −
                    </button>
                    <span className="px-3 py-1 text-sm font-medium border-x border-gray-300">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateItem(index, item.quantity + 1)}
                      className="px-3 py-1 text-gray-600 hover:bg-gray-50"
                    >
                      +
                    </button>
                  </div>

                  <button
                    onClick={() => removeItem(index)}
                    className="text-red-500 hover:text-red-700 text-sm px-2 py-1"
                    aria-label={t.cartRemove}
                  >
                    {t.cartRemove}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Order summary */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl border border-gray-200 p-6 sticky top-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">{t.cartOrderSummary}</h2>

            <div className="space-y-3 text-sm">
              <div className="flex justify-between text-gray-600">
                <span>{t.cartSubtotalPrefix}{items.reduce((s, i) => s + i.quantity, 0)}{t.cartSubtotalSuffix}</span>
                <span>{subtotal.toLocaleString('vi-VN')}₫</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>{t.cartDelivery}</span>
                <span>{DELIVERY_COST.toLocaleString('vi-VN')}₫</span>
              </div>
              <div className="border-t border-gray-200 pt-3 flex justify-between font-semibold text-gray-900 text-base">
                <span>{t.cartTotal}</span>
                <span>{total.toLocaleString('vi-VN')}₫</span>
              </div>
            </div>

            <button
              onClick={() => navigate('/checkout')}
              className="mt-6 w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors"
            >
              {t.cartCheckout}
            </button>

            <Link
              to="/products"
              className="mt-3 block text-center text-sm text-gray-500 hover:text-gray-700"
            >
              {t.cartContinueShopping}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
