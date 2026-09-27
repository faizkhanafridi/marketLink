import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from '../../components/common/Navbar';
import Footer from '../../components/common/Footer';
import CustomerSidebar from '../../components/customer/CustomerSidebar';
import EmptyState from '../../components/common/EmptyState';
import { useCart } from '../../hooks/useCart';
import { formatCurrency } from '../../utils/formatters';
import '../../styles/dashboard.css';

const CartPage = () => {
  const navigate = useNavigate();
  const { cartItems, updateQuantity, removeFromCart, getCartTotal, clearCart } = useCart();

  // ==================== ANIMATION VARIANTS ====================
  const fadeUp = {
    hidden: { opacity: 0, y: 24 },
    visible: (i = 0) => ({
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        delay: i * 0.08,
        ease: [0.16, 1, 0.3, 1],
      },
    }),
  };

  const stagger = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.08, delayChildren: 0.15 },
    },
  };

  const slideRight = {
    hidden: { opacity: 0, x: 40 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] },
    },
  };

  const cartItemVariants = {
    hidden: { opacity: 0, x: -30, scale: 0.95 },
    visible: (i = 0) => ({
      opacity: 1,
      x: 0,
      scale: 1,
      transition: {
        duration: 0.5,
        delay: i * 0.08,
        ease: [0.16, 1, 0.3, 1],
      },
    }),
    exit: {
      opacity: 0,
      x: 100,
      scale: 0.9,
      transition: { duration: 0.35, ease: 'easeIn' },
    },
  };

  // ==================== EMPTY CART ====================
  if (cartItems.length === 0) {
    return (
      <div className="dashboard-page">
        <Navbar />
        <div className="dashboard-layout">
          <CustomerSidebar />
          <main className="dashboard-main">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            >
              <EmptyState
                icon="shopping-basket"
                title="Your Cart is Empty"
                message="Browse products and add items to your cart."
                actionText="Browse Products"
                onAction={() => navigate('/products')}
              />
            </motion.div>
          </main>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="dashboard-page">
      <Navbar />
      <div className="dashboard-layout">
        <CustomerSidebar />
        <main className="dashboard-main">
          {/* ==================== HEADER ==================== */}
          <motion.div
            className="dashboard-header"
            initial="hidden"
            animate="visible"
            variants={stagger}
          >
            <motion.h1 variants={fadeUp} className="dashboard-title">
              Shopping Cart
            </motion.h1>
            <motion.p variants={fadeUp} className="dashboard-subtitle">
              {cartItems.length} items in your cart
            </motion.p>
          </motion.div>

          <div className="cart-layout">
            {/* ==================== CART ITEMS ==================== */}
            <motion.div
              className="cart-items"
              initial="hidden"
              animate="visible"
              variants={stagger}
            >
              <AnimatePresence mode="popLayout">
                {cartItems.map((item, i) => (
                  <motion.div
                    key={item.product_id}
                    className="cart-item"
                    variants={cartItemVariants}
                    custom={i}
                    layout
                    whileHover={{
                      y: -4,
                      boxShadow: '0 10px 30px rgba(0,0,0,0.08)',
                      transition: { duration: 0.25 },
                    }}
                    exit="exit"
                  >
                    <motion.img
                      src={item.image || '/assets/images/default-product.jpg'}
                      alt={item.name}
                      className="cart-item-image"
                      onError={(e) => {
                        e.target.src = '/assets/images/default-product.jpg';
                      }}
                      whileHover={{ scale: 1.08 }}
                      transition={{ duration: 0.3 }}
                    />

                    <div className="cart-item-info">
                      <motion.h3
                        className="cart-item-name"
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, delay: 0.15 + i * 0.08 }}
                      >
                        {item.name}
                      </motion.h3>
                      <motion.p
                        className="cart-item-price"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.4, delay: 0.2 + i * 0.08 }}
                      >
                        {formatCurrency(item.price)} / {item.unit}
                      </motion.p>
                    </div>

                    <div className="cart-item-quantity">
                      <motion.button
                        onClick={() =>
                          updateQuantity(item.product_id, item.quantity - 1)
                        }
                        whileHover={{ scale: 1.15 }}
                        whileTap={{ scale: 0.9 }}
                        transition={{ duration: 0.15 }}
                      >
                        −
                      </motion.button>

                      <AnimatePresence mode="popLayout">
                        <motion.span
                          key={item.quantity}
                          initial={{ opacity: 0, y: -10, scale: 0.7 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: 10, scale: 0.7 }}
                          transition={{ duration: 0.2 }}
                        >
                          {item.quantity}
                        </motion.span>
                      </AnimatePresence>

                      <motion.button
                        onClick={() =>
                          updateQuantity(item.product_id, item.quantity + 1)
                        }
                        whileHover={{ scale: 1.15 }}
                        whileTap={{ scale: 0.9 }}
                        transition={{ duration: 0.15 }}
                      >
                        +
                      </motion.button>
                    </div>

                    <motion.div
                      className="cart-item-subtotal"
                      key={`${item.product_id}-${item.quantity}`}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.35, type: 'spring', stiffness: 260 }}
                    >
                      {formatCurrency(item.price * item.quantity)}
                    </motion.div>

                    <motion.button
                      className="cart-item-remove"
                      onClick={() => removeFromCart(item.product_id)}
                      whileHover={{
                        scale: 1.15,
                        rotate: -10,
                        color: '#d33',
                      }}
                      whileTap={{ scale: 0.9 }}
                      transition={{ duration: 0.2 }}
                      aria-label="Remove item"
                    >
                      <i className="fas fa-trash"></i>
                    </motion.button>
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>

            {/* ==================== SUMMARY ==================== */}
            <motion.div
              className="cart-summary"
              initial="hidden"
              animate="visible"
              variants={slideRight}
              whileHover={{ y: -3 }}
              transition={{ duration: 0.3 }}
            >
              <motion.h3
                className="summary-title"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                Order Summary
              </motion.h3>

              <motion.div
                className="summary-row"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: 0.3 }}
              >
                <span>Subtotal</span>
                <motion.span
                  key={getCartTotal()}
                  initial={{ opacity: 0, scale: 0.85 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.35, type: 'spring', stiffness: 260 }}
                >
                  {formatCurrency(getCartTotal())}
                </motion.span>
              </motion.div>

              <motion.div
                className="summary-row"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: 0.4 }}
              >
                <span>Payment</span>
                <span>At Pickup</span>
              </motion.div>

              <motion.div
                className="summary-row total"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: 0.5 }}
              >
                <span>Total</span>
                <motion.span
                  key={`total-${getCartTotal()}`}
                  initial={{ opacity: 0, scale: 0.85 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.4, type: 'spring', stiffness: 260 }}
                >
                  {formatCurrency(getCartTotal())}
                </motion.span>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.6 }}
              >
                <motion.button
                  className="btn btn-primary btn-block btn-lg"
                  onClick={() => navigate('/customer/checkout')}
                  whileHover={{ scale: 1.03, y: -3 }}
                  whileTap={{ scale: 0.97 }}
                  transition={{ duration: 0.2 }}
                >
                  Proceed to Checkout
                </motion.button>
              </motion.div>

              {/* ✅ Clear Cart Button — NO rotation, sirf hover lift */}
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.7 }}
              >
                <motion.button
                  className="btn btn-outline btn-block"
                  onClick={clearCart}
                  whileHover={{ scale: 1.02, y: -2 }}
                  whileTap={{ scale: 0.97 }}
                  transition={{ duration: 0.2 }}
                >
                  Clear Cart
                </motion.button>
              </motion.div>
            </motion.div>
          </div>
        </main>
      </div>
      <Footer />
    </div>
  );
};

export default CartPage;