import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../../components/common/Navbar';
import Footer from '../../components/common/Footer';
import CustomerSidebar from '../../components/customer/CustomerSidebar';
import Loader from '../../components/common/Loader';
import EmptyState from '../../components/common/EmptyState';
import { orderApi } from '../../api';
import { formatCurrency, formatDate } from '../../utils/formatters';
import '../../styles/dashboard.css';

const MyOrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const data = await orderApi.getAll();
        setOrders(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error('Error fetching orders:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  const filteredOrders = filter === 'all'
    ? orders
    : orders.filter((o) => o.order_status === filter);

  const statusTabs = [
    { key: 'all', label: 'All' },
    { key: 'placed', label: 'Placed' },
    { key: 'accepted', label: 'Accepted' },
    { key: 'ready_for_pickup', label: 'Ready' },
    { key: 'completed', label: 'Completed' },
    { key: 'cancelled', label: 'Cancelled' },
  ];

  return (
    <div className="dashboard-page">
      <Navbar />
      <div className="dashboard-layout">
        <CustomerSidebar />
        <main className="dashboard-main">
          <div className="dashboard-header">
            <h1 className="dashboard-title">My Orders</h1>
            <p className="dashboard-subtitle">Track and manage your orders</p>
          </div>

          <div className="filter-tabs">
            {statusTabs.map((tab) => (
              <button
                key={tab.key}
                className={`filter-tab ${filter === tab.key ? 'active' : ''}`}
                onClick={() => setFilter(tab.key)}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {loading ? (
            <Loader message="Loading orders..." />
          ) : filteredOrders.length === 0 ? (
            <EmptyState
              icon="shopping-bag"
              title="No Orders Found"
              message="You haven't placed any orders yet."
              actionText="Browse Products"
              onAction={() => window.location.href = '/products'}
            />
          ) : (
            <div className="orders-list">
              {filteredOrders.map((order) => (
                <div key={order.order_id} className="order-card">
                  <div className="order-header">
                    <div>
                      <span className="order-id">Order #{order.order_id}</span>
                      <span className="order-date">{formatDate(order.created_at)}</span>
                    </div>
                    <span className={`status-badge status-${order.order_status}`}>
                      {order.order_status?.replace(/_/g, ' ')}
                    </span>
                  </div>

                  <div className="order-body">
                    <div className="order-farmer">
                      <i className="fas fa-tractor"></i>
                      {order.farmer?.stall_name || 'Farmer'}
                    </div>
                    <div className="order-items-preview">
                      {order.items?.slice(0, 3).map((item, idx) => (
                        <span key={idx} className="item-preview">
                          {item.quantity}x {item.product?.name}
                        </span>
                      ))}
                      {order.items?.length > 3 && (
                        <span className="more-items">+{order.items.length - 3} more</span>
                      )}
                    </div>
                    <div className="order-total">
                      <span>Total:</span>
                      <strong>{formatCurrency(order.total_amount)}</strong>
                    </div>
                  </div>

                  <div className="order-footer">
                    <div className="order-pickup">
                      <i className="fas fa-calendar"></i> {order.pickup_date} | {order.pickup_slot}
                    </div>
                    <Link to={`/customer/orders/${order.order_id}`} className="btn btn-sm btn-outline">
                      View Details
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </main>
      </div>
      
    </div>
  );
};

export default MyOrdersPage;