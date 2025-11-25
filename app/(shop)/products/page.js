'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { FiFilter, FiGrid, FiList, FiHeart, FiShoppingCart, FiRefreshCw } from 'react-icons/fi';
import { useCartStore, useWishlistStore } from '@/lib/store';
import { message } from 'antd';

export default function ProductsPage() {
  const { data: session } = useSession();
  const isAuthed = !!(session && session.user);
  const router = useRouter();

  const { addItem: addToCart } = useCartStore();
  const { addItem: addToWishlist, items: wishlistItems } = useWishlistStore();

  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [viewMode, setViewMode] = useState('grid');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [categories, setCategories] = useState(['All']);
  const [isLoading, setIsLoading] = useState(true);
  const [priceRange, setPriceRange] = useState([0, 1000]);
  const [sortBy, setSortBy] = useState('featured');

  // Auth guard wrapper
  const requireAuth = (onAuthed) => {
    if (!isAuthed) {
      message.info('Please sign in to continue');
      router.push('/login');
      return;
    }
    onAuthed();
  };

  // Handlers that respect auth
 const handleAddToCart = async (product) => {
  requireAuth(() => {
    // normalize _id → id for consistency
    const normalizedProduct = {
      ...product,
      id: product._id || product.id,
      quantity: 1
    };

    addToCart(normalizedProduct);
    message.success(`${product.name} added to cart!`);
  });
};


  const handleAddToWishlist = (product) => {
    requireAuth(() => {
      addToWishlist(product);
      message.success(`${product.name} added to wishlist!`);
    });
  };

  // Fetch from API and normalize shape (price as number, ensure quantity exists)
  const fetchProductsFromAPI = async () => {
    setIsLoading(true);
    try {
      const timestamp = new Date().getTime();
      const response = await fetch(`/api/products?t=${timestamp}`, {
        method: 'GET',
        headers: {
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Pragma': 'no-cache',
          'Expires': '0'
        },
        cache: 'no-store'
      });
      if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
      const data = await response.json();

      if (data.success && Array.isArray(data.data)) {
        const normalized = data.data.map((p) => ({
          ...p,
          price: typeof p.price === 'number' ? p.price : Number(p.price ?? 0),
          // always have a numeric quantity; fallback to p.stock if older docs have that
          quantity: typeof p.quantity === 'number'
            ? p.quantity
            : (typeof p.stock === 'number' ? p.stock : 0),
        }));
        return normalized;
      } else {
        console.error('❌ API returned success:false or invalid data format:', data);
        return [];
      }
    } catch (error) {
      console.error('❌ Error fetching products:', error);
      message.error('Failed to load products');
      return [];
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    let isMounted = true;
    const loadProducts = async () => {
      const productsData = await fetchProductsFromAPI();
      if (isMounted) {
        setProducts(productsData);
        setFilteredProducts(productsData);
        if (productsData.length > 0) {
          const uniqueCategories = ['All', ...new Set(productsData.map(p => p.category).filter(Boolean))];
          setCategories(uniqueCategories);
        }
      }
    };
    loadProducts();
    return () => { isMounted = false; };
  }, []);

  useEffect(() => {
    let result = [...products];
    if (selectedCategory !== 'All') {
      result = result.filter(product => product.category === selectedCategory);
    }
    result = result.filter(product => product.price >= priceRange[0] && product.price <= priceRange[1]);

    switch (sortBy) {
      case 'price-low-high': result.sort((a, b) => a.price - b.price); break;
      case 'price-high-low': result.sort((a, b) => b.price - a.price); break;
      case 'rating': result.sort((a, b) => (b.rating || 0) - (a.rating || 0)); break;
      default: break; // featured
    }

    setFilteredProducts(result);
  }, [products, selectedCategory, priceRange, sortBy]);

  const handleRefresh = async () => {
    const refreshedProducts = await fetchProductsFromAPI();
    setProducts(refreshedProducts);
    setFilteredProducts(refreshedProducts);
    if (refreshedProducts.length > 0) {
      const uniqueCategories = ['All', ...new Set(refreshedProducts.map(p => p.category).filter(Boolean))];
      setCategories(uniqueCategories);
    }
    message.success(`Loaded ${refreshedProducts.length} products`);
  };

  const containerVariants = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.1 } } };
  const itemVariants = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.5 } } };

  // Use empty wishlist when not authed to prevent "red heart" showing for guests
  const safeWishlistItems = isAuthed ? wishlistItems : [];

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Hero */}
      <div className="relative bg-gradient-to-r from-blue-900 to-blue-600 h-64 md:h-80">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute inset-0 bg-blue-500 opacity-20"></div>
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1920&q=80')] bg-cover bg-center opacity-30"></div>
        </div>
        <div className="relative container mx-auto px-4 h-full flex flex-col justify-center">
          <motion.h1 initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}
            className="text-4xl md:text-5xl font-bold text-white mb-4">
            Our Fountains
          </motion.h1>
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }}
            className="text-xl text-blue-100 max-w-2xl">
            Discover our collection of elegant water features for your home and garden
          </motion.p>
          <motion.button initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.4 }}
            onClick={handleRefresh} disabled={isLoading}
            className="mt-6 inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-700 hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed">
            <FiRefreshCw className={`mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            {isLoading ? 'Loading...' : 'Refresh Products'}
          </motion.button>
        </div>
      </div>

      {/* Main */}
      <div className="container mx-auto px-4 py-12">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Filters */}
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }}
            className={`w-full md:w-64 bg-white rounded-lg shadow-md p-6 ${showFilters ? 'block' : 'hidden md:block'} md:sticky md:top-24 h-fit`}>
            <div className="mb-8">
              <h3 className="text-lg font-semibold mb-4">Categories</h3>
              <div className="space-y-2">
                {categories.map((category) => (
                  <div key={category} className="flex items-center">
                    <button
                      onClick={() => setSelectedCategory(category)}
                      className={`w-full text-left py-1 px-2 rounded ${selectedCategory === category ? 'bg-blue-100 text-blue-700' : 'hover:bg-gray-100'}`}>
                      {category}
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div className="mb-8">
              <h3 className="text-lg font-semibold mb-4">Price Range</h3>
              <div className="px-2">
                <div className="flex justify-between mb-2">
                  <span>${priceRange[0]}</span><span>${priceRange[1]}</span>
                </div>
                <input type="range" min="0" max="1000" step="50" value={priceRange[0]}
                  onChange={(e) => setPriceRange([parseInt(e.target.value), priceRange[1]])}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer" />
                <input type="range" min="0" max="1000" step="50" value={priceRange[1]}
                  onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer mt-4" />
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4">Sort By</h3>
              <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option value="featured">Featured</option>
                <option value="price-low-high">Price: Low to High</option>
                <option value="price-high-low">Price: High to Low</option>
                <option value="rating">Highest Rated</option>
              </select>
            </div>
          </motion.div>

          {/* Products */}
          <div className="flex-1">
            {/* Mobile toggles */}
            <div className="flex justify-between items-center mb-6 md:hidden">
              <div className="flex items-center space-x-2">
                <button onClick={handleRefresh} disabled={isLoading}
                  className="flex items-center space-x-1 bg-blue-500 text-white px-3 py-2 rounded-md shadow-sm disabled:opacity-50">
                  <FiRefreshCw className={isLoading ? 'animate-spin' : ''} /><span>{isLoading ? 'Loading...' : 'Refresh'}</span>
                </button>
                <button onClick={() => setShowFilters(!showFilters)} className="flex items-center space-x-1 bg-white px-3 py-2 rounded-md shadow-sm">
                  <FiFilter /><span>Filters</span>
                </button>
              </div>
              <div className="flex space-x-2">
                <button onClick={() => setViewMode('grid')} className={`p-2 rounded-md ${viewMode === 'grid' ? 'bg-blue-100 text-blue-700' : 'bg-white'}`}><FiGrid /></button>
                <button onClick={() => setViewMode('list')} className={`p-2 rounded-md ${viewMode === 'list' ? 'bg-blue-100 text-blue-700' : 'bg-white'}`}><FiList /></button>
              </div>
            </div>

            {/* Results info */}
            <div className="flex justify-between items-center mb-6">
              <p className="text-gray-600">Showing <span className="font-medium">{filteredProducts.length}</span> of <span className="font-medium">{products.length}</span> products</p>
              <div className="hidden md:flex space-x-2">
                <button onClick={() => setViewMode('grid')} className={`p-2 rounded-md ${viewMode === 'grid' ? 'bg-blue-100 text-blue-700' : 'bg-white'}`}><FiGrid /></button>
                <button onClick={() => setViewMode('list')} className={`p-2 rounded-md ${viewMode === 'list' ? 'bg-blue-100 text-blue-700' : 'bg-white'}`}><FiList /></button>
              </div>
            </div>

            {/* Loading */}
            {isLoading && (
              <div className="flex justify-center items-center h-64">
                <div className="text-center">
                  <FiRefreshCw className="animate-spin h-12 w-12 text-blue-600 mx-auto mb-4" />
                  <p className="text-gray-600">Loading products...</p>
                </div>
              </div>
            )}

            {/* Grid view */}
            {!isLoading && viewMode === 'grid' && (
              <motion.div variants={containerVariants} initial="hidden" animate="visible" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProducts.map((product) => {
                  const stockQty = typeof product.quantity === 'number'
                    ? product.quantity
                    : (typeof product.stock === 'number' ? product.stock : 0);
                  const stockLabel = stockQty > 5 ? 'In Stock' : stockQty > 0 ? 'Low Stock' : 'Out of Stock';
                  const stockBadgeClass = stockQty > 5
                    ? 'bg-green-100 text-green-800'
                    : stockQty > 0
                    ? 'bg-yellow-100 text-yellow-800'
                    : 'bg-red-100 text-red-800';

                  const isInWishlist = safeWishlistItems.some(
                    (item) => (item._id || item.id) === (product._id || product.id)
                  );

                  return (
                    <motion.div key={product._id || product.id} variants={itemVariants} whileHover={{ y: -5, transition: { duration: 0.2 } }}
                      className="bg-white rounded-lg shadow-md overflow-hidden">
                      <div className="relative h-64 overflow-hidden group">
                        <img
                          src={product.images && product.images.length > 0 ? product.images[0] : '/images/placeholder.jpg'}
                          alt={product.name || 'Product image'}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                          onError={(e) => { e.target.onerror = null; e.target.src = '/images/placeholder.jpg'; }}
                        />
                        <div className="absolute inset-0 bg-black bg-opacity-20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                          <Link href={`/products/${product.slug}`} className="bg-white text-gray-900 px-4 py-2 rounded-md font-medium transform -translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                            View Details
                          </Link>
                        </div>

                        {/* Wishlist heart → redirects to login if not authed */}
                        <button
                          onClick={() => handleAddToWishlist(product)}
                          className={`absolute top-3 right-3 bg-white p-2 rounded-full shadow-md ${
                            isInWishlist ? 'text-red-500' : 'text-gray-500 hover:text-red-500'
                          } transition-colors`}
                          aria-label="Add to wishlist">
                          <FiHeart />
                        </button>
                      </div>

                      <div className="p-4">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="text-lg font-semibold mb-1">
                              <Link href={`/products/${product.slug}`} className="hover:text-blue-600 transition-colors">
                                {product.name}
                              </Link>
                            </h3>
                            <p className="text-sm text-gray-500 mb-2">{product.category}</p>
                          </div>
                          <p className="text-lg font-bold text-blue-700">${Number(product.price).toFixed(2)}</p>
                        </div>

                        <div className="flex items-center justify-between mt-4">
                          <div className="flex items-center">
                            <div className="flex">
                              {[...Array(5)].map((_, i) => (
                                <svg key={i} className={`w-4 h-4 ${i < Math.floor(product.rating || 0) ? 'text-yellow-400' : i < (product.rating || 0) ? 'text-yellow-300' : 'text-gray-300'}`} fill="currentColor" viewBox="0 0 20 20">
                                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                </svg>
                              ))}
                            </div>
                            <span className="text-xs text-gray-500 ml-1">({product.rating || 0})</span>
                          </div>

                          <span className={`text-xs px-2 py-1 rounded ${stockBadgeClass}`}>{stockLabel}</span>
                        </div>

                        {/* Add to Cart → redirects to login if not authed */}
                        <button
                          onClick={() => handleAddToCart(product)}
                          disabled={stockQty === 0}
                          className="w-full mt-4 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-md transition-colors flex items-center justify-center disabled:bg-gray-400 disabled:cursor-not-allowed">
                          <FiShoppingCart className="mr-2" />
                          {stockQty === 0 ? 'Out of Stock' : 'Add to Cart'}
                        </button>
                      </div>
                    </motion.div>
                  );
                })}
              </motion.div>
            )}

            {/* List view */}
            {!isLoading && viewMode === 'list' && (
              <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-6">
                {filteredProducts.map((product) => {
                  const stockQty = typeof product.quantity === 'number'
                    ? product.quantity
                    : (typeof product.stock === 'number' ? product.stock : 0);
                  const stockLabel = stockQty > 5 ? 'In Stock' : stockQty > 0 ? 'Low Stock' : 'Out of Stock';
                  const stockBadgeClass = stockQty > 5
                    ? 'bg-green-100 text-green-800'
                    : stockQty > 0
                    ? 'bg-yellow-100 text-yellow-800'
                    : 'bg-red-100 text-red-800';

                  const isInWishlist = safeWishlistItems.some(
                    (item) => (item._id || item.id) === (product._id || product.id)
                  );

                  return (
                    <motion.div key={product._id || product.id} variants={itemVariants} className="bg-white rounded-lg shadow-md overflow-hidden flex flex-col md:flex-row">
                      <div className="relative h-64 md:h-auto md:w-1/3 overflow-hidden group">
                        <img
                          src={product.images && product.images.length > 0 ? product.images[0] : '/images/placeholder.jpg'}
                          alt={product.name || 'Product image'}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                          onError={(e) => { e.target.onerror = null; e.target.src = '/images/placeholder.jpg'; }}
                        />

                        {/* Wishlist heart → redirects to login if not authed */}
                        <button
                          onClick={() => handleAddToWishlist(product)}
                          className={`absolute top-3 right-3 bg-white p-2 rounded-full shadow-md ${
                            isInWishlist ? 'text-red-500' : 'text-gray-500 hover:text-red-500'
                          } transition-colors`}
                          aria-label="Add to wishlist">
                          <FiHeart />
                        </button>
                      </div>

                      <div className="p-6 flex-1 flex flex-col">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <h3 className="text-xl font-semibold">
                              <Link href={`/products/${product.slug}`} className="hover:text-blue-600 transition-colors">
                                {product.name}
                              </Link>
                            </h3>
                            <p className="text-sm text-gray-500">{product.category}</p>
                          </div>
                          <p className="text-xl font-bold text-blue-700">${Number(product.price).toFixed(2)}</p>
                        </div>

                        <p className="text-gray-600 mb-4">{product.description || 'No description available for this product.'}</p>

                        <div className="flex items-center mt-auto">
                          <div className="flex">
                            {[...Array(5)].map((_, i) => (
                              <svg key={i} className={`w-4 h-4 ${i < Math.floor(product.rating || 0) ? 'text-yellow-400' : i < (product.rating || 0) ? 'text-yellow-300' : 'text-gray-300'}`} fill="currentColor" viewBox="0 0 20 20">
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                              </svg>
                            ))}
                          </div>
                          <span className="text-sm text-gray-500 ml-1">({product.rating || 0})</span>
                          <span className={`text-xs px-2 py-1 rounded ml-4 ${stockBadgeClass}`}>{stockLabel}</span>
                        </div>

                        <div className="flex space-x-4 mt-6">
                          {/* Add to Cart → redirects to login if not authed */}
                          <button
                            onClick={() => handleAddToCart(product)}
                            disabled={stockQty === 0}
                            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-md transition-colors flex items-center justify-center disabled:bg-gray-400 disabled:cursor-not-allowed">
                            <FiShoppingCart className="mr-2" />
                            {stockQty === 0 ? 'Out of Stock' : 'Add to Cart'}
                          </button>
                          <Link href={`/products/${product.slug}`} className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors flex items-center">
                            View Details
                          </Link>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </motion.div>
            )}

            {/* Empty state */}
            {!isLoading && filteredProducts.length === 0 && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-white rounded-lg shadow-md p-8 text-center">
                <svg className="w-16 h-16 mx-auto text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                    d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 0 0118 0z" />
                </svg>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No products found</h3>
                <p className="text-gray-500 mb-6">
                  {products.length === 0 
                    ? 'No products available yet. Please check back later.'
                    : 'Try adjusting your filters to find what you\'re looking for.'}
                </p>
                {products.length > 0 && (
                  <button
                    onClick={() => { setSelectedCategory('All'); setPriceRange([0, 1000]); setSortBy('featured'); }}
                    className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                    Reset Filters
                  </button>
                )}
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
