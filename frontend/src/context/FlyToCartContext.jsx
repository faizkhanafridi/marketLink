import React, { createContext, useContext, useState, useCallback } from 'react';

const FlyToCartContext = createContext(null);

export const FlyToCartProvider = ({ children }) => {
  const [flyingItems, setFlyingItems] = useState([]);

  const flyToCart = useCallback((fromRect, image) => {
    const id = Date.now() + Math.random();

    const cartBtn = document.querySelector('.cart-button');
    if (!cartBtn) return;

    const toRect = cartBtn.getBoundingClientRect();

    setFlyingItems((prev) => [
      ...prev,
      {
        id,
        image,
        from: {
          x: fromRect.left + fromRect.width / 2 - 20,
          y: fromRect.top + fromRect.height / 2 - 20,
          width: 40,
          height: 40,
        },
        to: {
          x: toRect.left + toRect.width / 2 - 20,
          y: toRect.top + toRect.height / 2 - 20,
        },
      },
    ]);

    setTimeout(() => {
      setFlyingItems((prev) => prev.filter((item) => item.id !== id));
    }, 1000);
  }, []);

  return (
    <FlyToCartContext.Provider value={{ flyingItems, flyToCart }}>
      {children}
    </FlyToCartContext.Provider>
  );
};

export const useFlyToCart = () => {
  const ctx = useContext(FlyToCartContext);
  if (!ctx) throw new Error('useFlyToCart must be used within FlyToCartProvider');
  return ctx;
};