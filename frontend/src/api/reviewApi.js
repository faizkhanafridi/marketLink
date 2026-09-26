import axiosInstance from './axiosConfig';

export const reviewApi = {
  create: async (reviewData) => {
    const response = await axiosInstance.post('/reviews', reviewData);
    return response.data;
  },

  reply: async (id, reply) => {
    const response = await axiosInstance.post(`/reviews/${id}/reply`, { reply });
    return response.data;
  },
};