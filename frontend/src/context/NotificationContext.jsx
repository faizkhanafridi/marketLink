import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from 'react';
import { notificationApi } from '../api';
import { useAuth } from '../hooks/useAuth';

const NotificationContext = createContext(null);

export const NotificationProvider = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);

  const fetchNotifications = useCallback(
    async (limit = 20) => {
      if (!isAuthenticated) return;
      setLoading(true);
      try {
        const data = await notificationApi.getAll({ limit });
        // Backend returns { notifications: [...], unread_count: N }
        setNotifications(data?.notifications || []);
        setUnreadCount(data?.unread_count || 0);
      } catch (err) {
        console.error('Failed to load notifications:', err);
      } finally {
        setLoading(false);
      }
    },
    [isAuthenticated]
  );

  const fetchUnreadCount = useCallback(async () => {
    if (!isAuthenticated) return;
    try {
      const data = await notificationApi.getUnreadCount();
      setUnreadCount(data?.unread_count || 0);
    } catch {
      // silent fail — background poll
    }
  }, [isAuthenticated]);

  const markAsRead = useCallback(async (id) => {
    try {
      await notificationApi.markAsRead(id);
      setNotifications((prev) =>
        prev.map((n) =>
          n.id === id
            ? { ...n, is_read: true, read_at: new Date().toISOString() }
            : n
        )
      );
      setUnreadCount((c) => Math.max(0, c - 1));
    } catch (err) {
      console.error(err);
    }
  }, []);

  const markAllAsRead = useCallback(async () => {
    try {
      await notificationApi.markAllAsRead();
      setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })));
      setUnreadCount(0);
    } catch (err) {
      console.error(err);
    }
  }, []);

  const removeNotification = useCallback(
    async (id) => {
      try {
        const target = notifications.find((n) => n.id === id);
        await notificationApi.delete(id);
        setNotifications((prev) => prev.filter((n) => n.id !== id));
        if (target && !target.is_read) {
          setUnreadCount((c) => Math.max(0, c - 1));
        }
      } catch (err) {
        console.error(err);
      }
    },
    [notifications]
  );

  const clearAll = useCallback(async () => {
    try {
      await notificationApi.clearAll();
      setNotifications([]);
      setUnreadCount(0);
    } catch (err) {
      console.error(err);
    }
  }, []);

  // Initial fetch on login + background poll for unread count
  useEffect(() => {
    if (!isAuthenticated) {
      setNotifications([]);
      setUnreadCount(0);
      return;
    }
    fetchNotifications();
    const interval = setInterval(fetchUnreadCount, 60000); // every 60s
    return () => clearInterval(interval);
  }, [isAuthenticated, fetchNotifications, fetchUnreadCount]);

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        loading,
        fetchNotifications,
        fetchUnreadCount,
        markAsRead,
        markAllAsRead,
        removeNotification,
        clearAll,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => {
  const ctx = useContext(NotificationContext);
  if (!ctx)
    throw new Error(
      'useNotifications must be used within a NotificationProvider'
    );
  return ctx;
};