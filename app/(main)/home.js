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
import { useProductStore } from '@/lib/store';
import FeaturedProducts from '@/components/shared/FeaturedProducts';
import NewsletterSection from '@/components/shared/NewsletterSection';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';

const heroSlides = [
  {
    id: 1,
    image: '/hero-fruits-1.jpg', // Replace with your fruit basket images
    title: 'Fruits',
  },
  {
    id: 2,
    image: '/hero-fruits-2.jpg',
    title: 'Vegetables',
  },
  {
    id: 3,
    image: '/hero-fruits-3.jpg',
    title: 'Organic',
  },
];

export default function HomePage() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const fetchProducts = useProductStore((state) => state.fetchProducts);

  // Fetch products on mount
  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  // Auto-slide
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const handlePrevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + heroSlides.length) % heroSlides.length);
  };

  const handleNextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    // Implement search functionality
    console.log('Searching for:', searchQuery);
  };

  return (
    <div className="w-full">
      {/* ===== HERO SECTION ===== */}
      <section className="relative min-h-[600px] lg:min-h-[700px] w-full bg-gradient-to-br from-orange-50 via-yellow-50 to-green-50 overflow-hidden">
        {/* Background Pattern/Overlay */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-32 h-32 bg-green-400 rounded-full blur-3xl"></div>
          <div className="absolute top-40 right-20 w-40 h-40 bg-orange-400 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 left-1/4 w-36 h-36 bg-yellow-400 rounded-full blur-3xl"></div>
        </div>

        <div className="container mx-auto px-4 py-12 lg:py-16 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            {/* Left Content */}
            <div className="text-left space-y-6 lg:space-y-8">
              {/* Badge */}
              <div className="inline-block">
                <span className="text-orange-500 font-semibold text-lg tracking-wide">
                  100% Organic Foods
                </span>
              </div>

              {/* Main Heading */}
              <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold leading-tight">
                <span className="text-green-600">Organic</span>{' '}
                <span className="text-gray-800">Veggies &</span>
                <br />
                <span className="text-gray-800">Fruits Foods</span>
              </h1>

              {/* Search Bar */}
              <form onSubmit={handleSearch} className="relative max-w-xl">
                <div className="flex items-center bg-white rounded-full shadow-lg overflow-hidden border-2 border-gray-100">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search"
                    className="flex-1 px-6 py-4 text-gray-700 outline-none text-base"
                  />
                  <button
                    type="submit"
                    className="bg-green-500 hover:bg-green-600 text-white font-semibold px-8 py-4 transition-colors"
                  >
                    Submit Now
                  </button>
                </div>
              </form>
            </div>

            {/* Right Image Carousel */}
            <div className="relative">
              {/* Main Image Container with Card Design */}
              <div className="relative bg-white rounded-3xl shadow-2xl overflow-hidden border-8 border-white max-w-md mx-auto lg:max-w-lg">
                {/* Image Slider */}
                <div className="relative h-[400px] lg:h-[500px] bg-gradient-to-br from-orange-200 to-yellow-200">
                  {heroSlides.map((slide, index) => (
                    <div
                      key={slide.id}
                      className={`absolute inset-0 transition-opacity duration-700 ${
                        index === currentSlide ? 'opacity-100' : 'opacity-0'
                      }`}
                    >
                      <img
                        src={slide.image}
                        alt={slide.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ))}

                  {/* Bottom Label */}
                  <div className="absolute bottom-6 left-1/2 -translate-x-1/2">
                    <div className="bg-white px-8 py-3 rounded-full shadow-lg">
                      <span className="text-gray-800 font-bold text-lg">
                        {heroSlides[currentSlide].title}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Navigation Arrows */}
                <button
                  onClick={handlePrevSlide}
                  className="absolute left-4 top-1/2 -translate-y-1/2 bg-white hover:bg-gray-100 text-gray-800 p-3 rounded-full shadow-lg transition-all z-10"
                  aria-label="Previous slide"
                >
                  <FiChevronLeft className="w-6 h-6" />
                </button>

                <button
                  onClick={handleNextSlide}
                  className="absolute right-4 top-1/2 -translate-y-1/2 bg-white hover:bg-gray-100 text-gray-800 p-3 rounded-full shadow-lg transition-all z-10"
                  aria-label="Next slide"
                >
                  <FiChevronRight className="w-6 h-6" />
                </button>
              </div>

              {/* Decorative Elements */}
              <div className="absolute -top-6 -right-6 w-24 h-24 bg-orange-300 rounded-full opacity-50 blur-xl"></div>
              <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-green-300 rounded-full opacity-50 blur-xl"></div>
            </div>
          </div>
        </div>

        {/* Wave Divider */}
        <div className="absolute bottom-0 left-0 w-full">
          <svg
            viewBox="0 0 1440 120"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-full"
          >
            <path
              d="M0 120L60 110C120 100 240 80 360 70C480 60 600 60 720 65C840 70 960 80 1080 85C1200 90 1320 90 1380 90L1440 90V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z"
              fill="#F9FAFB"
            />
          </svg>
        </div>
      </section>

      {/* ===== Featured Products Section ===== */}
      <FeaturedProducts />

      {/* ===== Newsletter Section ===== */}
      <NewsletterSection />
    </div>
  );
}