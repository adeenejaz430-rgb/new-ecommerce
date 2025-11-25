// 'use client';

// import { useState, useEffect, useMemo } from 'react';
// import Link from 'next/link';
// import { useSession, signOut } from 'next-auth/react';
// import { usePathname, useRouter } from 'next/navigation';
// import { motion, AnimatePresence } from 'framer-motion';
// import { ShoppingCart, User, Heart, Menu, X } from 'lucide-react';
// import { useUIStore, useCartStore, useWishlistStore } from '@/lib/store';
// import Image from 'next/image';

// export default function Navbar() {
//   const { data: session } = useSession();
//   const isAuthed = !!(session && session.user);
//   const pathname = usePathname();
//   const router = useRouter();

//   const [isScrolled, setIsScrolled] = useState(false);
//   const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

//   // Zustand stores
//   const { toggleCart } = useUIStore();
//   const cartItems = useCartStore((state) => state.items);
//   const wishlistItems = useWishlistStore((state) => state.items);

//   const cartTotal = useMemo(() => {
//     if (!isAuthed) return 0;
//     return cartItems.reduce((t, i) => t + i.price * i.quantity, 0);
//   }, [isAuthed, cartItems]);

//   useEffect(() => {
//     const handleScroll = () => setIsScrolled(window.scrollY > 10);
//     window.addEventListener('scroll', handleScroll);
//     return () => window.removeEventListener('scroll', handleScroll);
//   }, []);

//   useEffect(() => {
//     setMobileMenuOpen(false);
//   }, [pathname]);

//   const navLinks = [
//     { name: 'Home', href: '/' },
//     { name: 'Products', href: '/products' },
//     { name: 'About', href: '/about' },
//     { name: 'Blog', href: '/blog' },
//     { name: 'Contact', href: '/contact' },
//   ];

//   const handleCartClick = () => {
//     if (!isAuthed) {
//       router.push('/login');
//       return;
//     }
//     toggleCart();
//   };

//   const handleWishlistClick = (e) => {
//     if (!isAuthed) {
//       e.preventDefault();
//       router.push('/login');
//     }
//   };

//   return (
//     <header className={`fixed w-full z-50 transition-all duration-300 ${isScrolled ? 'bg-white shadow-md py-2' : 'bg-white py-2'}`}>
//       {/* Top bar */}
//       <div className="bg-gray-100 py-2 border-b border-gray-200 hidden md:block">
//         <div className="container mx-auto px-4 flex justify-between items-center text-sm">
//           <div className="flex items-center space-x-6">
//             <span className="text-gray-700">hello@colorlib.com</span>
//             <span className="text-gray-700">Free Shipping for all Order of $99</span>
//           </div>

//           <div className="flex items-center space-x-4">
//             <div className="flex items-center space-x-3">
//               <a href="#" className="text-gray-700 hover:text-gray-900">Fb</a>
//               <a href="#" className="text-gray-700 hover:text-gray-900">Tw</a>
//               <a href="#" className="text-gray-700 hover:text-gray-900">Ln</a>
//               <a href="#" className="text-gray-700 hover:text-gray-900">Pt</a>
//             </div>
//             <div className="flex items-center space-x-2">
//               <span className="text-gray-700">English</span>
//               <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
//               </svg>
//             </div>

//             {/* Desktop Login/Profile */}
//             {isAuthed ? (
//               <div className="relative group">
//                 <button className="flex items-center space-x-1 text-gray-700 hover:text-gray-900">
//                   <User className="h-4 w-4" />
//                   <span>{session.user?.name || 'Account'}</span>
//                 </button>
//                 <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
//                   <Link href="/profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Profile</Link>
//                   <Link href="/orders" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Orders</Link>
//                   {session.user?.role === 'admin' && (
//                     <Link href="/admin" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Admin Dashboard</Link>
//                   )}
//                   <button onClick={() => signOut()} className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100">
//                     Sign out
//                   </button>
//                 </div>
//               </div>
//             ) : (
//               <Link href="/login" className="text-gray-700 hover:text-gray-900">Login</Link>
//             )}
//           </div>
//         </div>
//       </div>

//       {/* Main header */}
//       <div className="container mx-auto px-4 py-4">
//         <div className="flex items-center justify-between">
//           {/* Logo */}
//           <Link href="/" className="flex items-center">
//             <div className="h-10 w-auto">
//               <Image src="/mainlogo.svg" alt="Ogani Logo" width={120} height={40} className="h-16 w-16" />
//             </div>
//           </Link>

