import axiosInstance from "./axiosConfig";

export const farmerApi = {
  getAll: async () => {
    const response = await axiosInstance.get("/farmers");
    return response.data;
  },

  getById: async (id) => {
    const response = await axiosInstance.get(`/farmers/${id}`);
    return response.data;
  },

  updateProfile: async (profileData) => {
    const response = await axiosInstance.put("/farmer/profile", profileData);
    return response.data;
  },

  getDashboard: async () => {
    const response = await axiosInstance.get("/farmer/dashboard");
    return response.data;
  },

  getReviews: async (id) => {
    const response = await axiosInstance.get(`/farmers/${id}/reviews`);
    return response.data;
  },

  getAnalytics: async ({ range = 30 } = {}) => {
    const response = await axiosInstance.get("/farmer/analytics", {
      params: { range },
    });
    return response.data;
  },
  getSales: async ({ range = 30 } = {}) => {
    const response = await axiosInstance.get("/farmer/sales", {
      params: { range },
    });
    return response.data;
  },

  getMyProducts: async () => {
  const response = await axiosInstance.get('/farmer/products');
  return response.data;
},
};
