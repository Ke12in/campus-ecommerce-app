// src/pages/AuthPage.jsx

import React, { useState } from 'react';
import CustomerSignup from '../components/CustomerSignup';
import UserLogin from '../components/UserLogin';

function AuthPage() {
  // State to track which view is active: 'login' or 'signup'
  const [isLoginView, setIsLoginView] = useState(true); 

  return (
    <div className="auth-container">
      <h2>Join or Login to the Campus Marketplace</h2>
      
      {/* Tab Switcher */}
      <div className="auth-tabs">
        <button 
          className={isLoginView ? 'active' : ''} 
          onClick={() => setIsLoginView(true)}
        >
          Sign In
        </button>
        <button 
          className={!isLoginView ? 'active' : ''} 
          onClick={() => setIsLoginView(false)}
        >
          Register
        </button>
      </div>

      {/* Conditional Rendering of the selected form */}
      <div className="auth-form-wrapper">
        {isLoginView ? <UserLogin /> : <CustomerSignup />}
      </div>
    </div>
  );
}

export default AuthPage;