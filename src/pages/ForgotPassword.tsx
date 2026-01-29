import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';
import { BASE_URL } from '../utils/constants';

const ForgotPassword: React.FC = () => {
    const [email, setEmail] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSent, setIsSent] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            await axios.post(`${BASE_URL}/api/users/forgot-password`, { email });
            toast.success('Reset code sent to your email!');
            setIsSent(true);
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Failed to send reset email');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="max-w-md mx-auto mt-10">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white p-8 rounded-lg shadow-md"
            >
                <div className="text-center mb-8">
                    <h1 className="text-2xl font-bold text-gray-800 mb-2">Reset Password</h1>
                    <p className="text-gray-600">Enter your email to receive a reset code</p>
                </div>

                {!isSent ? (
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                            <input
                                type="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-orange-500 focus:border-orange-500"
                                placeholder="your@email.com"
                            />
                        </div>
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full bg-orange-500 text-white py-2 px-4 rounded-md hover:bg-orange-600 disabled:opacity-50"
                        >
                            {isSubmitting ? 'Sending...' : 'Send Reset Code'}
                        </button>
                    </form>
                ) : (
                    <div className="text-center">
                        <div className="mb-4 text-green-500 text-5xl">✓</div>
                        <p className="mb-6 text-gray-700">Check your email for the reset code.</p>
                        <Link to="/login" className="text-orange-500 hover:text-orange-600 font-medium">
                            Back to Login
                        </Link>
                    </div>
                )}
                
                <div className="mt-6 text-center">
                   <Link to="/login" className="text-sm text-gray-500 hover:text-gray-700">
                     &larr; Back to Login
                   </Link>
                </div>
            </motion.div>
        </div>
    );
};

export default ForgotPassword;