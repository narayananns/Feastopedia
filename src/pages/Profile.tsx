import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Phone, Mail, Camera, Save, BadgeCheck, Loader2, Send, CheckCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';
import { BASE_URL } from '../utils/constants';

const Profile: React.FC = () => {
  const { user, updateUser } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    avatar: '',
  });
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  // Phone Verification
  const [phoneVerificationStatus, setPhoneVerificationStatus] = useState<'idle' | 'sent' | 'verified'>('idle');
  const [phoneOtp, setPhoneOtp] = useState('');
  const [isSendingPhoneOtp, setIsSendingPhoneOtp] = useState(false);
  const [isVerifyingPhoneOtp, setIsVerifyingPhoneOtp] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        phone: user.phone || '',
        avatar: user.avatar || '',
      });
      setPhoneVerificationStatus(user.isPhoneVerified ? 'verified' : 'idle');
    }
  }, [user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    // If phone number changes, reset verification status if it was verified
    // (Actually, usually if it was verified, we might not want to let them change it without re-verifying)
    // For now, if they change it, we reset to idle.
    if (e.target.name === 'phone' && user?.phone !== e.target.value && phoneVerificationStatus === 'verified') {
         setPhoneVerificationStatus('idle');
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        toast.error('Image size should be less than 5MB');
        return;
      }
      
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, avatar: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSendPhoneOtp = async () => {
    if (!formData.phone || formData.phone.length < 10) {
      toast.error('Please enter a valid phone number');
      return;
    }

    try {
      setIsSendingPhoneOtp(true);
      const response = await axios.post(`${BASE_URL}/api/users/send-phone-otp`, { phone: formData.phone });
      toast.success(response.data.message || 'OTP sent to your phone');
      setPhoneVerificationStatus('sent');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to send OTP');
    } finally {
      setIsSendingPhoneOtp(false);
    }
  };

  const handleVerifyPhoneOtp = async () => {
    if (!phoneOtp || phoneOtp.length < 6) {
      toast.error('Please enter a valid 6-digit OTP');
      return;
    }

    try {
      setIsVerifyingPhoneOtp(true);
      const response = await axios.post(`${BASE_URL}/api/users/verify-phone-otp`, { 
        phone: formData.phone, 
        otp: phoneOtp 
      });
      toast.success('Phone verified successfully!');
      setPhoneVerificationStatus('verified');
      setPhoneOtp(''); 
      // Optionally update user context immediately
      updateUser({ ...user!, isPhoneVerified: true, phone: formData.phone });
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Invalid or expired OTP');
    } finally {
      setIsVerifyingPhoneOtp(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      // Use standard axios with auth header (handled by stored token default header if set)
      // Wait, AuthContext sets it on load, but we should make sure.
      // Assuming axios defaults are set.
      
      const response = await axios.put(`${BASE_URL}/api/users/profile`, formData);
      updateUser(response.data);
      toast.success('Profile updated successfully!');
      setIsEditing(false);
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to update profile');
    } finally {
      setIsSaving(false);
    }
  };

  if (!user) return <div className="text-center mt-20">Please log in to view your profile.</div>;

  return (
    <div className="max-w-4xl mx-auto py-10 px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-2xl shadow-xl overflow-hidden"
      >
        {/* Header / Cover */}
        <div className="h-32 bg-gradient-to-r from-orange-400 to-red-500 relative"></div>

        {/* Profile Content */}
        <div className="px-8 pb-8">
          <div className="relative flex justify-between items-end -mt-12 mb-6">
            <div className="relative">
              <div className="w-24 h-24 rounded-full border-4 border-white bg-gray-200 overflow-hidden shadow-md">
                <img 
                  src={formData.avatar || `https://ui-avatars.com/api/?name=${user.name}&background=random`} 
                  alt="Profile" 
                  className="w-full h-full object-cover"
                />
              </div>
              {isEditing && (
                <>
                    <div 
                        onClick={() => fileInputRef.current?.click()}
                        className="absolute bottom-0 right-0 bg-white p-1.5 rounded-full shadow border border-gray-200 cursor-pointer text-gray-600 hover:text-orange-500 transition-colors"
                        title="Upload Profile Picture"
                    >
                        <Camera size={16} />
                    </div>
                    <input 
                        type="file" 
                        ref={fileInputRef} 
                        onChange={handleImageUpload} 
                        className="hidden" 
                        accept="image/*"
                    />
                </>
              )}
            </div>
            {!isEditing && (
              <button
                onClick={() => setIsEditing(true)}
                className="bg-orange-100 text-orange-600 px-4 py-2 rounded-lg font-medium hover:bg-orange-200 transition-colors"
              >
                Edit Profile
              </button>
            )}
          </div>

          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Left Column: Basic Info */}
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-800 flex items-center">
                    {user.name}
                  </h2>
                  <p className="text-gray-500">{user.email}</p>
                </div>

                <div className="space-y-4">
                   <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                    <div className="relative">
                        <User className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                        <input
                            type="text"
                            name="name"
                            disabled={!isEditing}
                            value={formData.name}
                            onChange={handleChange}
                            className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-orange-500 focus:border-orange-500 ${!isEditing ? 'bg-gray-50 border-gray-200' : 'border-gray-300'}`}
                        />
                    </div>
                   </div>

                   <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                    <div className="relative">
                        <Mail className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                        <input
                            type="email"
                            value={user.email}
                            disabled={true} // Email cannot be changed easily
                            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg bg-gray-50 text-gray-500 cursor-not-allowed"
                        />
                    </div>
                   </div>

                   <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                    <div className="relative">
                        <Phone className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                        <input
                            type="tel"
                            name="phone"
                            disabled={!isEditing}
                            value={formData.phone}
                            onChange={handleChange}
                            placeholder="+1 (555) 000-0000"
                            className={`w-full pl-10 pr-24 py-2 border rounded-lg focus:ring-orange-500 focus:border-orange-500 ${!isEditing ? 'bg-gray-50 border-gray-200' : 'border-gray-300'}`}
                        />
                        {isEditing && phoneVerificationStatus !== 'verified' && (
                            <div className="absolute inset-y-0 right-1 flex items-center">
                              <button
                                type="button"
                                onClick={handleSendPhoneOtp}
                                disabled={isSendingPhoneOtp || !formData.phone}
                                className="text-xs bg-orange-100 hover:bg-orange-200 text-orange-700 font-medium px-3 py-1.5 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                              >
                                {isSendingPhoneOtp ? (
                                  <Loader2 className="w-3 h-3 animate-spin mr-1" />
                                ) : (
                                  phoneVerificationStatus === 'sent' ? 'Resend' : 'Verify'
                                )}
                              </button>
                            </div>
                        )}
                        {phoneVerificationStatus === 'verified' && (
                            <div className="absolute inset-y-0 right-0 max-h-min my-auto pr-3 flex items-center pointer-events-none">
                              <CheckCircle className="h-5 w-5 text-green-500" />
                            </div>
                        )}
                    </div>
                    {/* OTP Input */}
                    <AnimatePresence>
                        {isEditing && phoneVerificationStatus === 'sent' && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="bg-orange-50 p-3 mt-2 rounded-md border border-orange-100"
                          >
                            <label className="block text-xs font-medium text-orange-800 mb-1">
                              Enter Code
                            </label>
                            <div className="flex space-x-2">
                              <input
                                type="text"
                                maxLength={6}
                                value={phoneOtp}
                                onChange={(e) => setPhoneOtp(e.target.value.replace(/[^0-9]/g, ''))}
                                className="flex-grow px-2 py-1 border border-orange-200 rounded text-sm focus:outline-none focus:ring-orange-500 font-mono"
                                placeholder="000000"
                              />
                              <button
                                type="button"
                                onClick={handleVerifyPhoneOtp}
                                disabled={isVerifyingPhoneOtp || phoneOtp.length !== 6}
                                className="bg-orange-500 hover:bg-orange-600 text-white px-3 py-1 rounded text-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                              >
                                {isVerifyingPhoneOtp ? <Loader2 className="w-3 h-3 animate-spin" /> : 'Confirm'}
                              </button>
                            </div>
                             <p className="text-xs text-orange-600 mt-1 flex items-center">
                               <Send className="w-3 h-3 mr-1" /> Code sent to {formData.phone}
                            </p>
                          </motion.div>
                        )}
                    </AnimatePresence>
                   </div>
                </div>
              </div>

              {/* Right Column: Avatar URL & Details */}
              <div className="space-y-6">
                 <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Profile Picture URL</label>
                    <div className="relative">
                      <Camera className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                      <input 
                        type="url" 
                        name="avatar"
                        disabled={!isEditing}
                        value={formData.avatar}
                        onChange={handleChange}
                        placeholder="https://example.com/my-photo.jpg"
                        className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-orange-500 focus:border-orange-500 ${!isEditing ? 'bg-gray-50 border-gray-200' : 'border-gray-300'}`}
                      />
                    </div>
                    {isEditing && <p className="text-xs text-gray-500 mt-1">Paste a direct link to an image.</p>}
                 </div>

                 <div className="bg-orange-50 rounded-xl p-6 border border-orange-100">
                    <h3 className="font-semibold text-orange-800 mb-2">Account Status</h3>
                    
                    {/* Email Status */}
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-gray-700 text-sm">Email:</span>
                        <div className="flex items-center">
                            {user.isVerified ? (
                                <>
                                    <BadgeCheck className="text-green-600 w-4 h-4 mr-1" />
                                    <span className="text-green-700 text-sm font-medium">Verified</span>
                                </>
                            ) : (
                                <span className="text-gray-500 text-sm">Unverified</span>
                            )}
                        </div>
                    </div>

                    {/* Phone Status */}
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-gray-700 text-sm">Phone:</span>
                        <div className="flex items-center">
                            {user.isPhoneVerified ? (
                                <>
                                    <BadgeCheck className="text-green-600 w-4 h-4 mr-1" />
                                    <span className="text-green-700 text-sm font-medium">Verified</span>
                                </>
                            ) : (
                                <span className="text-orange-600 text-sm font-medium">Unverified</span>
                            )}
                        </div>
                    </div>

                 </div>
              </div>
            </div>

            {isEditing && (
              <div className="flex justify-end gap-3 mt-8 pt-6 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => {
                    setIsEditing(false);
                    setFormData({
                        name: user.name || '',
                        phone: user.phone || '',
                        avatar: user.avatar || '',
                    });
                  }}
                  className="px-6 py-2 rounded-lg text-gray-600 hover:bg-gray-100 font-medium transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="bg-orange-500 text-white px-6 py-2 rounded-lg font-medium hover:bg-orange-600 transition-colors flex items-center shadow-lg shadow-orange-200"
                >
                  {isSaving ? 'Saving...' : <><Save className="w-4 h-4 mr-2" /> Save Changes</>}
                </button>
              </div>
            )}
          </form>
        </div>
      </motion.div>
    </div>
  );
};

export default Profile;