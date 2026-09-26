import axiosInstance from './axiosConfig';

export const favoriteApi = {
  getAll: async () => {
    const response = await axiosInstance.get('/favorites');
    return response.data;
  },

  toggle: async (data) => {
    const response = await axiosInstance.post('/favorites/toggle', data);
    return response.data;
  },
};