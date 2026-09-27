import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import '../../styles/cards.css';

const MarketCard = ({ market }) => {
  // ==================== ANIMATION VARIANTS ====================
  const cardVariants = {
    hidden: { opacity: 0, y: 30, scale: 0.96 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.55,
        ease: [0.16, 1, 0.3, 1],
      },
    },
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -10 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.4, ease: 'easeOut' },
    },
  };

  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
      variants={cardVariants}
      whileHover={{
        y: -8,
        boxShadow: '0 18px 40px rgba(0, 0, 0, 0.12)',
        transition: { duration: 0.3, ease: 'easeOut' },
      }}
    >
      <Link to={`/markets/${market.market_id}`} className="market-card">
        {/* Icon */}
        <motion.div
          className="market-card-icon"
          whileHover={{ rotate: -8, scale: 1.1 }}
          transition={{ type: 'spring', stiffness: 300, damping: 15 }}
        >
          <i className="fas fa-store"></i>
        </motion.div>

        {/* Content */}
        <motion.div
          className="market-card-content"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <motion.h3 className="market-name" variants={itemVariants}>
            {market.market_name}
          </motion.h3>

          <motion.p
            className="market-address"
            variants={itemVariants}
            whileHover={{ x: 3 }}
            transition={{ duration: 0.2 }}
          >
            <i className="fas fa-map-marker-alt"></i> {market.address}
          </motion.p>

          {market.operating_days && (
            <motion.p
              className="market-days"
              variants={itemVariants}
              whileHover={{ x: 3 }}
              transition={{ duration: 0.2 }}
            >
              <i className="fas fa-calendar-alt"></i> {market.operating_days}
            </motion.p>
          )}

          {market.timings && (
            <motion.p
              className="market-timings"
              variants={itemVariants}
              whileHover={{ x: 3 }}
              transition={{ duration: 0.2 }}
            >
              <i className="fas fa-clock"></i> {market.timings}
            </motion.p>
          )}
        </motion.div>

        {/* Arrow */}
        <motion.div
          className="market-card-arrow"
          whileHover={{ x: 5 }}
          transition={{ duration: 0.25, ease: 'easeOut' }}
        >
          <motion.i
            className="fas fa-chevron-right"
            animate={{ x: [0, 4, 0] }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />
        </motion.div>
      </Link>
    </motion.div>
  );
};

export default MarketCard;