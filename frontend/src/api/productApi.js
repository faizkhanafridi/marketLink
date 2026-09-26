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

  create: async (productData) => {
    const response = await axiosInstance.post('/products', productData);
    return response.data;
  },

  uploadImage: async (file) => {
  const formData = new FormData();
  formData.append('image', file);

  const response = await axiosInstance.post(
    '/upload/product-image',
    formData,
    {
      headers: { 'Content-Type': 'multipart/form-data' },
    }
  );
  return response.data; // { path, url }
},
  update: async (id, productData) => {
    const response = await axiosInstance.put(`/products/${id}`, productData);
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