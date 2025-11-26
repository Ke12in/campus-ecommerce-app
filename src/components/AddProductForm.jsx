// src/components/AddProductForm.jsx

import React, { useState } from 'react';
import { db } from '../firebase'; // Only importing db
import { collection, addDoc } from 'firebase/firestore';
import { useAuth } from '../AuthContext'; // <-- NEW IMPORT
// Removed all Firebase Storage imports

function AddProductForm() {
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  // NOTE: Image handling is REMOVED/SKIPPED to avoid Firebase Storage usage
  // The imageUrl will be a static placeholder.
  // src/components/AddProductForm.jsx




// ... (rest of imports)

function AddProductForm() {
  const { currentUser } = useAuth(); // <-- GET CURRENT USER
  
  // ... (rest of states and functions)

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    setError('');

    if (!currentUser || !currentUser.uid) { // Safety check
      setError("User not authenticated. Please log in.");
      setLoading(false);
      return;
    }

    try {
      // We use a static placeholder URL
      const imageUrl = "https://via.placeholder.com/250x200?text=Product+Image";

      // 2. SAVE PRODUCT DATA to Firestore
      await addDoc(collection(db, "products"), {
        name,
        price: parseFloat(price),
        description,
        category,
        imageUrl, 
        isAvailable: true, 
        createdAt: new Date(),
        vendorId: currentUser.uid // <-- NEW: Save the vendor's UID
      });

      // ... (rest of try/catch block)
    } catch (err) {
      // ...
    } finally {
      setLoading(false);
    }
  };

  // ... (rest of component return)
}



  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    setError('');

    // --- Start of Submission Logic ---
    try {
      // We use a static placeholder URL to avoid using Firebase Storage billing
      const imageUrl = "https://via.placeholder.com/250x200?text=Product+Image";

      // SAVE PRODUCT DATA to Firestore 'products' collection
      await addDoc(collection(db, "products"), {
        name,
        price: parseFloat(price),
        description,
        category,
        imageUrl, // Static placeholder used here
        isAvailable: true, 
        createdAt: new Date()
      });

      setMessage("Product added successfully! (Using placeholder image)");
      
      // Clear form
      setName('');
      setPrice('');
      setDescription('');
      setCategory('');

    } catch (err) {
      console.error("Error adding product:", err);
      setError(`Failed to add product: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card" style={{ maxWidth: '600px', margin: '20px auto' }}>
      <h3>Add New Product</h3>
      <form onSubmit={handleSubmit}>
        {/* Removed file input */}
        <input
          type="text"
          placeholder="Product Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <input
          type="number"
          placeholder="Price (e.g., 9.99)"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          required
          min="0"
          step="0.01"
        />
        <input
          type="text"
          placeholder="Category (e.g., Books, Electronics, Food)"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          required
        />
        <textarea
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
          rows="3"
        ></textarea>
        <button type="submit" disabled={loading}>
          {loading ? 'Adding Product...' : 'Add Product'}
        </button>
      </form>
      {message && <p style={{ color: 'green' }}>{message}</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
}

export default AddProductForm;