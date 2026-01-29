import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { motion } from 'framer-motion';
import { ChevronRight, CheckCircle, Clock, Users, Star } from 'lucide-react';
import DishCard from '../components/DishCard';
import { BASE_URL } from '../utils/constants';
import { useAuth } from '../contexts/AuthContext';
import Skeleton from '../components/Skeleton';

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
  const { isAuthenticated } = useAuth();
  
  useEffect(() => {
    const fetchFeaturedDishes = async () => {
      try {
        // Cache Check
        const CACHE_KEY = 'feastopedia_home_v1';
        const cached = sessionStorage.getItem(CACHE_KEY);
        if (cached) {
            const { data, timestamp } = JSON.parse(cached);
            if (Date.now() - timestamp < 30 * 60 * 1000) {
               setFeaturedDishes(data);
               setIsLoading(false);
               return;
            }
        }

        // Use a clean axios instance for external calls to bypass Auth headers
        const externalAxios = axios.create();
        delete externalAxios.defaults.headers.common['Authorization'];

         // Use a reliable search term 'Chicken' to ensure we always get data, instead of generic search
        const [localResult, externalResult] = await Promise.allSettled([
          axios.get(`${BASE_URL}/api/dishes?limit=4`),
          externalAxios.get('https://www.themealdb.com/api/json/v1/1/search.php?s=Chicken')
        ]);

        let allDishes: Dish[] = [];

        // 1. Process Local Dishes
        if (localResult.status === 'fulfilled') {
          if (Array.isArray(localResult.value.data)) {
            allDishes = [...allDishes, ...localResult.value.data];
          }
        }

        // 2. Process External Dishes
        if (externalResult.status === 'fulfilled') {
          const data = externalResult.value.data;
          if (data && data.meals) {
            const externalMeals = data.meals.slice(0, 8).map((meal: any) => {
               // Generate a price
               const pseudoRandomPrice = (12 + (parseInt(meal.idMeal.slice(-2)) || 50) / 4) * 85;
               
               return {
                _id: `ext-${meal.idMeal}`,
                name: meal.strMeal,
                description: meal.strInstructions 
                  ? `${meal.strInstructions.slice(0, 100)}...` 
                  : 'Delicious food.',
                imageUrl: meal.strMealThumb,
                price: parseFloat(pseudoRandomPrice.toFixed(0)),
                category: meal.strCategory
              };
            });
            allDishes = [...allDishes, ...externalMeals];
          }
        }
        
        // Remove duplicates and Shuffle slightly (optional) or just take top
        allDishes = Array.from(new Map(allDishes.map(item => [item._id, item])).values());

        // 3. Fallback (Demo Data) if absolutely nothing loaded
        if (allDishes.length === 0) {
           allDishes = [
            {
              _id: 'demo-home-1',
              name: 'Grilled Salmon',
              description: 'Fresh Atlantic salmon fillet grilled to perfection.',
              imageUrl: 'https://images.unsplash.com/photo-1467003909585-2f8a7270028d?auto=format&fit=crop&w=800&q=80',
              price: 1999,
              category: 'Main Course'
            },
            {
              _id: 'demo-home-2',
              name: 'Classic Cheeseburger',
              description: 'Juicy beef patty with melted cheddar.',
              imageUrl: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=800&q=80',
              price: 1299, 
              category: 'Main Course'
            },
            {
              _id: 'demo-home-3',
              name: 'Chocolate Lava Cake',
              description: 'Rich chocolate cake with a molten center.',
              imageUrl: 'https://images.unsplash.com/photo-1624353365286-3f8d62daad51?auto=format&fit=crop&w=800&q=80',
              price: 749,
              category: 'Dessert'
            },
            {
              _id: 'demo-home-4',
              name: 'Caesar Salad',
              description: 'Crisp romaine lettuce with Caesar dressing.',
              imageUrl: 'https://images.unsplash.com/photo-1550304943-4f24f54ddde9?auto=format&fit=crop&w=800&q=80',
              price: 899,
              category: 'Appetizer'
            }
          ];
        }

        // Take the top 4
        const finalDishes = allDishes.slice(0, 4);
        
        sessionStorage.setItem('feastopedia_home_v1', JSON.stringify({
           data: finalDishes,
           timestamp: Date.now()
        }));

        setFeaturedDishes(finalDishes);

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
              {!isLoading && !isAuthenticated && (
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
              <div key={index} className="bg-white rounded-lg overflow-hidden shadow-md p-4 h-64">
                <Skeleton className="w-full h-32 mb-4" />
                <Skeleton className="w-3/4 h-4 mb-2" />
                <Skeleton className="w-1/2 h-4" />
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
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-4 gap-4">
          {[
            { name: 'Appetizer', icon: '🍲' },
            { name: 'Main Course', icon: '🍝' },
            { name: 'Dessert', icon: '🍰' },
            { name: 'Seafood', icon: '🦐' },
            { name: 'Vegan', icon: '🥗' },
            { name: 'Vegetarian', icon: '🥦' },
            { name: 'Indian', icon: '🍛' },
            { name: 'Breakfast', icon: '🥞' }
          ].map((cat) => (
            <Link 
              key={cat.name} 
              to={`/dishes?category=${cat.name}`}
              className="group"
            >
              <motion.div 
                whileHover={{ y: -5 }}
                className="bg-white rounded-lg p-4 shadow-md text-center hover:shadow-lg transition-all duration-300 h-full flex flex-col items-center justify-center transform group-hover:bg-orange-50 border border-transparent group-hover:border-orange-100"
              >
                <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mb-3 group-hover:bg-orange-200 transition-colors duration-300 shadow-inner">
                  <span className="text-3xl filter drop-shadow-sm">
                    {cat.icon}
                  </span>
                </div>
                <h3 className="font-semibold text-gray-800 group-hover:text-orange-600 transition-colors duration-300 text-lg">
                  {cat.name}
                </h3>
              </motion.div>
            </Link>
          ))}
        </div>
      </section>

      {/* Features Section */}
      <section className="mb-12 bg-white rounded-xl p-8 shadow-sm border border-gray-100">
        <div className="text-center mb-10">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Why Choose FeastoPedia?</h2>
          <p className="text-gray-500">We bring the best culinary experience to your screen</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center p-4">
             <div className="bg-orange-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-orange-500">
                <Clock size={32} />
             </div>
             <h3 className="text-lg font-semibold mb-2">Quick Recipes</h3>
             <p className="text-gray-500 text-sm">Find easy-to-make recipes that are ready in 30 minutes or less.</p>
          </div>
          <div className="text-center p-4">
             <div className="bg-orange-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-orange-500">
                <Users size={32} />
             </div>
             <h3 className="text-lg font-semibold mb-2">Community Driven</h3>
             <p className="text-gray-500 text-sm">Share your own recipes and get feedback from our passionate community.</p>
          </div>
          <div className="text-center p-4">
             <div className="bg-orange-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-orange-500">
                <Star size={32} />
             </div>
             <h3 className="text-lg font-semibold mb-2">Top Rated Dishes</h3>
             <p className="text-gray-500 text-sm">Discover the most loved dishes as voted by foodies like you.</p>
          </div>
        </div>
      </section>

      {/* Join Us Banner - Only show if not logged in */}
      {!isAuthenticated && (
      <section className="bg-orange-500 rounded-xl overflow-hidden shadow-lg">
        <div className="container mx-auto py-12 px-4 md:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Join the Community</h2>
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
      )}
    </div>
  );
};

export default Home;