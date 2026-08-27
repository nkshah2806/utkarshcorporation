import api from "@/lib/api";

export const productsService = {
  /**
   * Get all products with optional filters
   */
  getProducts: async (params = {}) => {
    try {
      const response = await api.get("/products", { params });
      if (Array.isArray(response.data) && response.data.length > 0) {
        return response.data.map((p) => ({ ...p, id: p._id || p.id }));
      }
    } catch (error) {
      console.warn("Products API unavailable:", error.message);
    }
    return [];
  },

  /**
   * Get featured products
   */
  getFeaturedProducts: async (limit = 8) => {
    try {
      const response = await api.get("/products", {
        params: { featured: true, limit },
      });
      if (Array.isArray(response.data) && response.data.length > 0) {
        return response.data.map((p) => ({ ...p, id: p._id || p.id }));
      }
    } catch (error) {
      console.warn("Featured products API unavailable:", error.message);
    }
    return [];
  },

  /**
   * Get product by slug
   */
  getProductBySlug: async (slug) => {
    try {
      const response = await api.get(`/products/${slug}`);
      if (response.data) {
        return { ...response.data, id: response.data._id || response.data.id };
      }
    } catch (error) {
      console.warn("Product slug API error:", error.message);
    }
    throw new Error("Product not found");
  },

  /**
   * Get related products
   */
  getRelatedProducts: async (productId) => {
    try {
      const response = await api.get(`/products/${productId}/related`);
      if (Array.isArray(response.data) && response.data.length > 0) {
        return response.data.map((p) => ({ ...p, id: p._id || p.id }));
      }
    } catch (error) {
      console.warn("Related products API unavailable:", error.message);
    }
    return [];
  },

  /**
   * Get product reviews
   */
  getProductReviews: async (productId) => {
    try {
      const response = await api.get(`/products/${productId}/reviews`);
      if (Array.isArray(response.data)) {
        return response.data;
      }
    } catch (error) {
      console.warn("Product reviews API unavailable:", error.message);
    }
    return [];
  },

  /**
   * Add review to product
   */
  addReview: async (productId, reviewData) => {
    try {
      const response = await api.post(`/products/${productId}/reviews`, reviewData);
      return { ...response.data, id: response.data._id || response.data.id };
    } catch (error) {
      console.error("Error adding review:", error);
      throw error;
    }
  },

  /**
   * Create product (Admin)
   */
  createProduct: async (productData) => {
    try {
      const response = await api.post("/products", productData);
      return { ...response.data, id: response.data._id || response.data.id };
    } catch (error) {
      console.error("Error creating product:", error);
      throw error;
    }
  },

  /**
   * Update product (Admin)
   */
  updateProduct: async (id, productData) => {
    try {
      const response = await api.put(`/products/${id}`, productData);
      return { ...response.data, id: response.data._id || response.data.id };
    } catch (error) {
      console.error("Error updating product:", error);
      throw error;
    }
  },

  /**
   * Delete product (Admin)
   */
  deleteProduct: async (id) => {
    try {
      const response = await api.delete(`/products/${id}`);
      return response.data;
    } catch (error) {
      console.error("Error deleting product:", error);
      throw error;
    }
  },
};