//           {/* Navigation */}
//           <nav className="hidden md:flex items-center space-x-8">
//             {navLinks.map((link) => (
//               <Link
//                 key={link.name}
//                 href={link.href}
//                 className={`text-sm font-medium uppercase transition-colors hover:text-green-600 ${
//                   pathname === link.href ? 'text-green-600 font-bold' : 'text-gray-700'
//                 }`}
//               >
//                 {link.name}
//               </Link>
//             ))}
//           </nav>

//           {/* Right icons - Desktop */}
//           <div className="hidden md:flex items-center space-x-4">
//             {/* Wishlist: ONLY if authed */}
//             {isAuthed && (
//               <Link href="/wishlist" className="relative" onClick={handleWishlistClick}>
//                 <Heart className="h-5 w-5 text-gray-700 hover:text-green-600 transition-colors" />
//                 {wishlistItems.length > 0 && (
//                   <span className="absolute -top-1 -right-2 bg-green-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
//                     {wishlistItems.length}
//                   </span>
//                 )}
//               </Link>
//             )}

//             {/* Cart: ONLY if authed */}
//             {isAuthed && (
//               <div onClick={handleCartClick} className="relative cursor-pointer">
//                 <ShoppingCart className="h-5 w-5 text-gray-700 hover:text-green-600 transition-colors" />
//                 {cartItems.length > 0 && (
//                   <span className="absolute -top-1 -right-2 bg-green-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
//                     {cartItems.length}
//                   </span>
//                 )}
//               </div>
//             )}

//             {/* Cart total: ONLY if authed */}
//             {isAuthed && (
//               <div className="text-sm text-gray-700">
//                 Item: ${cartTotal.toFixed(2)}
//               </div>
//             )}

//             {/* Profile / Login */}
//             {isAuthed ? (
//               <div className="relative group">
//                 <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} className="p-2 rounded-full hover:bg-gray-100 transition-colors">
//                   <User className="h-5 w-5 text-gray-700" />
//                 </motion.button>
//                 <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
//                   <div className="px-4 py-2 border-b border-gray-200">
//                     <p className="text-sm font-medium text-gray-900">{session.user?.name}</p>
//                     <p className="text-xs text-gray-500 truncate">{session.user?.email}</p>
//                   </div>
//                   <Link href="/profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Profile</Link>
//                   <Link href="/orders" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Orders</Link>
//                   {session.user?.role === 'admin' && (
//                     <Link href="/admin" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Admin Dashboard</Link>
//                   )}
//                   <button onClick={() => signOut()} className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100">
//                     Sign out
//                   </button>
//                 </div>
//               </div>
//             ) : (
//               <Link href="/login">
//                 <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors">
//                   Sign In
//                 </motion.button>
//               </Link>
//             )}
//           </div>

//           {/* Mobile menu toggle */}
//           <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="md:hidden p-2 rounded-md text-gray-700">
//             {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
//           </button>
//         </div>

//         <div className="mt-4 hidden md:flex items-center justify-between">
//           <div className="flex items-center w-full max-w-2xl">
//             <button className="bg-green-600 text-white px-4 py-3 flex items-center space-x-2 rounded-l-md hover:bg-green-700 transition-colors">
//               <span>All Departments</span>
//               <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
//               </svg>
//             </button>
//             <div className="relative flex-1">
//               <input type="text" placeholder="What do you need?" className="w-full border border-gray-300 py-3 px-4 focus:outline-none focus:ring-2 focus:ring-green-500" />
//               <button className="absolute right-0 top-0 h-full bg-green-600 text-white px-5 hover:bg-green-700 transition-colors">SEARCH</button>
//             </div>
//           </div>

//           <div className="flex items-center space-x-2 text-gray-700">
//             <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-600 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
//             </svg>
//             <div className="flex flex-col">
//               <span className="text-sm font-medium">+65 11.188.888</span>
//               <span className="text-xs">Support 24/7 time</span>
//             </div>
//           </div>
//         </div>

//         {/* Mobile-only icons bar */}
//         <div className="flex items-center justify-between mt-3 md:hidden">
//           <div className="flex items-center space-x-4">
//             {/* Wishlist - Mobile: ONLY if authed */}
//             {isAuthed && (
//               <Link href="/wishlist" className="relative" onClick={handleWishlistClick}>
//                 <Heart className="h-5 w-5 text-gray-700" />
//                 {wishlistItems.length > 0 && (
//                   <span className="absolute -top-1 -right-2 bg-green-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
//                     {wishlistItems.length}
//                   </span>
//                 )}
//               </Link>
//             )}

//             {/* Cart - Mobile: ONLY if authed */}
//             {isAuthed && (
//               <div onClick={handleCartClick} className="relative cursor-pointer">
//                 <ShoppingCart className="h-5 w-5 text-gray-700" />
//                 {cartItems.length > 0 && (
//                   <span className="absolute -top-1 -right-2 bg-green-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
//                     {cartItems.length}
//                   </span>
//                 )}
//               </div>
//             )}

