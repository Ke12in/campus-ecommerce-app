// src/components/ProductList.jsx (Update: Adding Cart Logic)

import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, query, onSnapshot, orderBy } from 'firebase/firestore';
import { useCart } from '../CartContext'; // <-- NEW IMPORT

function ProductList() {
  const { addToCart } = useCart(); // <-- GET THE ADD TO CART FUNCTION
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(collection(db, "products"), orderBy("createdAt", "desc"));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const productsArray = [];
      snapshot.forEach((doc) => {
        // Map Firestore doc data into the product object format
        productsArray.push({ 
          id: doc.id, 
          ...doc.data(),
          // Ensure price is a number for cart math later
          price: parseFloat(doc.data().price) 
        });
      });
      setProducts(productsArray);
      setLoading(false);
    }, (error) => {
      console.error("Error fetching products:", error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return <div className="card">Loading products...</div>;
  }
  
  if (products.length === 0) {
    return <div className="card">No products available yet. (Admin needs to upload some!)</div>;
  }

  return (
    <div style={{ marginTop: '30px' }}>
      <h2>Available Products</h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px', padding: '20px' }}>
        {products.map((product) => (
          <div key={product.id} className="card" style={{ padding: '15px', textAlign: 'left' }}>
            <img 
              src={product.imageUrl} 
              alt={product.name} 
              style={{ width: '100%', height: '200px', objectFit: 'cover', borderRadius: '8px', marginBottom: '10px' }} 
            />
            <h4 style={{ color: 'var(--color-primary)', margin: '5px 0' }}>{product.name}</h4>
            <p style={{ margin: '5px 0', fontWeight: 'bold' }}>${product.price.toFixed(2)}</p>
            <p style={{ margin: '5px 0', fontSize: '0.9em' }}>Category: {product.category}</p>
            <p style={{ margin: '10px 0', fontSize: '0.9em', color: '#ccc' }}>{product.description}</p>
            <button 
              style={{ width: '100%' }}
              onClick={() => addToCart(product)} // <-- CALL ADD TO CART ON CLICK
            >
              Add to Cart
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ProductList;