import React, { useState, useEffect } from 'react';
import Navbar from '../../components/common/Navbar';
import Footer from '../../components/common/Footer';
import FarmerSidebar from '../../components/farmer/FarmerSidebar';
import Loader from '../../components/common/Loader';
import EmptyState from '../../components/common/EmptyState';
import { orderApi } from '../../api';
import { formatCurrency, formatDate } from '../../utils/formatters';
import { toast } from 'react-toastify';
import '../../styles/dashboard.css';

const FarmerOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

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

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleStatusUpdate = async (orderId, status) => {
    try {
      await orderApi.updateStatus(orderId, status);
      toast.success(`Order marked as ${status.replace(/_/g, ' ')}`);
      fetchOrders();
    } catch (error) {
      toast.error('Failed to update order');
    }
  };

  const filteredOrders = filter === 'all'
    ? orders
    : orders.filter((o) => o.order_status === filter);

  const statusTabs = [
    { key: 'all', label: 'All' },
    { key: 'placed', label: 'New' },
    { key: 'accepted', label: 'Accepted' },
    { key: 'ready_for_pickup', label: 'Ready' },
    { key: 'completed', label: 'Completed' },
    { key: 'cancelled', label: 'Cancelled' },
  ];

  return (
    <div className="dashboard-page">
      <Navbar />
      <div className="dashboard-layout">
        <FarmerSidebar />
        <main className="dashboard-main">
          <div className="dashboard-header">
            <h1 className="dashboard-title">Orders</h1>
            <p className="dashboard-subtitle">Manage incoming pre-orders</p>
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
              message="No orders match the selected filter."
            />
          ) : (
            <div className="orders-list">
              {filteredOrders.map((order) => (
                <div key={order.order_id} className="order-card farmer-order-card">
                  <div className="order-header">
                    <div>
                      <span className="order-id">Order #{order.order_id}</span>
                      <span className="order-date">{formatDate(order.created_at)}</span>
                    </div>
                    <span className={`status-badge status-${order.order_status}`}>
                      {order.order_status?.replace(/_/g, ' ')}
                    </span>
                  </div>

                  <div className="order-customer-info">
                    <i className="fas fa-user"></i>
                    <strong>{order.customer?.username}</strong>
                    {order.customer?.contact_number && (
                      <span className="customer-contact">
                        <i className="fas fa-phone"></i> {order.customer.contact_number}
                      </span>
                    )}
                  </div>

                  <div className="order-body">
                    <div className="order-items-preview">
                      {order.items?.map((item, idx) => (
                        <span key={idx} className="item-preview">
                          {item.quantity}x {item.product?.name}
                        </span>
                      ))}
                    </div>
                    <div className="order-meta-row">
                      <span><i className="fas fa-calendar"></i> {order.pickup_date}</span>
                      <span><i className="fas fa-clock"></i> {order.pickup_slot}</span>
                      <span className="order-total">
                        Total: <strong>{formatCurrency(order.total_amount)}</strong>
                      </span>
                    </div>
                    {order.notes && (
                      <p className="order-notes"><i className="fas fa-sticky-note"></i> {order.notes}</p>
                    )}
                  </div>

                  <div className="order-footer">
                    {order.order_status === 'placed' && (
                      <div className="order-actions-inline">
                        <button
                          className="btn btn-sm btn-primary"
                          onClick={() => handleStatusUpdate(order.order_id, 'accepted')}
                        >
                          Accept
                        </button>
                        <button
                          className="btn btn-sm btn-outline"
                          onClick={() => handleStatusUpdate(order.order_id, 'declined')}
                        >
                          Decline
                        </button>
                      </div>
                    )}
                    {order.order_status === 'accepted' && (
                      <button
                        className="btn btn-sm btn-primary"
                        onClick={() => handleStatusUpdate(order.order_id, 'ready_for_pickup')}
                      >
                        Mark Ready for Pickup
                      </button>
                    )}
                    {order.order_status === 'ready_for_pickup' && (
                      <button
                        className="btn btn-sm btn-primary"
                        onClick={() => handleStatusUpdate(order.order_id, 'completed')}
                      >
                        Mark Completed
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </main>
      </div>
      <Footer />
    </div>
  );
};

export default FarmerOrders;