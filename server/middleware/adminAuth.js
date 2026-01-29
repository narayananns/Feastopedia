import jwt from 'jsonwebtoken';
import User from '../models/user.js';

const adminAuth = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({ message: 'Authentication required' });
    }

    const decodedData = jwt.verify(token, process.env.JWT_SECRET || 'test_secret');
    
    // Check if user exists and is admin
    const user = await User.findById(decodedData?.id);
    
    if (!user) {
        return res.status(404).json({ message: 'User not found' });
    }

    if (user.role !== 'admin') {
        return res.status(403).json({ message: 'Access denied. Admin privileges required.' });
    }

    req.userId = decodedData?.id;
    next();
  } catch (error) {
    console.error('Admin middleware error:', error);
    res.status(401).json({ message: 'Invalid or expired token' });
  }
};

export default adminAuth;