import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { loadStripe } from '@stripe/stripe-js';
import {
  Elements,
  PaymentElement,
  useStripe,
  useElements,
} from '@stripe/react-stripe-js';
import { useCart } from '../hooks/useCart';
import { orderService } from '../services/orderService';
import type { CartItem, Order } from '../types';

const STRIPE_KEY = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY as string | undefined;
const stripePromise = STRIPE_KEY ? loadStripe(STRIPE_KEY) : null;

const DELIVERY_COST = 4.99;

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

function PaymentStep({ order, onSuccess }: PaymentStepProps) {
  const stripe = useStripe();
  const elements = useElements();
  const [error, setError] = useState('');
  const [processing, setProcessing] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    setProcessing(true);
    setError('');

    const result = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/orders/${order.id}`,
      },
      redirect: 'if_required',
    });

    if (result.error) {
      setError(result.error.message ?? 'Payment failed. Please try again.');
      setProcessing(false);
    } else {
      onSuccess();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <PaymentElement />

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg p-3 text-sm">
          {error}
        </div>
      )}

      <button
        type="submit"
        disabled={!stripe || processing}
        className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {/* Fix #4: order.total already includes delivery (set by backend) */}
        {processing ? 'Processing…' : `Pay £${order.total.toFixed(2)}`}
      </button>
    </form>
  );
}

export default function CheckoutPage() {
  const { cart, isLoading } = useCart();
  const navigate = useNavigate();

  const [step, setStep] = useState<'shipping' | 'payment'>('shipping');
  const [shipping, setShipping] = useState<ShippingForm>({
    street: '', city: '', state: '', postalCode: '', country: 'GB',
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [order, setOrder] = useState<Order | null>(null);
  const [clientSecret, setClientSecret] = useState('');

  // Fix #7: snapshot cart items before order creation clears the cart
  const [snapshotItems, setSnapshotItems] = useState<CartItem[]>([]);
  useEffect(() => {
    if (!isLoading && cart?.items.length) {
      setSnapshotItems(cart.items);
    }
  }, [isLoading, cart]);

  // Fix #5: only redirect when still on shipping step (not after order is created)
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
      // Snapshot before creating order (which will clear the cart context)
      setSnapshotItems(cart?.items ?? []);
      const created = await orderService.createOrder({ shippingAddress: shipping });
      const { clientSecret: cs } = await orderService.createPaymentIntent(created.id);
      setOrder(created);
      setClientSecret(cs);
      setStep('payment');
    } catch {
      setError('Failed to create order. Please try again.');
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

  // Fix #8: guard against missing Stripe publishable key
  if (!stripePromise) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center">
        <p className="text-red-600 font-medium">Payment system is not configured.</p>
        <p className="text-gray-500 text-sm mt-1">
          Set <code>VITE_STRIPE_PUBLISHABLE_KEY</code> in your <code>.env.local</code> file.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-8">Checkout</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left: form */}
        <div className="lg:col-span-2">
          {step === 'shipping' && (
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Shipping Address</h2>

              <form onSubmit={handleShippingSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Street address</label>
                  <input
                    required
                    type="text"
                    value={shipping.street}
                    onChange={e => setShipping({ ...shipping, street: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="123 Example Street"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                    <input
                      required
                      type="text"
                      value={shipping.city}
                      onChange={e => setShipping({ ...shipping, city: e.target.value })}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">State / County</label>
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
                    <label className="block text-sm font-medium text-gray-700 mb-1">Postal code</label>
                    <input
                      required
                      type="text"
                      value={shipping.postalCode}
                      onChange={e => setShipping({ ...shipping, postalCode: e.target.value })}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Country</label>
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
                  {submitting ? 'Creating order…' : 'Continue to Payment'}
                </button>
              </form>
            </div>
          )}

          {step === 'payment' && order && clientSecret && (
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Payment</h2>
              <Elements stripe={stripePromise} options={{ clientSecret }}>
                <PaymentStep order={order} onSuccess={handlePaymentSuccess} />
              </Elements>
            </div>
          )}
        </div>

        {/* Right: order summary — uses snapshot after order creation so it stays visible */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl border border-gray-200 p-6 sticky top-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Order Summary</h2>

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
                <span>Subtotal</span>
                <span>£{subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Delivery</span>
                <span>£{DELIVERY_COST.toFixed(2)}</span>
              </div>
              <div className="flex justify-between font-semibold text-gray-900 text-base pt-1 border-t border-gray-200">
                <span>Total</span>
                <span>£{total.toFixed(2)}</span>
              </div>
            </div>

            {step === 'shipping' && (
              <Link
                to="/cart"
                className="mt-4 block text-center text-sm text-gray-500 hover:text-gray-700"
              >
                ← Back to cart
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
