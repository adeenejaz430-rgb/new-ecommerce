'use client';

import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiX, FiTrash2, FiPlus, FiMinus, FiShoppingBag } from 'react-icons/fi';
import Link from 'next/link';
import { useCartStore, useUIStore } from '@/lib/store';
import  {useSession} from 'next-auth/react';
export default function CartSidebar() {
  const { items, totalItems, totalPrice, removeItem, updateItemQuantity } = useCartStore();
  const { isCartOpen, toggleCart } = useUIStore();
const { data: session } = useSession(); // ⬅️ add this inside your component
  // Close cart when pressing escape key
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape' && isCartOpen) {
        toggleCart();
      }
    };
    
    window.addEventListener('keydown', handleEsc);
    
    return () => {
      window.removeEventListener('keydown', handleEsc);
    };
  }, [isCartOpen, toggleCart]);

  // Prevent body scroll when cart is open
  useEffect(() => {
    if (isCartOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isCartOpen]);

  // Animation variants
  const sidebarVariants = {
    hidden: { x: '100%', opacity: 0 },
    visible: { 
      x: 0, 
      opacity: 1,
      transition: { 
        type: 'spring',
        stiffness: 300,
        damping: 30
      }
    },
    exit: { 
      x: '100%', 
      opacity: 0,
      transition: { 
        ease: 'easeInOut',
        duration: 0.3
      }
    }
  };

  const backdropVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
    exit: { opacity: 0 }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.3 }
    },
    exit: { 
      opacity: 0, 
      y: -20,
      transition: { duration: 0.2 }
    }
  };

  return (
    <AnimatePresence>
      {isCartOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-50 z-40"
            variants={backdropVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            onClick={toggleCart}
          />
          
          {/* Cart sidebar */}
          <motion.div
            className="fixed right-0 top-0 h-full w-full sm:w-96 bg-white shadow-xl z-50 flex flex-col"
            variants={sidebarVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b">
              <h2 className="text-xl font-semibold flex items-center">
                <FiShoppingBag className="mr-2" />
                Your Cart ({totalItems})
              </h2>
              <button
                onClick={toggleCart}
                className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                aria-label="Close cart"
              >
                <FiX className="w-5 h-5" />
              </button>
            </div>
            
            {/* Cart items */}
            <div className="flex-1 overflow-y-auto p-4">
              {items.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center p-4">
                  <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-4">
                    <FiShoppingBag className="w-8 h-8 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-medium mb-2">Your cart is empty</h3>
                  <p className="text-gray-500 mb-6">Looks like you haven't added any items to your cart yet.</p>
                  <button
                    onClick={toggleCart}
                    className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors"
                  >
                    Continue Shopping
                  </button>
                </div>
              ) : (
                <ul className="space-y-4">
                  <AnimatePresence>
                    {items.map((item) => (
                      <motion.li
                        key={item.id}
                        variants={itemVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        className="flex border-b border-gray-100 pb-4"
                      >
                        {/* Product image */}
                        <div className="w-20 h-20 rounded-md overflow-hidden flex-shrink-0">
                          <img
                            src={item.image || item.images?.[0]}
                            alt={item.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        
                        {/* Product details */}
                        <div className="ml-4 flex-1">
                          <div className="flex justify-between">
                            <h4 className="font-medium text-gray-900">{item.name}</h4>
                           <button
  onClick={async () => {
    try {
      // Remove from local store immediately for snappy UX
      removeItem(item.id);

      // If logged in, sync deletion with database
      if (session?.user) {
        const res = await fetch("/api/cart", {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ productId: item._id || item.id }),
        });

        const data = await res.json();

        if (!res.ok) {
          console.error(" Failed to remove from DB:", data.message);
        } else {
          console.log(" Item removed from DB:", data.message);
        }
      }
    } catch (err) {
      console.error(" Error deleting item:", err);
    }
  }}
  className="text-gray-400 hover:text-red-500 transition-colors"
  aria-label="Remove item"
>
  <FiTrash2 className="w-4 h-4" />
</button>
                          </div>
                          <p className="text-sm text-gray-500 mb-2">{item.category}</p>
                          <div className="flex justify-between items-center">
                            <div className="flex items-center border border-gray-200 rounded-md">
                              <button
                                onClick={() => updateItemQuantity(item.id, Math.max(1, item.quantity - 1))}
                                className="px-2 py-1 text-gray-500 hover:text-gray-700"
                                aria-label="Decrease quantity"
                              >
                                <FiMinus className="w-3 h-3" />
                              </button>
                              <span className="px-2 py-1 text-sm">{item.quantity}</span>
                              <button
                                onClick={() => updateItemQuantity(item.id, item.quantity + 1)}
                                className="px-2 py-1 text-gray-500 hover:text-gray-700"
                                aria-label="Increase quantity"
                              >
                                <FiPlus className="w-3 h-3" />
                              </button>
                            </div>
                            <p className="font-medium text-gray-900">
                              ${(item.price * item.quantity).toFixed(2)}
                            </p>
                          </div>
                        </div>
                      </motion.li>
                    ))}
                  </AnimatePresence>
                </ul>
              )}
            </div>
            
            {/* Footer with totals and checkout button */}
            {items.length > 0 && (
              <div className="border-t border-gray-200 p-4 bg-gray-50">
                <div className="flex justify-between mb-2">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-medium">${totalPrice.toFixed(2)}</span>
                </div>
                <div className="flex justify-between mb-4">
                  <span className="text-gray-600">Shipping</span>
                  <span className="font-medium">Calculated at checkout</span>
                </div>
                <div className="flex justify-between mb-6 text-lg font-bold">
                  <span>Total</span>
                  <span>${totalPrice.toFixed(2)}</span>
                </div>
                <Link
                  href="/checkout"
                  onClick={toggleCart}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-md font-medium flex items-center justify-center transition-colors"
                >
                  Proceed to Checkout
                </Link>
                <button
                  onClick={toggleCart}
                  className="w-full mt-2 border border-gray-300 bg-white hover:bg-gray-50 text-gray-800 py-2 rounded-md font-medium transition-colors"
                >
                  Continue Shopping
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

