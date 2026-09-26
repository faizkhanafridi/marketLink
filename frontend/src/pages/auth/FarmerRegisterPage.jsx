import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { toast } from 'react-toastify';
import Navbar from '../../components/common/Navbar';
import '../../styles/forms.css';

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
      const data = await register({ ...formData, role: 'farmer' });
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
      <div className="auth-container">
        <div className="auth-card auth-card-wide">
          <div className="auth-header">
            <h1 className="auth-title">Register as a Farmer</h1>
            <p className="auth-subtitle">
              Join MarketLink and reach more customers with your fresh produce
            </p>
          </div>

          <form onSubmit={handleSubmit} className="auth-form">
            <h3 className="form-section-title">Account Information</h3>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Username *</label>
                <input
                  type="text"
                  name="username"
                  className="form-control"
                  value={formData.username}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label">Email Address *</label>
                <input
                  type="email"
                  name="email"
                  className="form-control"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Password *</label>
                <input
                  type="password"
                  name="password"
                  className="form-control"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  minLength={6}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Confirm Password *</label>
                <input
                  type="password"
                  name="password_confirmation"
                  className="form-control"
                  value={formData.password_confirmation}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Contact Number</label>
                <input
                  type="text"
                  name="contact_number"
                  className="form-control"
                  value={formData.contact_number}
                  onChange={handleChange}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Address</label>
                <input
                  type="text"
                  name="address"
                  className="form-control"
                  value={formData.address}
                  onChange={handleChange}
                />
              </div>
            </div>

            <h3 className="form-section-title">Farm Information</h3>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Stall / Business Name *</label>
                <input
                  type="text"
                  name="stall_name"
                  className="form-control"
                  value={formData.stall_name}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label">Contact Person *</label>
                <input
                  type="text"
                  name="contact_person"
                  className="form-control"
                  value={formData.contact_person}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              className="btn btn-primary btn-block btn-lg"
              disabled={loading}
            >
              {loading ? 'Registering...' : 'Register as Farmer'}
            </button>
          </form>

          <div className="auth-footer">
            <p>Already have an account? <Link to="/login">Login</Link></p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FarmerRegisterPage;