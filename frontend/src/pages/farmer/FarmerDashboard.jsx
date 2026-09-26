import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../../components/common/Navbar';
import Footer from '../../components/common/Footer';
import FarmerSidebar from '../../components/farmer/FarmerSidebar';
import Loader from '../../components/common/Loader';
import EmptyState from '../../components/common/EmptyState';
import { farmerApi } from '../../api';
import { useAuth } from '../../hooks/useAuth';
import { formatCurrency, formatDate } from '../../utils/formatters';
import '../../styles/dashboard.css';

const FarmerDashboard = () => {
  const { user, isFarmer } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await farmerApi.getDashboard();
        setData(res);
      } catch (error) {
        console.error('Error fetching farmer dashboard:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, []);

  if (!isFarmer) {
    return (
      <div className="dashboard-page">
        <Navbar />
        <div className="container" style={{ padding: '100px 20px' }}>
          <EmptyState
            icon="lock"
            title="Farmer Access Only"
            message="You need a farmer account to access this dashboard."
          />
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="dashboard-page">
      <Navbar />
      <div className="dashboard-layout">
        <FarmerSidebar />
        <main className="dashboard-main">
          <div className="dashboard-header">
            <h1 className="dashboard-title">
              Welcome, {user?.farmer_profile?.stall_name || user?.username}
            </h1>
            <p className="dashboard-subtitle">Your farm business overview</p>
          </div>

          {!user?.is_approved && (
            <div className="alert-banner alert-warning">
              <i className="fas fa-exclamation-triangle"></i>
              Your account is pending approval. You'll be able to list products once approved.
            </div>
          )}

          {loading ? (
            <Loader message="Loading dashboard..." />
          ) : data ? (
            <>
              <div className="stats-grid">
                <div className="stat-card">
                  <div className="stat-icon blue"><i className="fas fa-shopping-bag"></i></div>
                  <div className="stat-content">
                    <span className="stat-value">{data.total_orders}</span>
                    <span className="stat-label">Total Orders</span>
                  </div>
                </div>
                <div className="stat-card">
                  <div className="stat-icon orange"><i className="fas fa-clock"></i></div>
                  <div className="stat-content">
                    <span className="stat-value">{data.pending_orders}</span>
                    <span className="stat-label">Pending Orders</span>
                  </div>
                </div>
                <div className="stat-card">
                  <div className="stat-icon green"><i className="fas fa-check-circle"></i></div>
                  <div className="stat-content">
                    <span className="stat-value">{data.completed_orders}</span>
                    <span className="stat-label">Completed</span>
                  </div>
                </div>
                <div className="stat-card">
                  <div className="stat-icon purple"><i className="fas fa-dollar-sign"></i></div>
                  <div className="stat-content">
                    <span className="stat-value">{formatCurrency(data.revenue_summary)}</span>
                    <span className="stat-label">Revenue</span>
                  </div>
                </div>
              </div>

              <div className="dashboard-card">
                <div className="card-header-row">
                  <h2 className="card-title">Best Selling Products</h2>
                  <Link to="/farmer/products" className="card-link">Manage Products</Link>
                </div>
                {data.best_selling?.length === 0 ? (
                  <EmptyState
                    icon="box-open"
                    title="No Products Yet"
                    message="Add your first product to start selling."
                    actionText="Add Product"
                    onAction={() => window.location.href = '/farmer/products'}
                  />
                ) : (
                  <div className="table-responsive">
                    <table className="data-table">
                      <thead>
                        <tr>
                          <th>Product</th>
                          <th>Price</th>
                          <th>Stock</th>
                          <th>Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {data.best_selling?.map((product) => (
                          <tr key={product.product_id}>
                            <td>{product.name}</td>
                            <td>{formatCurrency(product.price)}</td>
                            <td>{product.stock_quantity}</td>
                            <td>
                              <span className={`status-badge status-${product.is_available ? 'available' : 'unavailable'}`}>
                                {product.is_available ? 'Available' : 'Sold Out'}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </>
          ) : (
            <EmptyState
              icon="exclamation-circle"
              title="Unable to Load Dashboard"
              message="Please try again later."
            />
          )}
        </main>
      </div>
      <Footer />
    </div>
  );
};

export default FarmerDashboard;