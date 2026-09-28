import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useFlyToCart } from '../../context/FlyToCartContext';

const FlyToCartLayer = () => {
  const { flyingItems } = useFlyToCart();

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        pointerEvents: 'none',
        zIndex: 9999,
      }}
    >
      <AnimatePresence>
        {flyingItems.map((item) => (
          <motion.img
            key={item.id}
            src={item.image}
            alt=""
            initial={{
              x: item.from.x,
              y: item.from.y,
              width: item.from.width,
              height: item.from.height,
              opacity: 1,
              borderRadius: '8px',
            }}
            animate={{
              x: [item.from.x, (item.from.x + item.to.x) / 2, item.to.x],
              y: [item.from.y, item.from.y - 100, item.to.y],
              width: 20,
              height: 20,
              opacity: [1, 1, 0.6, 0],
              borderRadius: '50%',
            }}
            exit={{ opacity: 0 }}
            transition={{
              duration: 0.9,
              ease: [0.16, 1, 0.3, 1],
              times: [0, 0.5, 1],
            }}
            style={{
              position: 'fixed',
              objectFit: 'cover',
              boxShadow: '0 8px 24px rgba(0,0,0,0.2)',
            }}
          />
        ))}
      </AnimatePresence>
    </div>
  );
};

export default FlyToCartLayer;