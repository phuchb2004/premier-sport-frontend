import { Link } from 'react-router-dom';

export function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-400 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-xs">PS</span>
              </div>
              <span className="text-white font-bold text-lg">Premier Sport</span>
            </div>
            <p className="text-sm leading-relaxed max-w-sm">
              Your premier destination for football kits, boots, accessories, and equipment.
              Gear up and play like a champion.
            </p>
          </div>

          {/* Shop links */}
          <div>
            <h3 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">Shop</h3>
            <ul className="space-y-2 text-sm">
              {[
                { label: 'Kits', path: '/products/kits' },
                { label: 'Boots', path: '/products/boots' },
                { label: 'Accessories', path: '/products/accessories' },
                { label: 'Balls', path: '/products/balls' },
              ].map((item) => (
                <li key={item.path}>
                  <Link to={item.path} className="hover:text-white transition-colors">{item.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company links */}
          <div>
            <h3 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">Company</h3>
            <ul className="space-y-2 text-sm">
              {[
                { label: 'About Us', path: '/about' },
                { label: 'My Account', path: '/orders' },
              ].map((item) => (
                <li key={item.path}>
                  <Link to={item.path} className="hover:text-white transition-colors">{item.label}</Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-10 pt-6 flex flex-col sm:flex-row justify-between items-center gap-2 text-xs">
          <p>© {new Date().getFullYear()} Premier Sport. All rights reserved.</p>
          <p>Built with React + Spring Boot</p>
        </div>
      </div>
    </footer>
  );
}
