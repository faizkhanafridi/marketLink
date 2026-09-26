import React from 'react';
import { Link } from 'react-router-dom';
import { formatCurrency, formatDate } from '../../utils/formatters';
import '../../styles/dashboard.css';

const OrderCard = ({ order, viewAs = 'customer', detailLink }) => {
  const statusLabel = order.order_status?.replace(/_/g, ' ');
  const link = detailLink || `/${viewAs}/orders/${order.order_id}`;

  return (
    <div className="order-card">
      <div className="order-header">
        <div>
          <span className="order-id">Order #{order.order_id}</span>
          <span className="order-date">{formatDate(order.created_at)}</span>
        </div>
        <span className={`status-badge status-${order.order_status}`}>
          {statusLabel}
        </span>
      </div>

      {viewAs === 'farmer' && order.customer && (
        <div className="order-customer-info">
          <i className="fas fa-user"></i>
          <strong>{order.customer.username}</strong>
          {order.customer.contact_number && (
            <span className="customer-contact">
              <i className="fas fa-phone"></i> {order.customer.contact_number}
            </span>
          )}
        </div>
      )}

      {viewAs === 'customer' && order.farmer && (
        <div className="order-farmer">
          <i className="fas fa-tractor"></i> {order.farmer.stall_name}
        </div>
      )}

      <div className="order-body">
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

        <div className="order-meta-row">
          <span>
            <i className="fas fa-calendar"></i> {order.pickup_date}
          </span>
          <span>
            <i className="fas fa-clock"></i> {order.pickup_slot}
          </span>
          <span className="order-total">
            Total: <strong>{formatCurrency(order.total_amount)}</strong>
          </span>
        </div>
      </div>

      <div className="order-footer">
        <div className="order-pickup">
          <i className="fas fa-info-circle"></i> Pay at pickup
        </div>
        <Link to={link} className="btn btn-sm btn-outline">
          View Details
        </Link>
      </div>
    </div>
  );
};

export default OrderCard;