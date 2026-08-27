import api from "@/lib/api";

export const categoriesService = {
  /**
   * Get all categories with backend API and fallback data
   */
  getCategories: async () => {
    try {
      const response = await api.get("/categories");
      if (Array.isArray(response.data) && response.data.length > 0) {
        return response.data.map((c) => ({ ...c, id: c._id || c.id }));
      }
    } catch (error) {
      console.warn("Categories API unavailable:", error.message);
    }
    return [];
  },

  /**
   * Get category by ID
   */
  getCategoryById: async (categoryId) => {
    try {
      const response = await api.get(`/categories/${categoryId}`);
      return { ...response.data, id: response.data._id || response.data.id };
    } catch (error) {
      console.warn("Category by ID API error:", error.message);
      throw error;
    }
  },

  /**
   * Create category (Admin)
   */
  createCategory: async (categoryData) => {
    try {
      const response = await api.post("/categories", categoryData);
      return { ...response.data, id: response.data._id || response.data.id };
    } catch (error) {
      console.error("Error creating category:", error);
      throw error;
    }
  },

  /**
   * Update category (Admin)
   */
  updateCategory: async (id, categoryData) => {
    try {
      const response = await api.put(`/categories/${id}`, categoryData);
      return { ...response.data, id: response.data._id || response.data.id };
    } catch (error) {
      console.error("Error updating category:", error);
      throw error;
    }
  },

  /**
   * Delete category (Admin)
   */
  deleteCategory: async (id) => {
    try {
      const response = await api.delete(`/categories/${id}`);
      return response.data;
    } catch (error) {
      console.error("Error deleting category:", error);
      throw error;
    }
  },
};

