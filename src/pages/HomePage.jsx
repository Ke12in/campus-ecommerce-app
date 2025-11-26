// src/pages/HomePage.jsx (Updated to include CartSummary)

import React from 'react';
import { useAuth } from '../AuthContext';
import { auth } from '../firebase';
import { signOut } from 'firebase/auth';
import ProductList from '../components/ProductList';
import CartSummary from '../components/CartSummary'; // <-- NEW IMPORT

function HomePage() {
  const { currentUser } = useAuth();
  
  const handleLogout = () => {
    signOut(auth);
  };

  return (
    <div style={{ padding: '20px' }}>
      
      {currentUser && <CartSummary />} {/* <-- Display Cart Summary if logged in */}
      
      <div className="card" style={{ maxWidth: '800px', margin: 'auto', marginBottom: '30px' }}>
        <h2>Welcome to the Campus Marketplace!</h2>
        {currentUser ? (
          <>
            <p>You are logged in as: <strong>{currentUser.email}</strong></p>
            <button onClick={handleLogout}>Log Out</button>
          </>
        ) : (
          <p>Please log in to start shopping.</p>
        )}
      </div>

      {/* Product List Display */}
      {currentUser && <ProductList />}
      
      {/* Add pulse CSS animation for the cart badge */}
      <style>{`
        @keyframes pulse {
          0% { transform: scale(1); }
          50% { transform: scale(1.1); }
          100% { transform: scale(1); }
        }
      `}</style>
      
    </div>
  );
}
export default HomePage;