import axiosInstance from './axiosConfig';

export const categoryApi = {
  getAll: async () => {
    const response = await axiosInstance.get('/categories');
    return response.data;
  },
};