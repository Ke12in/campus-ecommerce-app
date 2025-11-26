// src/CartContext.jsx (Final version with clearCart)

import React, { createContext, useContext, useState } from 'react';

// 1. Create the Context
const CartContext = createContext();

// 2. Custom Hook to use the Cart
export const useCart = () => {
  return useContext(CartContext);
};

// 3. Provider Component
export const CartProvider = ({ children }) => {
  // Cart items are stored in state, starting empty
  const [cartItems, setCartItems] = useState([]); 

  // Function to add an item to the cart
  const addToCart = (product) => {
    setCartItems(prevItems => {
      // Check if item already exists
      const existingItem = prevItems.find(item => item.id === product.id);
      
      if (existingItem) {
        // If it exists, increase the quantity
        return prevItems.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        // If it's new, add it with quantity 1
        return [...prevItems, { ...product, quantity: 1 }];
      }
    });
  };

  // Function to remove an item entirely from the cart
  const removeFromCart = (productId) => {
    setCartItems(prevItems => prevItems.filter(item => item.id !== productId));
  };

  // Function to get the total number of items (quantities added up)
  const getTotalItems = () => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  };
  
  // NEW: Function to clear the cart entirely
  const clearCart = () => {
    setCartItems([]);
  };
  
  const value = {
    cartItems,
    addToCart,
    removeFromCart,
    getTotalItems,
    clearCart, // <-- NEW EXPORT
    // Future functions: updateQuantity, placeOrder
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};