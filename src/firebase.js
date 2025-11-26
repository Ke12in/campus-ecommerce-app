// src/firebase.js

import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore"; // Ensure this is imported for 'db'

// Your actual web app's Firebase configuration 
const firebaseConfig = {
  apiKey: "AIzaSyDxWpLeAhjfTdrZRRpgJM1HJL60EhCDfZI",
  authDomain: "campus-ecommerce-app.firebaseapp.com",
  projectId: "campus-ecommerce-app",
  storageBucket: "campus-ecommerce-app.firebasestorage.app",
  messagingSenderId: "364098130638",
  appId: "1:364098130638:web:9e6a6d0222dd99de4f369f",
  measurementId: "G-LTWWPHP1NE"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Services and EXPORT them as NAMED EXPORTS
export const auth = getAuth(app); // <--- THIS LINE MUST START WITH 'export'
export const db = getFirestore(app); // <--- THIS LINE MUST START WITH 'export'