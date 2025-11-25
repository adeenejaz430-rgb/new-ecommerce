'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { FiSave, FiX, FiUpload } from 'react-icons/fi';
import { useProductStore } from '../../../../lib/store';
import { message } from 'antd';
import FileUpload from '@/components/ui/FileUpload';

export default function NewProduct() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const addProduct = useProductStore((state) => state.addProduct);
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    price: 0,
    quantity: 0,
    description: '',
    featured: false,
    images: []
  });
  
  const categories = ['Furniture', 'Lighting', 'Decor', 'Electronics', 'Textiles', 'Kitchen'];
  
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    // Handle numeric inputs properly
    if (name === 'price' || name === 'quantity') {
      setFormData({
        ...formData,
        [name]: type === 'checkbox' ? checked : value === '' ? 0 : Number(value)
      });
    } else {
      setFormData({
        ...formData,
        [name]: type === 'checkbox' ? checked : value
      });
    }
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // Format the data properly
      const productData = {
        ...formData,
        price: parseFloat(formData.price),
        quantity: parseInt(formData.quantity),
        slug: formData.name.toLowerCase().replace(/\s+/g, '-'),
        image: formData.images.length > 0 ? formData.images[0] : '/images/placeholder.jpg',
        createdAt: new Date().toISOString(),
        featured: formData.featured || false,
      };
      
      // Save product to database via API
      const response = await fetch('/api/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(productData),
      });
      
      const result = await response.json();
      
      if (result.success) {
        // Add the product to the store
        const newProduct = addProduct(result.data);
        console.log('Product added successfully:', newProduct);
        
        // Show success message
        message.success('Product added successfully!');
        
        // Redirect to products list
        router.push('/admin/products');
      } else {
        throw new Error(result.message || 'Failed to save product');
      }
    } catch (error) {
      console.error('Error adding product:', error);
      message.error('Failed to add product. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <div className="max-w-4xl mx-auto pt-12">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Add New Product</h1>
        
        <button
          type="button"
          onClick={() => router.push('/admin/products')}
          className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          <FiX className="mr-2 -ml-1 h-5 w-5" />
          Cancel
        </button>
      </div>
      
      <motion.div
        className="bg-white rounded-lg shadow overflow-hidden"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <form onSubmit={handleSubmit}>
          <div className="p-6 space-y-6">
            {/* Basic Information */}
            <div>
              <h2 className="text-lg font-medium text-gray-900 mb-4">Basic Information</h2>
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                    Product Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    id="name"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                </div>
                
                <div>
                  <label htmlFor="category" className="block text-sm font-medium text-gray-700">
                    Category *
                  </label>
                  <select
                    id="category"
                    name="category"
                    required
                    value={formData.category}
                    onChange={handleChange}
                    className="mt-1 block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                  >
                    <option value="">Select a category</option>
                    {categories.map((category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label htmlFor="price" className="block text-sm font-medium text-gray-700">
                    Price ($) *
                  </label>
                  <input
                    type="number"
                    name="price"
                    id="price"
                    required
                    min="0"
                    step="0.01"
                    value={formData.price}
                    onChange={handleChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                </div>
                
                <div>
                  <label htmlFor="quantity" className="block text-sm font-medium text-gray-700">
                    Stock Quantity *
                  </label>
                  <input
                    type="number"
                    name="quantity"
                    id="quantity"
                    required
                    min="0"
                    value={formData.quantity}
                    onChange={handleChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                </div>
              </div>
            </div>
            
            {/* Description */}
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                Description *
              </label>
              <textarea
                id="description"
                name="description"
                rows="4"
                required
                value={formData.description}
                onChange={handleChange}
                className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="Product description"
              />
            </div>
            
            {/* Featured checkbox */}
            <div>
              <h2 className="text-lg font-medium text-gray-900 mb-4">Product Options</h2>
              <div className="flex items-center">
                <input
                  id="featured"
                  name="featured"
                  type="checkbox"
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  checked={formData.featured || false}
                  onChange={handleChange}
                />
                <label htmlFor="featured" className="ml-2 block text-sm text-gray-700">
                  Featured product (will appear on homepage)
                </label>
              </div>
            </div>
            
            {/* Images */}
            <div>
              <h2 className="text-lg font-medium text-gray-900 mb-4">Product Images</h2>
              <div className="mt-1 px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                <div className="space-y-4">
                  <FileUpload 
                    maxCount={5} 
                    accept="image/*"
                    onUploadComplete={(filePath) => {
                      if (filePath) {
                        setFormData({
                          ...formData,
                          images: [...formData.images, filePath]
                        });
                      }
                    }}
                  />
                  
                  {formData.images.length > 0 && (
                    <div className="mt-4">
                      <h3 className="text-sm font-medium text-gray-700 mb-2">Uploaded Images:</h3>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                        {formData.images.map((image, index) => (
                          <div key={index} className="relative group">
                            <img 
                              src={image} 
                              alt={`Product image ${index + 1}`} 
                              className="h-24 w-24 object-cover rounded-md"
                            />
                            <button
                              type="button"
                              className="absolute top-0 right-0 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                              onClick={() => {
                                const newImages = [...formData.images];
                                newImages.splice(index, 1);
                                setFormData({ ...formData, images: newImages });
                              }}
                            >
                              <FiX className="h-4 w-4" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
          
          <div className="px-4 py-3 bg-gray-50 text-right sm:px-6">
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <div className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span>Saving...</span>
                </div>
              ) : (
                <div className="flex items-center">
                  <FiSave className="mr-2 -ml-1 h-5 w-5" />
                  <span>Save Product</span>
                </div>
              )}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}