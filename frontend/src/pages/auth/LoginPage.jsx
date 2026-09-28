import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  CheckCircle2,
  ArrowRight,
  Leaf,
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { toast } from 'react-toastify';
import Navbar from '../../components/common/Navbar';
import '../../styles/forms.css';
import '../../styles/auth.css';

const LoginPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const from = location.state?.from?.pathname;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const data = await login(formData);
      toast.success(`Welcome back, ${data.user.username}!`);

      if (from) {
        navigate(from, { replace: true });
      } else if (data.user.role === 'farmer') {
        navigate('/farmer', { replace: true });
      } else if (data.user.role === 'admin') {
        navigate('/admin', { replace: true });
      } else {
        navigate('/customer', { replace: true });
      }
    } catch (error) {
      const message =
        error.response?.data?.message || 'Login failed. Please try again.';
      toast.error(message);
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

  return (
    <div className="auth-page">
      <Navbar />

      <div className="auth-shell">
        {/* ---------- LEFT PANEL: Form ---------- */}
        <motion.div
          className="auth-panel auth-panel-form"
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
              Welcome Back
            </motion.span>
            <motion.h1 variants={fadeUp} className="auth-heading">
              Sign in to your
              <span className="auth-heading-accent"> MarketLink </span>
              account
            </motion.h1>
            <motion.p variants={fadeUp} className="auth-lede">
              Pick up right where you left off — fresh produce is waiting.
            </motion.p>
          </motion.div>

          <motion.form
            onSubmit={handleSubmit}
            className="auth-form"
            initial="hidden"
            animate="visible"
            variants={stagger}
          >
            {/* Email */}
            <motion.div className="auth-field" variants={fadeUp}>
              <label className="auth-label" htmlFor="login-email">
                Email Address
              </label>
              <motion.div
                className="auth-input-wrap"
                whileFocus={{ scale: 1.01 }}
              >
                <Mail size={16} className="auth-input-icon" />
                <motion.input
                  id="login-email"
                  type="email"
                  name="email"
                  className="auth-input"
                  placeholder="you@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  autoComplete="email"
                  whileFocus={{
                    scale: 1.01,
                    transition: { duration: 0.2 },
                  }}
                />
              </motion.div>
            </motion.div>

            {/* Password */}
            <motion.div className="auth-field" variants={fadeUp}>
              <div className="auth-label-row">
                <label className="auth-label" htmlFor="login-password">
                  Password
                </label>
                <motion.div whileHover={{ x: 3 }} transition={{ duration: 0.2 }}>
                  <Link to="/forgot-password" className="auth-label-link">
                    Forgot?
                  </Link>
                </motion.div>
              </div>
              <motion.div
                className="auth-input-wrap"
                whileFocus={{ scale: 1.01 }}
              >
                <Lock size={16} className="auth-input-icon" />
                <motion.input
                  id="login-password"
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  className="auth-input"
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  autoComplete="current-password"
                  whileFocus={{
                    scale: 1.01,
                    transition: { duration: 0.2 },
                  }}
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
              ) : (
                <>
                  Sign In
                  <motion.span
                    whileHover={{ x: 4 }}
                    transition={{ duration: 0.2 }}
                    style={{ display: 'inline-flex' }}
                  >
                    <ArrowRight size={16} />
                  </motion.span>
                </>
              )}
              {loading && 'Signing in...'}
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
              New to MarketLink?{' '}
              <Link to="/register" className="auth-foot-link">
                Create an account
              </Link>
            </motion.p>
            <motion.p variants={fadeUp}>
              Selling produce?{' '}
              <Link to="/register/farmer" className="auth-foot-link">
                Register as a farmer
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
                animate={{ y: [0, -6, 0] }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
                style={{ display: 'inline-flex' }}
              >
                <Leaf size={26} strokeWidth={1.6} />
              </motion.div>
            </motion.div>

            <motion.h2
              className="auth-aside-title"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.45 }}
            >
              Farm Fresh,
              <br />
              Just a Click Away
            </motion.h2>

            <motion.p
              className="auth-aside-text"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.55 }}
            >
              Join a community of local growers and food lovers. Pre-order
              seasonal produce and pick it up at the market — fresh,
              personal, and fair.
            </motion.p>

            <motion.ul
              className="auth-feature-list"
              initial="hidden"
              animate="visible"
              variants={stagger}
            >
              {[
                'Browse verified local markets',
                'Pre-order your weekly basket',
                'Pay at pickup — zero pre-payment',
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

export default LoginPage;