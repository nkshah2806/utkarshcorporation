import api from "@/lib/api";

export const productsService = {
  /**
   * Get all products with optional filters
   */
  getProducts: async (params = {}) => {
    try {
      const response = await api.get("/products", { params });
      return response.data;
    } catch (error) {
      console.error("Error fetching products:", error);
      throw error;
    }
  },

  /**
   * Get featured products
   */
  getFeaturedProducts: async (limit = 8) => {
    try {
      const response = await api.get("/products", {
        params: { featured: true, limit },
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching featured products:", error);
      throw error;
    }
  },

  /**
   * Get product by slug
   */
  getProductBySlug: async (slug) => {
    try {
      const response = await api.get(`/products/${slug}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching product:", error);
      throw error;
    }
  },

  /**
   * Get related products
   */
  getRelatedProducts: async (productId) => {
    try {
      const response = await api.get(`/products/${productId}/related`);
      return response.data;
    } catch (error) {
      console.error("Error fetching related products:", error);
      throw error;
    }
  },

  /**
   * Get product reviews
   */
  getProductReviews: async (productId) => {
    try {
      const response = await api.get(`/products/${productId}/reviews`);
      return response.data;
    } catch (error) {
      console.error("Error fetching reviews:", error);
      throw error;
    }
  },

  /**
   * Add review to product
   */
  addReview: async (productId, reviewData) => {
    try {
      const response = await api.post(`/products/${productId}/reviews`, reviewData);
      return response.data;
    } catch (error) {
      console.error("Error adding review:", error);
      throw error;
    }
  },
};
