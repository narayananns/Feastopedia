import express from 'express';
import { getDashboardStats, getAllUsers, deleteUser, getAllDishesAdmin, deleteDishAdmin } from '../controllers/admin.js';
import adminAuth from '../middleware/adminAuth.js';

const router = express.Router();

router.use(adminAuth); // Protect all admin routes

router.get('/stats', getDashboardStats);
router.get('/users', getAllUsers);
router.delete('/users/:id', deleteUser);
router.get('/dishes', getAllDishesAdmin);
router.delete('/dishes/:id', deleteDishAdmin);

export default router;