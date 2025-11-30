'use client';

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import { usePathname, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingCart, User, Heart, Menu, X, Search } from 'lucide-react';
import { useUIStore, useCartStore, useWishlistStore } from '@/lib/store';
import Image from 'next/image';

export default function Navbar() {
  const { data: session } = useSession();
  const isAuthed = !!(session && session.user);
  const pathname = usePathname();
  const router = useRouter();

  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Zustand stores
  const { toggleCart } = useUIStore();
  const cartItems = useCartStore((state) => state.items);
  const wishlistItems = useWishlistStore((state) => state.items);

  const cartTotal = useMemo(() => {
    if (!isAuthed) return 0;
    return cartItems.reduce((t, i) => t + i.price * i.quantity, 0);
  }, [isAuthed, cartItems]);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'Products', href: '/products' },
    { name: 'About', href: '/about' },
    { name: 'Blog', href: '/blog' },
    { name: 'Contact', href: '/contact' },
  ];

  const handleCartClick = () => {
    if (!isAuthed) {
      router.push('/login');
      return;
    }
    toggleCart();
  };

  const handleWishlistClick = (e) => {
    if (!isAuthed) {
      e.preventDefault();
      router.push('/login');
    }
  };

  return (
    <header
      className={`fixed w-full z-50 transition-all duration-300 ${
        isScrolled ? 'bg-white shadow-lg' : 'bg-white'
      } border-b border-gray-100`}
    >
      <div className="container mx-auto px-4 lg:px-8">
        {/* MAIN NAV BAR ROW */}
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* ===== Logo (responsive) ===== */}
          <Link href="/" className="flex items-center">
            <div className="relative h-10 w-32 sm:h-12 sm:w-36 lg:h-16 lg:w-48">
              <Image
                src="/logo.png"              // your AquaElegance logo
                alt="AquaElegance Logo"
                fill
                className="object-contain"
                priority
              />
            </div>
          </Link>

          {/* ===== Desktop Navigation ===== */}
          <nav className="hidden lg:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className={`text-base font-medium transition-colors relative pb-1 ${
                  pathname === link.href
                    ? 'text-green-600'
                    : 'text-gray-700 hover:text-green-600'
                }`}
              >
                {link.name}
                {pathname === link.href && (
                  <motion.div
                    layoutId="navbar-indicator"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-green-600"
                    initial={false}
                    transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                  />
                )}
              </Link>
            ))}
          </nav>

          {/* ===== Right Side Icons ===== */}
          <div className="flex items-center space-x-4">
            {/* Search (desktop only) */}
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="hidden lg:flex items-center justify-center w-10 h-10 lg:w-12 lg:h-12 rounded-full border-2 border-green-600 text-green-600 hover:bg-green-600 hover:text-white transition-all duration-300"
            >
              <Search className="h-5 w-5" />
            </motion.button>

            {/* Cart Icon - only if authenticated */}
            {isAuthed && (
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={handleCartClick}
                className="relative flex items-center justify-center w-10 h-10 lg:w-12 lg:h-12 rounded-full bg-green-600 text-white hover:bg-green-700 transition-all duration-300"
              >
                <ShoppingCart className="h-5 w-5" />
                {cartItems.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-orange-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center border-2 border-white">
                    {cartItems.length}
                  </span>
                )}
              </motion.button>
            )}

            {/* User Icon */}
            {isAuthed ? (
              <div className="hidden lg:block relative group">
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="flex items-center justify-center w-10 h-10 lg:w-12 lg:h-12 rounded-full bg-green-600 text-white hover:bg-green-700 transition-all duration-300"
                >
                  <User className="h-5 w-5" />
                </motion.button>

                {/* Dropdown Menu */}
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-xl py-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 border border-gray-100">
                  <div className="px-4 py-3 border-b border-gray-100">
                    <p className="text-sm font-semibold text-gray-900">
                      {session.user?.name}
                    </p>
                    <p className="text-xs text-gray-500 truncate mt-1">
                      {session.user?.email}
                    </p>
                  </div>
                  <Link
                    href="/profile"
                    className="block px-4 py-2.5 text-sm text-gray-700 hover:bg-green-50 hover:text-green-600 transition-colors"
                  >
                    My Profile
                  </Link>
                  <Link
                    href="/orders"
                    className="block px-4 py-2.5 text-sm text-gray-700 hover:bg-green-50 hover:text-green-600 transition-colors"
                  >
                    My Orders
                  </Link>
                  {isAuthed && (
                    <Link
                      href="/wishlist"
                      onClick={handleWishlistClick}
                      className="flex items-center justify-between px-4 py-2.5 text-sm text-gray-700 hover:bg-green-50 hover:text-green-600 transition-colors"
                    >
                      <span>Wishlist</span>
                      {wishlistItems.length > 0 && (
                        <span className="bg-green-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                          {wishlistItems.length}
                        </span>
                      )}
                    </Link>
                  )}
                  {session.user?.role === 'admin' && (
                    <Link
                      href="/admin"
                      className="block px-4 py-2.5 text-sm text-gray-700 hover:bg-green-50 hover:text-green-600 transition-colors"
                    >
                      Admin Dashboard
                    </Link>
                  )}
                  <div className="border-t border-gray-100 mt-2 pt-2">
                    <button
                      onClick={() => signOut()}
                      className="block w-full text-left px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors"
                    >
                      Sign Out
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <Link href="/login" className="hidden lg:block">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex items-center justify-center w-10 h-10 lg:w-12 lg:h-12 rounded-full bg-green-600 text-white hover:bg-green-700 transition-all duration-300"
                >
                  <User className="h-5 w-5" />
                </motion.button>
              </Link>
            )}

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden flex items-center justify-center w-10 h-10 rounded-full border-2 border-green-600 text-green-600 hover:bg-green-600 hover:text-white transition-all duration-300"
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* ===== Mobile Menu ===== */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="lg:hidden border-t border-gray-100 bg-white"
            >
              <div className="py-4 space-y-1">
                {navLinks.map((link) => (
                  <Link
                    key={link.name}
                    href={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`block px-4 py-3 text-base font-medium rounded-lg transition-colors ${
                      pathname === link.href
                        ? 'text-green-600 bg-green-50'
                        : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    {link.name}
                  </Link>
                ))}

                {/* Mobile user / auth / cart section keeps same as your previous logic */}
                {/* ... keep your existing mobile auth + cart code here if needed ... */}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
}
