import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  User,
  Mail,
  Lock,
  Eye,
  EyeOff,
  Phone,
  MapPin,
  ArrowRight,
  CheckCircle2,
  Sprout,
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { toast } from 'react-toastify';
import Navbar from '../../components/common/Navbar';
import '../../styles/forms.css';
import '../../styles/auth.css';

const RegisterPage = () => {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    password_confirmation: '',
    contact_number: '',
    address: '',
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
      const data = await register({ ...formData, role: 'customer' });
      toast.success(`Welcome to MarketLink, ${data.user.username}!`);
      navigate('/customer', { replace: true });
    } catch (error) {
      const errors = error.response?.data?.errors;
      if (errors) {
        Object.values(errors).flat().forEach((msg) => toast.error(msg));
      } else {
        toast.error(error.response?.data?.message || 'Registration failed');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <Navbar />

      <div className="auth-shell auth-shell-wide">

        <div className="auth-panel auth-panel-form auth-panel-form-wide">

          <div className="auth-head">
            <span className="auth-eyebrow">Create Account</span>
            <h1 className="auth-heading">
              Join MarketLink as a
              <span className="auth-heading-accent"> customer</span>
            </h1>
            <p className="auth-lede">
              A few details and you're ready to start pre-ordering from
              local farmers.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="auth-form">

            <div className="auth-grid-2">

              <div className="auth-field">
                <label className="auth-label" htmlFor="reg-username">
                  Username
                </label>
                <div className="auth-input-wrap">
                  <User size={16} className="auth-input-icon" />
                  <input
                    id="reg-username"
                    type="text"
                    name="username"
                    className="auth-input"
                    placeholder="Choose a username"
                    value={formData.username}
                    onChange={handleChange}
                    required
                    autoComplete="username"
                  />
                </div>
              </div>

              <div className="auth-field">
                <label className="auth-label" htmlFor="reg-email">
                  Email Address
                </label>
                <div className="auth-input-wrap">
                  <Mail size={16} className="auth-input-icon" />
                  <input
                    id="reg-email"
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

            </div>

            <div className="auth-grid-2">

              <div className="auth-field">
                <label className="auth-label" htmlFor="reg-password">
                  Password
                </label>
                <div className="auth-input-wrap">
                  <Lock size={16} className="auth-input-icon" />
                  <input
                    id="reg-password"
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    className="auth-input"
                    placeholder="Min 6 characters"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    minLength={6}
                    autoComplete="new-password"
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

              <div className="auth-field">
                <label className="auth-label" htmlFor="reg-password-confirm">
                  Confirm Password
                </label>
                <div className="auth-input-wrap">
                  <Lock size={16} className="auth-input-icon" />
                  <input
                    id="reg-password-confirm"
                    type="password"
                    name="password_confirmation"
                    className="auth-input"
                    placeholder="Re-enter password"
                    value={formData.password_confirmation}
                    onChange={handleChange}
                    required
                    autoComplete="new-password"
                  />
                </div>
              </div>

            </div>

            <div className="auth-grid-2">

              <div className="auth-field">
                <label className="auth-label" htmlFor="reg-phone">
                  Contact Number
                </label>
                <div className="auth-input-wrap">
                  <Phone size={16} className="auth-input-icon" />
                  <input
                    id="reg-phone"
                    type="text"
                    name="contact_number"
                    className="auth-input"
                    placeholder="+1 555 123 4567"
                    value={formData.contact_number}
                    onChange={handleChange}
                    autoComplete="tel"
                  />
                </div>
              </div>

              <div className="auth-field">
                <label className="auth-label" htmlFor="reg-address">
                  Address
                </label>
                <div className="auth-input-wrap">
                  <MapPin size={16} className="auth-input-icon" />
                  <input
                    id="reg-address"
                    type="text"
                    name="address"
                    className="auth-input"
                    placeholder="Your delivery address"
                    value={formData.address}
                    onChange={handleChange}
                    autoComplete="street-address"
                  />
                </div>
              </div>

            </div>

            <button
              type="submit"
              className="auth-submit"
              disabled={loading}
            >
              {loading ? (
                'Creating account...'
              ) : (
                <>
                  Create Account
                  <ArrowRight size={16} />
                </>
              )}
            </button>

          </form>

          <div className="auth-foot">
            <p>
              Already have an account?{' '}
              <Link to="/login" className="auth-foot-link">
                Sign in
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
              <Sprout size={26} strokeWidth={1.6} />
            </div>

            <h2 className="auth-aside-title">
              Your Basket,
              <br />
              Your Neighborhood
            </h2>

            <p className="auth-aside-text">
              Order seasonal fruits, vegetables, honey, baked goods and
              more — directly from growers near you.
            </p>

            <ul className="auth-feature-list">
              <li>
                <CheckCircle2 size={16} />
                <span>Free to join, no fees</span>
              </li>
              <li>
                <CheckCircle2 size={16} />
                <span>Reserve ahead of market day</span>
              </li>
              <li>
                <CheckCircle2 size={16} />
                <span>Pay at stall, no pre-payment</span>
              </li>
            </ul>

          </div>
        </aside>

      </div>
    </div>
  );
};

export default RegisterPage;