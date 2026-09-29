import React, { useState, useMemo } from 'react';
import {
  Bell,
  Check,
  CheckCheck,
  Trash2,
  ShoppingBag,
  Star,
  CheckCircle2,
  XCircle,
  Package,
  Megaphone,
} from 'lucide-react';
import Navbar from '../../components/common/Navbar';
import Footer from '../../components/common/Footer';
import EmptyState from '../../components/common/EmptyState';
import { useNotifications } from '../../context/NotificationContext';
import { formatDate } from '../../utils/formatters';
import '../../styles/notifications.css';

const TYPE_CONFIG = {
  order_placed:    { icon: ShoppingBag,  color: '#1e5a7a', bg: '#e8f1f8', label: 'Order Placed' },
  order_accepted:  { icon: CheckCircle2, color: '#15803d', bg: '#dcfce7', label: 'Order Accepted' },
  order_ready:     { icon: Package,      color: '#c47a0a', bg: '#fdf3e0', label: 'Ready for Pickup' },
  order_completed: { icon: CheckCircle2, color: '#15803d', bg: '#dcfce7', label: 'Order Completed' },
  order_cancelled: { icon: XCircle,      color: '#b91c1c', bg: '#fee2e2', label: 'Order Cancelled' },
  order_declined:  { icon: XCircle,      color: '#b91c1c', bg: '#fee2e2', label: 'Order Declined' },
  new_review:      { icon: Star,         color: '#c47a0a', bg: '#fdf3e0', label: 'New Review' },
  review_reply:    { icon: Star,         color: '#6b4a8a', bg: '#f0eaf8', label: 'Review Reply' },
  farmer_approved: { icon: CheckCircle2, color: '#15803d', bg: '#dcfce7', label: 'Account Approved' },
  system:          { icon: Megaphone,    color: '#194d26', bg: '#eef4e8', label: 'Announcement' },
};

const FILTERS = [
  { key: 'all',     label: 'All' },
  { key: 'unread',  label: 'Unread' },
  { key: 'orders',  label: 'Orders' },
  { key: 'reviews', label: 'Reviews' },
  { key: 'system',  label: 'System' },
];

const NotificationsPage = () => {
  const {
    notifications,
    unreadCount,
    loading,
    markAsRead,
    markAllAsRead,
    removeNotification,
    clearAll,
  } = useNotifications();

  const [filter, setFilter] = useState('all');

  const filtered = useMemo(() => {
    if (filter === 'unread')  return notifications.filter((n) => !n.is_read);
    if (filter === 'orders')  return notifications.filter((n) => n.type.startsWith('order_'));
    if (filter === 'reviews') return notifications.filter((n) => n.type === 'new_review' || n.type === 'review_reply');
    if (filter === 'system')  return notifications.filter((n) => n.type === 'system' || n.type === 'farmer_approved');
    return notifications;
  }, [notifications, filter]);

  const counts = useMemo(
    () => ({
      all:     notifications.length,
      unread:  notifications.filter((n) => !n.is_read).length,
      orders:  notifications.filter((n) => n.type.startsWith('order_')).length,
      reviews: notifications.filter((n) => n.type === 'new_review' || n.type === 'review_reply').length,
      system:  notifications.filter((n) => n.type === 'system' || n.type === 'farmer_approved').length,
    }),
    [notifications]
  );

  const handleClearAll = () => {
    if (window.confirm('Clear all notifications? This cannot be undone.')) {
      clearAll();
    }
  };

  return (
    <div className="notif-page">
      <Navbar />

      {/* Hero */}
      <section className="notif-hero">
        <div className="notif-hero-decoration notif-hero-decoration-one" />
        <div className="notif-hero-decoration notif-hero-decoration-two" />

        <div className="container">
          <div className="notif-hero-content">
            <span className="notif-page-tag">
              <Bell size={13} />
              Your Updates
            </span>

            <h1 className="notif-page-title">
              All
              <span> Notifications</span>
            </h1>

            <p className="notif-page-subtitle">
              Order updates, reviews, and announcements — all in one place.
            </p>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="notif-content-section">
        <div className="container">

          {/* Toolbar */}
          <div className="notif-toolbar">
            <div className="notif-tabs">
              {FILTERS.map((f) => (
                <button
                  key={f.key}
                  type="button"
                  className={`notif-tab ${filter === f.key ? 'active' : ''}`}
                  onClick={() => setFilter(f.key)}
                >
                  {f.label}
                  <span className="notif-tab-count">{counts[f.key] || 0}</span>
                </button>
              ))}
            </div>

            <div className="notif-toolbar-actions">
              {unreadCount > 0 && (
                <button
                  type="button"
                  className="notif-btn notif-btn-ghost"
                  onClick={markAllAsRead}
                >
                  <CheckCheck size={14} />
                  Mark all read
                </button>
              )}
              {notifications.length > 0 && (
                <button
                  type="button"
                  className="notif-btn notif-btn-danger"
                  onClick={handleClearAll}
                >
                  <Trash2 size={14} />
                  Clear all
                </button>
              )}
            </div>
          </div>

          {/* List */}
          {loading ? (
            <div className="notif-loading">
              <div className="notif-spinner" />
              <p>Loading notifications...</p>
            </div>
          ) : filtered.length === 0 ? (
            <div className="notif-empty-wrap">
              <EmptyState
                icon="bell-slash"
                title={filter === 'all' ? 'No Notifications Yet' : 'Nothing Here'}
                message={
                  filter === 'all'
                    ? 'You will see order updates and announcements here.'
                    : 'Try a different filter.'
                }
                actionText={filter !== 'all' ? 'View All' : undefined}
                onAction={filter !== 'all' ? () => setFilter('all') : undefined}
              />
            </div>
          ) : (
            <div className="notif-list">
              {filtered.map((n) => {
                const cfg = TYPE_CONFIG[n.type] || TYPE_CONFIG.system;
                const Icon = cfg.icon;
                return (
                  <article
                    key={n.id}
                    className={`notif-card ${!n.is_read ? 'is-unread' : ''}`}
                  >
                    <span
                      className="notif-card-icon"
                      style={{ background: cfg.bg, color: cfg.color }}
                    >
                      <Icon size={18} />
                    </span>

                    <div className="notif-card-body">
                      <div className="notif-card-head">
                        <span
                          className="notif-card-type"
                          style={{ color: cfg.color }}
                        >
                          {cfg.label}
                        </span>
                        <span className="notif-card-date">
                          {formatDate(n.created_at)}
                        </span>
                      </div>

                      <h3 className="notif-card-title">{n.title}</h3>
                      <p className="notif-card-message">{n.message}</p>

                      {n.data?.order_id && (
                        <span className="notif-card-meta">
                          Order #{n.data.order_id}
                        </span>
                      )}
                    </div>

                    <div className="notif-card-actions">
                      {!n.is_read && (
                        <button
                          type="button"
                          className="notif-icon-btn"
                          title="Mark as read"
                          onClick={() => markAsRead(n.id)}
                        >
                          <Check size={14} />
                        </button>
                      )}
                      <button
                        type="button"
                        className="notif-icon-btn notif-icon-danger"
                        title="Delete"
                        onClick={() => removeNotification(n.id)}
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </article>
                );
              })}
            </div>
          )}

        </div>
      </section>

      <Footer />
    </div>
  );
};

export default NotificationsPage;