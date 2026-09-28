import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../../components/common/Navbar';
import Footer from '../../components/common/Footer';
import CustomerSidebar from '../../components/customer/CustomerSidebar';
import Loader from '../../components/common/Loader';
import EmptyState from '../../components/common/EmptyState';
import { orderApi, favoriteApi } from '../../api';
import { useAuth } from '../../hooks/useAuth';
import { formatCurrency, formatDate } from '../../utils/formatters';
import '../../styles/dashboard.css';

const CustomerDashboard = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [ordersData, favsData] = await Promise.all([
          orderApi.getAll().catch(() => []),
          favoriteApi.getAll().catch(() => []),
        ]);
        setOrders(Array.isArray(ordersData) ? ordersData : []);
        setFavorites(Array.isArray(favsData) ? favsData : []);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const pendingOrders = orders.filter((o) =>
    ['placed', 'accepted', 'ready_for_pickup'].includes(o.order_status)
  );
  const completedOrders = orders.filter((o) => o.order_status === 'completed');
  const totalSpent = completedOrders.reduce((sum, o) => sum + parseFloat(o.total_amount || 0), 0);

  return (
    <div className="dashboard-page">
      <Navbar />
      <div className="dashboard-layout">
        <CustomerSidebar />
        <main className="dashboard-main">
          <div className="dashboard-header">
                          <p className="dashboard-subtitle text-dark fw-bold ">Welcome, {user?.username}</p>

            <p className="dashboard-subtitle">Here's your MarketLink activity overview</p>
          </div>

          {loading ? (
            <Loader message="Loading dashboard..." />
          ) : (
            <>
              <div className="stats-grid">
                <div className="stat-card">
                  <div className="stat-icon blue"><i className="fas fa-shopping-bag"></i></div>
                  <div className="stat-content">
                    <span className="stat-value">{orders.length}</span>
                    <span className="stat-label">Total Orders</span>
                  </div>
                </div>
                <div className="stat-card">
                  <div className="stat-icon orange"><i className="fas fa-clock"></i></div>
                  <div className="stat-content">
                    <span className="stat-value">{pendingOrders.length}</span>
                    <span className="stat-label">Pending Orders</span>
                  </div>
                </div>
                <div className="stat-card">
                  <div className="stat-icon green"><i className="fas fa-heart"></i></div>
                  <div className="stat-content">
                    <span className="stat-value">{favorites.length}</span>
                    <span className="stat-label">Favorites</span>
                  </div>
                </div>
                <div className="stat-card">
                  <div className="stat-icon purple"><i className="fas fa-dollar-sign"></i></div>
                  <div className="stat-content">
                    <span className="stat-value">{formatCurrency(totalSpent)}</span>
                    <span className="stat-label">Total Spent</span>
                  </div>
                </div>
              </div>

              <div className="dashboard-card">
                <div className="card-header-row">
                  <h2 className="card-title">Recent Orders</h2>
                  <Link to="/customer/orders" className="card-link">View All</Link>
                </div>
                {orders.length === 0 ? (
                  <EmptyState
                    icon="shopping-bag"
                    title="No Orders Yet"
                    message="Start browsing products to place your first order."
                    actionText="Browse Products"
                    onAction={() => window.location.href = '/products'}
                  />
                ) : (
                  <div className="table-responsive">
                    <table className="data-table">
                      <thead>
                        <tr>
                          <th>Order ID</th>
                          <th>Date</th>
                          <th>Items</th>
                          <th>Total</th>
                          <th>Status</th>
                          <th>Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {orders.slice(0, 5).map((order) => (
                          <tr key={order.order_id}>
                            <td>#{order.order_id}</td>
                            <td>{formatDate(order.created_at)}</td>
                            <td>{order.items?.length || 0}</td>
                            <td>{formatCurrency(order.total_amount)}</td>
                            <td>
                              <span className={`status-badge status-${order.order_status}`}>
                                {order.order_status?.replace(/_/g, ' ')}
                              </span>
                            </td>
                            <td>
                              <Link to={`/customer/orders/${order.order_id}`} className="table-action">
                                View
                              </Link>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </>
          )}
        </main>
      </div>
 
 
    </div>
  );
};

export default CustomerDashboard;