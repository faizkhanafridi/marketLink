import React from 'react';
import { motion } from 'framer-motion';
import '../../styles/animations.css';

const Loader = ({ fullScreen = false, message = 'Loading...', size = 'medium' }) => {
  if (fullScreen) {
    return (
      <motion.div
        className="loader-fullscreen"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
      >
        <motion.div
          className={`loader-spinner loader-${size}`}
          initial={{ scale: 0.5, opacity: 0, rotate: -90 }}
          animate={{ scale: 1, opacity: 1, rotate: 0 }}
          transition={{
            duration: 0.5,
            ease: [0.16, 1, 0.3, 1],
          }}
        />
        <motion.p
          className="loader-message"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.15 }}
        >
          {message}
        </motion.p>
      </motion.div>
    );
  }

  return (
    <motion.div
      className="loader-inline"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      <motion.div
        className={`loader-spinner loader-${size}`}
        initial={{ scale: 0.5, opacity: 0, rotate: -90 }}
        animate={{ scale: 1, opacity: 1, rotate: 0 }}
        transition={{
          duration: 0.5,
          ease: [0.16, 1, 0.3, 1],
        }}
      />
      {message && (
        <motion.p
          className="loader-message"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.15 }}
        >
          {message}
        </motion.p>
      )}
    </motion.div>
  );
};

export default Loader;