'use client';
import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { FiShoppingCart, FiHeart, FiArrowLeft, FiStar } from 'react-icons/fi';
import { useCartStore, useWishlistStore, useProductStore } from '@/lib/store';
import React from 'react';
import { useSession } from "next-auth/react";

// Default products if store is empty
const DEFAULT_PRODUCTS = [
  {
    id: '1',
    name: 'Modern Cascade Fountain',
    slug: 'modern-cascade-fountain',
    price: 249.99,
    image: 'https://images.unsplash.com/photo-1585150841312-c833091e593d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80',
    category: 'Indoor',
    rating: 4.5,
    stock: 10,
  },
  {
    id: '2',
    name: 'Zen Garden Water Feature',
    slug: 'zen-garden-water-feature',
    price: 199.99,
    image: 'https://images.unsplash.com/photo-1576013551627-0cc20b96c2a7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80',
    category: 'Outdoor',
    rating: 4.2,
    stock: 5,
  },
   
  
  {
    id: '5',
    name: 'Solar Powered Garden Fountain',
    slug: 'solar-powered-garden-fountain',
    price: 349.99,
    image: 'https://images.unsplash.com/photo-1534857960998-63c4ea13a0a3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80',
    category: 'Outdoor',
    rating: 4.6,
    stock: 7,
  },
  {
    id: '6',
    name: 'LED Illuminated Wall Fountain',
    slug: 'led-illuminated-wall-fountain',
    price: 599.99,
    image: 'https://images.unsplash.com/photo-1611223235982-891064f27716?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80',
    category: 'Indoor',
    rating: 4.9,
    stock: 2,
  }
];

