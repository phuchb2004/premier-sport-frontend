import { useState, useEffect, useRef } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useCart } from '../../hooks/useCart';
import { useLanguage } from '../../context/LanguageContext';
import { PremierSportLogo } from '../PremierSportLogo';
import { SearchBar } from '../SearchBar';

export function Header() {
  const { user, isAuthenticated, logout } = useAuth();
  const { itemCount } = useCart();
  const { language, t, toggleLanguage } = useLanguage();
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);
  const location = useLocation();
  const [prevPathname, setPrevPathname] = useState(location.pathname);

  useEffect(() => {
    if (!profileOpen) return;
    const handleClickOutside = (e: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setProfileOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [profileOpen]);

  useEffect(() => {
    setSearchOpen(false);
  }, [location.pathname]);

  if (prevPathname !== location.pathname) {
    setPrevPathname(location.pathname);
    setMenuOpen(false);
    setProfileOpen(false);
  }

  const categories = [
    { label: t.jersey, path: '/products/jersey' },
    { label: t.boots, path: '/products/boots' },
    { label: t.accessories, path: '/products/accessories' },
    { label: t.balls, path: '/products/balls' },
  ];

  const navLinkClass = ({ isActive }: { isActive: boolean }) =>
    `text-sm font-medium transition-colors ${
      isActive ? 'text-green-600' : 'text-gray-600 hover:text-gray-900'
    }`;

  const flagEmoji = language === 'en' ? '🇬🇧' : '🇻🇳';

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      {/* Top bar */}
      <div className="bg-green-700 text-white text-sm text-center py-1.5 px-4">
        {t.topBar}
      </div>

      {/* Main header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5">
            <PremierSportLogo className="w-9 h-9" />
            <span className="text-xl font-bold text-gray-900 tracking-tight">Premier Sport</span>
          </Link>

          {/* Desktop category nav */}
          <nav className="hidden md:flex items-center gap-6">
            {categories.map((cat) => (
              <NavLink key={cat.path} to={cat.path} className={navLinkClass}>
                {cat.label}
              </NavLink>
            ))}
            <NavLink to="/about" className={navLinkClass}>
              {t.about}
            </NavLink>
          </nav>

          {/* Right actions */}
          <div className="flex items-center gap-4">
            {/* Search toggle */}
            <button
              onClick={() => setSearchOpen((o) => !o)}
              className={`p-2 transition-colors ${searchOpen ? 'text-green-600' : 'text-gray-600 hover:text-gray-900'}`}
              aria-label={searchOpen ? 'Close search' : 'Open search'}
              aria-expanded={searchOpen}
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>

            {/* Cart */}
            <Link to="/cart" className="relative p-2 text-gray-600 hover:text-gray-900" aria-label="Shopping cart">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
              {itemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-green-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                  {itemCount > 99 ? '99+' : itemCount}
                </span>
              )}
            </Link>

            {/* Profile icon + dropdown — desktop only */}
            <div
              className="hidden md:block relative"
              ref={profileRef}
            >
              <button
                className="flex items-center justify-center w-9 h-9 rounded-full bg-gray-100 hover:bg-green-50 text-gray-600 hover:text-green-700 transition-colors border border-gray-200 hover:border-green-300"
                aria-label="Profile menu"
                onClick={() => setProfileOpen((o) => !o)}
              >
                {isAuthenticated && user?.firstName ? (
                  <span className="text-sm font-bold uppercase text-green-700">
                    {user.firstName.charAt(0)}
                  </span>
                ) : (
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                )}
              </button>

              {/* Dropdown */}
              {profileOpen && (
                <div className="absolute right-0 top-full mt-1 w-52 bg-white rounded-xl shadow-xl border border-gray-100 py-1 z-50">
                  {isAuthenticated ? (
                    <>
                      {/* User info header */}
                      <div className="px-4 py-3 border-b border-gray-100">
                        <p className="text-sm font-semibold text-gray-900">
                          {user?.firstName} {user?.lastName}
                        </p>
                        <p className="text-xs text-gray-500 truncate">{user?.email}</p>
                      </div>

                      {user?.role === 'ADMIN' && (
                        <Link to="/admin" className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-green-600 hover:bg-green-50 transition-colors">
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                          </svg>
                          {t.admin}
                        </Link>
                      )}

                      <Link to="/orders" className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                        </svg>
                        {t.orders}
                      </Link>

                      <Link to="/profile" className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                        {t.editProfile}
                      </Link>

                      <div className="border-t border-gray-100 mt-1 pt-1">
                        <button
                          onClick={toggleLanguage}
                          className="flex items-center gap-2.5 w-full px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                        >
                          <span className="text-base leading-none">{flagEmoji}</span>
                          {t.currentLang}
                        </button>

                        <button
                          onClick={logout}
                          className="flex items-center gap-2.5 w-full px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors"
                        >
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                          </svg>
                          {t.logout}
                        </button>
                      </div>
                    </>
                  ) : (
                    <>
                      <Link to="/login" className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                        </svg>
                        {t.login}
                      </Link>
                      <Link to="/register" className="flex items-center gap-2.5 px-4 py-2.5 text-sm font-medium text-green-600 hover:bg-green-50 transition-colors">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                        </svg>
                        {t.signUp}
                      </Link>
                      <div className="border-t border-gray-100 mt-1 pt-1">
                        <button
                          onClick={toggleLanguage}
                          className="flex items-center gap-2.5 w-full px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                        >
                          <span className="text-base leading-none">{flagEmoji}</span>
                          {t.currentLang}
                        </button>
                      </div>
                    </>
                  )}
                </div>
              )}
            </div>

            {/* Hamburger — mobile only */}
            <button
              className="md:hidden p-2 text-gray-600 hover:text-gray-900"
              onClick={() => setMenuOpen((o) => !o)}
              aria-label={menuOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={menuOpen}
            >
              {menuOpen ? (
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Search bar row — visible on both desktop and mobile when searchOpen */}
      {searchOpen && (
        <div className="border-t border-gray-100 px-4 py-3">
          <div className="max-w-7xl mx-auto">
            <SearchBar onClose={() => setSearchOpen(false)} />
          </div>
        </div>
      )}

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden border-t border-gray-100 bg-white px-4 py-4 space-y-1">
          {categories.map((cat) => (
            <NavLink
              key={cat.path}
              to={cat.path}
              className={({ isActive }) =>
                `block px-3 py-2 rounded-lg text-sm font-medium ${
                  isActive ? 'bg-green-50 text-green-600' : 'text-gray-700 hover:bg-gray-50'
                }`
              }
              onClick={() => setMenuOpen(false)}
            >
              {cat.label}
            </NavLink>
          ))}
          <NavLink
            to="/about"
            className={({ isActive }) =>
              `block px-3 py-2 rounded-lg text-sm font-medium ${
                isActive ? 'bg-green-50 text-green-600' : 'text-gray-700 hover:bg-gray-50'
              }`
            }
            onClick={() => setMenuOpen(false)}
          >
            {t.about}
          </NavLink>

          <div className="border-t border-gray-100 pt-3 mt-3 space-y-1">
            {isAuthenticated ? (
              <>
                {user?.role === 'ADMIN' && (
                  <Link
                    to="/admin"
                    className="block px-3 py-2 rounded-lg text-sm font-medium text-green-600 hover:bg-green-50"
                    onClick={() => setMenuOpen(false)}
                  >
                    {t.admin}
                  </Link>
                )}
                <Link
                  to="/orders"
                  className="block px-3 py-2 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50"
                  onClick={() => setMenuOpen(false)}
                >
                  {t.orders}
                </Link>
                <Link
                  to="/profile"
                  className="block px-3 py-2 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50"
                  onClick={() => setMenuOpen(false)}
                >
                  {t.editProfile}
                </Link>
                <button
                  onClick={toggleLanguage}
                  className="flex items-center gap-2 w-full px-3 py-2 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  <span>{flagEmoji}</span>
                  {t.currentLang}
                </button>
                <button
                  onClick={() => { logout(); setMenuOpen(false); }}
                  className="block w-full text-left px-3 py-2 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50"
                >
                  {t.logout}
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="block px-3 py-2 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50"
                  onClick={() => setMenuOpen(false)}
                >
                  {t.login}
                </Link>
                <Link
                  to="/register"
                  className="block px-3 py-2 rounded-lg text-sm font-medium bg-green-600 text-white hover:bg-green-700 text-center"
                  onClick={() => setMenuOpen(false)}
                >
                  {t.signUp}
                </Link>
                <button
                  onClick={toggleLanguage}
                  className="flex items-center gap-2 w-full px-3 py-2 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  <span>{flagEmoji}</span>
                  {t.currentLang}
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
