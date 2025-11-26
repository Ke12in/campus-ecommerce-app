// src/AuthContext.jsx

import React, { createContext, useContext, useState, useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from './firebase'; // Import auth and db

// 1. Create the Context object
const AuthContext = createContext();

// 2. Custom hook to use the context easily
export const useAuth = () => useContext(AuthContext);

// 3. Provider Component
export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userRole, setUserRole] = useState(null);

  useEffect(() => {
    // This runs once when the component mounts
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setCurrentUser(user);
        
        // Fetch user role from Firestore
        const userDocRef = doc(db, "users", user.uid);
        const docSnap = await getDoc(userDocRef);

        if (docSnap.exists()) {
          setUserRole(docSnap.data().role);
        } else {
          // Fallback if Firestore doc is missing (e.g., initial sign-up)
          setUserRole('customer'); 
        }

      } else {
        setCurrentUser(null);
        setUserRole(null);
      }
      setLoading(false);
    });

    // Clean up the listener when the component unmounts
    return unsubscribe;
  }, []);

  // Context value object
  const value = {
    currentUser,
    userRole,
    loading,
  };

  return (
    <AuthContext.Provider value={value}>
      {/* Only render children (the rest of the app) when loading is false */}
      {!loading && children}
    </AuthContext.Provider>
  );
};