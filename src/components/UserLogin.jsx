// src/components/UserLogin.jsx

import React, { useState } from 'react';
import { signInWithEmailAndPassword } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore"; // <-- ADDED FIREBASE IMPORTS
import { auth, db } from '../firebase'; // <-- 'db' IMPORTED
import { useNavigate } from 'react-router-dom';

function UserLogin() {
  const navigate = useNavigate(); // <-- 1. INITIALIZE THE HOOK HERE

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [message, setMessage] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(null);
    setMessage('');

    try {
      // 1. Authenticate the user
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // 2. Fetch the user's role from Firestore
      const userDocRef = doc(db, "users", user.uid);
      const docSnap = await getDoc(userDocRef);
      
      let userRole = 'customer'; // Default role
      if (docSnap.exists() && docSnap.data().role) {
        userRole = docSnap.data().role;
      }
      
      console.log("Login successful! Role:", userRole);
      setMessage(`Welcome back, ${user.email}! Redirecting to ${userRole} dashboard...`);

      // 3. REDIRECT BASED ON ROLE
      if (userRole === 'admin') {
        navigate('/admin'); 
      } else {
        navigate('/home'); 
      }

    } catch (err) {
      console.error("Login error:", err.message);
      
      // Clean up the error message for the user
      const readableError = err.message.replace('Firebase: Error (auth/', '').replace(').', '').replace('-', ' ');
      setError(readableError);
    }
  };

  return (
    <div className="card">
      <h2>Customer/Admin Login</h2>
      <form onSubmit={handleLogin}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">
          Sign In
        </button>
      </form>
      {message && <p style={{ color: 'green' }}>{message}</p>}
      {error && <p style={{ color: 'red' }}>Error: {error}</p>}
    </div>
  );
}

export default UserLogin;