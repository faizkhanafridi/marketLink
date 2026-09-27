import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
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

  return (
    <div className="auth-page">
      <Navbar />

      <div className="auth-shell">
        <div className="auth-panel auth-panel-form">

          <div className="auth-head">
            <span className="auth-eyebrow">Welcome Back</span>
            <h1 className="auth-heading">
              Sign in to your
              <span className="auth-heading-accent"> MarketLink </span>
              account
            </h1>
            <p className="auth-lede">
              Pick up right where you left off — fresh produce is waiting.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="auth-form">

            <div className="auth-field">
              <label className="auth-label" htmlFor="login-email">
                Email Address
              </label>
              <div className="auth-input-wrap">
                <Mail size={16} className="auth-input-icon" />
                <input
                  id="login-email"
                  type="email"
                  name="email"
                  className="auth-input"
                  placeholder="you@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  autoComplete="email"
                />
              </div>
            </div>

            <div className="auth-field">
              <div className="auth-label-row">
                <label className="auth-label" htmlFor="login-password">
                  Password
                </label>
                <Link to="/forgot-password" className="auth-label-link">
                  Forgot?
                </Link>
              </div>
              <div className="auth-input-wrap">
                <Lock size={16} className="auth-input-icon" />
                <input
                  id="login-password"
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  className="auth-input"
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  className="auth-input-action"
                  onClick={() => setShowPassword((s) => !s)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="auth-submit"
              disabled={loading}
            >
              {loading ? (
                'Signing in...'
              ) : (
                <>
                  Sign In
                  <ArrowRight size={16} />
                </>
              )}
            </button>

          </form>

          <div className="auth-foot">
            <p>
              New to MarketLink?{' '}
              <Link to="/register" className="auth-foot-link">
                Create an account
              </Link>
            </p>
            <p>
              Selling produce?{' '}
              <Link to="/register/farmer" className="auth-foot-link">
                Register as a farmer
              </Link>
            </p>
          </div>

        </div>

        {/* Right panel */}
        <aside className="auth-panel auth-panel-aside">
          <div className="auth-aside-inner">

            <div className="auth-aside-icon">
              <Leaf size={26} strokeWidth={1.6} />
            </div>

            <h2 className="auth-aside-title">
              Farm Fresh,
              <br />
              Just a Click Away
            </h2>

            <p className="auth-aside-text">
              Join a community of local growers and food lovers. Pre-order
              seasonal produce and pick it up at the market — fresh,
              personal, and fair.
            </p>

            <ul className="auth-feature-list">
              <li>
                <CheckCircle2 size={16} />
                <span>Browse verified local markets</span>
              </li>
              <li>
                <CheckCircle2 size={16} />
                <span>Pre-order your weekly basket</span>
              </li>
              <li>
                <CheckCircle2 size={16} />
                <span>Pay at pickup — zero pre-payment</span>
              </li>
            </ul>

          </div>
        </aside>
      </div>
    </div>
  );
};

export default LoginPage;