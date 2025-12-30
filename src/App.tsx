import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './contexts/AuthContext';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Dishes from './pages/Dishes';
import DishDetail from './pages/DishDetail';
import AddDish from './pages/AddDish';
import EditDish from './pages/EditDish';
import Contact from './pages/Contact';
import Login from './pages/Login';
import Register from './pages/Register';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <div className="min-h-screen bg-gray-50">
          <Navbar />
          <div className="container mx-auto px-4 py-8">
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
          </div>
          <Toaster position="top-center" />
        </div>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;