import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
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
import { useNotifications } from '../../context/NotificationContext';
import { formatDate } from '../../utils/formatters';
import '../../styles/notifications.css';

const TYPE_CONFIG = {
  order_placed:    { icon: ShoppingBag,  color: '#1e5a7a', bg: '#e8f1f8' },
  order_accepted:  { icon: CheckCircle2, color: '#15803d', bg: '#dcfce7' },
  order_ready:     { icon: Package,      color: '#c47a0a', bg: '#fdf3e0' },
  order_completed: { icon: CheckCircle2, color: '#15803d', bg: '#dcfce7' },
  order_cancelled: { icon: XCircle,      color: '#b91c1c', bg: '#fee2e2' },
  order_declined:  { icon: XCircle,      color: '#b91c1c', bg: '#fee2e2' },
  new_review:      { icon: Star,         color: '#c47a0a', bg: '#fdf3e0' },
  review_reply:    { icon: Star,         color: '#6b4a8a', bg: '#f0eaf8' },
  farmer_approved: { icon: CheckCircle2, color: '#15803d', bg: '#dcfce7' },
  system:          { icon: Megaphone,    color: '#194d26', bg: '#eef4e8' },
};

const NotificationBell = () => {
  const {
    notifications,
    unreadCount,
    markAsRead,
    markAllAsRead,
    removeNotification,
  } = useNotifications();

  const [open, setOpen] = useState(false);
  const wrapperRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (!wrapperRef.current?.contains(e.target)) setOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const recent = notifications.slice(0, 6);

  return (
    <div className="nb-wrap" ref={wrapperRef}>
      <button
        type="button"
        className={`nb-bell ${open ? 'is-open' : ''}`}
        onClick={() => setOpen((v) => !v)}
        aria-label="Notifications"
      >
        <Bell size={18} strokeWidth={2} />
        {unreadCount > 0 && (
          <span className="nb-badge">
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div className="nb-dropdown">
          <div className="nb-head">
            <div>
              <h4 className="nb-title">Notifications</h4>
              {unreadCount > 0 && (
                <span className="nb-sub">{unreadCount} unread</span>
              )}
            </div>
            {unreadCount > 0 && (
              <button
                type="button"
                className="nb-mark-all"
                onClick={markAllAsRead}
              >
                <CheckCheck size={13} />
                Mark all read
              </button>
            )}
          </div>

          <div className="nb-body">
            {recent.length === 0 ? (
              <div className="nb-empty">
                <Bell size={28} strokeWidth={1.5} />
                <p>No notifications yet</p>
              </div>
            ) : (
              recent.map((n) => {
                const cfg = TYPE_CONFIG[n.type] || TYPE_CONFIG.system;
                const Icon = cfg.icon;
                return (
                  <div
                    key={n.id}
                    className={`nb-item ${!n.is_read ? 'is-unread' : ''}`}
                  >
                    <span
                      className="nb-item-icon"
                      style={{ background: cfg.bg, color: cfg.color }}
                    >
                      <Icon size={14} />
                    </span>

                    <div className="nb-item-body">
                      <div className="nb-item-title-row">
                        <span className="nb-item-title">{n.title}</span>
                        {!n.is_read && <span className="nb-dot" />}
                      </div>
                      <p className="nb-item-msg">{n.message}</p>
                      <span className="nb-item-date">
                        {formatDate(n.created_at)}
                      </span>
                    </div>

                    <div className="nb-item-actions">
                      {!n.is_read && (
                        <button
                          type="button"
                          title="Mark as read"
                          onClick={() => markAsRead(n.id)}
                        >
                          <Check size={12} />
                        </button>
                      )}
                      <button
                        type="button"
                        title="Delete"
                        onClick={() => removeNotification(n.id)}
                      >
                        <Trash2 size={12} />
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          <div className="nb-foot">
            <Link to="/notifications" onClick={() => setOpen(false)}>
              View all notifications
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationBell;