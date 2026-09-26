import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../../components/common/Navbar';
import Footer from '../../components/common/Footer';
import AdminSidebar from '../../components/admin/AdminSidebar';
import Loader from '../../components/common/Loader';
import { adminApi } from '../../api';
import { formatCurrency } from '../../utils/formatters';
import '../../styles/dashboard.css';

const AdminDashboard = () => {
  const [data, setData] = useState(null);
  const [reports, setReports] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [dashData, reportsData] = await Promise.all([
          adminApi.getDashboard(),
          adminApi.getReports().catch(() => null),
        ]);
        setData(dashData);
        setReports(reportsData);
      } catch (error) {
        console.error('Error fetching admin dashboard:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="dashboard-page">
      <Navbar />
      <div className="dashboard-layout">
        <AdminSidebar />
        <main className="dashboard-main">
          <div className="dashboard-header">
            <h1 className="dashboard-title">Admin Dashboard</h1>
            <p className="dashboard-subtitle">Platform overview and key metrics</p>
          </div>

          {loading ? (
            <Loader message="Loading dashboard..." />
          ) : data ? (
            <>
              <div className="stats-grid">
                <div className="stat-card">
                  <div className="stat-icon green"><i className="fas fa-tractor"></i></div>
                  <div className="stat-content">
                    <span className="stat-value">{data.total_farmers}</span>
                    <span className="stat-label">Total Farmers</span>
                  </div>
                </div>
                <div className="stat-card">
                  <div className="stat-icon blue"><i className="fas fa-users"></i></div>
                  <div className="stat-content">
                    <span className="stat-value">{data.total_customers}</span>
                    <span className="stat-label">Total Customers</span>
                  </div>
                </div>
                <div className="stat-card">
                  <div className="stat-icon orange"><i className="fas fa-shopping-bag"></i></div>
                  <div className="stat-content">
                    <span className="stat-value">{data.total_orders}</span>
                    <span className="stat-label">Total Orders</span>
                  </div>
                </div>
                <div className="stat-card">
                  <div className="stat-icon purple"><i className="fas fa-dollar-sign"></i></div>
                  <div className="stat-content">
                    <span className="stat-value">{formatCurrency(data.total_revenue)}</span>
                    <span className="stat-label">Total Revenue</span>
                  </div>
                </div>
              </div>

              {data.pending_farmers > 0 && (
                <div className="alert-banner alert-warning">
                  <i className="fas fa-exclamation-triangle"></i>
                  {data.pending_farmers} farmer registration(s) pending approval.
                  <Link to="/admin/users?role=farmer"> Review Now</Link>
                </div>
              )}

              {reports && (
                <div className="detail-grid-two">
                  <div className="dashboard-card">
                    <h3 className="card-title">Revenue by Status</h3>
                    <div className="table-responsive">
                      <table className="data-table">
                        <thead>
                          <tr>
                            <th>Status</th>
                            <th>Revenue</th>
                          </tr>
                        </thead>
                        <tbody>
                          {reports.revenue_by_status?.map((row, idx) => (
                            <tr key={idx}>
                              <td>
                                <span className={`status-badge status-${row.order_status}`}>
                                  {row.order_status?.replace(/_/g, ' ')}
                                </span>
                              </td>
                              <td>{formatCurrency(row.revenue)}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  <div className="dashboard-card">
                    <h3 className="card-title">Most Active Farmers</h3>
                    <div className="table-responsive">
                      <table className="data-table">
                        <thead>
                          <tr>
                            <th>Farmer</th>
                            <th>Orders</th>
                          </tr>
                        </thead>
                        <tbody>
                          {reports.most_active_farmers?.map((f) => (
                            <tr key={f.farmer_id}>
                              <td>{f.stall_name}</td>
                              <td>{f.orders_count}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}
            </>
          ) : (
            <Loader message="Unable to load dashboard" />
          )}
        </main>
      </div>
    
    </div>
  );
};

export default AdminDashboard;