import React, { useState, useEffect } from 'react';
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

const AdminReports = () => {
  const [reports, setReports] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const data = await adminApi.getReports();
        setReports(data);
      } catch (error) {
        console.error('Error fetching reports:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchReports();
  }, []);

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

  return (
    <div className="dashboard-page">
      <Navbar />
      <div className="dashboard-layout">
        <AdminSidebar />
        <main className="dashboard-main">
          <div className="dashboard-header">
            <h1 className="dashboard-title">Reports & Analytics</h1>
            <p className="dashboard-subtitle">Platform-wide insights and metrics</p>
          </div>

          {loading ? (
            <Loader message="Loading reports..." />
          ) : !reports ? (
            <EmptyState
              icon="chart-bar"
              title="No Reports Available"
              message="Reports will appear here once there is activity."
            />
          ) : (
            <>
              <div className="stats-grid">
                <div className="stat-card">
                  <div className="stat-icon blue"><i className="fas fa-shopping-bag"></i></div>
                  <div className="stat-content">
                    <span className="stat-value">{reports.total_orders}</span>
                    <span className="stat-label">Total Orders</span>
                  </div>
                </div>
              </div>

              {chartData && (
                <div className="dashboard-card">
                  <h3 className="card-title">Revenue by Order Status</h3>
                  <div className="chart-wrapper">
                    <Bar data={chartData} options={chartOptions} />
                  </div>
                </div>
              )}

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
            </>
          )}
        </main>
      </div>
      
    </div>
  );
};

export default AdminReports;