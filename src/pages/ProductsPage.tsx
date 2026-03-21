import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { productService } from '../services/productService';
import type { Product, ProductCategory } from '../types';

const CATEGORIES: { label: string; value: ProductCategory | 'ALL' }[] = [
  { label: 'All', value: 'ALL' },
  { label: 'Kits', value: 'KITS' },
  { label: 'Boots', value: 'BOOTS' },
  { label: 'Accessories', value: 'ACCESSORIES' },
  { label: 'Balls', value: 'BALLS' },
];

const SORT_OPTIONS = [
  { label: 'Newest', value: 'newest' },
  { label: 'Price: Low → High', value: 'price-asc' },
  { label: 'Price: High → Low', value: 'price-desc' },
  { label: 'Name A → Z', value: 'name-asc' },
];

function ProductCardSkeleton() {
  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden animate-pulse">
      <div className="aspect-square bg-gray-200" />
      <div className="p-4 space-y-2">
        <div className="h-3 bg-gray-200 rounded w-1/3" />
        <div className="h-4 bg-gray-200 rounded w-2/3" />
        <div className="h-4 bg-gray-200 rounded w-1/4" />
      </div>
    </div>
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
      <div className="aspect-square bg-gray-100 overflow-hidden relative">
        {product.images[0] ? (
          <img
            src={product.images[0]}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-5xl">⚽</div>
        )}
        {isOnSale && (
          <span className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded">
            SALE
          </span>
        )}
      </div>
      <div className="p-4">
        <p className="text-xs text-gray-500 mb-1 uppercase tracking-wide">{product.brand}</p>
        <h3 className="font-semibold text-gray-900 text-sm line-clamp-2 mb-2">{product.name}</h3>
        <div className="flex items-center gap-2">
          <span className="font-bold text-gray-900">£{displayPrice.toFixed(2)}</span>
          {isOnSale && (
            <span className="text-sm text-gray-400 line-through">£{product.price.toFixed(2)}</span>
          )}
        </div>
      </div>
    </Link>
  );
}

function Pagination({
  currentPage,
  totalPages,
  onPageChange,
}: {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}) {
  if (totalPages <= 1) return null;

  const pages = Array.from({ length: totalPages }, (_, i) => i);
  const visiblePages = pages.filter(
    (p) => p === 0 || p === totalPages - 1 || Math.abs(p - currentPage) <= 1
  );

  return (
    <div className="flex items-center justify-center gap-1 mt-10">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 0}
        className="px-3 py-2 rounded-lg border border-gray-300 text-sm font-medium text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed"
      >
        ← Prev
      </button>

      {visiblePages.map((p, i) => {
        const prevPage = visiblePages[i - 1];
        const showEllipsis = prevPage !== undefined && p - prevPage > 1;
        return (
          <span key={p} className="flex items-center gap-1">
            {showEllipsis && <span className="px-2 text-gray-400">…</span>}
            <button
              onClick={() => onPageChange(p)}
              className={`w-9 h-9 rounded-lg text-sm font-medium transition-colors ${
                p === currentPage
                  ? 'bg-green-600 text-white'
                  : 'border border-gray-300 text-gray-600 hover:bg-gray-50'
              }`}
            >
              {p + 1}
            </button>
          </span>
        );
      })}

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages - 1}
        className="px-3 py-2 rounded-lg border border-gray-300 text-sm font-medium text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed"
      >
        Next →
      </button>
    </div>
  );
}

