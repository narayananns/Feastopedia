import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Dish from '../models/dish.js';
import User from '../models/user.js';

dotenv.config();

const initDb = async () => {
  try {
    const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/food-platform';
    console.log(`Connecting to: ${uri}`);
    
    await mongoose.connect(uri);
    console.log('✅ Connected to MongoDB');

    // 1. Create a dummy user if none exists (Dish requires createdBy)
    let user = await User.findOne();
    if (!user) {
      console.log('Creating a dummy user for data ownership...');
      user = await User.create({
        name: 'Admin',
        email: 'admin@example.com',
        password: 'password123',
        role: 'admin'
      });
      console.log('✅ Dummy user created');
    }

    // 2. Create a dummy dish to force DB creation
    const count = await Dish.countDocuments();
    if (count === 0) {
      console.log('Creating a sample dish to initialize the database...');
      await Dish.create({
        name: 'Welcome Dish',
        description: 'This is a sample dish to initialize your database.',
        price: 100,
        category: 'Main Course',
        imageUrl: 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg',
        ingredients: ['Love', 'Code'],
        createdBy: user._id
      });
      console.log('✅ Sample data created!');
    } else {
      console.log('ℹ️ Database already has data.');
    }

    console.log('🎉 Database "food-platform" should now be visible in Compass!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
};

initDb();
