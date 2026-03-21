import { Link } from 'react-router-dom';
import { useEffect, useRef, useState } from 'react';
import { productService } from '../services/productService';
import type { Product } from '../types';
import { useLanguage } from '../context/LanguageContext';

const BANNER_SLIDES = [
  {
    gradient: 'from-green-900 via-green-800 to-green-600',
    accentColor: 'text-green-300',
    badge: '🏆 New Season 2025',
    title1: 'Play Like a',
    title2: 'Champion',
    subtitle: 'Premium football gear for every level — kits, boots, balls & accessories.',
    cta: { label: 'Shop Now', href: '/products' },
    cta2: { label: 'Learn More', href: '/about' },
    emoji: '⚽',
    pattern: 'repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(255,255,255,.05) 10px, rgba(255,255,255,.05) 20px)',
  },
  {
    gradient: 'from-red-900 via-red-800 to-red-600',
    accentColor: 'text-red-300',
    badge: '👟 Staff Picks',
    title1: 'Find Your',
    title2: 'Perfect Boots',
    subtitle: 'Grip the pitch with pro-grade football boots trusted by champions worldwide.',
    cta: { label: 'Shop Boots', href: '/products/boots' },
    cta2: null,
    emoji: '👟',
    pattern: 'repeating-linear-gradient(135deg, transparent, transparent 12px, rgba(255,255,255,.04) 12px, rgba(255,255,255,.04) 24px)',
  },
  {
    gradient: 'from-blue-900 via-blue-800 to-blue-600',
    accentColor: 'text-blue-300',
    badge: '👕 Kits Collection',
    title1: 'Dress Like',
    title2: 'a Pro',
    subtitle: 'Authentic kits and jerseys from your favourite clubs and national teams.',
    cta: { label: 'Shop Kits', href: '/products/kits' },
    cta2: null,
    emoji: '👕',
    pattern: 'repeating-linear-gradient(60deg, transparent, transparent 8px, rgba(255,255,255,.04) 8px, rgba(255,255,255,.04) 16px)',
  },
  {
    gradient: 'from-yellow-700 via-yellow-600 to-orange-500',
    accentColor: 'text-yellow-200',
    badge: '⚽ Featured Balls',
    title1: 'The Perfect',
    title2: 'Match Ball',
    subtitle: 'From training to tournament — discover balls built for performance and precision.',
    cta: { label: 'Shop Balls', href: '/products/balls' },
    cta2: null,
    emoji: '⚽',
    pattern: 'repeating-linear-gradient(30deg, transparent, transparent 10px, rgba(255,255,255,.04) 10px, rgba(255,255,255,.04) 20px)',
  },
];

const SLIDE_INTERVAL = 5000;

function HeroBanner() {
  const [current, setCurrent] = useState(0);
  const [paused, setPaused] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const total = BANNER_SLIDES.length;

  const goTo = (index: number) => setCurrent((index + total) % total);

  useEffect(() => {
    if (paused) return;
    intervalRef.current = setInterval(() => {
      setCurrent((prev) => (prev + 1) % total);
    }, SLIDE_INTERVAL);
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [paused, total]);

  return (
    <section
      className="relative overflow-hidden"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* Slides track */}
      <div
        className="flex transition-transform duration-700 ease-in-out"
        style={{ transform: `translateX(-${current * 100}%)` }}
      >
        {BANNER_SLIDES.map((slide, i) => (
          <div
            key={i}
            className={`min-w-full relative bg-gradient-to-br ${slide.gradient} text-white overflow-hidden`}
          >
            {/* Background pattern */}
            <div className="absolute inset-0 opacity-100" style={{ backgroundImage: slide.pattern }} />

            <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32">
              <div className="max-w-2xl">
                {/* Badge */}
                <span className="inline-block bg-white/20 backdrop-blur-sm text-white text-sm font-medium px-4 py-1.5 rounded-full mb-6">
                  {slide.badge}
                </span>
                <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-6 leading-tight">
                  {slide.title1}<br />
                  <span className={slide.accentColor}>{slide.title2}</span>
                </h1>
                <p className="text-lg md:text-xl text-white/80 mb-8 leading-relaxed">
                  {slide.subtitle}
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Link
                    to={slide.cta.href}
                    className="inline-flex items-center justify-center px-8 py-3 bg-white text-gray-900 font-bold rounded-xl hover:bg-white/90 transition-colors text-base"
                  >
                    {slide.cta.label}
                  </Link>
                  {slide.cta2 && (
                    <Link
                      to={slide.cta2.href}
                      className="inline-flex items-center justify-center px-8 py-3 border-2 border-white text-white font-bold rounded-xl hover:bg-white/10 transition-colors text-base"
                    >
                      {slide.cta2.label}
                    </Link>
                  )}
                </div>
              </div>
            </div>

            {/* Decorative emoji */}
            <div className="absolute right-0 bottom-0 text-[18rem] opacity-5 leading-none select-none pointer-events-none">
              {slide.emoji}
            </div>
          </div>
        ))}
      </div>

      {/* Prev / Next arrows */}
      <button
        onClick={() => goTo(current - 1)}
        className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center bg-white/20 hover:bg-white/40 text-white rounded-full backdrop-blur-sm transition-colors z-10"
        aria-label="Previous slide"
      >
        ‹
      </button>
      <button
        onClick={() => goTo(current + 1)}
        className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center bg-white/20 hover:bg-white/40 text-white rounded-full backdrop-blur-sm transition-colors z-10"
        aria-label="Next slide"
      >
        ›
      </button>

      {/* Dot indicators */}
      <div className="absolute bottom-5 left-1/2 -translate-x-1/2 flex items-center gap-2 z-10">
        {BANNER_SLIDES.map((_, i) => (
          <button
            key={i}
            onClick={() => goTo(i)}
            className={`transition-all duration-300 rounded-full ${
              i === current
                ? 'w-6 h-2.5 bg-white'
                : 'w-2.5 h-2.5 bg-white/40 hover:bg-white/70'
            }`}
            aria-label={`Go to slide ${i + 1}`}
          />
        ))}
      </div>
    </section>
  );
}

