import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

interface DishProps {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  price: number;
  category: string;
}

const DishCard: React.FC<DishProps> = ({ id, name, description, imageUrl, price, category }) => {
  return (
    <motion.div
      whileHover={{ y: -5 }}
      transition={{ duration: 0.2 }}
      className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300"
    >
      <Link to={`/dishes/${id}`}>
        <img
          src={imageUrl}
          alt={name}
          className="w-full h-48 object-cover"
        />
        <div className="p-4">
          <div className="flex justify-between items-start">
            <h3 className="text-lg font-semibold text-gray-800">{name}</h3>
            <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
              ${price.toFixed(2)}
            </span>
          </div>
          <span className="text-xs text-gray-500 mt-1 block">{category}</span>
          <p className="text-gray-600 mt-2 text-sm line-clamp-2">{description}</p>
          <div className="mt-4">
            <Link
              to={`/dishes/${id}`}
              className="text-orange-500 hover:text-orange-600 text-sm font-medium"
            >
              View Details →
            </Link>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export default DishCard;