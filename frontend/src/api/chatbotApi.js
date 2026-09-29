import axiosInstance from './axiosConfig';

export const chatbotApi = {
  sendMessage: async (message) => {
    const response = await axiosInstance.post('/chatbot', { message });
    return response.data;
  },
};