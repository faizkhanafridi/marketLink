import React, { createContext, useState, useEffect, useRef, useCallback } from 'react';

export const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [farmerId, setFarmerId] = useState(null);

  // Prevents the save effect from running before the load effect finishes
  const hydrated = useRef(false);

  // ---------------------------------------------
  // 1. LOAD from localStorage ONCE on mount
  // ---------------------------------------------
  useEffect(() => {
    try {
      const storedCart = localStorage.getItem('marketlink_cart');
      const storedFarmerId = localStorage.getItem('marketlink_cart_farmer');

      if (storedCart) {
        const parsed = JSON.parse(storedCart);
        if (Array.isArray(parsed)) setCartItems(parsed);
      }
      if (storedFarmerId && storedFarmerId !== 'undefined' && storedFarmerId !== 'null') {
        const parsedId = parseInt(storedFarmerId, 10);
        if (!isNaN(parsedId)) setFarmerId(parsedId);
      }
    } catch (err) {
      console.error('Failed to hydrate cart:', err);
      localStorage.removeItem('marketlink_cart');
      localStorage.removeItem('marketlink_cart_farmer');
    } finally {
      // Mark hydrated AFTER the load runs, even if it errored
      hydrated.current = true;
    }
  }, []);

  // ---------------------------------------------
  // 2. SAVE to localStorage — but ONLY after hydration
  // ---------------------------------------------
  useEffect(() => {
    if (!hydrated.current) return;  // ← critical guard

    try {
      if (cartItems.length === 0) {
        localStorage.removeItem('marketlink_cart');
        localStorage.removeItem('marketlink_cart_farmer');
      } else {
        localStorage.setItem('marketlink_cart', JSON.stringify(cartItems));
        if (farmerId) {
          localStorage.setItem('marketlink_cart_farmer', String(farmerId));
        } else {
          localStorage.removeItem('marketlink_cart_farmer');
        }
      }
    } catch (err) {
      console.error('Failed to persist cart:', err);
    }
  }, [cartItems, farmerId]);

  // ---------------------------------------------
  // ACTIONS
  // ---------------------------------------------
  const addToCart = useCallback((product, quantity = 1) => {
    const productFarmerId = product.farmer_id ?? product.farmer?.farmer_id;

    if (!productFarmerId) {
      console.warn('addToCart: product has no farmer_id', product);
      return;
    }

    setCartItems((prev) => {
      // Different farmer → reset cart and start fresh
      if (prev.length > 0 && prev[0].farmer_id !== productFarmerId) {
        setFarmerId(productFarmerId);
        return [{ ...product, farmer_id: productFarmerId, quantity }];
      }

      setFarmerId(productFarmerId);

      const existing = prev.find((item) => item.product_id === product.product_id);
      if (existing) {
        return prev.map((item) =>
          item.product_id === product.product_id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prev, { ...product, farmer_id: productFarmerId, quantity }];
    });
  }, []);

  const removeFromCart = useCallback((productId) => {
    setCartItems((prev) => {
      const updated = prev.filter((item) => item.product_id !== productId);
      if (updated.length === 0) setFarmerId(null);
      return updated;
    });
  }, []);

  const updateQuantity = useCallback(
    (productId, quantity) => {
      if (quantity <= 0) {
        removeFromCart(productId);
        return;
      }
      setCartItems((prev) =>
        prev.map((item) =>
          item.product_id === productId ? { ...item, quantity } : item
        )
      );
    },
    [removeFromCart]
  );

  const clearCart = useCallback(() => {
    setCartItems([]);
    setFarmerId(null);
    // Explicitly clear storage now (in case hydrated guard is somehow off)
    try {
      localStorage.removeItem('marketlink_cart');
      localStorage.removeItem('marketlink_cart_farmer');
    } catch {}
  }, []);

  const getCartTotal = useCallback(
    () =>
      cartItems.reduce(
        (total, item) => total + parseFloat(item.price) * item.quantity,
        0
      ),
    [cartItems]
  );

  const getCartCount = useCallback(
    () => cartItems.reduce((count, item) => count + item.quantity, 0),
    [cartItems]
  );

  const value = {
    cartItems,
    farmerId,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getCartTotal,
    getCartCount,
    isCartEmpty: cartItems.length === 0,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};