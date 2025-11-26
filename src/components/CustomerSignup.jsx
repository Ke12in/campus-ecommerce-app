// src/components/CustomerSignup.jsx

import React, { useState } from 'react';
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore"; // <-- ADDED FIREBASE IMPORTS
import { auth, db } from '../firebase'; // <-- 'db' IMPORTED
import { useNavigate } from 'react-router-dom';

function CustomerSignup() {
  const navigate = useNavigate(); // <-- 1. INITIALIZE THE HOOK HERE

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [message, setMessage] = useState('');

  const handleSignup = async (e) => {
    e.preventDefault(); 
    setError(null);
    setMessage('');

    try {
      // 1. Create user in Firebase Authentication
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // 2. Create corresponding document in Firestore 'users' collection
      await setDoc(doc(db, "users", user.uid), {
        email: user.email,
        role: "customer", // <-- Define the user's role
        createdAt: new Date()
      });

      console.log("Sign-up and Firestore document creation successful!", user.uid);
      setMessage("Account created successfully! Redirecting...");
      
      // 2. REDIRECT THE USER AFTER SUCCESS
      navigate('/home'); 

    } catch (err) {
      console.error("Sign-up error:", err.message);
      // Clean up the error message for the user
      const readableError = err.message.replace('Firebase: Error (auth/', '').replace(').', '').replace('-', ' ');
      setError(readableError);
    }
  };

  return (
    <div className="card">
      <h2>Customer Sign Up</h2>
      <form onSubmit={handleSignup}>
        <input
          type="email"
          placeholder="Email (e.g., student@university.edu)"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password (min 6 characters)"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">
          Register as Customer
        </button>
      </form>
      {message && <p style={{ color: 'green' }}>{message}</p>}
      {error && <p style={{ color: 'red' }}>Error: {error}</p>}
    </div>
  );
}

export default CustomerSignup;