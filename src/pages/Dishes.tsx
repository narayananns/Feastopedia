import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import DishCard from '../components/DishCard';
import SearchBar from '../components/SearchBar';
import CategoryFilter from '../components/CategoryFilter';
import { BASE_URL } from '../utils/constants';

interface Dish {
  _id: string;
  name: string;
  description: string;
  imageUrl: string;
  price: number;
  category: string;
}

const Dishes: React.FC = () => {
  const [dishes, setDishes] = useState<Dish[]>([]);
  const [filteredDishes, setFilteredDishes] = useState<Dish[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const location = useLocation();

  useEffect(() => {
    // Extract category from URL query params if present
    const queryParams = new URLSearchParams(location.search);
    const categoryParam = queryParams.get('category');
    
    if (categoryParam) {
      setSelectedCategory(categoryParam);
    }
    
    fetchDishes();
  }, [location.search]);

  const fetchDishes = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get(`${BASE_URL}/api/dishes`);
      const dishesData: Dish[] = response.data;
      setDishes(dishesData);
      
      // Extract unique categories
      const uniqueCategories = Array.from(new Set(dishesData.map(dish => dish.category)));
      setCategories(uniqueCategories);
      
      // Apply initial filters
      filterDishes(dishesData, selectedCategory, searchQuery);
    } catch (error) {
      console.error('Error fetching dishes:', error);
      toast.error('Failed to load dishes');
    } finally {
      setIsLoading(false);
    }
  };

  const filterDishes = (
    dishes: Dish[],
    category: string | null,
    search: string
  ) => {
    let filtered = [...dishes];
    
    // Filter by category
    if (category) {
      filtered = filtered.filter(dish => dish.category === category);
    }
    
    // Filter by search query
    if (search) {
      const lowercaseSearch = search.toLowerCase();
      filtered = filtered.filter(
        dish =>
          dish.name.toLowerCase().includes(lowercaseSearch) ||
          dish.description.toLowerCase().includes(lowercaseSearch)
      );
    }
    
    setFilteredDishes(filtered);
  };

  const handleCategorySelect = (category: string | null) => {
    setSelectedCategory(category);
    filterDishes(dishes, category, searchQuery);
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    filterDishes(dishes, selectedCategory, query);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Explore Dishes</h1>
        <p className="text-gray-600">
          Discover and browse through our collection of delicious dishes
        </p>
      </div>

      {/* Search and Filters */}
      <div className="mb-8">
        <SearchBar onSearch={handleSearch} />
        {categories.length > 0 && (
          <CategoryFilter
            categories={categories}
            selectedCategory={selectedCategory}
            onSelectCategory={handleCategorySelect}
          />
        )}
      </div>

      {/* Dishes Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[...Array(8)].map((_, index) => (
            <div key={index} className="bg-white rounded-lg overflow-hidden shadow-md p-4 h-72 animate-pulse">
              <div className="w-full h-40 bg-gray-200 rounded mb-4"></div>
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            </div>
          ))}
        </div>
      ) : (
        <AnimatePresence>
          {filteredDishes.length > 0 ? (
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
            >
              {filteredDishes.map(dish => (
                <motion.div key={dish._id} variants={itemVariants}>
                  <DishCard
                    id={dish._id}
                    name={dish.name}
                    description={dish.description}
                    imageUrl={dish.imageUrl}
                    price={dish.price}
                    category={dish.category}
                  />
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-12"
            >
              <h3 className="text-xl font-medium text-gray-700 mb-2">No dishes found</h3>
              <p className="text-gray-500">
                {searchQuery
                  ? `No results for "${searchQuery}"`
                  : selectedCategory
                  ? `No dishes found in the "${selectedCategory}" category`
                  : 'No dishes available at the moment'}
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      )}
    </div>
  );
};

export default Dishes;