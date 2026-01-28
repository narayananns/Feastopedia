import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './contexts/AuthContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';

// Lazy load pages for performance
const Home = lazy(() => import('./pages/Home'));
const Dishes = lazy(() => import('./pages/Dishes'));
const DishDetail = lazy(() => import('./pages/DishDetail'));
const AddDish = lazy(() => import('./pages/AddDish'));
const EditDish = lazy(() => import('./pages/EditDish'));
const Contact = lazy(() => import('./pages/Contact'));
const Login = lazy(() => import('./pages/Login'));
const Register = lazy(() => import('./pages/Register'));

// Loading Fallback Component
const PageLoader = () => (
  <div className="flex items-center justify-center min-h-[60vh]">
    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
  </div>
);

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <div className="min-h-screen flex flex-col bg-gray-50">
          <Navbar />
          <div className="flex-grow container mx-auto px-4 py-8">
            <Suspense fallback={<PageLoader />}>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/dishes" element={<Dishes />} />
                <Route path="/dishes/:id" element={<DishDetail />} />
                <Route 
                  path="/add-dish" 
                  element={
                    <ProtectedRoute>
                      <AddDish />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/edit-dish/:id" 
                  element={
                    <ProtectedRoute>
                      <EditDish />
                    </ProtectedRoute>
                  } 
                />
                <Route path="/contact" element={<Contact />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
              </Routes>
            </Suspense>
          </div>
          <Footer />
          <Toaster position="top-center" />
        </div>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;