import User from '../models/user.js';
import Dish from '../models/dish.js';

// Get Dashboard Stats
export const getDashboardStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalDishes = await Dish.countDocuments();
    const recentUsers = await User.find().sort({ createdAt: -1 }).limit(5);
    const recentDishes = await Dish.find().sort({ createdAt: -1 }).limit(5).populate('creator', 'name email');

    res.status(200).json({
      totalUsers,
      totalDishes,
      recentUsers,
      recentDishes
    });
  } catch (error) {
    console.error('Stats error:', error);
    res.status(500).json({ message: 'Failed to fetch stats' });
  }
};

// Get All Users
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 });
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch users' });
  }
};

// Delete User
export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    await User.findByIdAndDelete(id);
    // Also delete user's dishes? For now, keep them or delete them. 
    // Usually we delete them or reassign. Let's delete them to clean up.
    await Dish.deleteMany({ creator: id });
    
    res.status(200).json({ message: 'User and their dishes deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete user' });
  }
};

// Get All Dishes (Admin)
export const getAllDishesAdmin = async (req, res) => {
  try {
    const dishes = await Dish.find().populate('creator', 'name email').sort({ createdAt: -1 });
    res.status(200).json(dishes);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch dishes' });
  }
};

// Delete Dish (Admin)
export const deleteDishAdmin = async (req, res) => {
  try {
    const { id } = req.params;
    await Dish.findByIdAndDelete(id);
    res.status(200).json({ message: 'Dish deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete dish' });
  }
};
