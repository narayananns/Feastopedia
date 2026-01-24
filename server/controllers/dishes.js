import mongoose from 'mongoose';
import Dish from '../models/dish.js';
export const getDishes = async (req, res) => {
  const { category } = req.query;
  
  try {
    const query = category ? { category } : {};
    const dishes = await Dish.find(query).sort({ createdAt: -1 });
    
    res.status(200).json(dishes);
  } catch (error) {
    console.error('Get dishes error:', error);
    res.status(500).json({ message: 'Failed to fetch dishes' });
  }
};

// Get dish by id
export const getDishById = async (req, res) => {
  const { id } = req.params;
  
  try {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(404).json({ message: 'Invalid dish ID' });
    }
    
    const dish = await Dish.findById(id);
    
    if (!dish) {
      return res.status(404).json({ message: 'Dish not found' });
    }
    
    res.status(200).json(dish);
  } catch (error) {
    console.error('Get dish error:', error);
    res.status(500).json({ message: 'Failed to fetch dish' });
  }
};

// Create new dish
export const createDish = async (req, res) => {
  const dish = req.body;
  
  try {
    const newDish = new Dish({
      ...dish,
      createdBy: req.userId,
      createdAt: new Date()
    });
    
    await newDish.save();
    
    res.status(201).json(newDish);
  } catch (error) {
    console.error('Create dish error:', error);
    res.status(500).json({ message: 'Failed to create dish' });
  }
};

// Update dish
export const updateDish = async (req, res) => {
  const { id } = req.params;
  const dish = req.body;
  
  try {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(404).json({ message: 'Invalid dish ID' });
    }
    
    const existingDish = await Dish.findById(id);
    
    if (!existingDish) {
      return res.status(404).json({ message: 'Dish not found' });
    }
    
    // Check if user is the creator of the dish
    if (existingDish.createdBy.toString() !== req.userId) {
      return res.status(403).json({ message: 'Not authorized to update this dish' });
    }
    
    const updatedDish = await Dish.findByIdAndUpdate(
      id,
      { ...dish, _id: id },
      { new: true }
    );
    
    res.status(200).json(updatedDish);
  } catch (error) {
    console.error('Update dish error:', error);
    res.status(500).json({ message: 'Failed to update dish' });
  }
};

// Delete dish
export const deleteDish = async (req, res) => {
  const { id } = req.params;
  
  try {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(404).json({ message: 'Invalid dish ID' });
    }
    
    const dish = await Dish.findById(id);
    
    if (!dish) {
      return res.status(404).json({ message: 'Dish not found' });
    }
    
    // Check if user is the creator of the dish
    if (dish.createdBy.toString() !== req.userId) {
      return res.status(403).json({ message: 'Not authorized to delete this dish' });
    }
    
    await Dish.findByIdAndDelete(id);
    
    res.status(200).json({ message: 'Dish deleted successfully' });
  } catch (error) {
    console.error('Delete dish error:', error);
    res.status(500).json({ message: 'Failed to delete dish' });
  }
};