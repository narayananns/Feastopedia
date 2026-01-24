import express from 'express';
import { register, login, getCurrentUser, sendOtp, verifyOtp } from '../controllers/users.js';
import auth from '../middleware/auth.js';

const router = express.Router();

// Public routes
router.post('/register', register);
router.post('/login', login);
router.post('/send-otp', sendOtp);
router.post('/verify-otp', verifyOtp);

// Protected routes
router.get('/me', auth, getCurrentUser);

export default router;