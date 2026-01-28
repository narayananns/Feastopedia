import React from 'react';
import { motion } from 'framer-motion';

interface CategoryFilterProps {
  categories: string[];
  selectedCategory: string | null;
  onSelectCategory: (category: string | null) => void;
}

const CategoryFilter: React.FC<CategoryFilterProps> = ({ 
  categories, 
  selectedCategory, 
  onSelectCategory 
}) => {
  return (
    <div className="mb-8 relative group">
      {/* Gradient fade indicators for scrolling */}
      <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-orange-50 to-transparent pointer-events-none z-10 hidden sm:block" />
      <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-orange-50 to-transparent pointer-events-none z-10 hidden sm:block" />
      
      <div className="overflow-x-auto pb-4 pt-2 scrollbar-hide -mx-4 px-4 sm:mx-0 sm:px-0">
        <div className="flex space-x-3 min-w-max">
          <motion.button
            whileHover={{ scale: 1.02, y: -1 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onSelectCategory(null)}
            className={`px-6 py-2.5 rounded-full text-sm font-semibold tracking-wide transition-all duration-200 shadow-sm border ${
              selectedCategory === null
                ? 'bg-orange-600 text-white border-orange-600 shadow-orange-200 shadow-lg translate-y-[-1px]'
                : 'bg-white text-gray-700 border-gray-200 hover:border-orange-300 hover:text-orange-600 hover:shadow-md hover:bg-orange-50'
            }`}
          >
            All Dishes
          </motion.button>
          
          {categories.map(category => (
            <motion.button
              key={category}
              whileHover={{ scale: 1.02, y: -1 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => onSelectCategory(category)}
              className={`px-6 py-2.5 rounded-full text-sm font-semibold tracking-wide transition-all duration-200 shadow-sm border ${
                selectedCategory === category
                  ? 'bg-orange-600 text-white border-orange-600 shadow-orange-200 shadow-lg translate-y-[-1px]'
                  : 'bg-white text-gray-700 border-gray-200 hover:border-orange-300 hover:text-orange-600 hover:shadow-md hover:bg-orange-50'
              }`}
            >
              {category}
            </motion.button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CategoryFilter;