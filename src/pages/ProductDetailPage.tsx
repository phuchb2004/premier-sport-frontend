import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { productService } from '../services/productService';
import { useCart } from '../hooks/useCart';
import { useAuth } from '../hooks/useAuth';
import { useLanguage } from '../context/LanguageContext';
import type { Product } from '../types';

function DetailSkeleton() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-pulse">
      <div className="h-4 bg-gray-200 rounded w-48 mb-6" />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        <div className="aspect-square bg-gray-200 rounded-2xl" />
        <div className="space-y-4">
          <div className="h-6 bg-gray-200 rounded w-1/4" />
          <div className="h-8 bg-gray-200 rounded w-3/4" />
          <div className="h-6 bg-gray-200 rounded w-1/5" />
          <div className="h-4 bg-gray-200 rounded w-full" />
          <div className="h-4 bg-gray-200 rounded w-5/6" />
          <div className="flex gap-2 mt-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="w-12 h-10 bg-gray-200 rounded-lg" />
            ))}
          </div>
          <div className="h-12 bg-gray-200 rounded-xl mt-6" />
        </div>
      </div>
    </div>
  );
}

export default function ProductDetailPage() {
  const { slug } = useParams<{ category: string; slug: string }>();
  const navigate = useNavigate();
  const { addItem } = useCart();
  const { isAuthenticated } = useAuth();
  const { t } = useLanguage();

  const CATEGORY_LABELS: Record<string, string> = {
    JERSEY: t.jersey,
    BOOTS: t.boots,
    ACCESSORIES: t.accessories,
    BALLS: t.balls,
  };

  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [fetchError, setFetchError] = useState(false);
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [sizeError, setSizeError] = useState(false);
  const [addingToCart, setAddingToCart] = useState(false);
  const [addedToCart, setAddedToCart] = useState(false);
  const [cartError, setCartError] = useState(false);

  useEffect(() => {
    if (!slug) return;
    setIsLoading(true);
    setNotFound(false);
    setFetchError(false);
    productService
      .getProductBySlug(slug)
      .then((p) => {
        setProduct(p);
        setSelectedImage(0);
        setSelectedSize(null);
        setQuantity(1);
      })
      .catch((err) => {
        if (err?.response?.status === 404) {
          setNotFound(true);
        } else {
          setFetchError(true);
        }
      })
      .finally(() => setIsLoading(false));
  }, [slug]);

  async function handleAddToCart() {
    if (!product) return;

    if (product.sizes.length > 0 && !selectedSize) {
      setSizeError(true);
      return;
    }

    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    setAddingToCart(true);
    setCartError(false);
    try {
      await addItem({
        productId: product.id,
        productName: product.name,
        productImage: product.images[0] ?? '',
        size: selectedSize ?? 'ONE SIZE',
        quantity,
      });
      setAddedToCart(true);
      setTimeout(() => setAddedToCart(false), 2000);
    } catch {
      setCartError(true);
      setTimeout(() => setCartError(false), 3000);
    } finally {
      setAddingToCart(false);
    }
  }

  if (isLoading) return <DetailSkeleton />;

  if (fetchError) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center">
        <div className="text-6xl mb-4">⚠️</div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">{t.productErrorTitle}</h1>
        <p className="text-gray-500 mb-6">{t.productErrorMessage}</p>
        <div className="flex items-center justify-center gap-3">
          <button
            onClick={() => window.location.reload()}
            className="inline-flex items-center px-6 py-3 bg-green-600 text-white rounded-xl font-medium hover:bg-green-700 transition-colors"
          >
            {t.productTryAgain}
          </button>
          <Link
            to="/products"
            className="inline-flex items-center px-6 py-3 border border-gray-300 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition-colors"
          >
            {t.productBack}
          </Link>
        </div>
      </div>
    );
  }

  if (notFound || !product) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center">
        <div className="text-6xl mb-4">😔</div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">{t.productNotFound}</h1>
        <p className="text-gray-500 mb-6">{t.productNotFoundMessage}</p>
        <Link
          to="/products"
          className="inline-flex items-center px-6 py-3 bg-green-600 text-white rounded-xl font-medium hover:bg-green-700 transition-colors"
        >
          {t.productBack}
        </Link>
      </div>
    );
  }

  const displayPrice = product.salePrice ?? product.price;
  const isOnSale = !!product.salePrice;
  const isOutOfStock = product.stock === 0;
  const isLowStock = product.stock > 0 && product.stock < 5;
  const categoryLabel = CATEGORY_LABELS[product.category] ?? product.category;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-gray-500 mb-6">
          <Link to="/" className="hover:text-green-600">{t.productHome}</Link>
          <span>›</span>
          <Link to={`/products/${product.category.toLowerCase()}`} className="hover:text-green-600">
            {categoryLabel}
          </Link>
          <span>›</span>
          <span className="text-gray-900 font-medium line-clamp-1">{product.name}</span>
        </nav>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 lg:gap-16">
          {/* Image gallery */}
          <div>
            <div className="aspect-square bg-gray-100 rounded-2xl overflow-hidden mb-3">
              {product.images[selectedImage] ? (
                <img
                  src={product.images[selectedImage]}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-8xl">⚽</div>
              )}
            </div>
            {product.images.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-1">
                {product.images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedImage(i)}
                    className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-colors ${
                      i === selectedImage ? 'border-green-500' : 'border-transparent'
                    }`}
                  >
                    <img src={img} alt={`${product.name} ${i + 1}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product info */}
          <div>
            {/* Brand + Category badge */}
            <div className="flex items-center gap-2 mb-2">
              <span className="text-sm font-semibold text-gray-500 uppercase tracking-wide">{product.brand}</span>
              <span className="bg-green-100 text-green-700 text-xs font-medium px-2 py-0.5 rounded-full">
                {categoryLabel}
              </span>
            </div>

            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">{product.name}</h1>

            {/* Price */}
            <div className="flex items-center gap-3 mb-4">
              <span className="text-3xl font-bold text-gray-900">{displayPrice.toLocaleString('vi-VN')}₫</span>
              {isOnSale && (
                <>
                  <span className="text-xl text-gray-400 line-through">{product.price.toLocaleString('vi-VN')}₫</span>
                  <span className="bg-red-100 text-red-600 text-sm font-bold px-2 py-0.5 rounded">
                    {t.productSavePrefix}{(product.price - displayPrice).toLocaleString('vi-VN')}₫
                  </span>
                </>
              )}
            </div>

            {/* Stock indicator */}
            {isOutOfStock && (
              <div className="mb-4 text-red-600 font-medium text-sm">{t.productOutOfStockIndicator}</div>
            )}
            {isLowStock && (
              <div className="mb-4 text-amber-600 font-medium text-sm">
                {t.productLowStockPrefix}{product.stock}{t.productLowStockSuffix}
              </div>
            )}

            {/* Description */}
            <p className="text-gray-600 leading-relaxed mb-6">{product.description}</p>

            {/* Size selector */}
            {product.sizes.length > 0 && (
              <div className="mb-6">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm font-semibold text-gray-700">{t.productSizeLabel}</p>
                  {selectedSize && (
                    <span className="text-sm text-green-600 font-medium">{t.productSelectedSize}{selectedSize}</span>
                  )}
                </div>
                <div className="flex flex-wrap gap-2">
                  {product.sizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => {
                        setSelectedSize(size);
                        setSizeError(false);
                      }}
                      className={`px-4 py-2 rounded-lg border-2 text-sm font-medium transition-colors ${
                        selectedSize === size
                          ? 'border-green-600 bg-green-600 text-white'
                          : 'border-gray-300 text-gray-700 hover:border-green-400'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
                {sizeError && (
                  <p className="text-red-500 text-sm mt-2">{t.productSizeError}</p>
                )}
              </div>
            )}

            {/* Quantity selector */}
            <div className="mb-6">
              <p className="text-sm font-semibold text-gray-700 mb-2">{t.productQuantityLabel}</p>
              <div className="flex items-center gap-0 w-fit border border-gray-300 rounded-lg overflow-hidden">
                <button
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  disabled={quantity <= 1}
                  className="w-10 h-10 flex items-center justify-center text-lg text-gray-600 hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                >
                  −
                </button>
                <span className="w-12 h-10 flex items-center justify-center text-sm font-semibold border-x border-gray-300">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity((q) => Math.min(product.stock || 99, q + 1))}
                  disabled={quantity >= (product.stock || 99)}
                  className="w-10 h-10 flex items-center justify-center text-lg text-gray-600 hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                >
                  +
                </button>
              </div>
            </div>

            {/* Add to cart */}
            <button
              onClick={handleAddToCart}
              disabled={isOutOfStock || addingToCart}
              className={`w-full py-4 rounded-xl font-bold text-base transition-all ${
                addedToCart
                  ? 'bg-green-500 text-white'
                  : cartError
                  ? 'bg-red-500 text-white'
                  : isOutOfStock
                  ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  : 'bg-green-600 text-white hover:bg-green-700 active:scale-[0.98]'
              }`}
            >
              {addingToCart
                ? t.productAdding
                : addedToCart
                ? t.productAdded
                : cartError
                ? t.productAddFailed
                : isOutOfStock
                ? t.productOutOfStock
                : t.productAddToCart}
            </button>

            {!isAuthenticated && !isOutOfStock && (
              <p className="text-center text-sm text-gray-500 mt-2">
                {t.productSignInPrefix}<Link to="/login" className="text-green-600 hover:underline">{t.productSignIn}</Link>{t.productSignInSuffix}
              </p>
            )}
          </div>
        </div>
      </div>
  );
}
