// src/App.jsx

import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import AuthPage from './pages/AuthPage';
import HomePage from './pages/HomePage';
import AdminDashboard from './pages/AdminDashboard';
import './App.css'; 
import VendorPage from './pages/VendorPage'; // <-- NEW IMPORT

import { AuthProvider, useAuth } from './AuthContext'; // Note: useAuth is imported here for ProtectedRoute
import { CartProvider } from './CartContext'; // <-- NEW IMPORT

// Component to handle navigation protection based on role
const ProtectedRoute = ({ element, requiredRole }) => {
    const { currentUser, userRole, loading } = useAuth();
    
    if (loading) return <div>Loading User Data...</div>; // Show loading state

    // If user is logged in AND their role matches the requirement, render the element
    if (currentUser && (!requiredRole || userRole === requiredRole)) {
        return element;
    }
    
    // If not logged in, redirect to the login page
    return <Navigate to="/" replace />;
};


<Route path="/vendor/:vendorId" element={<ProtectedRoute element={<VendorPage />} />} />
function AppContent() {
    return (
        <Router>
            <div className="App">
                <h1>Campus E-Commerce Marketplace</h1>
                <Routes>
                    {/* Route for Login/Signup Page */}
                    <Route path="/" element={<AuthPage />} />

                    {/* Customer Routes (default role check is customer) */}
                    <Route 
                        path="/home" 
                        element={<ProtectedRoute element={<HomePage />} />} 
                    />
                    
                    {/* Admin/Vendor Routes (requires explicit 'admin' role) */}
                    <Route 
                        path="/admin" 
                        element={<ProtectedRoute element={<AdminDashboard />} requiredRole="admin" />} 
                    />
                    
                    {/* Fallback for invalid URLs */}
                    <Route path="*" element={<h1>404: Not Found</h1>} />
                </Routes>
            </div>
        </Router>
    );
}

// Wrap the main app content with the AuthProvider and CartProvider
function App() {
    return (
        <AuthProvider>
            <CartProvider> {/* <-- CART PROVIDER ADDED HERE */}
                <AppContent />
            </CartProvider>
        </AuthProvider>
    );
}

export default App;