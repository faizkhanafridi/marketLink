import axiosInstance from './axiosConfig';

export const notificationApi = {
  // ============================================================
  // LIST / COUNT
  // ============================================================

  getAll: async (params = {}) => {
    const response = await axiosInstance.get('/notifications', { params });
    return response.data;
  },

  getUnreadCount: async () => {
    const response = await axiosInstance.get('/notifications/unread-count');
    return response.data;
  },

  // ============================================================
  // READ STATE
  // ============================================================

  markAsRead: async (id) => {
    const response = await axiosInstance.patch(`/notifications/${id}/read`);
    return response.data;
  },

  markAllAsRead: async () => {
    const response = await axiosInstance.patch('/notifications/read-all');
    return response.data;
  },

  // ============================================================
  // DELETE
  // ============================================================

  delete: async (id) => {
    const response = await axiosInstance.delete(`/notifications/${id}`);
    return response.data;
  },

  clearAll: async () => {
    const response = await axiosInstance.delete('/notifications');
    return response.data;
  },
};