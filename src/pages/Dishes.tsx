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
  // Removed explicit filteredDishes state in favor of useMemo to avoid synchronization issues
  const [categories, setCategories] = useState<string[]>([]);
  
  const location = useLocation();
  const getInitialCategory = () => {
    const params = new URLSearchParams(location.search);
    return params.get('category');
  }
  const [selectedCategory, setSelectedCategory] = useState<string | null>(getInitialCategory());
  
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  // 1. Fetch Data Once
  useEffect(() => {
    fetchDishes();
  }, []);

  // 2. Handle URL Query Params (For navigation updates)
  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const categoryParam = queryParams.get('category');
    // Only update if it's different to prevent loops
    if (categoryParam !== selectedCategory) {
       if (categoryParam) {
         setSelectedCategory(categoryParam);
       } else if (!categoryParam && location.search === '') {
         setSelectedCategory(null);
       }
    }
  }, [location.search]);

  // 3. Derived State (Filtering) - Always in sync
  const filteredDishes = React.useMemo(() => {
    let filtered = [...dishes];
    
    // Filter by category
    if (selectedCategory) {
      filtered = filtered.filter(dish => dish.category === selectedCategory);
    }
    
    // Filter by search query
    if (searchQuery) {
      const lowercaseSearch = searchQuery.toLowerCase();
      filtered = filtered.filter(
        dish =>
          dish.name.toLowerCase().includes(lowercaseSearch) ||
          dish.description.toLowerCase().includes(lowercaseSearch)
      );
    }
    
    return filtered;
  }, [dishes, selectedCategory, searchQuery]);

  const fetchDishes = async () => {
    try {
      setIsLoading(true);

      // Cache Mechanism: Check SessionStorage
      const CACHE_KEY = 'feastopedia_dishes_v2'; 
      const cached = sessionStorage.getItem(CACHE_KEY);
      if (cached) {
         try {
           const { data, timestamp } = JSON.parse(cached);
           // Cache validity: 30 minutes
           if (Date.now() - timestamp < 30 * 60 * 1000) {
             setDishes(data);
             
             // Extract categories
             const defaultCategories = ['Appetizer', 'Main Course', 'Dessert', 'Seafood', 'Vegan', 'Vegetarian', 'Indian', 'Breakfast'];
             const dynamicCategories = Array.from(new Set(data.map((d: Dish) => d.category)));
             const uniqueCategories = Array.from(new Set([...defaultCategories, ...(dynamicCategories as string[])])).sort();
             setCategories(uniqueCategories);
             
             setIsLoading(false);
             return; 
           }
         } catch (e) {
           sessionStorage.removeItem(CACHE_KEY);
         }
      }

      // Use a clean axios instance for external calls to bypass Auth headers which cause CORS errors
      const externalAxios = axios.create();
      delete externalAxios.defaults.headers.common['Authorization'];
      
      // Request strategy:
      // 1. Local Database
      // 2. TheMealDB - Search 'Chicken' (Guaranteed results)
      // 3. TheMealDB - Search 'Pasta'
      // 4. TheMealDB - Search 'Seafood'
      // 5. TheMealDB - Filter 'Vegetarian' (Lightweight list)
      
      const promises = [
        axios.get(`${BASE_URL}/api/dishes`),
        // Core Searches (Full Details)
        externalAxios.get('https://www.themealdb.com/api/json/v1/1/search.php?s=Chicken'),
        externalAxios.get('https://www.themealdb.com/api/json/v1/1/search.php?s=Pasta'),
        externalAxios.get('https://www.themealdb.com/api/json/v1/1/search.php?s=Seafood'),
        
        // Explicit Category Filters (Partial Details - handled by index)
        externalAxios.get('https://www.themealdb.com/api/json/v1/1/filter.php?a=Indian'),   // Index 4
        externalAxios.get('https://www.themealdb.com/api/json/v1/1/filter.php?c=Vegetarian'),// Index 5
        externalAxios.get('https://www.themealdb.com/api/json/v1/1/filter.php?c=Dessert'),   // Index 6
        externalAxios.get('https://www.themealdb.com/api/json/v1/1/filter.php?c=Starter'),   // Index 7
        externalAxios.get('https://www.themealdb.com/api/json/v1/1/filter.php?c=Breakfast'), // Index 8
        
        // More Searches
        externalAxios.get('https://www.themealdb.com/api/json/v1/1/search.php?s=Beef'),
        externalAxios.get('https://www.themealdb.com/api/json/v1/1/search.php?s=Pork'),
        externalAxios.get('https://www.themealdb.com/api/json/v1/1/search.php?s=Lamb'),
        externalAxios.get('https://www.themealdb.com/api/json/v1/1/search.php?s=Salad'),
        externalAxios.get('https://www.themealdb.com/api/json/v1/1/filter.php?c=Side'),
        externalAxios.get('https://www.themealdb.com/api/json/v1/1/filter.php?c=Vegan')
      ];

      const results = await Promise.allSettled(promises);
      let allDishes: Dish[] = [];

      // 1. Process Local DB Results (Index 0)
      if (results[0].status === 'fulfilled') {
        const localData = results[0].value.data;
        if (Array.isArray(localData)) {
          allDishes = [...allDishes, ...localData];
        }
      } else {
        console.warn('Local database disconnected:', results[0].reason);
      }

      // 2. Process External API Results
      for (let i = 1; i < results.length; i++) {
        const result = results[i];
        if (result.status === 'fulfilled' && result.value.data.meals) {
          const meals = result.value.data.meals;
          
          const processedMeals = meals.map((meal: any) => {
            // Determine Category from API directly
            let category = meal.strCategory || 'Main Course';

            // Priority 1: Explicit Category by Source Index
            // Indices align with the promises array above
            if (i === 4) category = 'Indian';
            else if (i === 5) category = 'Vegetarian';
            else if (i === 6) category = 'Dessert';
            else if (i === 7) category = 'Appetizer';
            else if (i === 8) category = 'Breakfast';
            else if (i === 13) category = 'Appetizer';
            else if (i === 14) category = 'Vegan';

            // Priority 2: Dynamic Detection (for search results)
            else if (meal.strArea === 'Indian') {
                category = 'Indian';
            }
            // Map common API categories to our standardized ones
            else if (['Goat', 'Lamb', 'Pork', 'Beef', 'Chicken', 'Pasta'].includes(category)) {
               category = 'Main Course';
            } else if (['Starter', 'Side', 'Miscellaneous'].includes(category)) {
               category = 'Appetizer';
            } else if (category === 'Vegetarian') {
               category = 'Vegetarian';
            } else if (category === 'Vegan') {
               category = 'Vegan';
            } else if (category === 'Breakfast') {
               category = 'Breakfast';
            }

            // Generate Price (Consistent hash)
            const idNum = parseInt(meal.idMeal);
            const price = (12 + (idNum % 20) + 0.99) * 85;

            return {
              _id: `ext-${meal.idMeal}`,
              name: meal.strMeal,
              description: meal.strInstructions 
                ? `${meal.strInstructions.slice(0, 100)}...` 
                : 'A delicious internationally famous dish.',
              imageUrl: meal.strMealThumb,
              price: parseFloat(price.toFixed(0)),
              category: category
            };
          });

          allDishes = [...allDishes, ...processedMeals];
        }
      }

      // Remove duplicates
      allDishes = Array.from(new Map(allDishes.map(item => [item._id, item])).values());


      // 3. Graceful Fallback (Offline Mode)
      if (allDishes.length === 0) {
        console.warn('Both Local and External APIs failed. Switching to Demo Mode.');
        toast('Connection failed. Showing demo menu.', { icon: '⚠️' });
        
        allDishes = [
          {
            _id: 'demo-1',
            name: 'Classic Cheeseburger',
            description: 'Juicy beef patty with melted cheddar, fresh lettuce, tomato, and our secret sauce on a brioche bun.',
            imageUrl: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=800&q=80',
            price: 1299, 
            category: 'Main Course'
          },
          {
            _id: 'demo-2',
            name: 'Margherita Pizza',
            description: 'Traditional wood-fired pizza topped with San Marzano tomato sauce, fresh mozzarella cheese, and basil leaves.',
            imageUrl: 'https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?auto=format&fit=crop&w=800&q=80',
            price: 1399,
            category: 'Main Course'
          },
          {
            _id: 'demo-3',
            name: 'Caesar Salad',
            description: 'Crisp romaine lettuce tossed in creamy Caesar dressing with crispy croutons and shaved parmesan cheese.',
            imageUrl: 'https://images.unsplash.com/photo-1550304943-4f24f54ddde9?auto=format&fit=crop&w=800&q=80',
            price: 899,
            category: 'Appetizer'
          },
          {
            _id: 'demo-4',
            name: 'Chocolate Lava Cake',
            description: 'Rich chocolate cake with a molten chocolate center, served warm with a scoop of vanilla bean ice cream.',
            imageUrl: 'https://images.unsplash.com/photo-1624353365286-3f8d62daad51?auto=format&fit=crop&w=800&q=80',
            price: 8.99,
            category: 'Dessert'
          },
          {
            _id: 'demo-5',
            name: 'Grilled Salmon',
            description: 'Fresh Atlantic salmon fillet grilled to perfection, served with roasted asparagus and lemon butter sauce.',
            imageUrl: 'https://images.unsplash.com/photo-1467003909585-2f8a7270028d?auto=format&fit=crop&w=800&q=80',
            price: 22.99,
            category: 'Main Course'
          },
          {
            _id: 'demo-6',
            name: 'Berry Smoothie',
            description: 'Refreshing blend of mixed berries, yogurt, and honey. A perfect healthy choice for any time of day.',
            imageUrl: 'https://images.unsplash.com/photo-1505252585461-04db1eb84625?auto=format&fit=crop&w=800&q=80',
            price: 6.99,
            category: 'Beverage'
          },
          {
            _id: 'demo-7',
            name: 'Chicken Tikka Masala',
            description: 'Roasted marinated chicken chunks in spiced curry sauce. The curry is usually creamy and orange-coloured.',
            imageUrl: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?auto=format&fit=crop&w=800&q=80',
            price: 14.99,
            category: 'Indian'
          },
          {
            _id: 'demo-8',
            name: 'Blueberry Pancakes',
            description: 'Fluffy buttermilk pancakes filled with fresh blueberries, served with maple syrup and butter.',
            imageUrl: 'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?auto=format&fit=crop&w=800&q=80',
            price: 10.99,
            category: 'Breakfast'
          }
        ];
      }

      // Save to SessionStorage Cache
      try {
        sessionStorage.setItem('feastopedia_dishes_v2', JSON.stringify({
           data: allDishes,
           timestamp: Date.now()
        }));
      } catch (e) {
        console.warn('Failed to cache dishes', e);
      }

      setDishes(allDishes);
      
      // Merge default categories with any dynamic ones found in the data to ensure all options are available
      const defaultCategories = ['Appetizer', 'Main Course', 'Dessert', 'Seafood', 'Vegan', 'Vegetarian', 'Indian', 'Breakfast'];
      const dynamicCategories = Array.from(new Set(allDishes.map(dish => dish.category)));
      const uniqueCategories = Array.from(new Set([...defaultCategories, ...dynamicCategories])).sort();
      
      setCategories(uniqueCategories);
      
    } catch (error) {
      console.error('Unexpected error in fetchDishes:', error);
      toast.error('Something went wrong while loading dishes');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCategorySelect = (category: string | null) => {
    // Update local state
    setSelectedCategory(category);
    // Note: The parent component or URL should ideally drive this, 
    // but here we just update state for immediate feedback.
    // If using categories filter component only calls this:
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
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