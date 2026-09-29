import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '../../components/common/Navbar';
import Footer from '../../components/common/Footer';
import CustomerSidebar from '../../components/customer/CustomerSidebar';
import Loader from '../../components/common/Loader';
import EmptyState from '../../components/common/EmptyState';
import { orderApi } from '../../api';
import { formatCurrency, formatDate } from '../../utils/formatters';
import { toast } from 'react-toastify';
import '../../styles/dashboard.css';

const OrderDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [cancelling, setCancelling] = useState(false);

  const fetchOrder = async () => {
    try {
      const data = await orderApi.getById(id);
      setOrder(data);
    } catch (error) {
      console.error('Error fetching order:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrder();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const handleCancel = async () => {
    if (!window.confirm('Are you sure you want to cancel this order?')) return;
    setCancelling(true);
    try {
      await orderApi.cancel(id);
      toast.success('Order cancelled');
      fetchOrder();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to cancel order');
    } finally {
      setCancelling(false);
    }
  };

  const timelineSteps = [
    { key: 'placed', label: 'Order Placed', icon: 'clipboard-check' },
    { key: 'accepted', label: 'Accepted', icon: 'check-circle' },
    { key: 'ready_for_pickup', label: 'Ready for Pickup', icon: 'box-open' },
    { key: 'completed', label: 'Completed', icon: 'check-double' },
  ];

  const getStepStatus = (stepKey) => {
    if (!order) return 'pending';
    if (order.order_status === 'cancelled') return 'cancelled';
    const orderIndex = timelineSteps.findIndex(
      (s) => s.key === order.order_status
    );
    const stepIndex = timelineSteps.findIndex((s) => s.key === stepKey);
    if (orderIndex === -1) return 'pending';
    if (stepIndex < orderIndex) return 'completed';
    if (stepIndex === orderIndex) return 'current';
    return 'pending';
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <Loader fullScreen message="Loading order..." />
      </>
    );
  }

  if (!order) {
    return (
      <div className="dashboard-page">
        <Navbar />
        <div className="dashboard-layout">
          <CustomerSidebar />
          <main className="dashboard-main">
            <EmptyState
              icon="exclamation-circle"
              title="Order Not Found"
              message="The order you're looking for doesn't exist."
              actionText="Back to Orders"
              onAction={() => navigate('/customer/orders')}
            />
          </main>
        </div>
        <Footer />
      </div>
    );
  }

  const canCancel = ['placed', 'accepted'].includes(order.order_status);

  return (
    <div className="dashboard-page">
      <Navbar />
      <div className="dashboard-layout">
        <CustomerSidebar />
        <main className="dashboard-main">

          {/* ---------- Header ---------- */}
          <div className="dashboard-header">
            <div className="header-with-back">
              <button
                type="button"
                className="back-btn"
                onClick={() => navigate('/customer/orders')}
                aria-label="Back to orders"
              >
                <i className="fas fa-arrow-left"></i>
              </button>
              <div>
                <h1 className="dashboard-subtitle text-dark fw-bold">
                  Order #{String(order.order_id).padStart(4, '0')}
                </h1>
                <p className="dashboard-subtitle">
                  Placed on {formatDate(order.created_at)}
                </p>
              </div>
            </div>

       
          </div>

          {/* ---------- Timeline ---------- */}
          {order.order_status === 'cancelled' ? (
            <div className="cancelled-banner">
              <i className="fas fa-times-circle"></i>
              This order has been cancelled.
            </div>
          ) : (
            <div className="order-timeline">
              {timelineSteps.map((step) => {
                const status = getStepStatus(step.key);
                return (
                  <div key={step.key} className={`timeline-step ${status}`}>
                    <div className="step-icon">
                      <i className={`fas fa-${step.icon}`}></i>
                    </div>
                    <span className="step-label">{step.label}</span>
                  </div>
                );
              })}
            </div>
          )}

          {/* ---------- Order Items ---------- */}
          <div className="dashboard-card">
            <div className="card-header-row">
              <h3 className="card-subtitle text-dark fw-700">Order Items</h3>
              <span className="card-subtitle">
                {order.items?.length || 0}{' '}
                {order.items?.length === 1 ? 'item' : 'items'}
              </span>
            </div>

            <div className="order-items-table">
              {order.items?.map((item) => (
                <div
                  key={item.order_item_id || item.product_id}
                  className="order-item-row"
                >
                  <img
                    src={
                      item.product?.image ||
                      '/assets/images/default-product.jpg'
                    }
                    alt={item.product?.name}
                    className="order-item-img"
                    onError={(e) => {
                      e.target.src = '/assets/images/default-product.jpg';
                    }}
                  />
                  <div className="order-item-details">
                    <span className="order-item-name">
                      {item.product?.name}
                    </span>
                    <span className="order-item-qty">
                      {item.quantity} × {formatCurrency(item.price)}
                    </span>
                  </div>
                  <span className="order-item-subtotal">
                    {formatCurrency(item.subtotal)}
                  </span>
                </div>
              ))}
            </div>

            <div className="order-total-row">
              <span>Total</span>
              <strong>{formatCurrency(order.total_amount)}</strong>
            </div>
          </div>

          {/* ---------- Pickup + Payment ---------- */}
          <div className="detail-grid-two">

            {/* Pickup Information */}
            <div className="dashboard-card order-info-card">
              <div className="order-info-head">
                <span className="order-info-icon">
                  <i className="fas fa-map-marker-alt"></i>
                </span>
                <div>
                  <h3 className="card-title">Pickup Information</h3>
                  <p className="card-subtitle">
                    Where and when to collect your order
                  </p>
                </div>
              </div>

              <div className="order-info-list">
                <div className="order-info-row">
                  <span className="order-info-label">
                    <i className="fas fa-calendar"></i>
                    Pickup Date
                  </span>
                  <strong className="order-info-value">
                    {order.pickup_date || '—'}
                  </strong>
                </div>

                <div className="order-info-row">
                  <span className="order-info-label">
                    <i className="fas fa-clock"></i>
                    Pickup Slot
                  </span>
                  <strong className="order-info-value">
                    {order.pickup_slot || '—'}
                  </strong>
                </div>

                <div className="order-info-row">
                  <span className="order-info-label">
                    <i className="fas fa-tractor"></i>
                    Farmer
                  </span>
                  <strong className="order-info-value">
                    {order.farmer?.stall_name || '—'}
                  </strong>
                </div>
              </div>
            </div>

            {/* Payment */}
            <div className="dashboard-card order-info-card">
              <div className="order-info-head">
                <span className="order-info-icon">
                  <i className="fas fa-wallet"></i>
                </span>
                <div>
                  <h3 className="card-title">Payment</h3>
                  <p className="card-subtitle">
                    Settled in person at the stall
                  </p>
                </div>
              </div>

              <div className="order-payment-amount">
                <span className="order-payment-label">Amount Due</span>
                <span className="order-payment-value">
                  {formatCurrency(order.total_amount)}
                </span>
              </div>

              <div className="order-payment-note">
                <i className="fas fa-info-circle"></i>
                <span>
                  Bring cash or card. Pay directly to the farmer when you
                  pick up your order.
                </span>
              </div>

              {order.notes && (
                <div className="order-info-notes">
                  <span className="order-info-label">
                    <i className="fas fa-sticky-note"></i>
                    Your Notes
                  </span>
                  <p>{order.notes}</p>
                </div>
              )}
            </div>

          </div>

          {/* ---------- Cancel action ---------- */}
          {canCancel && (
            <div className="order-actions">
              <button
                type="button"
                className="order-cancel-btn"
                onClick={handleCancel}
                disabled={cancelling}
              >
                <i className="fas fa-times"></i>
                {cancelling ? 'Cancelling…' : 'Cancel Order'}
              </button>
            </div>
          )}

        </main>
      </div>
     
    </div>
  );
};

export default OrderDetailPage;