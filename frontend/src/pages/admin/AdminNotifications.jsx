import React, { useState, useEffect } from 'react';
import {
  Megaphone,
  Users,
  Tractor,
  Send,
  Bell,
} from 'lucide-react';
import Navbar from '../../components/common/Navbar';
import Footer from '../../components/common/Footer';
import AdminSidebar from '../../components/admin/AdminSidebar';
import Loader from '../../components/common/Loader';
import EmptyState from '../../components/common/EmptyState';
import { adminApi } from '../../api';
import { formatDate } from '../../utils/formatters';
import { toast } from 'react-toastify';
import '../../styles/dashboard.css';
import '../../styles/notifications.css';

const TARGETS = [
  { key: 'all',       label: 'All Users', icon: Users,   description: 'Every active account' },
  { key: 'customers', label: 'Customers', icon: Users,   description: 'Customer accounts only' },
  { key: 'farmers',   label: 'Farmers',   icon: Tractor, description: 'Farmer accounts only' },
];

const AdminNotifications = () => {
  const [form, setForm] = useState({ title: '', message: '', target: 'all' });
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState([]);
  const [loadingSent, setLoadingSent] = useState(true);

  const fetchSent = async () => {
    setLoadingSent(true);
    try {
      const data = await adminApi.getSentNotifications({
        type: 'system',
        per_page: 30,
      });
      // Backend returns paginated data: { data: [...], current_page, ... }
      setSent(data?.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingSent(false);
    }
  };

  useEffect(() => {
    fetchSent();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title.trim() || !form.message.trim()) {
      toast.error('Title and message are required');
      return;
    }
    setSending(true);
    try {
      const data = await adminApi.broadcastNotification(form);
      toast.success(data?.message || 'Notification sent');
      setForm({ title: '', message: '', target: 'all' });
      fetchSent();
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Failed to send');
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="dashboard-page">
      <Navbar />
      <div className="dashboard-layout">
        <AdminSidebar />
        <main className="dashboard-main">

          <div className="dashboard-header">
            <h1 className="dashboard-title">Notifications</h1>
            <p className="dashboard-subtitle">
              Broadcast announcements and view sent notifications
            </p>
          </div>

          <div className="admin-notif-layout">

            {/* Left: Broadcast form */}
            <div className="dashboard-card">
              <div className="card-header-row">
                <div>
                  <h3 className="card-title">Send Announcement</h3>
                  <p className="card-subtitle">
                    Message will be delivered instantly to all selected users
                  </p>
                </div>
                <span className="admin-notif-badge">
                  <Megaphone size={13} />
                  Broadcast
                </span>
              </div>

              <form onSubmit={handleSubmit} className="admin-notif-form">

                <div className="admin-notif-group">
                  <label className="admin-notif-label">Send to</label>
                  <div className="admin-notif-targets">
                    {TARGETS.map((t) => {
                      const Icon = t.icon;
                      return (
                        <button
                          key={t.key}
                          type="button"
                          className={`admin-notif-target ${
                            form.target === t.key ? 'active' : ''
                          }`}
                          onClick={() => setForm({ ...form, target: t.key })}
                        >
                          <Icon size={16} />
                          <div>
                            <strong>{t.label}</strong>
                            <span>{t.description}</span>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="admin-notif-group">
                  <label className="admin-notif-label">Title</label>
                  <input
                    type="text"
                    className="admin-notif-input"
                    placeholder="e.g. Holiday Schedule Update"
                    value={form.title}
                    onChange={(e) =>
                      setForm({ ...form, title: e.target.value })
                    }
                    maxLength={150}
                    required
                  />
                  <span className="admin-notif-char">
                    {form.title.length}/150
                  </span>
                </div>

                <div className="admin-notif-group">
                  <label className="admin-notif-label">Message</label>
                  <textarea
                    className="admin-notif-input admin-notif-textarea"
                    rows={5}
                    placeholder="Write your announcement..."
                    value={form.message}
                    onChange={(e) =>
                      setForm({ ...form, message: e.target.value })
                    }
                    required
                  />
                </div>

                <button
                  type="submit"
                  className="admin-notif-submit"
                  disabled={sending}
                >
                  {sending ? (
                    'Sending...'
                  ) : (
                    <>
                      <Send size={15} />
                      Send Notification
                    </>
                  )}
                </button>
              </form>
            </div>

            {/* Right: Sent history */}
            <div className="dashboard-card">
              <div className="card-header-row">
                <div>
                  <h3 className="card-title">Recently Sent</h3>
                  <p className="card-subtitle">Last 30 system announcements</p>
                </div>
              </div>

              {loadingSent ? (
                <Loader message="Loading..." />
              ) : sent.length === 0 ? (
                <EmptyState
                  icon="bell-slash"
                  title="Nothing Sent Yet"
                  message="Your broadcasts will appear here."
                />
              ) : (
                <div className="admin-notif-history">
                  {sent.map((s) => (
                    <div key={s.id} className="admin-notif-history-item">
                      <span className="admin-notif-history-icon">
                        <Bell size={13} />
                      </span>
                      <div className="admin-notif-history-body">
                        <span className="admin-notif-history-title">
                          {s.title}
                        </span>
                        <p className="admin-notif-history-msg">{s.message}</p>
                        <div className="admin-notif-history-meta">
                          <span>→ {s.user?.username || 'Unknown'}</span>
                          <span>·</span>
                          <span>{formatDate(s.created_at)}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

          </div>

        </main>
      </div>
      <Footer />
    </div>
  );
};

export default AdminNotifications;