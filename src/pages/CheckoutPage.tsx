import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useCart } from '../hooks/useCart';
import { orderService } from '../services/orderService';
import type { CartItem, Order } from '../types';

const DELIVERY_COST = 4.99;

// Placeholder bank/wallet details — replace with real accounts before going live
const VIETQR_BANK_ID = 'vcb';
const VIETQR_ACCOUNT_NO = '0123456789';
const VIETQR_ACCOUNT_NAME = 'PREMIER SPORT';
const MOMO_PHONE = '0909999999';
const MOMO_NAME = 'PREMIER SPORT';

interface ShippingForm {
  street: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

interface PaymentStepProps {
  order: Order;
  onSuccess: () => void;
}

function VietQRPanel({ order }: { order: Order }) {
  const qrUrl =
    `https://img.vietqr.io/image/${VIETQR_BANK_ID}-${VIETQR_ACCOUNT_NO}-compact2.png` +
    `?amount=${Math.round(order.total * 100)}&addInfo=${encodeURIComponent('DH ' + order.orderNumber)}&accountName=${encodeURIComponent(VIETQR_ACCOUNT_NAME)}`;

  return (
    <div className="space-y-4">
      <div className="flex flex-col items-center gap-3">
        <img
          src={qrUrl}
          alt="VietQR"
          className="w-52 h-52 border border-gray-200 rounded-lg"
        />
        <p className="text-xs text-gray-500">Quét mã bằng app ngân hàng bất kỳ</p>
      </div>
      <div className="bg-gray-50 rounded-lg p-4 text-sm space-y-1">
        <div className="flex justify-between">
          <span className="text-gray-500">Ngân hàng</span>
          <span className="font-medium">Vietcombank (VCB)</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-500">Số tài khoản</span>
          <span className="font-medium font-mono">{VIETQR_ACCOUNT_NO}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-500">Chủ tài khoản</span>
          <span className="font-medium">{VIETQR_ACCOUNT_NAME}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-500">Số tiền</span>
          <span className="font-semibold text-green-700">£{order.total.toFixed(2)}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-500">Nội dung</span>
          <span className="font-medium font-mono">DH {order.orderNumber}</span>
        </div>
      </div>
    </div>
  );
}

function MoMoPanel({ order }: { order: Order }) {
  const qrUrl =
    `https://img.vietqr.io/image/momo-${MOMO_PHONE}-compact2.png` +
    `?amount=${Math.round(order.total * 100)}&addInfo=${encodeURIComponent('DH ' + order.orderNumber)}&accountName=${encodeURIComponent(MOMO_NAME)}`;

  return (
    <div className="space-y-4">
      <div className="flex flex-col items-center gap-3">
        <img
          src={qrUrl}
          alt="MoMo QR"
          className="w-52 h-52 border border-gray-200 rounded-lg"
          onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
        />
        <p className="text-xs text-gray-500">Quét mã bằng ứng dụng MoMo</p>
      </div>
      <div className="bg-pink-50 rounded-lg p-4 text-sm space-y-1">
        <div className="flex justify-between">
          <span className="text-gray-500">Số điện thoại MoMo</span>
          <span className="font-medium font-mono">{MOMO_PHONE}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-500">Tên</span>
          <span className="font-medium">{MOMO_NAME}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-500">Số tiền</span>
          <span className="font-semibold text-green-700">£{order.total.toFixed(2)}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-500">Nội dung</span>
          <span className="font-medium font-mono">DH {order.orderNumber}</span>
        </div>
      </div>
    </div>
  );
}

function PaymentStep({ order, onSuccess }: PaymentStepProps) {
  const [method, setMethod] = useState<'VIETQR' | 'MOMO'>('VIETQR');
  const [confirming, setConfirming] = useState(false);
  const [error, setError] = useState('');

  const handleConfirm = async () => {
    setConfirming(true);
    setError('');
    try {
      await orderService.confirmPayment(order.id, method);
      onSuccess();
    } catch {
      setError('Xác nhận thanh toán thất bại. Vui lòng thử lại hoặc liên hệ hỗ trợ.');
      setConfirming(false);
    }
  };

  return (
    <div className="space-y-5">
      {/* Method selector */}
      <div className="flex gap-3">
        <button
          onClick={() => setMethod('VIETQR')}
          className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-lg border-2 font-medium text-sm transition-colors ${
            method === 'VIETQR'
              ? 'border-blue-600 bg-blue-50 text-blue-700'
              : 'border-gray-200 text-gray-600 hover:border-gray-300'
          }`}
        >
          <img src="https://img.vietqr.io/favicon.png" alt="" className="w-5 h-5" onError={(e) => { (e.target as HTMLImageElement).style.display='none'; }} />
          VietQR
        </button>
        <button
          onClick={() => setMethod('MOMO')}
          className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-lg border-2 font-medium text-sm transition-colors ${
            method === 'MOMO'
              ? 'border-pink-500 bg-pink-50 text-pink-700'
              : 'border-gray-200 text-gray-600 hover:border-gray-300'
          }`}
        >
          <span className="text-lg">💳</span>
          MoMo
        </button>
      </div>

      {/* Payment info */}
      {method === 'VIETQR' ? (
        <VietQRPanel order={order} />
      ) : (
        <MoMoPanel order={order} />
      )}

      <p className="text-xs text-gray-500 bg-yellow-50 border border-yellow-200 rounded-lg px-3 py-2">
        Sau khi chuyển khoản thành công, nhấn nút bên dưới để xác nhận đơn hàng.
      </p>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg p-3 text-sm">
          {error}
        </div>
      )}

      <button
        onClick={handleConfirm}
        disabled={confirming}
        className="w-full bg-green-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-green-700 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {confirming ? 'Đang xác nhận…' : 'Tôi đã hoàn tất thanh toán'}
      </button>
    </div>
  );
}

