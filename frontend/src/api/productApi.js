import axiosInstance from './axiosConfig';

export const productApi = {
  getAll: async (filters = {}) => {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        params.append(key, value);
      }
    });
    const response = await axiosInstance.get(`/products?${params.toString()}`);
    return response.data;
  },

  getById: async (id) => {
    const response = await axiosInstance.get(`/products/${id}`);
    return response.data;
  },

  create: async (payload) => {
    const isFormData = payload instanceof FormData;

    const response = await axiosInstance.post('/products', payload, {
      headers: isFormData
        ? { 'Content-Type': 'multipart/form-data' }
        : { 'Content-Type': 'application/json' },
    });
    return response.data;
  },

  update: async (id, payload) => {
    const isFormData = payload instanceof FormData;

    if (isFormData) {
      // Method spoofing — POST with _method=PUT so PHP parses the multipart body
      payload.append('_method', 'PUT');
      const response = await axiosInstance.post(`/products/${id}`, payload, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return response.data;
    }

    const response = await axiosInstance.put(`/products/${id}`, payload);
    return response.data;
  },

  delete: async (id) => {
    const response = await axiosInstance.delete(`/products/${id}`);
    return response.data;
  },

  markSoldOut: async (id) => {
    const response = await axiosInstance.patch(`/products/${id}/sold-out`);
    return response.data;
  },

  getReviews: async (id) => {
    const response = await axiosInstance.get(`/products/${id}/reviews`);
    return response.data;
  },
};