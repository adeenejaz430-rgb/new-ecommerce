// 'use client';

// import { useEffect, useState } from 'react';
// import Link from 'next/link';
// import FeaturedProducts from '@/components/shared/FeaturedProducts';
// import NewsletterSection from '@/components/shared/NewsletterSection';
// import HeroSlider from '@/components/shared/HeroSlider';
// import { motion } from 'framer-motion';

// export default function Home() {
//   return (
//     <div className="container mx-auto px-4">
//       {/* Hero Section */}
//       <section className="mt-24 md:mt-32 mb-16">
//         <div className="container mx-auto px-0">
//           <div className="flex flex-col md:flex-row items-center bg-gray-50">
//             {/* Left content */}
//             <motion.div 
//               initial={{ opacity: 0, x: -50 }}
//               animate={{ opacity: 1, x: 0 }}
//               transition={{ duration: 0.5 }}
//               className="w-full md:w-1/2 p-8 sm:p-12 md:p-16 lg:p-20 order-2 md:order-1"
//             >
//               <div className="uppercase text-green-500 font-semibold mb-3 text-xs sm:text-sm tracking-wider">
//                 INSPIRED BY NATURE
//               </div>
//               <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-4 sm:mb-6 leading-tight">
//                 Handcrafted Artificial Florals & Vases
//               </h1>
//               <p className="text-gray-600 mb-6 sm:mb-8 text-base sm:text-lg">
//                 Free Pickup and Delivery Available
//               </p>
//               <Link 
//                 href="/products"
//                 className="inline-block px-8 sm:px-10 py-3 sm:py-4 bg-green-500 text-white font-semibold uppercase hover:bg-green-600 transition-all duration-300 text-sm sm:text-base"
//               >
//                 SHOP NOW
//               </Link>
//             </motion.div>
            
//             {/* Right side product slider */}
//             <motion.div
//               initial={{ opacity: 0, scale: 0.95 }}
//               animate={{ opacity: 1, scale: 1 }}
//               transition={{ duration: 0.5, delay: 0.2 }}
//               className="w-full md:w-1/2 order-1 md:order-2 flex items-center justify-center p-4"
//             >
//               <HeroSlider />
//             </motion.div>
//           </div>
//         </div>
//       </section>

//       {/* Featured Products Section */}
//       <FeaturedProducts />

//       {/* Newsletter Section */}
//       <NewsletterSection />
//     </div>
//   );
// }
'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import FeaturedProducts from '@/components/shared/FeaturedProducts.js';
import NewsletterSection from '@/components/shared/NewsletterSection';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';

const slides = [
  {
    id: 1,
    image: '/flower.png', // Replace with your own images
    heading: 'Elevate Interiors with Quality & Style',
    text: 'Since 2015, Golden Rugs has been a trusted supplier of premium rugs and curated furniture. We deliver quality, affordability, and timeless design.',
    buttonText: 'Explore Now',
    buttonLink: '/products',
  },
  {
    id: 2,
    image: '/flower.png',
    heading: 'Transform Your Home with Modern Elegance',
    text: 'Discover handcrafted furniture and décor that define comfort and luxury. Shop dining sets, coffee tables, and more.',
    buttonText: 'Shop Collection',
    buttonLink: '/products',
  },
  {
    id: 3,
    image: '/flower.png',
    heading: 'Crafted to Inspire Every Space',
    text: 'Explore our wide range of designs, from bold modern styles to timeless classics — made for retailers who value excellence.',
    buttonText: 'View Catalog',
    buttonLink: '/products',
  },
];

export default function Home() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 6000); // Auto-slide every 6s
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="w-full">
      {/* ===== HERO SECTION ===== */}
      <section className="relative h-[90vh] w-full overflow-hidden">
        <AnimatePresence mode="wait">
          {slides.map(
            (slide, index) =>
              index === current && (
                <motion.div
                  key={slide.id}
                  initial={{ opacity: 0, scale: 1.05 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.8 }}
                  className="absolute inset-0"
                >
                  <Image
                    src={slide.image}
                    alt={slide.heading}
                    fill
                    priority
                    className="object-contain w-full h-full brightness-[0.7]"
                  />

                  {/* Text overlay */}
                  <div className="absolute inset-0 flex flex-col justify-center items-start px-6 md:px-16 lg:px-24 text-black max-w-2xl">
                    <motion.h1
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3, duration: 0.8 }}
                      className="text-3xl sm:text-5xl md:text-6xl font-extrabold leading-tight mb-6 drop-shadow-lg"
                    >
                      {slide.heading}
                    </motion.h1>

                    <motion.p
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.6, duration: 0.8 }}
                      className="text-sm sm:text-base md:text-lg mb-8 text-black drop-shadow-md"
                    >
                      {slide.text}
                    </motion.p>

                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.8 }}
                    >
                      <Link
                        href={slide.buttonLink}
                        className="inline-block bg-black/80 hover:bg-black text-white font-semibold px-6 py-3 rounded-md text-sm sm:text-base uppercase transition-colors"
                      >
                        {slide.buttonText}
                      </Link>
                    </motion.div>
                  </div>
                </motion.div>
              )
          )}
        </AnimatePresence>

        {/* Navigation Dots */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex space-x-2">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrent(index)}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                index === current ? 'bg-white scale-110' : 'bg-gray-400'
              }`}
            />
          ))}
        </div>
      </section>

      {/* ===== Featured Products Section ===== */}
      <div className="container mx-auto px-4 mt-16">
        <FeaturedProducts />
      </div>

      {/* ===== Newsletter Section ===== */}
      <NewsletterSection />
    </div>
  );
}
