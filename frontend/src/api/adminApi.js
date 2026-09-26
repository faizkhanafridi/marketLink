import axiosInstance from './axiosConfig';

export const adminApi = {
  getDashboard: async () => {
    const response = await axiosInstance.get('/admin/dashboard');
    return response.data;
  },

  getUsers: async (role) => {
    const params = role ? `?role=${role}` : '';
    const response = await axiosInstance.get(`/admin/users${params}`);
    return response.data;
  },

  approveFarmer: async (id) => {
    const response = await axiosInstance.patch(`/admin/users/${id}/approve`);
    return response.data;
  },

  toggleUserStatus: async (id) => {
    const response = await axiosInstance.patch(`/admin/users/${id}/toggle-status`);
    return response.data;
  },
getReviews: async () => {
  const response = await axiosInstance.get('/admin/reviews');
  return response.data;
},
  deleteReview: async (id) => {
    const response = await axiosInstance.delete(`/admin/reviews/${id}`);
    return response.data;
  },

  getReports: async () => {
    const response = await axiosInstance.get('/admin/reports');
    return response.data;
  },

  getCategories: async () => {
    const response = await axiosInstance.get('/admin/categories');
    return response.data;
  },

  createCategory: async (data) => {
    const response = await axiosInstance.post('/admin/categories', data);
    return response.data;
  },

  deleteCategory: async (id) => {
    const response = await axiosInstance.delete(`/admin/categories/${id}`);
    return response.data;
  },

  
};