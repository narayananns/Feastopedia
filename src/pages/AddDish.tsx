import React from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import DishForm from '../components/DishForm';
import { BASE_URL } from '../utils/constants';

const AddDish: React.FC = () => {
  const handleSubmit = async (formData: any) => {
    try {
      await axios.post(`${BASE_URL}/api/dishes`, formData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      toast.success('Dish added successfully!');
      return Promise.resolve();
    } catch (error) {
      console.error('Add dish error:', error);
      toast.error('Failed to add dish');
      return Promise.reject(error);
    }
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Add New Dish</h1>
        <p className="text-gray-600">
          Share your culinary creation with the community
        </p>
      </div>
      
      <DishForm onSubmit={handleSubmit} buttonText="Add Dish" />
    </div>
  );
};

export default AddDish;