export default function ProductDetail() {
  // Get slug from params
  const params = useParams();
  const slug = params.slug;
  const { data: session } = useSession();
  const { addItem: addToCart } = useCartStore();
  const { addItem: addToWishlist, items: wishlist } = useWishlistStore();
  const { products: storeProducts, getProductBySlug } = useProductStore();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [isInWishlist, setIsInWishlist] = useState(false);
  const [relatedProducts, setRelatedProducts] = useState([]);
  
  useEffect(() => {
    // Find product by slug
    if (!slug) return;
    
    // Try to find product in store by slug
    const foundProduct = getProductBySlug(slug) || DEFAULT_PRODUCTS.find(p => p.slug === slug);
    
    if (foundProduct) {
      // Handle both 'stock' and 'quantity' field names and ensure it's a number
      const stockValue = foundProduct.stock !== undefined ? foundProduct.stock : foundProduct.quantity;
      const productWithStock = {
        ...foundProduct,
        stock: typeof stockValue === 'number' ? stockValue : parseInt(stockValue) || 0
      };
      
      setProduct(productWithStock);
      // Check if product is in wishlist
      if (wishlist && Array.isArray(wishlist)) {
        setIsInWishlist(wishlist.some(item => item.id === productWithStock.id));
      }
      
      // Get related products from store or defaults
      const productsSource = storeProducts.length > 0 ? storeProducts : DEFAULT_PRODUCTS;
      const related = productsSource
        .filter(p => p.category === productWithStock.category && p.id !== productWithStock.id)
        .slice(0, 4);
      setRelatedProducts(related);
    }
    
    setLoading(false);
  }, [slug, wishlist, getProductBySlug, storeProducts]);
  
  const handleAddToCart = async () => {
  if (product && product.stock > 0) {
    addToCart(product, quantity);

    if (session?.user) {
      try {
        // ✅ Make sure we're sending the MongoDB _id
        const productId = product._id || product.id;
        console.log("Sending productId to API:", productId); // Debug log

        const res = await fetch("/api/cart", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ productId, quantity }),
        });

        const data = await res.json();
        console.log("Cart API response:", data); // Debug log

        if (!res.ok) {
          throw new Error(data.message || "Failed to sync cart");
        }
        
        console.log("Cart synced successfully");
      } catch (err) {
        console.error("Failed to sync cart:", err);
      }
    }
  }
};
  
 const handleAddToWishlist = async () => {
  if (!product) return;

  addToWishlist(product);
  setIsInWishlist(true);

  if (session?.user) {
    try {
      const productId = product._id || product.id;

      const res = await fetch("/api/wishlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ productId }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to sync wishlist");
      }

      console.log("✅ Wishlist synced:", data.message);
    } catch (err) {
      console.error("❌ Failed to sync wishlist:", err);
    }
  }
};

  
  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-gray-200 rounded-lg h-96"></div>
            <div>
              <div className="h-8 bg-gray-200 rounded w-3/4 mb-4"></div>
              <div className="h-6 bg-gray-200 rounded w-1/4 mb-6"></div>
              <div className="h-4 bg-gray-200 rounded w-full mb-3"></div>
              <div className="h-4 bg-gray-200 rounded w-full mb-3"></div>
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-6"></div>
              <div className="h-10 bg-gray-200 rounded w-1/3 mb-4"></div>
              <div className="h-12 bg-gray-200 rounded w-full mb-4"></div>
              <div className="h-12 bg-gray-200 rounded w-full"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  if (!product) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-12 text-center">
        <h1 className="text-3xl font-bold mb-4">Product Not Found</h1>
        <p className="mb-6">Sorry, the product you are looking for does not exist.</p>
        <Link href="/products" className="inline-flex items-center text-blue-600 hover:text-blue-800">
          <FiArrowLeft className="mr-2" /> Back to Products
        </Link>
      </div>
    );
  }
  
  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <Link href="/products" className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-6">
        <FiArrowLeft className="mr-2" /> Back to Products
      </Link>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="relative h-96 md:h-[500px] bg-gray-100 rounded-lg overflow-hidden"
        >
          <Image 
            src={product.images && product.images.length > 0 ? product.images[0] : '/flower.png'} 
            alt={product.name || 'Product image'}
            fill
            className="object-cover"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = '/flower.png';
            }}
          />
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
          <div className="flex items-center mb-4">
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <FiStar
                  key={i}
                  className={`w-5 h-5 ${
                    i < Math.floor(product.rating)
                      ? 'text-yellow-400 fill-current'
                      : i < product.rating
                      ? 'text-yellow-400 fill-current'
                      : 'text-gray-300'
                  }`}
                />
              ))}
            </div>
            <span className="text-sm text-gray-500 ml-2">({product.rating})</span>
            <span className="mx-2">•</span>
            <span className="text-sm text-gray-500">Category: {product.category}</span>
          </div>
          
          <p className="text-2xl font-bold text-blue-700 mb-6">${product.price.toFixed(2)}</p>
          
          <div className="mb-6">
            <h2 className="text-lg font-semibold mb-2">Description</h2>
            <p className="text-gray-600">
              {product.description}
            </p>
          </div>
          
          <div className="mb-6">
            <h2 className="text-lg font-semibold mb-2">Quantity</h2>
            <div className="flex items-center">
              <button 
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="w-10 h-10 rounded-l border border-gray-300 flex items-center justify-center hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={product.stock === 0}
              >
                -
              </button>
              <input 
                type="number" 
                min="1" 
                value={quantity} 
                onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                className="w-16 h-10 border-t border-b border-gray-300 text-center disabled:bg-gray-100 disabled:cursor-not-allowed"
                disabled={product.stock === 0}
              />
              <button 
                onClick={() => setQuantity(quantity + 1)}
                className="w-10 h-10 rounded-r border border-gray-300 flex items-center justify-center hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={product.stock === 0}
              >
                +
              </button>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <button 
              onClick={handleAddToCart}
              className={`flex-1 py-3 px-6 rounded-lg flex items-center justify-center transition-colors ${
                product.stock > 0
                  ? 'bg-blue-600 hover:bg-blue-700 text-white cursor-pointer'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
              disabled={!product.stock || product.stock <= 0}
            >
              <FiShoppingCart className="mr-2" />
              {product.stock > 0 ? 'Add to Cart' : 'Out of Stock'}
            </button>
            
            <button 
              onClick={handleAddToWishlist}
              className={`flex-1 py-3 px-6 rounded-lg flex items-center justify-center border ${
                isInWishlist 
                  ? 'bg-pink-50 text-pink-600 border-pink-200' 
                  : 'bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100'
              }`}
            >
              <FiHeart className={`mr-2 ${isInWishlist ? 'fill-current' : ''}`} />
              {isInWishlist ? 'Added to Wishlist' : 'Add to Wishlist'}
            </button>
          </div>
          
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="flex items-center mb-2">
              <div className={`w-3 h-3 rounded-full mr-2 ${
                product.stock > 5 
                  ? 'bg-green-500' 
                  : product.stock > 0 
                  ? 'bg-yellow-500' 
                  : 'bg-red-500'
              }`}></div>
              <span className="text-sm font-medium">
                {product.stock > 5 
                  ? 'In Stock' 
                  : product.stock > 0 
                  ? `Low Stock (${product.stock} left)` 
                  : 'Out of Stock'}
              </span>
            </div>
            <p className="text-sm text-gray-500">Free shipping on orders over $50</p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}