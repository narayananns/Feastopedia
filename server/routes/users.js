import express from 'express';
import { register, login, getCurrentUser, sendOtp, verifyOtp, forgotPassword, updateProfile, sendPhoneOtp, verifyPhoneOtp } from '../controllers/users.js';
import auth from '../middleware/auth.js';

const router = express.Router();

// Public routes
router.post('/register', register);
router.post('/login', login);
router.post('/send-otp', sendOtp);
router.post('/verify-otp', verifyOtp);
router.post('/forgot-password', forgotPassword);

// Protected routes
router.get('/me', auth, getCurrentUser);
router.put('/profile', auth, updateProfile);
router.post('/send-phone-otp', auth, sendPhoneOtp);
router.post('/verify-phone-otp', auth, verifyPhoneOtp);

export default router;