export default function ProductsPage() {
  const { category: categoryParam } = useParams<{ category?: string }>();
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  // Category comes from URL path segment (/products/:category), not search params
  const activeCategory: ProductCategory | 'ALL' = categoryParam
    ? (categoryParam.toUpperCase() as ProductCategory)
    : 'ALL';

  const search = searchParams.get('search') || '';
  const sort = searchParams.get('sort') || 'newest';
  const page = parseInt(searchParams.get('page') || '0', 10);

  const [products, setProducts] = useState<Product[]>([]);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [searchInput, setSearchInput] = useState(search);

  // Sync search input when URL search param changes (e.g. browser back/forward)
  useEffect(() => {
    setSearchInput(search);
  }, [search]);

  useEffect(() => {
    setIsLoading(true);
    const cat = activeCategory === 'ALL' ? undefined : activeCategory;
    productService
      .getProducts({ category: cat, search: search || undefined, page, size: 12, sort })
      .then((data) => {
        setProducts(data.content);
        setTotalPages(data.totalPages);
        setTotalElements(data.totalElements);
      })
      .catch(() => {
        setProducts([]);
        setTotalPages(0);
        setTotalElements(0);
      })
      .finally(() => setIsLoading(false));
  }, [activeCategory, search, sort, page]);

  // Build query string from current non-default params (excluding category, which lives in the path)
  function buildQuery(overrides: Record<string, string> = {}) {
    const params = new URLSearchParams();
    const effective = { sort, search, page: String(page), ...overrides };
    if (effective.sort && effective.sort !== 'newest') params.set('sort', effective.sort);
    if (effective.search) params.set('search', effective.search);
    if (effective.page && effective.page !== '0') params.set('page', effective.page);
    return params.toString();
  }

  // Category changes navigate to a new URL path segment
  function handleCategoryChange(cat: ProductCategory | 'ALL') {
    const query = buildQuery({ page: '0' });
    if (cat === 'ALL') {
      navigate(`/products${query ? '?' + query : ''}`);
    } else {
      navigate(`/products/${cat.toLowerCase()}${query ? '?' + query : ''}`);
    }
  }

  function updateParam(key: string, value: string) {
    const next = new URLSearchParams(searchParams);
    if (value && value !== 'newest' && value !== '0') {
      next.set(key, value);
    } else {
      next.delete(key);
    }
    if (key !== 'page') next.delete('page'); // reset page on filter/sort change
    setSearchParams(next);
  }

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    updateParam('search', searchInput);
  }

  function handleClearFilters() {
    setSearchInput('');
    navigate('/products');
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">
            {activeCategory === 'ALL'
              ? 'All Products'
              : CATEGORIES.find((c) => c.value === activeCategory)?.label ?? activeCategory}
          </h1>
          {!isLoading && (
            <p className="text-gray-500 mt-1 text-sm">
              {totalElements} {totalElements === 1 ? 'product' : 'products'}
            </p>
          )}
        </div>

        {/* Category tabs */}
        <div className="flex gap-2 flex-wrap mb-6">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.value}
              onClick={() => handleCategoryChange(cat.value)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors border ${
                activeCategory === cat.value
                  ? 'bg-green-600 text-white border-green-600'
                  : 'bg-white text-gray-600 border-gray-300 hover:border-green-400'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Search + Sort bar */}
        <div className="flex flex-col sm:flex-row gap-3 mb-8">
          <form onSubmit={handleSearch} className="flex-1 flex gap-2">
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Search products..."
              className="flex-1 border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
            />
            <button
              type="submit"
              className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700 transition-colors"
            >
              Search
            </button>
            {search && (
              <button
                type="button"
                onClick={() => {
                  setSearchInput('');
                  updateParam('search', '');
                }}
                className="px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-600 hover:bg-gray-50"
              >
                ✕
              </button>
            )}
          </form>

          <select
            value={sort}
            onChange={(e) => updateParam('sort', e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500 bg-white"
          >
            {SORT_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>

        {/* Product grid */}
        {isLoading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <ProductCardSkeleton key={i} />
            ))}
          </div>
        ) : products.length > 0 ? (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
            <Pagination
              currentPage={page}
              totalPages={totalPages}
              onPageChange={(p) => updateParam('page', String(p))}
            />
          </>
        ) : (
          <div className="flex flex-col items-center justify-center py-24 text-gray-400">
            <div className="text-6xl mb-4">🔍</div>
            <p className="text-lg font-medium text-gray-500 mb-2">No products found</p>
            <p className="text-sm mb-6">
              {search ? `No results for "${search}"` : 'Check back soon for new arrivals'}
            </p>
            {(search || activeCategory !== 'ALL') && (
              <button
                onClick={handleClearFilters}
                className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700"
              >
                Clear filters
              </button>
            )}
          </div>
        )}
      </div>
  );
}
