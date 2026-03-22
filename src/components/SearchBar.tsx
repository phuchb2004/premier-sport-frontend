import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { productService } from '../services/productService';
import type { SearchSuggestionsResponse } from '../types';

interface SearchBarProps {
  onClose: () => void;
}

export function SearchBar({ onClose }: SearchBarProps) {
  const [query, setQuery] = useState('');
  const [debouncedQ, setDebouncedQ] = useState('');
  const [suggestions, setSuggestions] = useState<SearchSuggestionsResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  // Auto-focus on mount
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  // Debounce: produce debouncedQ 300ms after query stops changing
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedQ(query), 300);
    return () => clearTimeout(timer);
  }, [query]);

  // Fetch suggestions when debouncedQ changes
  useEffect(() => {
    if (debouncedQ.length < 2) {
      setSuggestions(null);
      setShowDropdown(false);
      setLoading(false);
      return;
    }

    const controller = new AbortController();
    setLoading(true);

    productService
      .searchSuggestions(debouncedQ, controller.signal)
      .then((data) => {
        setSuggestions(data);
        setShowDropdown(true);
      })
      .catch((err: unknown) => {
        // Ignore abort — just means a newer request replaced this one
        if (!axios.isCancel(err)) {
          setSuggestions(null);
          setShowDropdown(false);
        }
      })
      .finally(() => setLoading(false));

    return () => controller.abort();
  }, [debouncedQ]);

  // Click outside: hide dropdown only — bar stays open
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && query.trim()) {
      navigate(`/products?search=${encodeURIComponent(query.trim())}`);
      onClose();
    } else if (e.key === 'Escape') {
      onClose();
    }
  };

  const handleClear = () => {
    setQuery('');
    setSuggestions(null);
    setShowDropdown(false);
    inputRef.current?.focus();
    // Does NOT call onClose — bar stays open (consistent with click-outside behaviour)
  };

  const hasResults =
    suggestions &&
    (suggestions.products.length > 0 ||
      suggestions.categories.length > 0 ||
      suggestions.brands.length > 0);

  return (
    <div ref={containerRef} className="relative w-full">
      {/* Input row */}
      <div className="relative">
        <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
          <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          maxLength={50}
          placeholder="Search products, brands..."
          className="w-full pl-9 pr-10 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500 bg-gray-50"
        />
        {loading && (
          <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
            <div className="w-4 h-4 border-2 border-gray-300 border-t-green-500 rounded-full animate-spin" />
          </div>
        )}
        {!loading && query && (
          <button
            onClick={handleClear}
            aria-label="Clear search"
            className="absolute inset-y-0 right-3 flex items-center text-gray-400 hover:text-gray-600"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>

      {/* Dropdown */}
      {showDropdown && suggestions && (
        <div className="absolute top-full left-0 right-0 bg-white border border-gray-200 rounded-lg shadow-xl z-50 mt-1 max-h-96 overflow-y-auto">
          {!hasResults && (
            <p className="px-4 py-3 text-sm text-gray-500">No results for &ldquo;{debouncedQ}&rdquo;</p>
          )}

          {/* Products */}
          {suggestions.products.length > 0 && (
            <div>
              <p className="px-4 pt-3 pb-1 text-xs font-semibold text-gray-400 uppercase tracking-wide">Products</p>
              {suggestions.products.map((product) => (
                <button
                  key={product.id}
                  onClick={() => {
                    navigate(`/products/${product.category.toLowerCase()}/${product.slug}`);
                    onClose();
                  }}
                  aria-label={`Go to ${product.name}`}
                  className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-gray-50 text-left transition-colors"
                >
                  {product.image ? (
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-10 h-10 object-cover rounded-md flex-shrink-0"
                    />
                  ) : (
                    <div className="w-10 h-10 bg-gray-100 rounded-md flex-shrink-0 flex items-center justify-center">
                      <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                          d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                  )}
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">{product.name}</p>
                    <p className="text-xs text-gray-500">
                      {product.salePrice != null
                        ? `${product.salePrice.toLocaleString('vi-VN')}₫`
                        : `${product.price.toLocaleString('vi-VN')}₫`}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          )}

          {/* Categories */}
          {suggestions.categories.length > 0 && (
            <div className={suggestions.products.length > 0 ? 'border-t border-gray-100' : ''}>
              <p className="px-4 pt-3 pb-1 text-xs font-semibold text-gray-400 uppercase tracking-wide">Categories</p>
              <div className="flex flex-wrap gap-2 px-4 pb-3">
                {suggestions.categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => {
                      navigate(`/products/${cat.toLowerCase()}`);
                      onClose();
                    }}
                    className="px-3 py-1 text-xs bg-gray-100 rounded-full text-gray-700 hover:bg-green-50 hover:text-green-700 transition-colors"
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Brands */}
          {suggestions.brands.length > 0 && (
            <div className={
              suggestions.products.length > 0 || suggestions.categories.length > 0
                ? 'border-t border-gray-100'
                : ''
            }>
              <p className="px-4 pt-3 pb-1 text-xs font-semibold text-gray-400 uppercase tracking-wide">Brands</p>
              <div className="flex flex-wrap gap-2 px-4 pb-3">
                {suggestions.brands.map((brand) => (
                  <button
                    key={brand}
                    onClick={() => {
                      navigate(`/products?search=${encodeURIComponent(brand)}`);
                      onClose();
                    }}
                    className="px-3 py-1 text-xs bg-gray-100 rounded-full text-gray-700 hover:bg-green-50 hover:text-green-700 transition-colors"
                  >
                    {brand}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
