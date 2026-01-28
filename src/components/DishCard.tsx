import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { DEFAULT_DISH_IMAGE } from '../utils/constants';

interface DishProps {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  price: number;
  category: string;
}

const DishCard: React.FC<DishProps> = ({ id, name, description, imageUrl, price, category }) => {
  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    e.currentTarget.src = DEFAULT_DISH_IMAGE;
  };

  return (
    <motion.div
      whileHover={{ y: -5 }}
      transition={{ duration: 0.2 }}
      className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300 h-full flex flex-col"
    >
      <Link to={`/dishes/${id}`} className="block h-48 overflow-hidden relative group">
        <img
          src={imageUrl || DEFAULT_DISH_IMAGE}
          alt={name}
          loading="lazy"
          decoding="async"
          onError={handleImageError}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-all duration-300"></div>
      </Link>
      <div className="p-4 flex flex-col flex-grow">
        <div className="flex justify-between items-start mb-2">
          <Link to={`/dishes/${id}`}>
            <h3 className="text-lg font-bold text-gray-800 hover:text-orange-500 line-clamp-1" title={name}>{name}</h3>
          </Link>
          <span className="bg-orange-100 text-orange-800 text-xs font-bold px-2 py-1 rounded-full whitespace-nowrap ml-2">
            ₹{price.toFixed(0)}
          </span>
        </div>
        <span className="text-xs text-gray-500 mb-2 block font-medium uppercase tracking-wide">{category}</span>
        <p className="text-gray-600 text-sm line-clamp-2 mb-4 flex-grow">{description}</p>
        <div className="mt-auto pt-3 border-t border-gray-100">
          <Link
            to={`/dishes/${id}`}
            className="text-orange-500 hover:text-orange-600 text-sm font-semibold flex items-center justify-between group"
          >
            <span>View Recipe</span>
            <span className="transform group-hover:translate-x-1 transition-transform">→</span>
          </Link>
        </div>
      </div>
    </motion.div>
  );
};

export default DishCard;