import React, { useState } from 'react';
import Navbar from '../../components/common/Navbar';
import Footer from '../../components/common/Footer';
import CustomerSidebar from '../../components/customer/CustomerSidebar';
import { useAuth } from '../../hooks/useAuth';
import { toast } from 'react-toastify';
import '../../styles/dashboard.css';
import '../../styles/forms.css';

const ProfilePage = () => {
  const { user, updateUser } = useAuth();
  const [formData, setFormData] = useState({
    username: user?.username || '',
    email: user?.email || '',
    contact_number: user?.contact_number || '',
    address: user?.address || '',
  });
  const [saving, setSaving] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    // Note: Backend doesn't have a specific update profile endpoint for customers
    // This is a placeholder - you'd need to add it to your backend
    setTimeout(() => {
      updateUser({ ...user, ...formData });
      toast.success('Profile updated successfully');
      setSaving(false);
    }, 800);
  };

  return (
    <div className="dashboard-page">
      <Navbar />
      <div className="dashboard-layout">
        <CustomerSidebar />
        <main className="dashboard-main">
          <div className="dashboard-header">
              <p className="dashboard-subtitle text-dark fw-bold ">My Profile</p>
            <p className="dashboard-subtitle">Manage your account information</p>
          </div>

          <div className="profile-layout">
            <div className="profile-avatar-card">
              <div className="profile-avatar-lg">
                {user?.username?.charAt(0).toUpperCase()}
              </div>
              <h3 className="profile-name">{user?.username}</h3>
              <span className="profile-role">Customer</span>
              <span className="profile-email">{user?.email}</span>
            </div>

            <div className="dashboard-card profile-form-card">
              <h3 className="card-title">Account Information</h3>
              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label className="form-label">Username</label>
                  <input
                    type="text"
                    name="username"
                    className="form-control"
                    value={formData.username}
                    onChange={handleChange}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Email</label>
                  <input
                    type="email"
                    name="email"
                    className="form-control"
                    value={formData.email}
                    onChange={handleChange}
                    disabled
                  />
                </div>
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
                <button type="submit" className="btn btn-primary" disabled={saving}>
                  {saving ? 'Saving...' : 'Save Changes'}
                </button>
              </form>
            </div>
          </div>
        </main>
      </div>
   
    </div>
  );
};

export default ProfilePage;