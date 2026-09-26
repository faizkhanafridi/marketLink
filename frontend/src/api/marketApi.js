import axiosInstance from './axiosConfig';

export const marketApi = {
  getAll: async () => {
    const response = await axiosInstance.get('/markets');
    return response.data;
  },

  getById: async (id) => {
    const response = await axiosInstance.get(`/markets/${id}`);
    return response.data;
  },

  getNearby: async (latitude, longitude, radius = 10) => {
    const response = await axiosInstance.get('/markets/nearby', {
      params: { latitude, longitude, radius },
    });
    return response.data;
  },

  create: async (marketData) => {
    const response = await axiosInstance.post('/admin/markets', marketData);
    return response.data;
  },

  update: async (id, marketData) => {
    const response = await axiosInstance.put(`/admin/markets/${id}`, marketData);
    return response.data;
  },

  delete: async (id) => {
    const response = await axiosInstance.delete(`/admin/markets/${id}`);
    return response.data;
  },
};