import axiosInstance from './axiosConfig';

export const farmerApi = {
  getAll: async () => {
    const response = await axiosInstance.get('/farmers');
    return response.data;
  },

  getById: async (id) => {
    const response = await axiosInstance.get(`/farmers/${id}`);
    return response.data;
  },

  updateProfile: async (profileData) => {
    const response = await axiosInstance.put('/farmer/profile', profileData);
    return response.data;
  },

  getDashboard: async () => {
    const response = await axiosInstance.get('/farmer/dashboard');
    return response.data;
  },

  getReviews: async (id) => {
    const response = await axiosInstance.get(`/farmers/${id}/reviews`);
    return response.data;
  },

    getAnalytics: (params) => axiosInstance.get('/farmer/analytics', { params }),

};