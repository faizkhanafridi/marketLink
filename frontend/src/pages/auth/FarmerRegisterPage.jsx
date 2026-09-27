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
      toast.success('Registration successful! Your account is pending approval.');
      navigate('/farmer', { replace: true });
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
            <span className="auth-eyebrow">Farmer Registration</span>
            <h1 className="auth-heading">
              Become a
              <span className="auth-heading-accent"> MarketLink </span>
              grower
            </h1>
            <p className="auth-lede">
              Publish your weekly stock, manage pre-orders, and reach
              customers in your community.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="auth-form">

            {/* -------- Section: Account -------- */}
            <h3 className="auth-section-title">Account Information</h3>

            <div className="auth-grid-2">

              <div className="auth-field">
                <label className="auth-label" htmlFor="fr-username">
                  Username <span className="auth-required">*</span>
                </label>
                <div className="auth-input-wrap">
                  <User size={16} className="auth-input-icon" />
                  <input
                    id="fr-username"
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
                <label className="auth-label" htmlFor="fr-email">
                  Email Address <span className="auth-required">*</span>
                </label>
                <div className="auth-input-wrap">
                  <Mail size={16} className="auth-input-icon" />
                  <input
                    id="fr-email"
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
                <label className="auth-label" htmlFor="fr-password">
                  Password <span className="auth-required">*</span>
                </label>
                <div className="auth-input-wrap">
                  <Lock size={16} className="auth-input-icon" />
                  <input
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
                <label className="auth-label" htmlFor="fr-password-confirm">
                  Confirm Password <span className="auth-required">*</span>
                </label>
                <div className="auth-input-wrap">
                  <Lock size={16} className="auth-input-icon" />
                  <input
                    id="fr-password-confirm"
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
                <label className="auth-label" htmlFor="fr-phone">
                  Contact Number
                </label>
                <div className="auth-input-wrap">
                  <Phone size={16} className="auth-input-icon" />
                  <input
                    id="fr-phone"
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
                <label className="auth-label" htmlFor="fr-address">
                  Address
                </label>
                <div className="auth-input-wrap">
                  <MapPin size={16} className="auth-input-icon" />
                  <input
                    id="fr-address"
                    type="text"
                    name="address"
                    className="auth-input"
                    placeholder="Your farm address"
                    value={formData.address}
                    onChange={handleChange}
                    autoComplete="street-address"
                  />
                </div>
              </div>

            </div>

            {/* -------- Section: Farm -------- */}
            <h3 className="auth-section-title">Farm Information</h3>

            <div className="auth-grid-2">

              <div className="auth-field">
                <label className="auth-label" htmlFor="fr-stall">
                  Stall / Business Name <span className="auth-required">*</span>
                </label>
                <div className="auth-input-wrap">
                  <Store size={16} className="auth-input-icon" />
                  <input
                    id="fr-stall"
                    type="text"
                    name="stall_name"
                    className="auth-input"
                    placeholder="e.g. Green Valley Farms"
                    value={formData.stall_name}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="auth-field">
                <label className="auth-label" htmlFor="fr-contact-person">
                  Contact Person <span className="auth-required">*</span>
                </label>
                <div className="auth-input-wrap">
                  <Contact2 size={16} className="auth-input-icon" />
                  <input
                    id="fr-contact-person"
                    type="text"
                    name="contact_person"
                    className="auth-input"
                    placeholder="Full name of primary contact"
                    value={formData.contact_person}
                    onChange={handleChange}
                    required
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
                'Registering...'
              ) : (
                <>
                  Register as Farmer
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
          </div>

        </div>

        {/* Right panel */}
        <aside className="auth-panel auth-panel-aside">
          <div className="auth-aside-inner">

            <div className="auth-aside-icon">
              <Tractor size={26} strokeWidth={1.6} />
            </div>

            <h2 className="auth-aside-title">
              Grow Your Farm,
              <br />
              One Pre-Order at a Time
            </h2>

            <p className="auth-aside-text">
              MarketLink gives you a stallfront online — publish stock,
              manage pickups, and meet customers who value what you grow.
            </p>

            <ul className="auth-feature-list">
              <li>
                <CheckCircle2 size={16} />
                <span>Free stallfront on the platform</span>
              </li>
              <li>
                <CheckCircle2 size={16} />
                <span>Weekly stock & pricing management</span>
              </li>
              <li>
                <CheckCircle2 size={16} />
                <span>Pre-orders with pickup scheduling</span>
              </li>
            </ul>

          </div>
        </aside>

      </div>
    </div>
  );
};

export default FarmerRegisterPage;