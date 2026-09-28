import axiosInstance from './axiosConfig';

export const customerApi = {
  getDashboard: async () => {
    const response = await axiosInstance.get('/customer/dashboard');
    return response.data;
  },

  getPickupReminders: async () => {
    const response = await axiosInstance.get('/customer/pickup-reminders');
    return response.data;
  },
};