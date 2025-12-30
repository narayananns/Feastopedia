import express from 'express';
import { 
  getDishes, 
  getDishById, 
  createDish, 
  updateDish, 
  deleteDish 
} from '../controllers/dishes.js';
import auth from '../middleware/auth.js';

const router = express.Router();

// Public routes
router.get('/', getDishes);
router.get('/:id', getDishById);

// Protected routes
router.post('/', auth, createDish);
router.patch('/:id', auth, updateDish);
router.delete('/:id', auth, deleteDish);

export default router;