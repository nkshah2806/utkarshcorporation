import api from "@/lib/api";

export const ordersService = {
  /**
   * Get all orders for the current user
   */
  getMyOrders: async () => {
    try {
      const response = await api.get("/orders/mine");
      return response.data;
    } catch (error) {
      console.error("Error fetching orders:", error);
      throw error;
    }
  },

  /**
   * Get a specific order by ID
   */
  getOrderById: async (orderId) => {
    try {
      const response = await api.get(`/orders/${orderId}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching order:", error);
      throw error;
    }
  },

  /**
   * Create a new order (checkout)
   */
  createOrder: async (payload) => {
    try {
      const response = await api.post("/checkout", payload);
      return response.data;
    } catch (error) {
      console.error("Error creating order:", error);
      throw error;
    }
  },

  /**
   * Cancel an order
   */
  cancelOrder: async (orderId) => {
    try {
      const response = await api.put(`/orders/${orderId}/cancel`);
      return response.data;
    } catch (error) {
      console.error("Error canceling order:", error);
      throw error;
    }
  },
};
