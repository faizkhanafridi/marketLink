import React, { useState, useEffect } from 'react';
import Navbar from '../../components/common/Navbar';
import Footer from '../../components/common/Footer';
import AdminSidebar from '../../components/admin/AdminSidebar';
import Loader from '../../components/common/Loader';
import EmptyState from '../../components/common/EmptyState';
import { marketApi } from '../../api';
import { toast } from 'react-toastify';
import '../../styles/dashboard.css';
import '../../styles/forms.css';

const AdminMarkets = () => {
  const [markets, setMarkets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingMarket, setEditingMarket] = useState(null);
  const [formData, setFormData] = useState({
    market_name: '',
    address: '',
    latitude: '',
    longitude: '',
    operating_days: '',
    timings: '',
    map_provider: 'openstreetmap',
  });

  const fetchMarkets = async () => {
    try {
      const data = await marketApi.getAll();
      setMarkets(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching markets:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMarkets();
  }, []);

  const resetForm = () => {
    setFormData({
      market_name: '',
      address: '',
      latitude: '',
      longitude: '',
      operating_days: '',
      timings: '',
      map_provider: 'openstreetmap',
    });
    setEditingMarket(null);
    setShowForm(false);
  };

  const handleEdit = (market) => {
    setFormData({
      market_name: market.market_name || '',
      address: market.address || '',
      latitude: market.latitude || '',
      longitude: market.longitude || '',
      operating_days: market.operating_days || '',
      timings: market.timings || '',
      map_provider: market.map_provider || 'openstreetmap',
    });
    setEditingMarket(market);
    setShowForm(true);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...formData,
        latitude: formData.latitude ? parseFloat(formData.latitude) : null,
        longitude: formData.longitude ? parseFloat(formData.longitude) : null,
      };

      if (editingMarket) {
        await marketApi.update(editingMarket.market_id, payload);
        toast.success('Market updated');
      } else {
        await marketApi.create(payload);
        toast.success('Market created');
      }
      resetForm();
      fetchMarkets();
    } catch (error) {
      const errors = error.response?.data?.errors;
      if (errors) {
        Object.values(errors).flat().forEach((msg) => toast.error(msg));
      } else {
        toast.error('Failed to save market');
      }
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this market?')) return;
    try {
      await marketApi.delete(id);
      toast.success('Market deleted');
      fetchMarkets();
    } catch (error) {
      toast.error('Failed to delete market');
    }
  };

  return (
    <div className="dashboard-page">
      <Navbar />
      <div className="dashboard-layout">
        <AdminSidebar />
        <main className="dashboard-main">
          <div className="dashboard-header-row">
            <div>
              <h1 className="dashboard-title">Manage Markets</h1>
              <p className="dashboard-subtitle">Add, edit, or remove farmers markets</p>
            </div>
            <button className="btn btn-primary" onClick={() => { resetForm(); setShowForm(true); }}>
              <i className="fas fa-plus"></i> Add Market
            </button>
          </div>

          {showForm && (
            <div className="dashboard-card">
              <div className="card-header-row">
                <h3 className="card-title">{editingMarket ? 'Edit Market' : 'Add New Market'}</h3>
                <button className="btn-close-sm" onClick={resetForm}>
                  <i className="fas fa-times"></i>
                </button>
              </div>
              <form onSubmit={handleSubmit} className="product-form">
                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Market Name *</label>
                    <input
                      type="text"
                      name="market_name"
                      className="form-control"
                      value={formData.market_name}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Map Provider</label>
                    <select
                      name="map_provider"
                      className="form-control"
                      value={formData.map_provider}
                      onChange={handleChange}
                    >
                      <option value="openstreetmap">OpenStreetMap</option>
                      <option value="google">Google Maps</option>
                    </select>
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Address *</label>
                  <input
                    type="text"
                    name="address"
                    className="form-control"
                    value={formData.address}
                    onChange={handleChange}
                    required
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

                <div className="form-row">
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
                  <div className="form-group">
                    <label className="form-label">Timings</label>
                    <input
                      type="text"
                      name="timings"
                      className="form-control"
                      placeholder="e.g., 7:00 AM - 1:00 PM"
                      value={formData.timings}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <div className="form-actions">
                  <button type="button" className="btn btn-outline" onClick={resetForm}>
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary">
                    {editingMarket ? 'Update' : 'Create'}
                  </button>
                </div>
              </form>
            </div>
          )}

          {loading ? (
            <Loader message="Loading markets..." />
          ) : markets.length === 0 ? (
            <EmptyState
              icon="store"
              title="No Markets Yet"
              message="Add your first market to get started."
              actionText="Add Market"
              onAction={() => setShowForm(true)}
            />
          ) : (
            <div className="dashboard-card">
              <div className="table-responsive">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Market Name</th>
                      <th>Address</th>
                      <th>Operating Days</th>
                      <th>Timings</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {markets.map((m) => (
                      <tr key={m.market_id}>
                        <td>{m.market_name}</td>
                        <td>{m.address}</td>
                        <td>{m.operating_days || '-'}</td>
                        <td>{m.timings || '-'}</td>
                        <td>
                          <div className="table-actions">
                            <button className="action-btn edit" onClick={() => handleEdit(m)} title="Edit">
                              <i className="fas fa-edit"></i>
                            </button>
                            <button className="action-btn delete" onClick={() => handleDelete(m.market_id)} title="Delete">
                              <i className="fas fa-trash"></i>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </main>
      </div>
      
    </div>
  );
};

export default AdminMarkets;