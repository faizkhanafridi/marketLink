import React, { useState, useEffect } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ShoppingBag,
  ChevronDown,
  Package,
  Heart,
  LayoutDashboard,
  LogOut,
  Menu,
  X,
  User,
  ArrowRight,
  Sprout,
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { useCart } from '../../hooks/useCart';
import Logo from './Logo';
import '../../styles/navbar.css';

const NAV_ITEMS = [
  { label: 'Home', to: '/', end: true },
  { label: 'Products', to: '/products' },
  { label: 'Markets', to: '/markets' },
  { label: 'Farmers', to: '/farmers' },
  { label: 'About', to: '/about' },
  { label: 'Contact', to: '/contact' },
];

const Navbar = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const { getCartCount } = useCart();
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  useEffect(() => {
    setMobileOpen(false);
    setUserMenuOpen(false);
  }, [navigate]);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 12);
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (!e.target.closest('.user-menu-wrapper')) {
        setUserMenuOpen(false);
      }
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileOpen]);

  const handleLogout = async () => {
    setUserMenuOpen(false);
    setMobileOpen(false);
    await logout();
    navigate('/');
  };

  const getDashboardLink = () => {
    if (user?.role === 'farmer') return '/farmer';
    if (user?.role === 'admin') return '/admin';
    return '/customer';
  };

  const cartCount = getCartCount ? getCartCount() : 0;

  /* ---------- Desktop animation variants ---------- */
  const navVariants = {
    hidden: { y: -80, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
    },
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.07, delayChildren: 0.25 },
    },
  };

  const itemVariants = {
    hidden: { y: -10, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.4, ease: 'easeOut' },
    },
  };

  const brandVariants = {
    hidden: { x: -20, opacity: 0 },
    visible: {
      x: 0,
      opacity: 1,
      transition: { duration: 0.6, ease: 'easeOut' },
    },
  };

  const authVariants = {
    hidden: { x: 20, opacity: 0 },
    visible: {
      x: 0,
      opacity: 1,
      transition: { duration: 0.6, ease: 'easeOut' },
    },
  };

  /* ---------- Mobile drawer animation variants ---------- */
  const drawerVariants = {
    hidden: { x: '100%' },
    visible: {
      x: 0,
      transition: { duration: 0.42, ease: [0.32, 0.72, 0, 1] },
    },
    exit: {
      x: '100%',
      transition: { duration: 0.32, ease: [0.32, 0.72, 0, 1] },
    },
  };

  const drawerListVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.05, delayChildren: 0.12 },
    },
  };

  const drawerItemVariants = {
    hidden: { x: 30, opacity: 0 },
    visible: {
      x: 0,
      opacity: 1,
      transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] },
    },
  };

  return (
    <>
      {/* ============================================================
          NAVBAR BAR
      ============================================================ */}
      <motion.nav
        className={`marketlink-navbar ${scrolled ? 'scrolled' : ''}`}
        variants={navVariants}
        initial="hidden"
        animate="visible"
      >
        <div className="navbar-container">
          {/* ===== BRAND ===== */}
          <motion.div variants={brandVariants} initial="hidden" animate="visible">
            <Link
              to="/"
              className="navbar-brand"
              onClick={() => setMobileOpen(false)}
            >
              <motion.div
                className="brand-logo"
                whileHover={{ rotate: -6, scale: 1.08 }}
                transition={{ type: 'spring', stiffness: 300, damping: 15 }}
              >
                <Logo size={42} />
              </motion.div>
              <div className="brand-text">
                <span className="brand-name">
                  <span className="brand-name-primary">Market</span>
                  <span className="brand-name-accent">Link</span>
                </span>
                <span className="brand-tagline">eGreen Basket</span>
              </div>
            </Link>
          </motion.div>

          {/* ===== DESKTOP NAV ===== */}
          <motion.div
            className="navbar-menu"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {NAV_ITEMS.map((item) => (
              <motion.div key={item.label} variants={itemVariants}>
                <NavLink to={item.to} end={item.end} className="nav-link">
                  {item.label}
                </NavLink>
              </motion.div>
            ))}
          </motion.div>

          {/* ===== ACTIONS ===== */}
          <motion.div
            className="navbar-actions"
            variants={authVariants}
            initial="hidden"
            animate="visible"
          >
            {isAuthenticated ? (
              <>
                {user?.role === 'customer' && (
                  <motion.div
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Link
                      to="/customer/cart"
                      className="cart-button"
                      aria-label="Basket"
                    >
                      <ShoppingBag size={19} strokeWidth={2} />
                      {cartCount > 0 && (
                        <motion.span
                          className="cart-badge"
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{
                            type: 'spring',
                            stiffness: 500,
                            damping: 15,
                          }}
                        >
                          {cartCount}
                        </motion.span>
                      )}
                    </Link>
                  </motion.div>
                )}

                <div className="user-menu-wrapper">
                  <motion.button
                    type="button"
                    className="user-menu-button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setUserMenuOpen(!userMenuOpen);
                    }}
                    aria-haspopup="true"
                    aria-expanded={userMenuOpen}
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                  >
                    <span className="user-avatar">
                      {user?.username?.charAt(0).toUpperCase() || '?'}
                    </span>
                    <span className="user-name">{user?.username}</span>
                    <motion.span
                      animate={{ rotate: userMenuOpen ? 180 : 0 }}
                      transition={{ duration: 0.25 }}
                      style={{ display: 'inline-flex' }}
                    >
                      <ChevronDown size={13} className="user-chevron" />
                    </motion.span>
                  </motion.button>

                  <AnimatePresence>
                    {userMenuOpen && (
                      <motion.div
                        className="user-dropdown"
                        initial={{ opacity: 0, y: -10, scale: 0.96 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -10, scale: 0.96 }}
                        transition={{ duration: 0.22, ease: 'easeOut' }}
                      >
                        <div className="user-dropdown-header">
                          <span className="user-dropdown-name">
                            {user?.username}
                          </span>
                          <span className="user-dropdown-email">
                            {user?.email}
                          </span>
                          <span className="user-dropdown-role">
                            {user?.role}
                          </span>
                        </div>

                        <Link to={getDashboardLink()} className="dropdown-item">
                          <LayoutDashboard size={15} />
                          <span>Dashboard</span>
                        </Link>

                        {user?.role === 'customer' && (
                          <>
                            <Link
                              to="/customer/orders"
                              className="dropdown-item"
                            >
                              <Package size={15} />
                              <span>My Pre-Orders</span>
                            </Link>
                            <Link
                              to="/customer/favorites"
                              className="dropdown-item"
                            >
                              <Heart size={15} />
                              <span>Saved Favorites</span>
                            </Link>
                          </>
                        )}

                        {user?.role !== 'admin' && (
                          <Link
                            to={`${getDashboardLink()}/profile`}
                            className="dropdown-item"
                          >
                            <User size={15} />
                            <span>Profile</span>
                          </Link>
                        )}

                        <div className="dropdown-divider" />

                        <button
                          onClick={handleLogout}
                          className="dropdown-item logout"
                        >
                          <LogOut size={15} />
                          <span>Sign Out</span>
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </>
            ) : (
              <div className="auth-actions">
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.7 }}
                  whileHover={{ y: -2 }}
                >
                  <Link to="/login" className="btn-nav btn-outline">
                    Sign In
                  </Link>
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.8 }}
                  whileHover={{ y: -2 }}
                >
                  <Link to="/register" className="btn-nav btn-primary">
                    Register
                  </Link>
                </motion.div>
              </div>
            )}

            {/* Mobile toggle */}
            <motion.button
              type="button"
              className="mobile-toggle"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Toggle navigation"
              aria-expanded={mobileOpen}
              whileTap={{ scale: 0.9 }}
            >
              <AnimatePresence mode="wait">
                {mobileOpen ? (
                  <motion.span
                    key="close"
                    initial={{ rotate: -90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: 90, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    style={{ display: 'inline-flex' }}
                  >
                    <X size={20} />
                  </motion.span>
                ) : (
                  <motion.span
                    key="menu"
                    initial={{ rotate: 90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: -90, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    style={{ display: 'inline-flex' }}
                  >
                    <Menu size={20} />
                  </motion.span>
                )}
              </AnimatePresence>
            </motion.button>
          </motion.div>
        </div>
      </motion.nav>

      {/* ============================================================
          MOBILE DRAWER + BACKDROP — RENDERED OUTSIDE NAVBAR
      ============================================================ */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              className="mobile-backdrop-blur"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.28 }}
              onClick={() => setMobileOpen(false)}
            />

            <motion.aside
              className="mobile-drawer"
              variants={drawerVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              {/* Drawer header */}
              <div className="mobile-drawer-head">
                <Link
                  to="/"
                  className="mobile-drawer-brand"
                  onClick={() => setMobileOpen(false)}
                >
                  <span className="mobile-drawer-brand-mark">
                    <Logo size={34} />
                  </span>
                  <span className="mobile-drawer-brand-text">
                    <span className="mobile-drawer-brand-name">
                      <span className="brand-name-primary">Market</span>
                      <span className="brand-name-accent">Link</span>
                    </span>
                    <span className="mobile-drawer-brand-tag">
                      <Sprout size={10} />
                      Farm Fresh Marketplace
                    </span>
                  </span>
                </Link>

                <button
                  type="button"
                  className="mobile-drawer-close"
                  onClick={() => setMobileOpen(false)}
                  aria-label="Close menu"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Drawer nav */}
              <motion.nav
                className="mobile-drawer-nav"
                variants={drawerListVariants}
                initial="hidden"
                animate="visible"
              >
                {NAV_ITEMS.map((item) => (
                  <motion.div key={item.label} variants={drawerItemVariants}>
                    <NavLink
                      to={item.to}
                      end={item.end}
                      className={({ isActive }) =>
                        `mobile-drawer-link ${isActive ? 'active' : ''}`
                      }
                      onClick={() => setMobileOpen(false)}
                    >
                      <span className="mobile-drawer-link-label">
                        {item.label}
                      </span>
                      <ArrowRight size={14} className="mobile-drawer-link-arrow" />
                    </NavLink>
                  </motion.div>
                ))}
              </motion.nav>

              {/* Drawer footer: auth buttons */}
              {!isAuthenticated && (
                <motion.div
                  className="mobile-drawer-foot"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.35, duration: 0.4 }}
                >
                  <Link
                    to="/login"
                    className="mobile-drawer-btn mobile-drawer-btn-ghost"
                    onClick={() => setMobileOpen(false)}
                  >
                    Sign In
                  </Link>
                  <Link
                    to="/register"
                    className="mobile-drawer-btn mobile-drawer-btn-solid"
                    onClick={() => setMobileOpen(false)}
                  >
                    Get Started
                    <ArrowRight size={14} />
                  </Link>
                </motion.div>
              )}
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;