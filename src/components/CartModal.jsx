// src/components/CartModal.jsx (Final Version with clearCart)

import React, { useState, useEffect } from 'react';
import { useCart } from '../CartContext';

// This function formats seconds into MM:SS format
const formatTime = (seconds) => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  
  const paddedMinutes = String(minutes).padStart(2, '0');
  const paddedSeconds = String(remainingSeconds).padStart(2, '0');

  return `${paddedMinutes}:${paddedSeconds}`;
};

function CartModal({ onClose }) {
  // 🛑 CRITICAL UPDATE: Import clearCart
  const { cartItems, removeFromCart, clearCart } = useCart(); 
  
  // Timer State: Start with 30 minutes (1800 seconds)
  const INITIAL_TIME = 1800; // 30 minutes * 60 seconds
  const [timeRemaining, setTimeRemaining] = useState(INITIAL_TIME);
  const [isExpired, setIsExpired] = useState(false);

  // Calculate Subtotal and Total Price
  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const TAX_RATE = 0.05;
  const tax = subtotal * TAX_RATE;
  const total = subtotal + tax;

  // Countdown Effect
  useEffect(() => {
    if (isExpired) return;

    const timerId = setInterval(() => {
      setTimeRemaining(prevTime => {
        if (prevTime <= 1) {
          clearInterval(timerId);
          setIsExpired(true);
          
          // 🛑 CRITICAL LOGIC: Call clearCart() when time expires
          clearCart();
          
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);

    // Cleanup function to stop the timer when the modal closes
    return () => clearInterval(timerId);
  }, [isExpired, clearCart]); // Added clearCart to dependency array
  
  const handleCheckout = () => {
    if (isExpired) {
      alert("Time has expired. Your cart is no longer valid.");
      return;
    }
    // In a real app, this would redirect to a payment page or confirmation page
    alert(`Checking out $${total.toFixed(2)}! (Functionality TBD)`);
    // Clear the cart on successful checkout
    clearCart(); 
    onClose(); 
  };
  
  const timerStyle = {
    color: timeRemaining <= 60 ? 'red' : (timeRemaining <= 300 ? 'orange' : 'green'),
    fontWeight: 'bold',
    fontSize: '1.2em',
    marginBottom: '15px'
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content" style={{ maxWidth: '600px', padding: '30px' }}>
        <button onClick={onClose} style={{ float: 'right', background: 'black', border: 'none', fontSize: '1.5em', cursor: 'pointer' }}>
            &times;
        </button>
        
        <h3>Your Shopping Cart</h3>
        
        {/* Timer Display */}
        <div style={timerStyle}>
          {isExpired 
            ? "Order Expired! Cart Cleared." 
            : `Time Remaining: ${formatTime(timeRemaining)}`
          }
        </div>

        {cartItems.length === 0 ? (
          <p>Your cart is empty.</p>
        ) : (
          <>
            {/* Cart Items List */}
            <ul style={{ listStyle: 'none', padding: 0 }}>
              {cartItems.map(item => (
                <li key={item.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px dashed #020202ff' }}>
                  <span>
                    {item.name} x {item.quantity}
                  </span>
                  <span>
                    ${(item.price * item.quantity).toFixed(2)}
                    <button 
                      onClick={() => removeFromCart(item.id)} 
                      style={{ marginLeft: '15px', background: 'none', border: '1px solid #ccc', color: 'red', cursor: 'pointer', padding: '2px 8px', borderRadius: '4px' }}
                    >
                      Remove
                    </button>
                  </span>
                </li>
              ))}
            </ul>

            {/* Price Summary */}
            <div style={{ marginTop: '20px', borderTop: '2px solid #ccc', paddingTop: '10px', textAlign: 'right' }}>
              <p>Subtotal: ${subtotal.toFixed(2)}</p>
              <p>Tax (2%): ${tax.toFixed(2)}</p>
              <h4 style={{ color: 'var(--color-primary)' }}>Total: ${total.toFixed(2)}</h4>
            </div>
            
            {/* Checkout Button */}
            <button 
              onClick={handleCheckout} 
              disabled={isExpired || cartItems.length === 0}
              style={{ width: '100%', padding: '15px', marginTop: '20px', backgroundColor: isExpired ? '#aaa' : 'var(--color-primary)' }}
            >
              {isExpired ? 'Expired' : `Checkout $${total.toFixed(2)}`}
            </button>
          </>
        )}
      </div>
    </div>
  );
}

export default CartModal;