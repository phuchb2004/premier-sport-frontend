import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Layout } from '../components/layout/Layout';
import { productService } from '../services/productService';
import type { Product } from '../types';

const CATEGORIES = [
  {
    label: 'Kits',
    value: 'KITS',
    path: '/products/kits',
    description: 'Full match kits & training wear',
    emoji: '👕',
    color: 'from-blue-500 to-blue-700',
  },
  {
    label: 'Boots',
    value: 'BOOTS',
    path: '/products/boots',
    description: 'Performance football boots',
    emoji: '👟',
    color: 'from-red-500 to-red-700',
  },
  {
    label: 'Accessories',
    value: 'ACCESSORIES',
    path: '/products/accessories',
    description: 'Shin pads, gloves & more',
    emoji: '🧤',
    color: 'from-yellow-500 to-yellow-700',
  },
  {
    label: 'Balls',
    value: 'BALLS',
    path: '/products/balls',
    description: 'Match & training balls',
    emoji: '⚽',
    color: 'from-green-500 to-green-700',
  },
];

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
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    productService.getFeaturedProducts()
      .then(setFeaturedProducts)
      .catch(() => setFeaturedProducts([]))
      .finally(() => setIsLoading(false));
  }, []);

  return (
    <Layout>
      {/* Hero section */}
      <section className="relative bg-gradient-to-br from-green-800 to-green-600 text-white overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(255,255,255,.1) 10px, rgba(255,255,255,.1) 20px)'
          }} />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32">
          <div className="max-w-2xl">
            <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-6 leading-tight">
              Play Like a<br />
              <span className="text-green-300">Champion</span>
            </h1>
            <p className="text-lg md:text-xl text-green-100 mb-8 leading-relaxed">
              Premium football gear for every level. From grassroots to professional —
              find your perfect kit, boots, and equipment.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                to="/products"
                className="inline-flex items-center justify-center px-8 py-3 bg-white text-green-700 font-bold rounded-xl hover:bg-green-50 transition-colors text-base"
              >
                Shop Now
              </Link>
              <Link
                to="/about"
                className="inline-flex items-center justify-center px-8 py-3 border-2 border-white text-white font-bold rounded-xl hover:bg-white/10 transition-colors text-base"
              >
                Learn More
              </Link>
            </div>
          </div>
        </div>
        {/* Decorative football */}
        <div className="absolute right-0 bottom-0 text-[20rem] opacity-5 leading-none select-none">⚽</div>
      </section>

      {/* Category grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-gray-900 mb-3">Shop by Category</h2>
          <p className="text-gray-500">Everything you need on and off the pitch</p>
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
              <h2 className="text-3xl font-bold text-gray-900 mb-1">Featured Products</h2>
              <p className="text-gray-500">Hand-picked for performance and style</p>
            </div>
            <Link to="/products" className="text-green-600 font-semibold hover:text-green-700 text-sm">
              View all →
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
          ) : featuredProducts.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {featuredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-gray-500">
              <div className="text-5xl mb-4">⚽</div>
              <p>Featured products coming soon</p>
            </div>
          )}
        </div>
      </section>

      {/* Trust badges */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {[
            { icon: '🚚', title: 'Free Delivery', desc: 'On orders over £50' },
            { icon: '↩️', title: 'Easy Returns', desc: '30-day return policy' },
            { icon: '🔒', title: 'Secure Payment', desc: 'Powered by Stripe' },
          ].map((badge) => (
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
    </Layout>
  );
}
