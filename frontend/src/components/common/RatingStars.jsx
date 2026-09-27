import React from 'react';
import { motion } from 'framer-motion';

const RatingStars = ({ rating, max = 5, size = 'medium', interactive = false, onRate }) => {
  // ==================== ANIMATION VARIANTS ====================
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
        delayChildren: 0.05,
      },
    },
  };

  const starVariants = {
    hidden: { opacity: 0, scale: 0.3, rotate: -45 },
    visible: (i = 0) => ({
      opacity: 1,
      scale: 1,
      rotate: 0,
      transition: {
        duration: 0.4,
        delay: i * 0.08,
        type: 'spring',
        stiffness: 300,
        damping: 18,
      },
    }),
  };

  const stars = [];

  for (let i = 1; i <= max; i++) {
    const isFilled = i <= rating;

    stars.push(
      <motion.span
        key={i}
        className={`star ${isFilled ? 'filled' : 'empty'} star-${size} ${
          interactive ? 'interactive' : ''
        }`}
        onClick={() => interactive && onRate && onRate(i)}
        role={interactive ? 'button' : undefined}
        tabIndex={interactive ? 0 : undefined}
        variants={starVariants}
        custom={i}
        whileHover={
          interactive
            ? {
                scale: 1.25,
                y: -2,
                transition: { duration: 0.2 },
              }
            : { scale: 1.1 }
        }
        whileTap={interactive ? { scale: 0.85 } : {}}
        animate={
          isFilled
            ? {
                scale: [0.3, 1.15, 1],
                transition: {
                  duration: 0.5,
                  delay: i * 0.08,
                  ease: 'easeOut',
                },
              }
            : {}
        }
      >
        <i className={`${isFilled ? 'fas' : 'far'} fa-star`}></i>
      </motion.span>
    );
  }

  return (
    <motion.div
      className="rating-stars"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.5 }}
      variants={containerVariants}
    >
      {stars}
    </motion.div>
  );
};

export default RatingStars;