import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import Navbar from '../../components/common/Navbar';
import Footer from '../../components/common/Footer';
import FarmerSidebar from '../../components/farmer/FarmerSidebar';
import Loader from '../../components/common/Loader';
import EmptyState from '../../components/common/EmptyState';
import { orderApi } from '../../api';
import { formatCurrency, formatDate } from '../../utils/formatters';
import { toast } from 'react-toastify';
import '../../styles/dashboard.css';

const STATUS_TABS = [
  { key: 'all', label: 'All' },
  { key: 'placed', label: 'New' },
  { key: 'accepted', label: 'Accepted' },
  { key: 'ready_for_pickup', label: 'Ready' },
  { key: 'completed', label: 'Completed' },
  { key: 'cancelled', label: 'Cancelled' },
];

const STATUS_LABEL = {
  placed: 'New',
  accepted: 'Accepted',
  ready_for_pickup: 'Ready for pickup',
  completed: 'Completed',
  cancelled: 'Cancelled',
  declined: 'Declined',
};

const FarmerOrders = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  // Derive the filter from the URL — single source of truth
  const statusFromUrl = searchParams.get('status');
  const filter = statusFromUrl || 'all';

  const fetchOrders = async () => {
    try {
      const data = await orderApi.getAll();
      setOrders(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching orders:', error);
      toast.error('Failed to load orders');
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
      toast.success(`Order marked as ${STATUS_LABEL[status] || status}`);
      fetchOrders();
    } catch (error) {
      toast.error('Failed to update order');
    }
  };

  // Clicking a tab updates the URL, which re-derives `filter` above
  const handleFilterChange = (key) => {
    if (key === 'all') {
      navigate('/farmer/orders');
    } else {
      navigate(`/farmer/orders?status=${key}`);
    }
  };

  const counts = useMemo(() => {
    const map = { all: orders.length };
    orders.forEach((o) => {
      map[o.order_status] = (map[o.order_status] || 0) + 1;
    });
    return map;
  }, [orders]);

  const filteredOrders = useMemo(
    () =>
      filter === 'all'
        ? orders
        : orders.filter((o) => o.order_status === filter),
    [orders, filter]
  );

  return (
    <div className="dashboard-page">
      <Navbar />
      <div className="dashboard-layout">
        <FarmerSidebar />
        <main className="dashboard-main">

          <div className="dashboard-header">
            <h1 className="dashboard-title">Orders</h1>
            <p className="dashboard-subtitle">
              Manage incoming pre-orders from customers
            </p>
          </div>

          {/* KPI strip */}
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-icon blue">
                <i className="fas fa-shopping-bag"></i>
              </div>
              <div className="stat-content">
                <span className="stat-value">{counts.all || 0}</span>
                <span className="stat-label">Total Orders</span>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon orange">
                <i className="fas fa-hourglass-half"></i>
              </div>
              <div className="stat-content">
                <span className="stat-value">{counts.placed || 0}</span>
                <span className="stat-label">New</span>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon purple">
                <i className="fas fa-box-open"></i>
              </div>
              <div className="stat-content">
                <span className="stat-value">
                  {counts.ready_for_pickup || 0}
                </span>
                <span className="stat-label">Ready</span>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon green">
                <i className="fas fa-check-circle"></i>
              </div>
              <div className="stat-content">
                <span className="stat-value">{counts.completed || 0}</span>
                <span className="stat-label">Completed</span>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="filter-tabs">
            {STATUS_TABS.map((tab) => {
              const count = counts[tab.key] || 0;
              return (
                <button
                  key={tab.key}
                  type="button"
                  className={`filter-tab ${
                    filter === tab.key ? 'active' : ''
                  }`}
                  onClick={() => handleFilterChange(tab.key)}
                >
                  {tab.label}
                  <span className="filter-tab-count">{count}</span>
                </button>
              );
            })}
          </div>

          {/* List */}
          {loading ? (
            <Loader message="Loading orders..." />
          ) : filteredOrders.length === 0 ? (
            <EmptyState
              icon="shopping-bag"
              title={
                filter === 'all' ? 'No Orders Yet' : 'No Orders Found'
              }
              message={
                filter === 'all'
                  ? 'Orders will appear here when customers place them.'
                  : 'Try a different filter.'
              }
              actionText={filter !== 'all' ? 'View All' : undefined}
              onAction={
                filter !== 'all' ? () => handleFilterChange('all') : undefined
              }
            />
          ) : (
            <div className="fo-list">
              {filteredOrders.map((order) => {
                const statusKey = order.order_status || 'placed';
                const itemsCount =
                  order.items?.reduce(
                    (sum, it) => sum + (it.quantity || 0),
                    0
                  ) || 0;

                return (
                  <article key={order.order_id} className="fo-card">
                    <div className="fo-head">
                      <div className="fo-head-left">
                        <span className="fo-id">
                          #{String(order.order_id).padStart(4, '0')}
                        </span>
                        <span className="fo-date">
                          {formatDate(order.created_at)}
                        </span>
                      </div>
                      <span className={`status-badge status-${statusKey}`}>
                        {STATUS_LABEL[statusKey] || statusKey}
                      </span>
                    </div>

                    <div className="fo-info">
                      <div className="fo-info-item">
                        <span className="fo-info-icon">
                          <i className="fas fa-user"></i>
                        </span>
                        <div className="fo-info-body">
                          <span className="fo-info-label">Customer</span>
                          <span className="fo-info-value">
                            {order.customer?.username || 'Unknown'}
                          </span>
                        </div>
                      </div>

                      {order.customer?.contact_number && (
                        <div className="fo-info-item">
                          <span className="fo-info-icon">
                            <i className="fas fa-phone"></i>
                          </span>
                          <div className="fo-info-body">
                            <span className="fo-info-label">Contact</span>
                            <span className="fo-info-value">
                              {order.customer.contact_number}
                            </span>
                          </div>
                        </div>
                      )}

                      {order.pickup_date && (
                        <div className="fo-info-item">
                          <span className="fo-info-icon">
                            <i className="fas fa-calendar"></i>
                          </span>
                          <div className="fo-info-body">
                            <span className="fo-info-label">Pickup</span>
                            <span className="fo-info-value">
                              {order.pickup_date}
                              {order.pickup_slot && ` · ${order.pickup_slot}`}
                            </span>
                          </div>
                        </div>
                      )}

                      {itemsCount > 0 && (
                        <div className="fo-info-item">
                          <span className="fo-info-icon">
                            <i className="fas fa-box"></i>
                          </span>
                          <div className="fo-info-body">
                            <span className="fo-info-label">Items</span>
                            <span className="fo-info-value">
                              {itemsCount}{' '}
                              {itemsCount === 1 ? 'item' : 'items'}
                            </span>
                          </div>
                        </div>
                      )}
                    </div>

                    {order.items?.length > 0 && (
                      <div className="fo-items">
                        {order.items.map((item, idx) => (
                          <div key={idx} className="fo-item">
                            <span className="fo-item-qty">
                              {item.quantity}×
                            </span>
                            <span className="fo-item-name">
                              {item.product?.name || 'Product'}
                            </span>
                            {item.price != null && (
                              <span className="fo-item-price">
                                {formatCurrency(item.price * item.quantity)}
                              </span>
                            )}
                          </div>
                        ))}
                      </div>
                    )}

                    {order.notes && (
                      <div className="fo-notes">
                        <i className="fas fa-sticky-note"></i>
                        <span>{order.notes}</span>
                      </div>
                    )}

                    <div className="fo-foot">
                      <div className="fo-total">
                        <span className="fo-total-label">Total</span>
                        <span className="fo-total-value">
                          {formatCurrency(order.total_amount)}
                        </span>
                      </div>

                      <div className="fo-actions">
                        {order.order_status === 'placed' && (
                          <>
                            <button
                              type="button"
                              className="fo-btn fo-btn-ghost"
                              onClick={() =>
                                handleStatusUpdate(order.order_id, 'declined')
                              }
                            >
                              Decline
                            </button>
                            <button
                              type="button"
                              className="fo-btn fo-btn-primary"
                              onClick={() =>
                                handleStatusUpdate(order.order_id, 'accepted')
                              }
                            >
                              Accept
                            </button>
                          </>
                        )}

                        {order.order_status === 'accepted' && (
                          <button
                            type="button"
                            className="fo-btn fo-btn-primary"
                            onClick={() =>
                              handleStatusUpdate(
                                order.order_id,
                                'ready_for_pickup'
                              )
                            }
                          >
                            Mark Ready for Pickup
                          </button>
                        )}

                        {order.order_status === 'ready_for_pickup' && (
                          <button
                            type="button"
                            className="fo-btn fo-btn-primary"
                            onClick={() =>
                              handleStatusUpdate(order.order_id, 'completed')
                            }
                          >
                            Mark Completed
                          </button>
                        )}
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          )}

        </main>
      </div>
      <Footer />
    </div>
  );
};

export default FarmerOrders;