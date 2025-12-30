import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { motion } from 'framer-motion';
import { ChevronRight } from 'lucide-react';
import DishCard from '../components/DishCard';
import { BASE_URL } from '../utils/constants';

interface Dish {
  _id: string;
  name: string;
  description: string;
  imageUrl: string;
  price: number;
  category: string;
}

const Home: React.FC = () => {
  const [featuredDishes, setFeaturedDishes] = useState<Dish[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchFeaturedDishes = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/api/dishes?limit=4`);
        setFeaturedDishes(response.data.slice(0, 4));
      } catch (error) {
        console.error('Error fetching featured dishes:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchFeaturedDishes();
  }, []);

  const heroVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    }
  };

  return (
    <div>
      {/* Hero Section */}
      <motion.section 
        className="bg-gradient-to-r from-orange-50 to-amber-50 rounded-xl overflow-hidden shadow-md mb-12"
        initial="hidden"
        animate="visible"
        variants={heroVariants}
      >
        <div className="container mx-auto py-12 px-4 md:px-8 flex flex-col md:flex-row items-center">
          <div className="md:w-1/2 mb-8 md:mb-0">
            <motion.h1 
              className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-800 mb-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
            >
              Discover Delicious <span className="text-orange-500">Culinary</span> Creations
            </motion.h1>
            <motion.p 
              className="text-gray-600 mb-6 text-lg"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.5 }}
            >
              Explore a world of flavors, save your favorite dishes, and create your own culinary masterpieces.
            </motion.p>
            <motion.div
              className="flex space-x-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.5 }}
            >
              <Link 
                to="/dishes" 
                className="bg-orange-500 hover:bg-orange-600 text-white py-2 px-6 rounded-md transition duration-300 flex items-center"
              >
                Explore Dishes
                <ChevronRight className="ml-1 h-4 w-4" />
              </Link>
              {!isLoading && (
                <Link 
                  to="/register" 
                  className="bg-white hover:bg-gray-100 text-gray-800 border border-gray-300 py-2 px-6 rounded-md transition duration-300"
                >
                  Join Now
                </Link>
              )}
            </motion.div>
          </div>
          <div className="md:w-1/2">
            <motion.img 
              src="https://images.pexels.com/photos/1640774/pexels-photo-1640774.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
              alt="Delicious Food"
              className="rounded-lg shadow-md w-full h-auto md:h-80 object-cover"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3, duration: 0.6 }}
            />
          </div>
        </div>
      </motion.section>

      {/* Featured Dishes Section */}
      <section className="mb-12">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Featured Dishes</h2>
          <Link 
            to="/dishes" 
            className="text-orange-500 hover:text-orange-600 font-medium flex items-center"
          >
            View All
            <ChevronRight className="ml-1 h-4 w-4" />
          </Link>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, index) => (
              <div key={index} className="bg-white rounded-lg overflow-hidden shadow-md p-4 h-64 animate-pulse">
                <div className="w-full h-32 bg-gray-200 rounded mb-4"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredDishes.map((dish) => (
              <DishCard
                key={dish._id}
                id={dish._id}
                name={dish.name}
                description={dish.description}
                imageUrl={dish.imageUrl}
                price={dish.price}
                category={dish.category}
              />
            ))}
          </div>
        )}
      </section>

      {/* Categories Section */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Categories</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {['Appetizer', 'Main Course', 'Dessert', 'Beverage', 'Vegan', 'Vegetarian'].map((category) => (
            <Link 
              key={category} 
              to={`/dishes?category=${category}`}
              className="group"
            >
              <motion.div 
                whileHover={{ y: -5 }}
                className="bg-white rounded-lg p-4 shadow-md text-center hover:shadow-lg transition-all duration-300 h-full flex flex-col items-center justify-center"
              >
                <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mb-3 group-hover:bg-orange-200 transition-colors duration-300">
                  <span className="text-orange-500 text-xl">
                    {category === 'Appetizer' && '🍲'}
                    {category === 'Main Course' && '🍝'}
                    {category === 'Dessert' && '🍰'}
                    {category === 'Beverage' && '🥤'}
                    {category === 'Vegan' && '🥗'}
                    {category === 'Vegetarian' && '🥦'}
                  </span>
                </div>
                <h3 className="font-medium text-gray-800 group-hover:text-orange-500 transition-colors duration-300">
                  {category}
                </h3>
              </motion.div>
            </Link>
          ))}
        </div>
      </section>

      {/* Join Us Banner */}
      <section className="bg-orange-500 rounded-xl overflow-hidden shadow-lg">
        <div className="container mx-auto py-12 px-4 md:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Join Our Food Community</h2>
          <p className="text-white text-opacity-90 mb-6 max-w-2xl mx-auto">
            Sign up to share your favorite recipes, save dishes, and connect with other food enthusiasts.
          </p>
          <Link 
            to="/register" 
            className="inline-block bg-white hover:bg-gray-100 text-orange-500 font-medium py-2 px-6 rounded-md transition duration-300"
          >
            Sign Up Now
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;