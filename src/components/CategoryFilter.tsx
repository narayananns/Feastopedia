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
    <div className="mb-8 overflow-x-auto pb-4 scrollbar-hide py-2">
      <div className="flex space-x-3 px-1 min-w-max">
        <motion.button
          whileHover={{ scale: 1.05, y: -2 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => onSelectCategory(null)}
          className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all shadow-sm border ${
            selectedCategory === null
              ? 'bg-orange-500 text-white border-orange-500 shadow-md ring-2 ring-orange-200'
              : 'bg-white text-gray-600 border-gray-200 hover:border-orange-300 hover:text-orange-500 hover:shadow-md'
          }`}
        >
          All Dishes
        </motion.button>
        
        {categories.map(category => (
          <motion.button
            key={category}
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onSelectCategory(category)}
            className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all shadow-sm border ${
              selectedCategory === category
                ? 'bg-orange-500 text-white border-orange-500 shadow-md ring-2 ring-orange-200'
                : 'bg-white text-gray-600 border-gray-200 hover:border-orange-300 hover:text-orange-500 hover:shadow-md'
            }`}
          >
            {category}
          </motion.button>
        ))}
      </div>
    </div>
  );
};

export default CategoryFilter;