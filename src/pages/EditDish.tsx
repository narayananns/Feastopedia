import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import { AlertCircle } from 'lucide-react';
import DishForm from '../components/DishForm';
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

const EditDish: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [dish, setDish] = useState<Dish | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (id) {
      fetchDish(id);
    }
  }, [id]);

  const fetchDish = async (dishId: string) => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await axios.get(`${BASE_URL}/api/dishes/${dishId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      setDish(response.data);
    } catch (error) {
      console.error('Error fetching dish:', error);
      setError('Failed to load dish details');
      toast.error('Failed to load dish details');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (formData: any) => {
    if (!id) return Promise.reject('No dish ID provided');
    
    try {
      await axios.patch(`${BASE_URL}/api/dishes/${id}`, formData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      toast.success('Dish updated successfully!');
      return Promise.resolve();
    } catch (error) {
      console.error('Update dish error:', error);
      toast.error('Failed to update dish');
      return Promise.reject(error);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  if (error || !dish) {
    return (
      <div className="text-center py-12">
        <AlertCircle className="h-12 w-12 text-orange-500 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Error</h2>
        <p className="text-gray-600 mb-6">{error || 'Dish not found'}</p>
        <button
          onClick={() => navigate('/dishes')}
          className="inline-block bg-orange-500 hover:bg-orange-600 text-white font-medium py-2 px-6 rounded-md transition duration-300"
        >
          Back to Dishes
        </button>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Edit Dish</h1>
        <p className="text-gray-600">
          Update the details of your dish
        </p>
      </div>
      
      <DishForm
        initialValues={{
          name: dish.name,
          description: dish.description,
          ingredients: dish.ingredients,
          imageUrl: dish.imageUrl,
          price: dish.price,
          category: dish.category
        }}
        onSubmit={handleSubmit}
        buttonText="Update Dish"
      />
    </div>
  );
};

export default EditDish;