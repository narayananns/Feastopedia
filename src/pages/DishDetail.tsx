import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';
import { ChevronLeft, Edit, Trash, AlertCircle } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { BASE_URL } from '../utils/constants';
import Skeleton from '../components/Skeleton';

interface Dish {
  _id: string;
  name: string;
  description: string;
  ingredients: string[];
  imageUrl: string;
  price: number;
  category: string;
  createdBy: string;
}

const DishDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [dish, setDish] = useState<Dish | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (id) {
      fetchDish(id);
    }
  }, [id]);

  const fetchDish = async (dishId: string) => {
    try {
      setIsLoading(true);

      // Check if it's an external dish (ID starts with 'ext-')
      if (dishId.startsWith('ext-')) {
        const realId = dishId.split('-')[1];
        // Use clean axios instance
        const externalAxios = axios.create();
        delete externalAxios.defaults.headers.common['Authorization'];
        
        const response = await externalAxios.get(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${realId}`);
        
        if (response.data.meals && response.data.meals[0]) {
           const meal = response.data.meals[0];
           
           // Build ingredients array from the strIngredient1...20 fields
           const ingredients: string[] = [];
           for (let i = 1; i <= 20; i++) {
             const ingredient = meal[`strIngredient${i}`];
             const measure = meal[`strMeasure${i}`];
             if (ingredient && ingredient.trim()) {
               ingredients.push(`${measure ? measure : ''} ${ingredient}`.trim());
             }
           }

           setDish({
             _id: dishId,
             name: meal.strMeal,
             description: meal.strInstructions,
             ingredients: ingredients,
             imageUrl: meal.strMealThumb,
             price: (10 + (parseInt(realId)%25) + 0.99) * 85, // Consistent price generation in Rupees
             category: meal.strCategory,
             createdBy: 'external' // Marker to hide edit/delete buttons
           });
        } else {
           throw new Error('Meal not found in external API');
        }

      } else {
        // Fetch from local backend
        const response = await axios.get(`${BASE_URL}/api/dishes/${dishId}`);
        setDish(response.data);
      }

    } catch (error) {
      console.error('Error fetching dish:', error);
      toast.error('Failed to load dish details');
      navigate('/dishes');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!id || !isAuthenticated) return;
    
    try {
      setIsDeleting(true);
      await axios.delete(`${BASE_URL}/api/dishes/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      toast.success('Dish deleted successfully');
      navigate('/dishes');
    } catch (error) {
      console.error('Error deleting dish:', error);
      toast.error('Failed to delete dish');
    } finally {
      setIsDeleting(false);
      setShowDeleteConfirm(false);
    }
  };

  const isOwner = user && dish && user.id === dish.createdBy;

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <Skeleton width={120} height={24} />
        </div>
        
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="md:flex">
            {/* Image Skeleton */}
            <div className="md:w-1/2">
              <Skeleton className="w-full h-64 md:h-full" /> 
            </div>

            {/* Content Skeleton */}
            <div className="p-6 md:w-1/2">
              <div className="flex justify-between items-start mb-4">
                  <div>
                    <Skeleton width={200} height={32} className="mb-2" />
                    <Skeleton width={100} height={24} className="rounded-full" />
                  </div>
                  <Skeleton width={80} height={36} />
              </div>

              <div className="mb-6">
                  <Skeleton width={120} height={24} className="mb-2" />
                  <Skeleton height={100} />
              </div>

              <div className="mb-6">
                  <Skeleton width={120} height={24} className="mb-2" />
                  <div className="flex gap-2">
                    <Skeleton width={80} height={32} className="rounded-full" />
                    <Skeleton width={80} height={32} className="rounded-full" />
                    <Skeleton width={80} height={32} className="rounded-full" />
                  </div>
              </div>

              <div className="flex space-x-4 mt-8 pt-6 border-t border-gray-100">
                  <Skeleton className="flex-1 h-12 rounded-lg" />
                  <Skeleton width={48} height={48} className="rounded-lg" />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!dish) {
    return (
      <div className="text-center py-12">
        <AlertCircle className="h-12 w-12 text-orange-500 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Dish Not Found</h2>
        <p className="text-gray-600 mb-6">The dish you're looking for doesn't exist or has been removed.</p>
        <Link 
          to="/dishes" 
          className="inline-flex items-center text-orange-500 hover:text-orange-600 font-medium"
        >
          <ChevronLeft className="h-4 w-4 mr-1" />
          Back to Dishes
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <Link 
          to="/dishes" 
          className="inline-flex items-center text-orange-500 hover:text-orange-600 font-medium"
        >
          <ChevronLeft className="h-4 w-4 mr-1" />
          Back to Dishes
        </Link>
      </div>
      
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="md:flex">
          <motion.div 
            className="md:w-1/2"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <img
              src={dish.imageUrl}
              alt={dish.name}
              className="w-full h-64 md:h-full object-cover"
            />
          </motion.div>
          
          <motion.div 
            className="p-6 md:w-1/2"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div className="flex justify-between items-start">
              <div>
                <h1 className="text-2xl font-bold text-gray-800 mb-2">{dish.name}</h1>
                <span className="inline-block bg-green-100 text-green-800 text-sm px-3 py-1 rounded-full mb-4">
                  {dish.category}
                </span>
              </div>
              <div className="text-3xl font-bold text-orange-600">₹{dish.price.toFixed(0)}</div>
            </div>
            
            <div className="mb-6">
              <h2 className="text-lg font-semibold text-gray-700 mb-2">Description</h2>
              <p className="text-gray-600">{dish.description}</p>
            </div>
            
            <div className="mb-6">
              <h2 className="text-lg font-semibold text-gray-700 mb-2">Ingredients</h2>
              <div className="flex flex-wrap gap-2">
                {dish.ingredients.map((ingredient, index) => (
                  <span key={index} className="bg-orange-50 text-orange-800 text-sm px-3 py-1 rounded-full border border-orange-100">
                    {ingredient}
                  </span>
                ))}
              </div>
            </div>
            
            <div className="flex space-x-4 mt-8 pt-6 border-t border-gray-100">
              {isOwner ? (
                <>
                <Link
                  to={`/edit-dish/${dish._id}`}
                  className="flex-1 inline-flex items-center justify-center px-4 py-3 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                >
                  <Edit className="h-4 w-4 mr-2" />
                  Edit Dish
                </Link>
                
                <button
                  onClick={() => setShowDeleteConfirm(true)}
                  className="flex-1 inline-flex items-center justify-center px-4 py-3 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors"
                >
                  <Trash className="h-4 w-4 mr-2" />
                  Delete Dish
                </button>
                </>
              ) : (
                 <>
                  <button className="flex-1 bg-orange-500 text-white px-6 py-3 rounded-lg font-medium hover:bg-orange-600 transition shadow-sm hover:shadow-md active:scale-95 transform duration-200">
                    Add to Cart
                  </button>
                  <button className="p-3 border border-gray-200 rounded-lg hover:bg-gray-50 text-gray-400 hover:text-red-500 transition-colors">
                     <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                     </svg>
                  </button>
                 </>
              )}
            </div>
          </motion.div>
        </div>
      </div>
      
      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <motion.div 
            className="bg-white rounded-lg p-6 max-w-md w-full mx-4"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <h3 className="text-xl font-bold text-gray-800 mb-2">Delete Dish</h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete this dish? This action cannot be undone.
            </p>
            <div className="flex space-x-4">
              <button
                onClick={handleDelete}
                disabled={isDeleting}
                className="flex-1 bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded-md transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isDeleting ? 'Deleting...' : 'Delete'}
              </button>
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 py-2 px-4 rounded-md transition duration-200"
              >
                Cancel
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default DishDetail;