import { Link, useLocation } from 'react-router-dom';
import { useState } from 'react';

const Header = () => {
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 transition-all duration-300 bg-gradient-to-b from-black to-transparent">
      <nav className="flex items-center justify-between px-4 md:px-8 lg:px-16 py-4">
        <div className="flex items-center space-x-8">
          <Link to="/" className="flex items-center">
            <h1 className="text-netflix-red text-2xl md:text-3xl font-bold tracking-tight">
              MOVIEFLIX
            </h1>
          </Link>

          <ul className="hidden md:flex space-x-6">
            <li>
              <Link
                to="/"
                className={`text-sm font-medium transition-colors hover:text-gray-300 ${
                  isActive('/') ? 'text-white' : 'text-gray-400'
                }`}
              >
                Home
              </Link>
            </li>
            <li>
              <Link
                to="/analytics"
                className={`text-sm font-medium transition-colors hover:text-gray-300 ${
                  isActive('/analytics') ? 'text-white' : 'text-gray-400'
                }`}
              >
                Analytics
              </Link>
            </li>
            <li>
              <Link
                to="/browse"
                className={`text-sm font-medium transition-colors hover:text-gray-300 ${
                  isActive('/browse') ? 'text-white' : 'text-gray-400'
                }`}
              >
                Browse
              </Link>
            </li>
          </ul>
        </div>

        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden text-white focus:outline-none"
          aria-label="Toggle menu"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            {mobileMenuOpen ? (
              <path d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </nav>

      {mobileMenuOpen && (
        <div className="md:hidden bg-black bg-opacity-95 border-t border-gray-800">
          <ul className="flex flex-col space-y-4 px-4 py-6">
            <li>
              <Link
                to="/"
                onClick={() => setMobileMenuOpen(false)}
                className={`block text-sm font-medium transition-colors ${
                  isActive('/') ? 'text-white' : 'text-gray-400'
                }`}
              >
                Home
              </Link>
            </li>
            <li>
              <Link
                to="/analytics"
                onClick={() => setMobileMenuOpen(false)}
                className={`block text-sm font-medium transition-colors ${
                  isActive('/analytics') ? 'text-white' : 'text-gray-400'
                }`}
              >
                Analytics
              </Link>
            </li>
            <li>
              <Link
                to="/browse"
                onClick={() => setMobileMenuOpen(false)}
                className={`block text-sm font-medium transition-colors ${
                  isActive('/browse') ? 'text-white' : 'text-gray-400'
                }`}
              >
                Browse
              </Link>
            </li>
          </ul>
        </div>
      )}
    </header>
  );
};

export default Header;
