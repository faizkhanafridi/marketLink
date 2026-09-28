import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  if (totalPages <= 1) return null;

  const pages = [];
  const maxVisible = 5;
  let start = Math.max(1, currentPage - Math.floor(maxVisible / 2));
  let end = Math.min(totalPages, start + maxVisible - 1);

  if (end - start + 1 < maxVisible) {
    start = Math.max(1, end - maxVisible + 1);
  }

  for (let i = start; i <= end; i++) {
    pages.push(i);
  }

  // ==================== ANIMATION VARIANTS ====================
  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: [0.16, 1, 0.3, 1],
        staggerChildren: 0.06,
        delayChildren: 0.1,
      },
    },
  };

  const btnVariants = {
    hidden: { opacity: 0, scale: 0.6, y: 10 },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: {
        duration: 0.4,
        type: 'spring',
        stiffness: 260,
        damping: 18,
      },
    },
  };

  const ellipsisVariants = {
    hidden: { opacity: 0, scale: 0.5 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.3 },
    },
  };

  return (
    <motion.div
      className="pagination-wrapper"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      variants={containerVariants}
    >
      {/* Previous */}
      <motion.button
        className="pagination-btn"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        variants={btnVariants}
        whileHover={currentPage !== 1 ? { scale: 1.06, y: -2 } : {}}
        whileTap={currentPage !== 1 ? { scale: 0.94 } : {}}
      >
        <motion.i
          className="fas fa-chevron-left"
          whileHover={{ x: -3 }}
          transition={{ duration: 0.2 }}
        />{' '}
        Previous
      </motion.button>

      {/* First page shortcut */}
      <AnimatePresence>
        {start > 1 && (
          <>
            <motion.button
              className="pagination-btn"
              onClick={() => onPageChange(1)}
              variants={btnVariants}
              whileHover={{ scale: 1.08, y: -2 }}
              whileTap={{ scale: 0.94 }}
            >
              1
            </motion.button>
            {start > 2 && (
              <motion.span
                className="pagination-ellipsis"
                variants={ellipsisVariants}
              >
                ...
              </motion.span>
            )}
          </>
        )}
      </AnimatePresence>

      {/* Page numbers */}
      {pages.map((page) => {
        const isActive = page === currentPage;
        return (
          <motion.button
            key={page}
            className={`pagination-btn ${isActive ? 'active' : ''}`}
            onClick={() => onPageChange(page)}
            variants={btnVariants}
            whileHover={!isActive ? { scale: 1.08, y: -2 } : { scale: 1.05 }}
            whileTap={{ scale: 0.94 }}
            animate={
              isActive
                ? {
                    scale: [1, 1.08, 1],
                    transition: {
                      duration: 0.4,
                      ease: 'easeOut',
                    },
                  }
                : {}
            }
          >
            {page}
          </motion.button>
        );
      })}

      {/* Last page shortcut */}
      <AnimatePresence>
        {end < totalPages && (
          <>
            {end < totalPages - 1 && (
              <motion.span
                className="pagination-ellipsis"
                variants={ellipsisVariants}
              >
                ...
              </motion.span>
            )}
            <motion.button
              className="pagination-btn"
              onClick={() => onPageChange(totalPages)}
              variants={btnVariants}
              whileHover={{ scale: 1.08, y: -2 }}
              whileTap={{ scale: 0.94 }}
            >
              {totalPages}
            </motion.button>
          </>
        )}
      </AnimatePresence>

      {/* Next */}
      <motion.button
        className="pagination-btn"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        variants={btnVariants}
        whileHover={
          currentPage !== totalPages ? { scale: 1.06, y: -2 } : {}
        }
        whileTap={currentPage !== totalPages ? { scale: 0.94 } : {}}
      >
        Next{' '}
        <motion.i
          className="fas fa-chevron-right"
          whileHover={{ x: 3 }}
          transition={{ duration: 0.2 }}
        />
      </motion.button>
    </motion.div>
  );
};

export default Pagination;