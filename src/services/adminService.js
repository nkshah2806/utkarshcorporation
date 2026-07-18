import api from "@/lib/api";

export const adminService = {
  /**
   * Get admin statistics
   */
  getAdminStats: async () => {
    try {
      const response = await api.get("/admin/stats");
      return response.data;
    } catch (error) {
      console.error("Error fetching admin stats:", error);
      throw error;
    }
  },

  /**
   * Get all admin orders
   */
  getAdminOrders: async () => {
    try {
      const response = await api.get("/admin/orders");
      return response.data;
    } catch (error) {
      console.error("Error fetching admin orders:", error);
      throw error;
    }
  },

  /**
   * Get distributor inquiries
   */
  getDistributorInquiries: async () => {
    try {
      const response = await api.get("/admin/distributor-inquiries");
      return response.data;
    } catch (error) {
      console.error("Error fetching distributor inquiries:", error);
      throw error;
    }
  },
};
