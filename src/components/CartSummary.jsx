// src/components/CartSummary.jsx (Final Update)

import React, { useState } from 'react';
import { useCart } from '../CartContext';
import CartModal from './CartModal'; // <-- IMPORT THE NEW MODAL FILE

function CartSummary() {
  const { getTotalItems } = useCart();
  const totalItems = getTotalItems();
  const [isModalOpen, setIsModalOpen] = useState(false); 

  return (
    <>
      {/* ... (The fixed position button code remains the same) ... */}
      <div style={{ 
        position: 'fixed', 
        top: '20px', 
        right: '20px', 
        zIndex: 100,
        display: 'flex',
        alignItems: 'center',
        gap: '10px'
      }}>
        <button 
          className="button"
          onClick={() => setIsModalOpen(true)}
          style={{ 
            display: 'flex', 
            alignItems: 'center', 
            backgroundColor: 'var(--color-secondary)',
            color: 'white',
            fontWeight: 'bold',
            padding: '10px 15px',
            borderRadius: '25px',
            boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
          }}
        >
          🛒 Cart ({totalItems})
        </button>
        {/* ... (Total items badge code remains the same) ... */}
        {totalItems > 0 && (
          <span style={{
            backgroundColor: 'red',
            color: 'white',
            borderRadius: '50%',
            padding: '2px 8px',
            fontSize: '0.8em',
            fontWeight: 'bold',
            animation: 'pulse 1s infinite'
          }}>
            {totalItems}
          </span>
        )}
      </div>
      
      {/* 2. Render the Modal Component */}
      {isModalOpen && (
        <CartModal 
          onClose={() => setIsModalOpen(false)} 
        />
      )}
    </>
    // Note: Remove the old CartModal function definition from this file!
  );
}

export default CartSummary;