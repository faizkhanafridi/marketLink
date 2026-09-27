import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../../components/common/Navbar';
import Footer from '../../components/common/Footer';
import AdminSidebar from '../../components/admin/AdminSidebar';
import Loader from '../../components/common/Loader';
import EmptyState from '../../components/common/EmptyState';
import { adminApi } from '../../api';
import { formatCurrency } from '../../utils/formatters';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import '../../styles/dashboard.css';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const AdminDashboard = () => {
  const [data, setData] = useState(null);
  const [reports, setReports] = useState(null);
  const [loading, setLoading] = useState(true);
  const [reportsLoading, setReportsLoading] = useState(true);

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
        setReportsLoading(false);
      }
    };
    fetchData();
  }, []);

  // Prepare chart data from reports
  const chartData = reports?.revenue_by_status
    ? {
        labels: reports.revenue_by_status.map((r) =>
          r.order_status?.replace(/_/g, ' ')
        ),
        datasets: [
          {
            label: 'Revenue',
            data: reports.revenue_by_status.map((r) => parseFloat(r.revenue)),
            backgroundColor: '#2d5016',
            borderRadius: 6,
          },
        ],
      }
    : null;

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: { display: false },
      title: { display: false },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: (value) => `$${value}`,
        },
        grid: { color: '#e8e8e8' },
      },
      x: {
        grid: { display: false },
      },
    },
  };

  // Helper for status badge class
  const getStatusBadgeClass = (status) => {
    const map = {
      pending: 'status-pending',
      confirmed: 'status-confirmed',
      processing: 'status-processing',
      shipped: 'status-shipped',
      delivered: 'status-delivered',
      cancelled: 'status-cancelled',
      paid: 'status-paid',
      completed: 'status-completed',
    };
    return map[status] || 'status-default';
  };

  return (
    <div className="dashboard-page">
      <Navbar />
      <div className="dashboard-layout">
        <AdminSidebar />
        <main className="dashboard-main">
          {/* Header */}
          <div className="dashboard-header">
            <h1 className="dashboard-title">Admin Dashboard</h1>
            <p className="dashboard-subtitle">Platform overview and key metrics</p>
          </div>

          {loading ? (
            <Loader message="Loading dashboard..." />
          ) : data ? (
            <>
              {/* Stats Cards */}
              <div className="stats-grid">
                <div className="stat-card">
                  <div className="stat-icon green">
                    <i className="fas fa-tractor"></i>
                  </div>
                  <div className="stat-content">
                    <span className="stat-value">{data.total_farmers}</span>
                    <span className="stat-label">Total Farmers</span>
                  </div>
                </div>
                <div className="stat-card">
                  <div className="stat-icon blue">
                    <i className="fas fa-users"></i>
                  </div>
                  <div className="stat-content">
                    <span className="stat-value">{data.total_customers}</span>
                    <span className="stat-label">Total Customers</span>
                  </div>
                </div>
                <div className="stat-card">
                  <div className="stat-icon orange">
                    <i className="fas fa-shopping-bag"></i>
                  </div>
                  <div className="stat-content">
                    <span className="stat-value">{data.total_orders}</span>
                    <span className="stat-label">Total Orders</span>
                  </div>
                </div>
                <div className="stat-card">
                  <div className="stat-icon purple">
                    <i className="fas fa-dollar-sign"></i>
                  </div>
                  <div className="stat-content">
                    <span className="stat-value">
                      {formatCurrency(data.total_revenue)}
                    </span>
                    <span className="stat-label">Total Revenue</span>
                  </div>
                </div>
              </div>

              {/* Pending Farmers Alert */}
              {data.pending_farmers > 0 && (
                <div className="alert-banner alert-warning">
                  <i className="fas fa-exclamation-triangle"></i>
                  {data.pending_farmers} farmer registration(s) pending approval.
                  <Link to="/admin/users?role=farmer"> Review Now</Link>
                </div>
              )}

              {/* Reports & Analytics Section */}
              <div className="section-divider">
                <h2 className="section-title">Reports & Analytics</h2>
                <p className="section-subtitle">Platform-wide insights and metrics</p>
              </div>

              {reportsLoading ? (
                <Loader message="Loading reports..." />
              ) : !reports ? (
                <EmptyState
                  icon="chart-bar"
                  title="No Reports Available"
                  message="Reports will appear here once there is activity."
                />
              ) : (
                <>
                  {/* Total Orders Stat (from reports) */}
                  {reports.total_orders !== undefined && (
                    <div className="stats-grid" style={{ marginBottom: '24px' }}>
                      <div className="stat-card">
                        <div className="stat-icon blue">
                          <i className="fas fa-shopping-bag"></i>
                        </div>
                        <div className="stat-content">
                          <span className="stat-value">{reports.total_orders}</span>
                          <span className="stat-label">Total Orders (Reported)</span>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Revenue Chart */}
                  {chartData && (
                    <div className="dashboard-card">
                      <h3 className="card-title">Revenue by Order Status</h3>
                      <div className="chart-wrapper">
                        <Bar data={chartData} options={chartOptions} />
                      </div>
                    </div>
                  )}

                  {/* Two-column layout: Most Active Farmers & Revenue Summary */}
                  <div className="detail-grid-two">
                    {/* Most Active Farmers */}
                    <div className="dashboard-card">
                      <h3 className="card-title">Most Active Farmers</h3>
                      {reports.most_active_farmers?.length === 0 ? (
                        <p className="no-data">No data available.</p>
                      ) : (
                        <div className="table-responsive">
                          <table className="data-table">
                            <thead>
                              <tr>
                                <th>Rank</th>
                                <th>Farmer</th>
                                <th>Total Orders</th>
                              </tr>
                            </thead>
                            <tbody>
                              {reports.most_active_farmers?.map((farmer, idx) => (
                                <tr key={farmer.farmer_id}>
                                  <td>{idx + 1}</td>
                                  <td>{farmer.stall_name}</td>
                                  <td>{farmer.orders_count}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      )}
                    </div>

                    {/* Revenue Summary */}
                    <div className="dashboard-card">
                      <h3 className="card-title">Revenue Summary</h3>
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
                                  <span
                                    className={`status-badge ${getStatusBadgeClass(
                                      row.order_status
                                    )}`}
                                  >
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
                  </div>
                </>
              )}
            </>
          ) : (
            <Loader message="Unable to load dashboard" />
          )}
        </main>
      </div>
      <Footer />
    </div>
  );
};

export default AdminDashboard;