export default function CheckoutPage() {
  const { cart, isLoading } = useCart();
  const navigate = useNavigate();

  const [step, setStep] = useState<'shipping' | 'payment'>('shipping');
  const [shipping, setShipping] = useState<ShippingForm>({
    street: '', city: '', state: '', postalCode: '', country: 'VN',
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [order, setOrder] = useState<Order | null>(null);

  const [snapshotItems, setSnapshotItems] = useState<CartItem[]>([]);
  useEffect(() => {
    if (!isLoading && cart?.items.length) {
      setSnapshotItems(cart.items);
    }
  }, [isLoading, cart]);

  useEffect(() => {
    if (!isLoading && step === 'shipping' && (!cart || cart.items.length === 0)) {
      navigate('/cart');
    }
  }, [cart, isLoading, navigate, step]);

  const displayItems = step === 'payment' ? snapshotItems : (cart?.items ?? []);
  const subtotal = displayItems.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);
  const total = subtotal + DELIVERY_COST;

  const handleShippingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');

    try {
      setSnapshotItems(cart?.items ?? []);
      const created = await orderService.createOrder({ shippingAddress: shipping });
      setOrder(created);
      setStep('payment');
    } catch {
      setError('Không thể tạo đơn hàng. Vui lòng thử lại.');
    } finally {
      setSubmitting(false);
    }
  };

  const handlePaymentSuccess = () => {
    navigate(`/orders/${order!.id}`);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-64">
        <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-8">Thanh toán</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left: form */}
        <div className="lg:col-span-2">
          {step === 'shipping' && (
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Địa chỉ giao hàng</h2>

              <form onSubmit={handleShippingSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Địa chỉ</label>
                  <input
                    required
                    type="text"
                    value={shipping.street}
                    onChange={e => setShipping({ ...shipping, street: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="123 Nguyễn Huệ"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Thành phố</label>
                    <input
                      required
                      type="text"
                      value={shipping.city}
                      onChange={e => setShipping({ ...shipping, city: e.target.value })}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Tỉnh / Quận</label>
                    <input
                      required
                      type="text"
                      value={shipping.state}
                      onChange={e => setShipping({ ...shipping, state: e.target.value })}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Mã bưu chính</label>
                    <input
                      required
                      type="text"
                      value={shipping.postalCode}
                      onChange={e => setShipping({ ...shipping, postalCode: e.target.value })}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Quốc gia</label>
                    <input
                      required
                      type="text"
                      value={shipping.country}
                      onChange={e => setShipping({ ...shipping, country: e.target.value })}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                {error && (
                  <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg p-3 text-sm">
                    {error}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {submitting ? 'Đang xử lý…' : 'Tiếp tục thanh toán'}
                </button>
              </form>
            </div>
          )}

          {step === 'payment' && order && (
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Phương thức thanh toán</h2>
              <PaymentStep order={order} onSuccess={handlePaymentSuccess} />
            </div>
          )}
        </div>

        {/* Right: order summary */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl border border-gray-200 p-6 sticky top-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Tóm tắt đơn hàng</h2>

            <div className="space-y-3 mb-4">
              {displayItems.map((item, i) => (
                <div key={i} className="flex justify-between text-sm">
                  <span className="text-gray-700 truncate pr-2">
                    {item.productName} × {item.quantity}
                  </span>
                  <span className="text-gray-900 font-medium flex-shrink-0">
                    £{(item.unitPrice * item.quantity).toFixed(2)}
                  </span>
                </div>
              ))}
            </div>

            <div className="border-t border-gray-200 pt-3 space-y-2 text-sm">
              <div className="flex justify-between text-gray-600">
                <span>Tạm tính</span>
                <span>£{subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Phí vận chuyển</span>
                <span>£{DELIVERY_COST.toFixed(2)}</span>
              </div>
              <div className="flex justify-between font-semibold text-gray-900 text-base pt-1 border-t border-gray-200">
                <span>Tổng cộng</span>
                <span>£{total.toFixed(2)}</span>
              </div>
            </div>

            {step === 'shipping' && (
              <Link
                to="/cart"
                className="mt-4 block text-center text-sm text-gray-500 hover:text-gray-700"
              >
                ← Quay lại giỏ hàng
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
