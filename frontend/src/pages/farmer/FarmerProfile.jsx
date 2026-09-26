import React, { useState, useEffect } from 'react';
import Navbar from '../../components/common/Navbar';
import Footer from '../../components/common/Footer';
import FarmerSidebar from '../../components/farmer/FarmerSidebar';
import MapView from '../../components/common/MapView';
import { farmerApi, marketApi } from '../../api';
import { useAuth } from '../../hooks/useAuth';
import { toast } from 'react-toastify';
import '../../styles/dashboard.css';
import '../../styles/forms.css';

const FarmerProfile = () => {
  const { user, updateUser } = useAuth();
  const [markets, setMarkets] = useState([]);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    stall_name: '',
    contact_person: '',
    description: '',
    market_id: '',
    operating_days: '',
    pickup_window: '',
    address: '',
    latitude: '',
    longitude: '',
    order_cutoff_time: '',
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const marketsData = await marketApi.getAll();
        setMarkets(Array.isArray(marketsData) ? marketsData : []);
      } catch (error) {
        console.error('Error fetching markets:', error);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (user?.farmer_profile) {
      const p = user.farmer_profile;
      setFormData({
        stall_name: p.stall_name || '',
        contact_person: p.contact_person || '',
        description: p.description || '',
        market_id: p.market_id || '',
        operating_days: p.operating_days || '',
        pickup_window: p.pickup_window || '',
        address: p.address || '',
        latitude: p.latitude || '',
        longitude: p.longitude || '',
        order_cutoff_time: p.order_cutoff_time || '',
      });
    }
  }, [user]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await farmerApi.updateProfile({
        ...formData,
        market_id: formData.market_id ? parseInt(formData.market_id, 10) : null,
        latitude: formData.latitude ? parseFloat(formData.latitude) : null,
        longitude: formData.longitude ? parseFloat(formData.longitude) : null,
      });
      toast.success('Profile updated successfully');
      updateUser({ ...user, farmer_profile: res.profile });
    } catch (error) {
      const errors = error.response?.data?.errors;
      if (errors) {
        Object.values(errors).flat().forEach((msg) => toast.error(msg));
      } else {
        toast.error('Failed to update profile');
      }
    } finally {
      setSaving(false);
    }
  };

  const hasLocation = formData.latitude && formData.longitude;

  return (
    <div className="dashboard-page">
      <Navbar />
      <div className="dashboard-layout">
        <FarmerSidebar />
        <main className="dashboard-main">
          <div className="dashboard-header">
            <h1 className="dashboard-title">Farm Profile</h1>
            <p className="dashboard-subtitle">Manage your farm details and location</p>
          </div>

          <div className="profile-layout-farmer">
            <form onSubmit={handleSubmit} className="dashboard-card">
              <h3 className="card-title">Basic Information</h3>

              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Stall / Business Name</label>
                  <input
                    type="text"
                    name="stall_name"
                    className="form-control"
                    value={formData.stall_name}
                    onChange={handleChange}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Contact Person</label>
                  <input
                    type="text"
                    name="contact_person"
                    className="form-control"
                    value={formData.contact_person}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Description</label>
                <textarea
                  name="description"
                  className="form-control"
                  rows="3"
                  value={formData.description}
                  onChange={handleChange}
                ></textarea>
              </div>

              <h3 className="card-title">Market & Operations</h3>

              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Market</label>
                  <select
                    name="market_id"
                    className="form-control"
                    value={formData.market_id}
                    onChange={handleChange}
                  >
                    <option value="">Select market</option>
                    {markets.map((m) => (
                      <option key={m.market_id} value={m.market_id}>{m.market_name}</option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Operating Days</label>
                  <input
                    type="text"
                    name="operating_days"
                    className="form-control"
                    placeholder="e.g., Saturday, Sunday"
                    value={formData.operating_days}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Pickup Window</label>
                  <input
                    type="text"
                    name="pickup_window"
                    className="form-control"
                    placeholder="e.g., 8:00 AM - 12:00 PM"
                    value={formData.pickup_window}
                    onChange={handleChange}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Order Cutoff Time</label>
                  <input
                    type="text"
                    name="order_cutoff_time"
                    className="form-control"
                    placeholder="e.g., 6:00 PM Friday"
                    value={formData.order_cutoff_time}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <h3 className="card-title">Location</h3>

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

              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Latitude</label>
                  <input
                    type="number"
                    step="any"
                    name="latitude"
                    className="form-control"
                    value={formData.latitude}
                    onChange={handleChange}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Longitude</label>
                  <input
                    type="number"
                    step="any"
                    name="longitude"
                    className="form-control"
                    value={formData.longitude}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <button type="submit" className="btn btn-primary" disabled={saving}>
                {saving ? 'Saving...' : 'Save Profile'}
              </button>
            </form>

            <div className="profile-map-column">
              <div className="dashboard-card">
                <h3 className="card-title">Location Preview</h3>
                {hasLocation ? (
                  <MapView
                    latitude={parseFloat(formData.latitude)}
                    longitude={parseFloat(formData.longitude)}
                    height="350px"
                    zoom={15}
                  />
                ) : (
                  <div className="map-placeholder">
                    <i className="fas fa-map-marked-alt"></i>
                    <p>Enter latitude and longitude to preview your location</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </main>
      </div>
      <Footer />
    </div>
  );
};

export default FarmerProfile;