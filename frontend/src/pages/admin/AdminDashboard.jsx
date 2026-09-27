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
  ChartCard,
  RevenueTimelineChart,
  UserGrowthChart,
  OrderStatusChart,
  TopFarmersChart,
  TopCategoriesChart,
  AovChart,
} from '../../components/dashboard/DashboardCharts';
import '../../styles/dashboard.css';

const RANGES = [
  { key: '7', label: '7D' },
  { key: '30', label: '30D' },
  { key: '90', label: '90D' },
  { key: '365', label: '1Y' },
];

const AdminDashboard = () => {
  const [data, setData] = useState(null);
  const [reports, setReports] = useState(null);
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [reportsLoading, setReportsLoading] = useState(true);
  const [analyticsLoading, setAnalyticsLoading] = useState(true);
  const [range, setRange] = useState('30');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [dashData, reportsData] = await Promise.all([
          adminApi.getDashboard(),
          adminApi.getReports().catch(() => null),
        ]);
        setData(dashData);
        setReports(reportsData);
      } catch (err) {
        console.error('Error fetching admin dashboard:', err);
      } finally {
        setLoading(false);
        setReportsLoading(false);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    const fetchAnalytics = async () => {
      setAnalyticsLoading(true);
      try {
        const res = await adminApi.getAnalytics({ range });
        setAnalytics(res);
      } catch (err) {
        console.error('Error fetching analytics:', err);
        setAnalytics(null);
      } finally {
        setAnalyticsLoading(false);
      }
    };
    fetchAnalytics();
  }, [range]);

  const getStatusBadgeClass = (status) => {
    const map = {
      pending: 'status-pending',
      placed: 'status-placed',
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

  const RangeToggle = (
    <div className="chart-range">
      {RANGES.map((r) => (
        <button
          key={r.key}
          type="button"
          className={`chart-range-btn ${range === r.key ? 'is-active' : ''}`}
          onClick={() => setRange(r.key)}
        >
          {r.label}
        </button>
      ))}
    </div>
  );

  return (
    <div className="dashboard-page">
      <Navbar />
      <div className="dashboard-layout">
        <AdminSidebar />
        <main className="dashboard-main">

          <div className="dashboard-header">
            <h1 className="dashboard-title">Admin Dashboard</h1>
            <p className="dashboard-subtitle">
              Platform overview and key metrics
            </p>
          </div>

          {loading ? (
            <Loader message="Loading dashboard..." />
          ) : data ? (
            <>
              {/* KPI strip */}
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

              {/* Pending farmers alert */}
              {data.pending_farmers > 0 && (
                <div className="alert-banner alert-warning">
                  <i className="fas fa-exclamation-triangle"></i>
                  {data.pending_farmers} farmer registration(s) pending approval.
                  <Link to="/admin/users?role=farmer"> Review Now</Link>
                </div>
              )}

              {/* Section divider */}
              <div className="section-divider">
                <h2 className="section-title">Reports & Analytics</h2>
                <p className="section-subtitle">
                  Platform-wide insights, updated live
                </p>
              </div>

              {analyticsLoading ? (
                <Loader message="Loading analytics..." />
              ) : !analytics ? (
                <EmptyState
                  icon="chart-bar"
                  title="No Analytics Available"
                  message="Analytics will appear once there's activity."
                />
              ) : (
                <>
                  {/* Row 1 — Revenue timeline */}
                  <div className="charts-grid">
                    <ChartCard
                      title="Revenue & Orders"
                      subtitle={`Last ${range} days`}   
                      actions={RangeToggle}
                      span={2}
                    >
                      <RevenueTimelineChart
                        data={analytics.revenue_timeline}
                        height={320}
                      />
                    </ChartCard>
                  </div>

                  {/* Row 2 — Order status + User growth */}
                  <div className="charts-grid">
                    <ChartCard
                      title="Order Status"
                      subtitle="Distribution by current state"
                    >
                      <OrderStatusChart
                        data={analytics.order_status}
                        height={300}
                      />
                    </ChartCard>

                    <ChartCard
                      title="User Growth"
                      subtitle="New signups by role"
                    >
                      <UserGrowthChart
                        data={analytics.user_growth}
                        height={300}
                      />
                    </ChartCard>
                  </div>

                  {/* Row 3 — Top farmers + Top categories */}
                  <div className="charts-grid">
                    <ChartCard
                      title="Top Farmers"
                      subtitle="By revenue generated"
                    >
                      <TopFarmersChart
                        data={analytics.top_farmers}
                        height={320}
                      />
                    </ChartCard>

                    <ChartCard
                      title="Top Categories"
                      subtitle="By product count"
                    >
                      <TopCategoriesChart
                        data={analytics.top_categories}
                        height={300}
                      />
                    </ChartCard>
                  </div>

                  {/* Row 4 — AOV */}
                  <div className="charts-grid">
                    <ChartCard
                      title="Average Order Value"
                      subtitle="Daily trend for completed orders"
                      span={2}
                    >
                      <AovChart
                        data={analytics.aov_timeline}
                        height={260}
                      />
                    </ChartCard>
                  </div>

                  {/* Two-column tables */}
                  <div className="detail-grid-two">
                    <div className="dashboard-card">
                      <h3 className="card-title">Most Active Farmers</h3>
                      {reports?.most_active_farmers?.length === 0 ? (
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
                              {reports?.most_active_farmers?.map((f, i) => (
                                <tr key={f.farmer_id}>
                                  <td>{i + 1}</td>
                                  <td>{f.stall_name}</td>
                                  <td>{f.orders_count}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      )}
                    </div>

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
                            {reports?.revenue_by_status?.map((row, i) => (
                              <tr key={i}>
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
     
    </div>
  );
};

export default AdminDashboard;