function ProductCard({ product }: { product: Product }) {
  const displayPrice = product.salePrice ?? product.price;
  const isOnSale = !!product.salePrice;

  return (
    <Link
      to={`/products/${product.category.toLowerCase()}/${product.slug}`}
      className="group bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow"
    >
      <div className="aspect-square bg-gray-100 overflow-hidden">
        {product.images[0] ? (
          <img
            src={product.images[0]}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-5xl">⚽</div>
        )}
      </div>
      <div className="p-4">
        <p className="text-xs text-gray-500 mb-1">{product.brand}</p>
        <h3 className="font-semibold text-gray-900 text-sm line-clamp-2">{product.name}</h3>
        <div className="flex items-center gap-2 mt-2">
          <span className="font-bold text-gray-900">£{displayPrice.toFixed(2)}</span>
          {isOnSale && (
            <span className="text-sm text-gray-400 line-through">£{product.price.toFixed(2)}</span>
          )}
        </div>
      </div>
    </Link>
  );
}

export default function HomePage() {
  const { t } = useLanguage();
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [fetchError, setFetchError] = useState(false);

  const CATEGORIES = [
    { label: t.kits, value: 'KITS', path: '/products/kits', description: t.kitsDesc, emoji: '👕', color: 'from-blue-500 to-blue-700' },
    { label: t.boots, value: 'BOOTS', path: '/products/boots', description: t.bootsDesc, emoji: '👟', color: 'from-red-500 to-red-700' },
    { label: t.accessories, value: 'ACCESSORIES', path: '/products/accessories', description: t.accessoriesDesc, emoji: '🧤', color: 'from-yellow-500 to-yellow-700' },
    { label: t.balls, value: 'BALLS', path: '/products/balls', description: t.ballsDesc, emoji: '⚽', color: 'from-green-500 to-green-700' },
  ];

  const TRUST_BADGES = [
    { icon: '🚚', title: t.freeDelivery, desc: t.freeDeliveryDesc },
    { icon: '↩️', title: t.easyReturns, desc: t.easyReturnsDesc },
    { icon: '🔒', title: t.securePayment, desc: t.securePaymentDesc },
  ];

  useEffect(() => {
    productService.getFeaturedProducts()
      .then(setFeaturedProducts)
      .catch(() => setFetchError(true))
      .finally(() => setIsLoading(false));
  }, []);

  return (
    <>
      <HeroBanner />

      {/* Category grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-gray-900 mb-3">{t.shopByCategory}</h2>
          <p className="text-gray-500">{t.categorySubtitle}</p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {CATEGORIES.map((cat) => (
            <Link
              key={cat.value}
              to={cat.path}
              className={`group relative bg-gradient-to-br ${cat.color} rounded-2xl p-6 text-white overflow-hidden hover:scale-105 transition-transform cursor-pointer`}
            >
              <div className="text-4xl mb-3">{cat.emoji}</div>
              <h3 className="font-bold text-lg mb-1">{cat.label}</h3>
              <p className="text-sm opacity-80">{cat.description}</p>
              <div className="absolute -bottom-4 -right-4 text-8xl opacity-10 group-hover:opacity-20 transition-opacity">
                {cat.emoji}
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured products */}
      <section className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-10">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-1">{t.featuredProducts}</h2>
              <p className="text-gray-500">{t.featuredSubtitle}</p>
            </div>
            <Link to="/products" className="text-green-600 font-semibold hover:text-green-700 text-sm">
              {t.viewAll}
            </Link>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="bg-white rounded-xl border border-gray-200 overflow-hidden animate-pulse">
                  <div className="aspect-square bg-gray-200" />
                  <div className="p-4 space-y-2">
                    <div className="h-3 bg-gray-200 rounded w-1/3" />
                    <div className="h-4 bg-gray-200 rounded w-2/3" />
                    <div className="h-4 bg-gray-200 rounded w-1/4" />
                  </div>
                </div>
              ))}
            </div>
          ) : fetchError ? (
            <div className="text-center py-12 text-gray-500">
              <p>{t.loadingError}</p>
            </div>
          ) : featuredProducts.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {featuredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-gray-500">
              <div className="text-5xl mb-4">⚽</div>
              <p>{t.featuredEmpty}</p>
            </div>
          )}
        </div>
      </section>

      {/* Trust badges */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {TRUST_BADGES.map((badge) => (
            <div key={badge.title} className="flex items-center gap-4 p-6 bg-white border border-gray-200 rounded-xl">
              <span className="text-3xl">{badge.icon}</span>
              <div>
                <h3 className="font-semibold text-gray-900">{badge.title}</h3>
                <p className="text-sm text-gray-500">{badge.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
