import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, X, ChefHat, ShieldCheck } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';

const Navbar: React.FC = () => {
  const { isAuthenticated, isAdmin, logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const navLinks = [
    { path: '/', label: 'Home' },
    { path: '/dishes', label: 'Dishes' },
    { path: '/add-dish', label: 'Add Dish', requiresAuth: true },
    { path: '/contact', label: 'Contact Us' },
  ];

  const authLinks = [
    { path: '/login', label: 'Login', showWhenAuth: false },
    { path: '/register', label: 'Sign Up', showWhenAuth: false },
  ];

  return (
    <nav className="bg-white/80 backdrop-blur-md shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <ChefHat className="text-orange-500" size={28} />
            <span className="text-xl font-bold text-gray-800">FeastoPedia</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center">
            <div className="flex space-x-6">
              {navLinks.map((link) => {
                if (link.requiresAuth && !isAuthenticated) return null;
                
                return (
                  <Link
                    key={link.path}
                    to={link.path}
                    className="text-gray-700 hover:text-orange-500 transition duration-200 font-medium"
                  >
                    {link.label}
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Auth Buttons - Desktop */}
          <div className="hidden md:flex items-center space-x-4">
            {isAuthenticated ? (
              <div className="flex items-center space-x-3">
                {isAdmin && (
                  <Link 
                    to="/admin" 
                    title="Admin Dashboard"
                    className="flex items-center text-purple-600 hover:text-purple-700 font-medium bg-purple-50 p-2 rounded-full transition-colors"
                  >
                    <ShieldCheck size={20} />
                  </Link>
                )}
                <Link 
                  to="/profile" 
                  className="flex items-center space-x-1 text-gray-700 hover:text-orange-500 font-medium bg-orange-50 px-3 py-1.5 rounded-full transition-colors"
                >
                  <span>Profile</span>
                </Link>
                <button
                  onClick={handleLogout}
                  className="bg-orange-500 text-white px-4 py-2 rounded-md hover:bg-orange-600 transition duration-200"
                >
                  Logout
                </button>
              </div>
            ) : (
              <>
                {authLinks.map((link) => (
                  <Link
                    key={link.path}
                    to={link.path}
                    className={link.path === '/register' 
                      ? "bg-orange-500 text-white px-4 py-2 rounded-md hover:bg-orange-600 transition duration-200"
                      : "text-gray-700 hover:text-orange-500 transition duration-200 font-medium"
                    }
                  >
                    {link.label}
                  </Link>
                ))}
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={toggleMenu}
              className="text-gray-700 hover:text-orange-500 focus:outline-none"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden bg-white"
          >
            <div className="px-4 pt-2 pb-4 space-y-3">
              {navLinks.map((link) => {
                if (link.requiresAuth && !isAuthenticated) return null;
                
                return (
                  <Link
                    key={link.path}
                    to={link.path}
                    className="block text-gray-700 hover:text-orange-500 transition duration-200 py-2 font-medium"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {link.label}
                  </Link>
                );
              })}
              
              {/* Auth Links - Mobile */}
              {isAuthenticated ? (
                <>                  {isAdmin && (
                    <Link
                      to="/admin"
                      className="block px-3 py-2 text-purple-600 font-medium hover:bg-purple-50 rounded-md"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Admin Dashboard
                    </Link>
                  )}                  <Link
                    to="/profile"
                    className="block text-gray-700 hover:text-orange-500 transition duration-200 py-2 font-medium"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    My Profile
                  </Link>
                  <button
                    onClick={() => {
                      handleLogout();
                      setIsMenuOpen(false);
                    }}
                    className="w-full text-left block text-red-600 hover:text-red-700 transition duration-200 py-2 font-medium"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  {authLinks.map((link) => (
                    <Link
                      key={link.path}
                      to={link.path}
                      className="block text-gray-700 hover:text-orange-500 transition duration-200 py-2 font-medium"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      {link.label}
                    </Link>
                  ))}
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;