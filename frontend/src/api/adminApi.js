import axiosInstance from './axiosConfig';

export const adminApi = {
  // ============================================================
  // DASHBOARD
  // ============================================================

  getDashboard: async () => {
    const response = await axiosInstance.get('/admin/dashboard');

    return response.data;
  },

  // ============================================================
  // USERS
  // ============================================================

  getUsers: async (role) => {
    const params = role ? `?role=${role}` : '';

    const response = await axiosInstance.get(`/admin/users${params}`);

    return response.data;
  },

  approveFarmer: async (id) => {
    const response = await axiosInstance.patch(
      `/admin/users/${id}/approve`
    );

    return response.data;
  },

  toggleUserStatus: async (id) => {
    const response = await axiosInstance.patch(
      `/admin/users/${id}/toggle-status`
    );

    return response.data;
  },

  // ============================================================
  // REVIEWS
  // ============================================================

  getReviews: async () => {
    const response = await axiosInstance.get('/admin/reviews');

    return response.data;
  },

  deleteReview: async (id) => {
    const response = await axiosInstance.delete(
      `/admin/reviews/${id}`
    );

    return response.data;
  },

  // ============================================================
  // REPORTS
  // ============================================================

  getReports: async () => {
    const response = await axiosInstance.get('/admin/reports');

    return response.data;
  },

  // ============================================================
  // CATEGORIES
  // ============================================================

  getCategories: async () => {
    const response = await axiosInstance.get('/admin/categories');

    return response.data;
  },

  createCategory: async (data) => {
    const response = await axiosInstance.post(
      '/admin/categories',
      data
    );

    return response.data;
  },

  deleteCategory: async (id) => {
    const response = await axiosInstance.delete(
      `/admin/categories/${id}`
    );

    return response.data;
  },

  // ============================================================
  // ANALYTICS
  // ============================================================

  getAnalytics: async (params = {}) => {
    const response = await axiosInstance.get(
      '/admin/analytics',
      {
        params,
      }
    );

    // IMPORTANT:
    // Return response.data instead of the complete Axios response.
    // This keeps the API structure consistent with all other methods.
    return response.data;
  },

    // ============================================================
  // NOTIFICATIONS — BROADCAST & HISTORY
  // ============================================================

  broadcastNotification: async (data) => {
    const response = await axiosInstance.post(
      '/admin/notifications/broadcast',
      data
    );

    return response.data;
  },

  getSentNotifications: async (params = {}) => {
    const response = await axiosInstance.get('/admin/notifications', {
      params,
    });

    return response.data;
  },
};