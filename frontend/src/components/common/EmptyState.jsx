import React from 'react';
import { motion } from 'framer-motion';

const EmptyState = ({ icon = 'inbox', title, message, actionText, onAction }) => {
  // ==================== ANIMATION VARIANTS ====================
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.12,
        delayChildren: 0.1,
      },
    },
  };

  const iconVariants = {
    hidden: { opacity: 0, scale: 0.3, rotate: -20 },
    visible: {
      opacity: 1,
      scale: 1,
      rotate: 0,
      transition: {
        duration: 0.6,
        type: 'spring',
        stiffness: 200,
        damping: 15,
      },
    },
  };

  const textVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] },
    },
  };

  const buttonVariants = {
    hidden: { opacity: 0, y: 15, scale: 0.9 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.5,
        ease: [0.16, 1, 0.3, 1],
      },
    },
  };

  return (
    <motion.div
      className="empty-state"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <motion.div
        className="empty-state-icon"
        variants={iconVariants}
        animate={{
          y: [0, -6, 0],
        }}
        transition={{
          y: {
            duration: 3,
            repeat: Infinity,
            ease: 'easeInOut',
          },
        }}
      >
        <i className={`fas fa-${icon}`}></i>
      </motion.div>

      <motion.h3 className="empty-state-title" variants={textVariants}>
        {title}
      </motion.h3>

      <motion.p className="empty-state-message" variants={textVariants}>
        {message}
      </motion.p>

      {actionText && onAction && (
        <motion.button
          className="btn btn-primary"
          onClick={onAction}
          variants={buttonVariants}
          whileHover={{
            scale: 1.05,
            y: -2,
            transition: { duration: 0.2 },
          }}
          whileTap={{ scale: 0.96 }}
        >
          {actionText}
        </motion.button>
      )}
    </motion.div>
  );
};

export default EmptyState;