//             {/* Cart total - Mobile: ONLY if authed */}
//             {isAuthed && (
//               <div className="text-sm text-gray-700">
//                 ${cartTotal.toFixed(2)}
//               </div>
//             )}
//           </div>

//           {/* Profile - Mobile */}
//           {isAuthed ? (
//             <div className="relative group">
//               <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} className="p-2 rounded-full hover:bg-gray-100 transition-colors">
//                 <User className="h-5 w-5 text-gray-700" />
//               </motion.button>
//               <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
//                 <Link href="/profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Profile</Link>
//                 <Link href="/orders" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Orders</Link>
//                 {session.user?.role === 'admin' && (
//                   <Link href="/admin" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Admin Dashboard</Link>
//                 )}
//                 <button onClick={() => signOut()} className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100">Sign out</button>
//               </div>
//             </div>
//           ) : (
//             <Link href="/login">
//               <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors">
//                 Sign In
//               </motion.button>
//             </Link>
//           )}
//         </div>

//         {/* Mobile Navigation */}
//         <AnimatePresence>
//           {mobileMenuOpen && (
//             <motion.div
//               initial={{ opacity: 0, height: 0 }}
//               animate={{ opacity: 1, height: 'auto' }}
//               exit={{ opacity: 0, height: 0 }}
//               transition={{ duration: 0.3 }}
//               className="md:hidden bg-white border-t"
//             >
//               <div className="container mx-auto px-4 py-4 space-y-4">
//                 {navLinks.map((link) => (
//                   <Link
//                     key={link.name}
//                     href={link.href}
//                     onClick={() => setMobileMenuOpen(false)}
//                     className={`block py-2 text-base font-medium ${pathname === link.href ? 'text-green-600' : 'text-gray-700'}`}
//                   >
//                     {link.name}
//                   </Link>
//                 ))}
//                 {!isAuthed && (
//                   <Link
//                     href="/register"
//                     onClick={() => setMobileMenuOpen(false)}
//                     className="block py-2 text-base font-medium text-gray-700"
//                   >
//                     Create Account
//                   </Link>
//                 )}
//               </div>
//             </motion.div>
//           )}
//         </AnimatePresence>
//       </div>
//     </header>
//   );
// }
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
  const [searchTerm, setSearchTerm] = useState('');

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
    if (!isAuthed) return router.push('/login');
    toggleCart();
  };

  const handleWishlistClick = (e) => {
    if (!isAuthed) {
      e.preventDefault();
      router.push('/login');
    }
  };

  const submitSearch = (e) => {
    e.preventDefault();
    const q = searchTerm.trim();
    if (!q) return;
    router.push(`/search?q=${encodeURIComponent(q)}`);
  };

  return (
    <header className={`fixed w-full z-50 transition-all duration-300 ${isScrolled ? 'bg-white shadow-md py-2' : 'bg-white py-2'}`}>
      {/* Top Info Bar */}
      <div className="bg-gray-100 py-2 border-b border-gray-200 hidden md:block">
        <div className="container mx-auto px-4 flex justify-between items-center text-sm">
          <div className="flex items-center space-x-6">
            <span className="text-gray-700">hello@colorlib.com</span>
            <span className="text-gray-700">Free Shipping for all Order of $99</span>
          </div>

          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-3">
              <a href="#" className="text-gray-700 hover:text-gray-900">Fb</a>
              <a href="#" className="text-gray-700 hover:text-gray-900">Tw</a>
              <a href="#" className="text-gray-700 hover:text-gray-900">Ln</a>
              <a href="#" className="text-gray-700 hover:text-gray-900">Pt</a>
            </div>

            {/* Auth quick entry (top bar) */}
            {isAuthed ? (
              <div className="relative group">
                <button className="flex items-center space-x-1 text-gray-700 hover:text-gray-900">
                  <User className="h-4 w-4" />
                  <span>{session.user?.name || 'Account'}</span>
                </button>
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                  <Link href="/profile" className="block px-4 py-2 text-sm hover:bg-gray-100">Profile</Link>
                  <Link href="/orders" className="block px-4 py-2 text-sm hover:bg-gray-100">Orders</Link>
                  {session.user?.role === 'admin' && (
                    <Link href="/admin" className="block px-4 py-2 text-sm hover:bg-gray-100">Admin Dashboard</Link>
                  )}
                  <button onClick={() => signOut()} className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100">
                    Sign out
                  </button>
                </div>
              </div>
            ) : (
              <Link href="/login" className="text-gray-700 hover:text-gray-900">Login</Link>
            )}
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="container mx-auto px-4 py-4 bg-white">
        <div className="flex items-center w-full gap-16">
          {/* LEFT GROUP: Logo + Nav */}
          <div className="flex items-center gap-6">
            {/* Logo */}
            <Link href="/" className="shrink-0 flex items-center">
              <Image src="/mainlogo.svg" alt="Ogani Logo" width={120} height={40} className="h-16 w-16" />
            </Link>

            {/* Nav (left, next to logo) */}
            <nav className="hidden md:flex items-center space-x-6">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`text-sm font-medium uppercase transition-colors hover:text-green-600 ${
                    pathname === link.href ? 'text-green-600 font-bold' : 'text-gray-700'
                  }`}
                >
                  {link.name}
                </Link>
              ))}
            </nav>
          </div>

          {/* RIGHT GROUP: Search + Icons */}
          <div className="ml-auto flex items-center gap-4">
            {/* Search (right side) */}
            <form onSubmit={submitSearch} className="hidden md:flex items-center w-[420px] max-w-[45vw] relative">
              <input
                type="search"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search products, categories, articles…"
                className="w-full border border-gray-300 py-3 pl-4 pr-12 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              />
              <button
                type="submit"
                className="absolute right-1 top-1 bottom-1 px-4 rounded-md bg-green-600 text-white hover:bg-green-700 transition-colors flex items-center gap-2"
              >
                <Search className="h-4 w-4" />
                <span className="hidden lg:inline">Search</span>
              </button>
            </form>

            {/* Icons (right edge) */}
            {isAuthed ? (
              <>
                <Link href="/wishlist" className="relative hidden md:inline-block" onClick={handleWishlistClick}>
                  <Heart className="h-5 w-5 text-gray-700 hover:text-green-600 transition-colors" />
                  {wishlistItems.length > 0 && (
                    <span className="absolute -top-1 -right-2 bg-green-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                      {wishlistItems.length}
                    </span>
                  )}
                </Link>

                <div onClick={handleCartClick} className="relative cursor-pointer hidden md:inline-block">
                  <ShoppingCart className="h-5 w-5 text-gray-700 hover:text-green-600 transition-colors" />
                  {cartItems.length > 0 && (
                    <span className="absolute -top-1 -right-2 bg-green-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                      {cartItems.length}
                    </span>
                  )}
                </div>

                <div className="hidden md:block text-sm text-gray-700">${cartTotal.toFixed(2)}</div>

                <div className="relative group hidden md:block">
                  <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} className="p-2 rounded-full hover:bg-gray-100 transition-colors">
                    <User className="h-5 w-5 text-gray-700" />
                  </motion.button>
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                    <div className="px-4 py-2 border-b border-gray-200">
                      <p className="text-sm font-medium text-gray-900">{session.user?.name}</p>
                      <p className="text-xs text-gray-500 truncate">{session.user?.email}</p>
                    </div>
                    <Link href="/profile" className="block px-4 py-2 text-sm hover:bg-gray-100">Profile</Link>
                    <Link href="/orders" className="block px-4 py-2 text-sm hover:bg-gray-100">Orders</Link>
                    {session.user?.role === 'admin' && (
                      <Link href="/admin" className="block px-4 py-2 text-sm hover:bg-gray-100">Admin Dashboard</Link>
                    )}
                    <button onClick={() => signOut()} className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100">
                      Sign out
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <Link href="/login" className="hidden md:block">
                <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors">
                  Sign In
                </motion.button>
              </Link>
            )}

            {/* Mobile menu toggle */}
            <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="md:hidden p-2 rounded-md text-gray-700">
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile: Search under header */}
        <form onSubmit={submitSearch} className="mt-3 md:hidden relative">
          <input
            type="search"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search..."
            className="w-full border border-gray-300 py-3 pl-4 pr-12 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
          />
          <button type="submit" className="absolute right-1 top-1 bottom-1 px-4 rounded-md bg-green-600 text-white">
            <Search className="h-4 w-4" />
          </button>
        </form>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="md:hidden bg-white border-t"
            >
              <div className="container mx-auto px-4 py-4 space-y-4">
                {navLinks.map((link) => (
                  <Link
                    key={link.name}
                    href={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`block py-2 text-base font-medium ${pathname === link.href ? 'text-green-600' : 'text-gray-700'}`}
                  >
                    {link.name}
                  </Link>
                ))}
                {!isAuthed && (
                  <Link href="/register" onClick={() => setMobileMenuOpen(false)} className="block py-2 text-base font-medium text-gray-700">
                    Create Account
                  </Link>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
}
