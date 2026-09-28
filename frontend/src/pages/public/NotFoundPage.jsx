import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Home,
  ShoppingBasket,
  Store,
  Tractor,
  ArrowLeft,
  Sprout,
} from 'lucide-react';
import Navbar from '../../components/common/Navbar';
import Footer from '../../components/common/Footer';
import '../../styles/home.css';
import '../../styles/not-found.css';

const NotFoundPage = () => {
  // ==================== ANIMATION VARIANTS ====================
  const fadeUp = {
    hidden: { opacity: 0, y: 24 },
    visible: (i = 0) => ({
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        delay: i * 0.1,
        ease: [0.16, 1, 0.3, 1],
      },
    }),
  };

  const stagger = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.15 },
    },
  };

  const slideRight = {
    hidden: { opacity: 0, x: 40 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] },
    },
  };

  return (
    <div className="not-found-page">
      <Navbar />

      <section className="not-found-section">
        <div className="container">
          <div className="nf-inner">
            {/* ---------- LEFT: Illustration ---------- */}
            <motion.div
              className="nf-visual"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            >
              <motion.div
                className="nf-visual-card"
                whileHover={{ y: -8, scale: 1.02 }}
                transition={{ duration: 0.4 }}
              >
                <svg
                  viewBox="0 0 400 320"
                  className="nf-illustration"
                  xmlns="http://www.w3.org/2000/svg"
                  aria-hidden="true"
                >
                  {/* Background circle - scale in */}
                  <motion.circle
                    cx="200"
                    cy="160"
                    r="140"
                    fill="#eef4e8"
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{
                      duration: 0.8,
                      delay: 0.1,
                      type: 'spring',
                      stiffness: 80,
                      damping: 15,
                    }}
                    style={{ transformOrigin: '200px 160px' }}
                  />

                  {/* Dashed orbit - draw in */}
                  <motion.circle
                    cx="200"
                    cy="160"
                    r="118"
                    fill="none"
                    stroke="#c9dcc0"
                    strokeWidth="1.5"
                    strokeDasharray="4 8"
                    initial={{ opacity: 0, rotate: -45 }}
                    animate={{ opacity: 1, rotate: 0 }}
                    transition={{ duration: 1, delay: 0.4 }}
                    style={{ transformOrigin: '200px 160px' }}
                  />

                  {/* Ground line */}
                  <motion.ellipse
                    cx="200"
                    cy="252"
                    rx="120"
                    ry="10"
                    fill="#dbe7d3"
                    initial={{ opacity: 0, scaleX: 0 }}
                    animate={{ opacity: 1, scaleX: 1 }}
                    transition={{
                      duration: 0.6,
                      delay: 0.5,
                      ease: [0.16, 1, 0.3, 1],
                    }}
                    style={{ transformOrigin: '200px 252px' }}
                  />

                  {/* Basket body - drop in */}
                  <motion.g
                    initial={{ opacity: 0, y: -30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      duration: 0.7,
                      delay: 0.6,
                      type: 'spring',
                      stiffness: 100,
                      damping: 14,
                    }}
                  >
                    <path
                      d="M120 175 L280 175 L265 245 C263 250, 258 253, 253 253 L147 253 C142 253, 137 250, 135 245 Z"
                      fill="#194d26"
                    />
                    <rect
                      x="110"
                      y="163"
                      width="180"
                      height="18"
                      rx="9"
                      fill="#194d26"
                    />
                    <path
                      d="M160 163 C160 130, 240 130, 240 163"
                      stroke="#194d26"
                      strokeWidth="7"
                      strokeLinecap="round"
                      fill="none"
                    />

                    {/* Weave lines - stagger in */}
                    <motion.line
                      x1="150"
                      y1="185"
                      x2="147"
                      y2="240"
                      stroke="#2c5f38"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      initial={{ pathLength: 0, opacity: 0 }}
                      animate={{ pathLength: 1, opacity: 1 }}
                      transition={{ duration: 0.5, delay: 0.9 }}
                    />
                    <motion.line
                      x1="180"
                      y1="185"
                      x2="178"
                      y2="240"
                      stroke="#2c5f38"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      initial={{ pathLength: 0, opacity: 0 }}
                      animate={{ pathLength: 1, opacity: 1 }}
                      transition={{ duration: 0.5, delay: 1 }}
                    />
                    <motion.line
                      x1="210"
                      y1="185"
                      x2="212"
                      y2="240"
                      stroke="#2c5f38"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      initial={{ pathLength: 0, opacity: 0 }}
                      animate={{ pathLength: 1, opacity: 1 }}
                      transition={{ duration: 0.5, delay: 1.1 }}
                    />
                    <motion.line
                      x1="240"
                      y1="185"
                      x2="243"
                      y2="240"
                      stroke="#2c5f38"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      initial={{ pathLength: 0, opacity: 0 }}
                      animate={{ pathLength: 1, opacity: 1 }}
                      transition={{ duration: 0.5, delay: 1.2 }}
                    />
                  </motion.g>

                  {/* Leaves - pop in + wiggle */}
                  <motion.path
                    d="M185 163 C185 135, 205 118, 220 128 C232 138, 215 158, 198 160 Z"
                    fill="#6EE7B7"
                    initial={{ opacity: 0, scale: 0, rotate: -30 }}
                    animate={{ opacity: 1, scale: 1, rotate: 0 }}
                    transition={{
                      duration: 0.6,
                      delay: 1.3,
                      type: 'spring',
                      stiffness: 200,
                    }}
                    style={{ transformOrigin: '200px 145px' }}
                  />
                  <motion.path
                    d="M215 160 C220 130, 250 122, 258 138 C264 152, 240 165, 224 163 Z"
                    fill="#A6895C"
                    initial={{ opacity: 0, scale: 0, rotate: 30 }}
                    animate={{ opacity: 1, scale: 1, rotate: 0 }}
                    transition={{
                      duration: 0.6,
                      delay: 1.4,
                      type: 'spring',
                      stiffness: 200,
                    }}
                    style={{ transformOrigin: '235px 145px' }}
                  />

                  {/* Floating "?" - continuous float */}
                  <motion.g
                    className="nf-question"
                    initial={{ opacity: 0, scale: 0, y: -30 }}
                    animate={{
                      opacity: 1,
                      scale: 1,
                      y: 0,
                    }}
                    transition={{
                      duration: 0.7,
                      delay: 1.5,
                      type: 'spring',
                      stiffness: 180,
                      damping: 12,
                    }}
                  >
                    <motion.g
                      animate={{ y: [0, -8, 0] }}
                      transition={{
                        duration: 2.5,
                        repeat: Infinity,
                        ease: 'easeInOut',
                        delay: 2.2,
                      }}
                    >
                      <circle cx="308" cy="90" r="26" fill="#c47a0a" />
                      <text
                        x="308"
                        y="102"
                        textAnchor="middle"
                        fontSize="34"
                        fontWeight="800"
                        fontFamily="Manrope, sans-serif"
                        fill="#ffffff"
                      >
                        ?
                      </text>
                    </motion.g>
                  </motion.g>

                  {/* Floating dots - staggered pop + float */}
                  <motion.circle
                    cx="95"
                    cy="105"
                    r="5"
                    fill="#6EE7B7"
                    opacity="0.7"
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{
                      opacity: 0.7,
                      scale: 1,
                      y: [0, -6, 0],
                    }}
                    transition={{
                      opacity: { duration: 0.4, delay: 1.6 },
                      scale: {
                        duration: 0.4,
                        delay: 1.6,
                        type: 'spring',
                      },
                      y: {
                        duration: 3,
                        repeat: Infinity,
                        ease: 'easeInOut',
                        delay: 2,
                      },
                    }}
                  />
                  <motion.circle
                    cx="330"
                    cy="200"
                    r="4"
                    fill="#A6895C"
                    opacity="0.6"
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{
                      opacity: 0.6,
                      scale: 1,
                      y: [0, 6, 0],
                    }}
                    transition={{
                      opacity: { duration: 0.4, delay: 1.75 },
                      scale: {
                        duration: 0.4,
                        delay: 1.75,
                        type: 'spring',
                      },
                      y: {
                        duration: 3.5,
                        repeat: Infinity,
                        ease: 'easeInOut',
                        delay: 2.2,
                      },
                    }}
                  />
                  <motion.circle
                    cx="70"
                    cy="200"
                    r="3"
                    fill="#194d26"
                    opacity="0.4"
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{
                      opacity: 0.4,
                      scale: 1,
                      x: [0, 5, 0],
                    }}
                    transition={{
                      opacity: { duration: 0.4, delay: 1.9 },
                      scale: {
                        duration: 0.4,
                        delay: 1.9,
                        type: 'spring',
                      },
                      x: {
                        duration: 4,
                        repeat: Infinity,
                        ease: 'easeInOut',
                        delay: 2.4,
                      },
                    }}
                  />
                </svg>
              </motion.div>
            </motion.div>

            {/* ---------- RIGHT: Content ---------- */}
            <motion.div
              className="nf-content"
              initial="hidden"
              animate="visible"
              variants={slideRight}
            >
              <motion.span
                className="nf-eyebrow"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <motion.span
                  animate={{ rotate: [0, 15, -15, 0] }}
                  transition={{
                    duration: 2.5,
                    repeat: Infinity,
                    repeatDelay: 1.5,
                  }}
                  style={{ display: 'inline-flex' }}
                >
                  <Sprout size={14} />
                </motion.span>
                Error 404
              </motion.span>

              <motion.h1
                className="nf-title"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
              >
                This patch of the field
                <motion.span
                  className="nf-title-accent"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.5 }}
                >
                  {" "}hasn't been planted yet
                </motion.span>
              </motion.h1>

              <motion.p
                className="nf-subtitle"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.6 }}
              >
                The page you're looking for doesn't exist, was moved, or
                the link may be broken. Let's get you back to the good stuff.
              </motion.p>

              <motion.div
                className="nf-actions"
                initial="hidden"
                animate="visible"
                variants={stagger}
              >
                <motion.div
                  variants={fadeUp}
                  whileHover={{ scale: 1.05, y: -3 }}
                  whileTap={{ scale: 0.97 }}
                  transition={{ duration: 0.25 }}
                >
                  <Link to="/" className="nf-btn nf-btn-primary">
                    <motion.span
                      whileHover={{ rotate: -10, scale: 1.1 }}
                      transition={{ duration: 0.2 }}
                      style={{ display: 'inline-flex' }}
                    >
                      <Home size={16} />
                    </motion.span>
                    Back to Home
                  </Link>
                </motion.div>

                <motion.div
                  variants={fadeUp}
                  whileHover={{ scale: 1.05, y: -3 }}
                  whileTap={{ scale: 0.97 }}
                  transition={{ duration: 0.25 }}
                >
                  <Link to="/products" className="nf-btn nf-btn-outline">
                    <motion.span
                      whileHover={{ y: -3, rotate: -8 }}
                      transition={{ duration: 0.2 }}
                      style={{ display: 'inline-flex' }}
                    >
                      <ShoppingBasket size={16} />
                    </motion.span>
                    Browse Products
                  </Link>
                </motion.div>
              </motion.div>

              {/* Helpful quick links */}
              <motion.div
                className="nf-quick-links"
                initial="hidden"
                animate="visible"
                variants={stagger}
              >
                <motion.span
                  className="nf-quick-label"
                  variants={fadeUp}
                >
                  Popular pages
                </motion.span>
                <div className="nf-quick-grid">
                  {[
                    { to: '/markets', icon: Store, label: 'Markets' },
                    { to: '/farmers', icon: Tractor, label: 'Farmers' },
                    { to: '/about', icon: ArrowLeft, label: 'About Us' },
                  ].map((item, i) => {
                    const Icon = item.icon;
                    return (
                      <motion.div
                        key={item.label}
                        variants={fadeUp}
                        custom={i}
                        whileHover={{ scale: 1.05, y: -3 }}
                        whileTap={{ scale: 0.96 }}
                        transition={{ duration: 0.2 }}
                      >
                        <Link to={item.to} className="nf-quick-item">
                          <Icon size={16} />
                          <span>{item.label}</span>
                        </Link>
                      </motion.div>
                    );
                  })}
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default NotFoundPage;