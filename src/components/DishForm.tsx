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
        toast.error('Please provide an image');
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

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit check (though backend handles more)
         toast.error('Image size should be less than 5MB');
         return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, imageUrl: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl mx-auto bg-white p-8 rounded-xl shadow-lg border border-gray-100">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">{buttonText}</h2>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Dish Image
          </label>
          <div className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg p-6 bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer" onClick={() => document.getElementById('image-upload')?.click()}>
             {formData.imageUrl ? (
                <div className="relative w-full h-64">
                   <img 
                     src={formData.imageUrl} 
                     alt="Preview" 
                     className="w-full h-full object-contain rounded-md"
                   />
                   <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-40 opacity-0 hover:opacity-100 transition-opacity rounded-md">
                      <span className="text-white font-medium">Click to change image</span>
                   </div>
                </div>
             ) : (
                <div className="text-center py-8">
                   <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true">
                      <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                   </svg>
                   <p className="mt-1 text-sm text-gray-600">Click to upload an image</p>
                   <p className="mt-1 text-xs text-gray-500">PNG, JPG up to 5MB</p>
                </div>
             )}
            <input
              type="file"
              id="image-upload"
              accept="image/*"
              onChange={handleImageChange}
              className="hidden"
            />
          </div>
        </div>

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
             className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500 py-2 px-3 sm:text-sm"
             placeholder="e.g. Spicy Chicken Curry"
             required
           />
        </div>
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
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500 py-2 px-3 sm:text-sm"
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
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500 py-2 px-3 sm:text-sm"
          placeholder="e.g. Tomato, Onion, Garlic"
          required
        />
      </div>
      
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div>
          <label htmlFor="price" className="block text-sm font-medium text-gray-700">
            Price (₹)
          </label>
          <input
            type="number"
            id="price"
            name="price"
            value={formData.price}
            onChange={handleChange}
            min="1"
            step="1"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500 py-2 px-3 sm:text-sm"
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
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500 py-2 px-3 sm:text-sm"
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