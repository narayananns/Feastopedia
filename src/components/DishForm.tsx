import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

interface DishFormProps {
  initialValues?: {
    name: string;
    description: string;
    ingredients: string[];
    imageUrl: string;
    price: number;
    category: string;
  };
  onSubmit: (formData: any) => Promise<void>;
  buttonText: string;
}

const categories = [
  'Appetizer',
  'Main Course',
  'Dessert',
  'Beverage',
  'Vegan',
  'Vegetarian'
];

const DishForm: React.FC<DishFormProps> = ({ initialValues, onSubmit, buttonText }) => {
  const [formData, setFormData] = useState({
    name: initialValues?.name || '',
    description: initialValues?.description || '',
    ingredients: initialValues?.ingredients.join(', ') || '',
    imageUrl: initialValues?.imageUrl || '',
    price: initialValues?.price || 0,
    category: initialValues?.category || categories[0]
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    try {
      setIsSubmitting(true);
      
      // Process ingredients string to array
      const ingredients = formData.ingredients
        .split(',')
        .map(item => item.trim())
        .filter(item => item);
      
      // Validate price
      const price = parseFloat(formData.price.toString());
      if (isNaN(price) || price <= 0) {
        toast.error('Please enter a valid price');
        return;
      }
      
      // Validate image URL
      if (!formData.imageUrl) {
        toast.error('Please provide an image URL');
        return;
      }
      
      // Call the onSubmit handler with processed data
      await onSubmit({
        ...formData,
        ingredients,
        price
      });
      
      toast.success('Dish saved successfully!');
      navigate('/dishes');
    } catch (error) {
      console.error('Form submission error:', error);
      toast.error('Failed to save dish');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl mx-auto">
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700">
          Dish Name
        </label>
        <input
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500 sm:text-sm"
          required
        />
      </div>
      
      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700">
          Description
        </label>
        <textarea
          id="description"
          name="description"
          rows={3}
          value={formData.description}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500 sm:text-sm"
          required
        />
      </div>
      
      <div>
        <label htmlFor="ingredients" className="block text-sm font-medium text-gray-700">
          Ingredients (comma-separated)
        </label>
        <input
          type="text"
          id="ingredients"
          name="ingredients"
          value={formData.ingredients}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500 sm:text-sm"
          placeholder="e.g. Tomato, Onion, Garlic"
          required
        />
      </div>
      
      <div>
        <label htmlFor="imageUrl" className="block text-sm font-medium text-gray-700">
          Image URL
        </label>
        <input
          type="url"
          id="imageUrl"
          name="imageUrl"
          value={formData.imageUrl}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500 sm:text-sm"
          required
        />
      </div>
      
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div>
          <label htmlFor="price" className="block text-sm font-medium text-gray-700">
            Price ($)
          </label>
          <input
            type="number"
            id="price"
            name="price"
            value={formData.price}
            onChange={handleChange}
            min="0.01"
            step="0.01"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500 sm:text-sm"
            required
          />
        </div>
        
        <div>
          <label htmlFor="category" className="block text-sm font-medium text-gray-700">
            Category
          </label>
          <select
            id="category"
            name="category"
            value={formData.category}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500 sm:text-sm"
            required
          >
            {categories.map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
        </div>
      </div>
      
      <div className="flex space-x-4">
        <button
          type="submit"
          disabled={isSubmitting}
          className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-orange-500 hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? 'Saving...' : buttonText}
        </button>
        
        <button
          type="button"
          onClick={() => navigate('/dishes')}
          className="inline-flex justify-center py-2 px-4 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
        >
          Cancel
        </button>
      </div>
    </form>
  );
};

export default DishForm;