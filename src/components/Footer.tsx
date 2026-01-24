import React from 'react';
import { ChefHat, Facebook, Twitter, Instagram, Mail, Phone, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-900 text-white pt-12 pb-8 mt-auto">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <ChefHat className="text-orange-500" size={28} />
              <span className="text-xl font-bold">FeastoPedia</span>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed">
              Discover the best recipes and dishes from around the world. Your daily dose of culinary inspiration starts here.
            </p>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4 text-orange-500">Quick Links</h3>
            <ul className="space-y-2 text-gray-400 text-sm">
              <li><Link to="/" className="hover:text-white transition-colors duration-200 block py-1">Home</Link></li>
              <li><Link to="/dishes" className="hover:text-white transition-colors duration-200 block py-1">Explore Dishes</Link></li>
              <li><Link to="/add-dish" className="hover:text-white transition-colors duration-200 block py-1">Share Recipe</Link></li>
              <li><Link to="/contact" className="hover:text-white transition-colors duration-200 block py-1">Contact Us</Link></li>
            </ul>
          </div>

          <div>
             <h3 className="text-lg font-semibold mb-4 text-orange-500">Contact Info</h3>
             <ul className="space-y-3 text-gray-400 text-sm">
               <li className="flex items-start"><MapPin size={18} className="mr-2 mt-0.5 flex-shrink-0" /> 123 Foodie Lane, Flavor Town, FT 56000</li>
               <li className="flex items-center"><Phone size={18} className="mr-2 flex-shrink-0" /> +91 98765 43210</li>
               <li className="flex items-center"><Mail size={18} className="mr-2 flex-shrink-0" /> support@feastopedia.com</li>
             </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4 text-orange-500">Follow Us</h3>
            <p className="text-gray-400 text-sm mb-4">Join our community social media</p>
            <div className="flex space-x-3">
              <a href="#" className="bg-gray-800 p-2.5 rounded-full hover:bg-orange-600 hover:text-white text-gray-400 transition-all duration-300 transform hover:-translate-y-1"><Facebook size={20} /></a>
              <a href="#" className="bg-gray-800 p-2.5 rounded-full hover:bg-orange-600 hover:text-white text-gray-400 transition-all duration-300 transform hover:-translate-y-1"><Twitter size={20} /></a>
              <a href="#" className="bg-gray-800 p-2.5 rounded-full hover:bg-orange-600 hover:text-white text-gray-400 transition-all duration-300 transform hover:-translate-y-1"><Instagram size={20} /></a>
            </div>
          </div>
        </div>
        
        <div className="border-t border-gray-800 mt-10 pt-6 text-center text-gray-500 text-sm">
          <p>&copy; {new Date().getFullYear()} FeastoPedia. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;