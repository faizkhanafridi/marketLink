import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  User,
  Mail,
  Lock,
  Eye,
  EyeOff,
  Phone,
  MapPin,
  Store,
  Contact2,
  ArrowRight,
  CheckCircle2,
  Tractor,
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { toast } from 'react-toastify';
import Navbar from '../../components/common/Navbar';
import '../../styles/forms.css';
import '../../styles/auth.css';

const FarmerRegisterPage = () => {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    password_confirmation: '',
    contact_number: '',
    address: '',
    stall_name: '',
    contact_person: '',
  });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.password_confirmation) {
      toast.error('Passwords do not match');
      return;
    }

    setLoading(true);
    try {
      await register({ ...formData, role: 'farmer' });
      toast.success(
        'Registration successful! Your account is pending approval.',
      );
      navigate('/farmer', { replace: true });
    } catch (error) {
      const errors = error.response?.data?.errors;
      if (errors) {
        Object.values(errors)
          .flat()
          .forEach((msg) => toast.error(msg));
      } else {
        toast.error(error.response?.data?.message || 'Registration failed');
      }
    } finally {
      setLoading(false);
    }
  };

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

  const slideLeft = {
    hidden: { opacity: 0, x: -50 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] },
    },
  };

  const slideRight = {
    hidden: { opacity: 0, x: 50 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] },
    },
  };

  const sectionTitleVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] },
    },
  };

  const featureItem = {
    hidden: { opacity: 0, x: -20 },
    visible: (i = 0) => ({
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.5,
        delay: i * 0.12,
        ease: [0.16, 1, 0.3, 1],
      },
    }),
  };

  const inputFocus = {
    scale: 1.01,
    transition: { duration: 0.2 },
  };

  return (
    <div className="auth-page">
      <Navbar />

      <div className="auth-shell auth-shell-wide">
        {/* ---------- LEFT PANEL: Form ---------- */}
        <motion.div
          className="auth-panel auth-panel-form auth-panel-form-wide"
          initial="hidden"
          animate="visible"
          variants={slideLeft}
        >
          <motion.div
            className="auth-head"
            initial="hidden"
            animate="visible"
            variants={stagger}
          >
            <motion.span variants={fadeUp} className="auth-eyebrow">
              Farmer Registration
            </motion.span>
            <motion.h1 variants={fadeUp} className="auth-heading">
              Become a
              <span className="auth-heading-accent"> MarketLink </span>
              grower
            </motion.h1>
            <motion.p variants={fadeUp} className="auth-lede">
              Publish your weekly stock, manage pre-orders, and reach
              customers in your community.
            </motion.p>
          </motion.div>

          <motion.form
            onSubmit={handleSubmit}
            className="auth-form"
            initial="hidden"
            animate="visible"
            variants={stagger}
          >
            {/* -------- Section: Account -------- */}
            <motion.h3
              className="auth-section-title"
              variants={sectionTitleVariants}
            >
              Account Information
            </motion.h3>

            {/* Row 1: Username + Email */}
            <motion.div className="auth-grid-2" variants={stagger}>
              <motion.div className="auth-field" variants={fadeUp}>
                <label className="auth-label" htmlFor="fr-username">
                  Username <span className="auth-required">*</span>
                </label>
                <div className="auth-input-wrap">
                  <User size={16} className="auth-input-icon" />
                  <motion.input
                    id="fr-username"
                    type="text"
                    name="username"
                    className="auth-input"
                    placeholder="Choose a username"
                    value={formData.username}
                    onChange={handleChange}
                    required
                    autoComplete="username"
                    whileFocus={inputFocus}
                  />
                </div>
              </motion.div>

              <motion.div className="auth-field" variants={fadeUp}>
                <label className="auth-label" htmlFor="fr-email">
                  Email Address <span className="auth-required">*</span>
                </label>
                <div className="auth-input-wrap">
                  <Mail size={16} className="auth-input-icon" />
                  <motion.input
                    id="fr-email"
                    type="email"
                    name="email"
                    className="auth-input"
                    placeholder="you@example.com"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    autoComplete="email"
                    whileFocus={inputFocus}
                  />
                </div>
              </motion.div>
            </motion.div>

            {/* Row 2: Password + Confirm */}
            <motion.div className="auth-grid-2" variants={stagger}>
              <motion.div className="auth-field" variants={fadeUp}>
                <label className="auth-label" htmlFor="fr-password">
                  Password <span className="auth-required">*</span>
                </label>
                <div className="auth-input-wrap">
                  <Lock size={16} className="auth-input-icon" />
                  <motion.input
                    id="fr-password"
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    className="auth-input"
                    placeholder="Min 6 characters"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    minLength={6}
                    autoComplete="new-password"
                    whileFocus={inputFocus}
                  />
                  <motion.button
                    type="button"
                    className="auth-input-action"
                    onClick={() => setShowPassword((s) => !s)}
                    aria-label={
                      showPassword ? 'Hide password' : 'Show password'
                    }
                    whileHover={{ scale: 1.15 }}
                    whileTap={{ scale: 0.9 }}
                    transition={{ duration: 0.2 }}
                  >
                    <AnimatePresence mode="wait" initial={false}>
                      {showPassword ? (
                        <motion.span
                          key="hide"
                          initial={{ opacity: 0, rotate: -90 }}
                          animate={{ opacity: 1, rotate: 0 }}
                          exit={{ opacity: 0, rotate: 90 }}
                          transition={{ duration: 0.2 }}
                          style={{ display: 'inline-flex' }}
                        >
                          <EyeOff size={16} />
                        </motion.span>
                      ) : (
                        <motion.span
                          key="show"
                          initial={{ opacity: 0, rotate: 90 }}
                          animate={{ opacity: 1, rotate: 0 }}
                          exit={{ opacity: 0, rotate: -90 }}
                          transition={{ duration: 0.2 }}
                          style={{ display: 'inline-flex' }}
                        >
                          <Eye size={16} />
                        </motion.span>
                      )}
                    </AnimatePresence>
                  </motion.button>
                </div>
              </motion.div>

              <motion.div className="auth-field" variants={fadeUp}>
                <label className="auth-label" htmlFor="fr-password-confirm">
                  Confirm Password <span className="auth-required">*</span>
                </label>
                <div className="auth-input-wrap">
                  <Lock size={16} className="auth-input-icon" />
                  <motion.input
                    id="fr-password-confirm"
                    type="password"
                    name="password_confirmation"
                    className="auth-input"
                    placeholder="Re-enter password"
                    value={formData.password_confirmation}
                    onChange={handleChange}
                    required
                    autoComplete="new-password"
                    whileFocus={inputFocus}
                  />
                </div>
              </motion.div>
            </motion.div>

            {/* Row 3: Phone + Address */}
            <motion.div className="auth-grid-2" variants={stagger}>
              <motion.div className="auth-field" variants={fadeUp}>
                <label className="auth-label" htmlFor="fr-phone">
                  Contact Number
                </label>
                <div className="auth-input-wrap">
                  <Phone size={16} className="auth-input-icon" />
                  <motion.input
                    id="fr-phone"
                    type="text"
                    name="contact_number"
                    className="auth-input"
                    placeholder="+1 555 123 4567"
                    value={formData.contact_number}
                    onChange={handleChange}
                    autoComplete="tel"
                    whileFocus={inputFocus}
                  />
                </div>
              </motion.div>

              <motion.div className="auth-field" variants={fadeUp}>
                <label className="auth-label" htmlFor="fr-address">
                  Address
                </label>
                <div className="auth-input-wrap">
                  <MapPin size={16} className="auth-input-icon" />
                  <motion.input
                    id="fr-address"
                    type="text"
                    name="address"
                    className="auth-input"
                    placeholder="Your farm address"
                    value={formData.address}
                    onChange={handleChange}
                    autoComplete="street-address"
                    whileFocus={inputFocus}
                  />
                </div>
              </motion.div>
            </motion.div>

            {/* -------- Section: Farm -------- */}
            <motion.h3
              className="auth-section-title"
              variants={sectionTitleVariants}
            >
              Farm Information
            </motion.h3>

            <motion.div className="auth-grid-2" variants={stagger}>
              <motion.div className="auth-field" variants={fadeUp}>
                <label className="auth-label" htmlFor="fr-stall">
                  Stall / Business Name{' '}
                  <span className="auth-required">*</span>
                </label>
                <div className="auth-input-wrap">
                  <Store size={16} className="auth-input-icon" />
                  <motion.input
                    id="fr-stall"
                    type="text"
                    name="stall_name"
                    className="auth-input"
                    placeholder="e.g. Green Valley Farms"
                    value={formData.stall_name}
                    onChange={handleChange}
                    required
                    whileFocus={inputFocus}
                  />
                </div>
              </motion.div>

              <motion.div className="auth-field" variants={fadeUp}>
                <label className="auth-label" htmlFor="fr-contact-person">
                  Contact Person <span className="auth-required">*</span>
                </label>
                <div className="auth-input-wrap">
                  <Contact2 size={16} className="auth-input-icon" />
                  <motion.input
                    id="fr-contact-person"
                    type="text"
                    name="contact_person"
                    className="auth-input"
                    placeholder="Full name of primary contact"
                    value={formData.contact_person}
                    onChange={handleChange}
                    required
                    whileFocus={inputFocus}
                  />
                </div>
              </motion.div>
            </motion.div>

            {/* Submit */}
            <motion.button
              type="submit"
              className="auth-submit"
              disabled={loading}
              variants={fadeUp}
              whileHover={!loading ? { scale: 1.03, y: -3 } : {}}
              whileTap={!loading ? { scale: 0.97 } : {}}
              transition={{ duration: 0.2 }}
            >
              {loading ? (
                <>
                  <motion.span
                    animate={{ rotate: 360 }}
                    transition={{
                      duration: 1,
                      repeat: Infinity,
                      ease: 'linear',
                    }}
                    style={{ display: 'inline-flex' }}
                  >
                    <ArrowRight size={16} />
                  </motion.span>
                  Registering...
                </>
              ) : (
                <>
                  Register as Farmer
                  <motion.span
                    whileHover={{ x: 4 }}
                    transition={{ duration: 0.2 }}
                    style={{ display: 'inline-flex' }}
                  >
                    <ArrowRight size={16} />
                  </motion.span>
                </>
              )}
            </motion.button>
          </motion.form>

          {/* Footer */}
          <motion.div
            className="auth-foot"
            initial="hidden"
            animate="visible"
            variants={stagger}
          >
            <motion.p variants={fadeUp}>
              Already have an account?{' '}
              <Link to="/login" className="auth-foot-link">
                Sign in
              </Link>
            </motion.p>
          </motion.div>
        </motion.div>

        {/* ---------- RIGHT PANEL: Aside ---------- */}
        <motion.aside
          className="auth-panel auth-panel-aside"
          initial="hidden"
          animate="visible"
          variants={slideRight}
        >
          <div className="auth-aside-inner">
            <motion.div
              className="auth-aside-icon"
              initial={{ opacity: 0, scale: 0.5, rotate: -30 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              transition={{
                duration: 0.7,
                delay: 0.3,
                type: 'spring',
                stiffness: 200,
                damping: 15,
              }}
              whileHover={{ rotate: -10, scale: 1.1 }}
            >
              <motion.div
                animate={{
                  x: [0, 4, 0, -4, 0],
                  y: [0, -3, 0, -3, 0],
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
                style={{ display: 'inline-flex' }}
              >
                <Tractor size={26} strokeWidth={1.6} />
              </motion.div>
            </motion.div>

            <motion.h2
              className="auth-aside-title"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.45 }}
            >
              Grow Your Farm,
              <br />
              One Pre-Order at a Time
            </motion.h2>

            <motion.p
              className="auth-aside-text"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.55 }}
            >
              MarketLink gives you a stallfront online — publish stock,
              manage pickups, and meet customers who value what you grow.
            </motion.p>

            <motion.ul
              className="auth-feature-list"
              initial="hidden"
              animate="visible"
              variants={stagger}
            >
              {[
                'Free stallfront on the platform',
                'Weekly stock & pricing management',
                'Pre-orders with pickup scheduling',
              ].map((text, i) => (
                <motion.li
                  key={i}
                  variants={featureItem}
                  custom={i}
                  whileHover={{ x: 5 }}
                  transition={{ duration: 0.2 }}
                >
                  <motion.span
                    initial={{ scale: 0, rotate: -90 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{
                      duration: 0.4,
                      delay: 0.8 + i * 0.12,
                      type: 'spring',
                      stiffness: 300,
                      damping: 15,
                    }}
                    whileHover={{ scale: 1.2, rotate: 10 }}
                    style={{ display: 'inline-flex' }}
                  >
                    <CheckCircle2 size={16} />
                  </motion.span>
                  <span>{text}</span>
                </motion.li>
              ))}
            </motion.ul>
          </div>
        </motion.aside>
      </div>
    </div>
  );
};

export default FarmerRegisterPage;