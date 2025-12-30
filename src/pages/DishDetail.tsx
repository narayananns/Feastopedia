import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';
import { ChevronLeft, Edit, Trash, AlertCircle } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { BASE_URL } from '../utils/constants';

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
      const response = await axios.get(`${BASE_URL}/api/dishes/${dishId}`);
      setDish(response.data);
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
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
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
              <div className="text-2xl font-bold text-orange-500">${dish.price.toFixed(2)}</div>
            </div>
            
            <div className="mb-6">
              <h2 className="text-lg font-semibold text-gray-700 mb-2">Description</h2>
              <p className="text-gray-600">{dish.description}</p>
            </div>
            
            <div className="mb-6">
              <h2 className="text-lg font-semibold text-gray-700 mb-2">Ingredients</h2>
              <ul className="list-disc pl-5 text-gray-600">
                {dish.ingredients.map((ingredient, index) => (
                  <li key={index}>{ingredient}</li>
                ))}
              </ul>
            </div>
            
            {isOwner && (
              <div className="flex space-x-4 mt-6">
                <Link
                  to={`/edit-dish/${dish._id}`}
                  className="inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-orange-500 hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
                >
                  <Edit className="h-4 w-4 mr-2" />
                  Edit Dish
                </Link>
                
                <button
                  onClick={() => setShowDeleteConfirm(true)}
                  className="inline-flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
                >
                  <Trash className="h-4 w-4 mr-2 text-red-500" />
                  Delete Dish
                </button>
              </div>
            )}
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