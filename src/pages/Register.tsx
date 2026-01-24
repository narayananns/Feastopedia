import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import axios from 'axios';
import { CheckCircle, AlertCircle, Loader2, Send } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { BASE_URL } from '../utils/constants';

const Register: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  
  // Verification States
  const [verificationStatus, setVerificationStatus] = useState<'idle' | 'sent' | 'verified'>('idle');
  const [otp, setOtp] = useState('');
  const [isSendingOtp, setIsSendingOtp] = useState(false);
  const [isVerifyingOtp, setIsVerifyingOtp] = useState(false);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    // If user changes email after verification, reset status
    if (name === 'email' && verificationStatus !== 'idle') {
      setVerificationStatus('idle');
      setOtp('');
    }
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSendOtp = async () => {
    if (!formData.email || !formData.email.includes('@')) {
      toast.error('Please enter a valid email address');
      return;
    }

    try {
      setIsSendingOtp(true);
      // Clean axios request
      const response = await axios.post(`${BASE_URL}/api/users/send-otp`, { email: formData.email });
      toast.success(response.data.message || 'OTP sent to your email');
      setVerificationStatus('sent');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to send OTP');
    } finally {
      setIsSendingOtp(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (!otp || otp.length < 6) {
      toast.error('Please enter a valid 6-digit OTP');
      return;
    }

    try {
      setIsVerifyingOtp(true);
      const response = await axios.post(`${BASE_URL}/api/users/verify-otp`, { 
        email: formData.email, 
        otp 
      });
      toast.success('Email verified successfully!');
      setVerificationStatus('verified');
      setOtp(''); // Clear OTP field
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Invalid or expired OTP');
    } finally {
      setIsVerifyingOtp(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (verificationStatus !== 'verified') {
      toast.error('Please verify your email address first');
      return;
    }

    // Validate password match
    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    
    // Validate password length
    if (formData.password.length < 6) {
      toast.error('Password must be at least 6 characters long');
      return;
    }
    
    try {
      setIsSubmitting(true);
      await register(formData.name, formData.email, formData.password);
      toast.success('Registration successful!');
      navigate('/dishes');
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Registration failed. Please try again.';
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-md mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white p-8 rounded-lg shadow-md"
      >
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Create Your Account</h1>
          <p className="text-gray-600">Join FeastoPedia to share and discover amazing dishes</p>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
              Full Name
            </label>
            <input
              id="name"
              name="name"
              type="text"
              autoComplete="name"
              required
              value={formData.name}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-orange-500 focus:border-orange-500"
              placeholder="John Doe"
            />
          </div>
          
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email Address
            </label>
            <div className="relative">
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                disabled={verificationStatus === 'verified'}
                value={formData.email}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-orange-500 focus:border-orange-500 ${
                  verificationStatus === 'verified' 
                    ? 'border-green-500 bg-green-50 pr-10 text-green-700' 
                    : 'border-gray-300 pr-24'
                }`}
                placeholder="your@email.com"
              />
              
              {verificationStatus === 'verified' && (
                <div className="absolute inset-y-0 right-0 max-h-min my-auto pr-3 flex items-center pointer-events-none">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                </div>
              )}

              {verificationStatus !== 'verified' && formData.email && (
                <div className="absolute inset-y-0 right-1 flex items-center">
                  <button
                    type="button"
                    onClick={handleSendOtp}
                    disabled={isSendingOtp || !formData.email.includes('@')}
                    className="text-xs bg-orange-100 hover:bg-orange-200 text-orange-700 font-medium px-3 py-1.5 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                  >
                    {isSendingOtp ? (
                      <Loader2 className="w-3 h-3 animate-spin mr-1" />
                    ) : (
                      verificationStatus === 'sent' ? 'Resend OTP' : 'Verify'
                    )}
                  </button>
                </div>
              )}
            </div>
          </div>

          <AnimatePresence>
            {verificationStatus === 'sent' && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="bg-orange-50 p-4 rounded-md border border-orange-100"
              >
                <label htmlFor="otp" className="block text-sm font-medium text-orange-800 mb-2">
                  Enter Verification Code
                </label>
                <div className="flex space-x-2">
                  <input
                    id="otp"
                    type="text"
                    maxLength={6}
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/[^0-9]/g, ''))}
                    className="flex-grow px-3 py-2 border border-orange-200 rounded-md focus:outline-none focus:ring-orange-500 focus:border-orange-500 tracking-widest text-center font-mono text-lg"
                    placeholder="000000"
                  />
                  <button
                    type="button"
                    onClick={handleVerifyOtp}
                    disabled={isVerifyingOtp || otp.length !== 6}
                    className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                  >
                    {isVerifyingOtp ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Confirm'}
                  </button>
                </div>
                <p className="text-xs text-orange-600 mt-2 flex items-center">
                   <Send className="w-3 h-3 mr-1" /> Code sent to {formData.email}
                </p>
              </motion.div>
            )}
          </AnimatePresence>
          
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="new-password"
              required
              value={formData.password}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-orange-500 focus:border-orange-500"
              placeholder="••••••••"
            />
            <p className="mt-1 text-xs text-gray-500">
              Must be at least 6 characters long
            </p>
          </div>
          
          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
              Confirm Password
            </label>
            <input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              autoComplete="new-password"
              required
              value={formData.confirmPassword}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-orange-500 focus:border-orange-500"
              placeholder="••••••••"
            />
          </div>
          
          <div>
            <button
              type="submit"
              disabled={isSubmitting || verificationStatus !== 'verified'}
              className="w-full bg-orange-500 text-white py-2 px-4 rounded-md hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
            >
              {isSubmitting ? (
                <span className="flex items-center justify-center">
                  <Loader2 className="w-4 h-4 animate-spin mr-2" /> Creating Account...
                </span>
              ) : (
                verificationStatus !== 'verified' ? 'Verify Email Before Signing Up' : 'Create Account'
              )}
            </button>
          </div>
        </form>
        
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            Already have an account?{' '}
            <Link to="/login" className="font-medium text-orange-500 hover:text-orange-600">
              Sign in here
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default Register;