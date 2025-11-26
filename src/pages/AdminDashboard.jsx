// src/pages/AdminDashboard.jsx (Updated)

import React from 'react';
import { useAuth } from '../AuthContext';
import { auth } from '../firebase';
import { signOut } from 'firebase/auth';
import AddProductForm from '../components/AddProductForm'; // <-- NEW IMPORT

function AdminDashboard() {
  const { currentUser } = useAuth();
  
  const handleLogout = () => {
    signOut(auth);
  };
  
  return (
    <div style={{ padding: '20px' }}>
      <div className="card" style={{ maxWidth: '800px', margin: 'auto', marginBottom: '30px' }}>
        <h2>ADMIN DASHBOARD</h2>
        <p>Welcome, **{currentUser.email}**! You have privileged access to manage the marketplace inventory.</p>
        <button onClick={handleLogout} style={{marginTop: '10px'}}>Log Out</button>
      </div>
      
      {/* Product Upload Tool */}
      <AddProductForm />
      
    </div>
  );
}

export default AdminDashboard;