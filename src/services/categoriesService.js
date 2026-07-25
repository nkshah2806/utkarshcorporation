import api from "@/lib/api";

export const DEFAULT_CATEGORIES = [
  {
    id: "cat_1",
    name: "Classical Medicines",
    slug: "classical-medicines",
    image: "https://images.unsplash.com/photo-1615485499958-69973683793c?crop=entropy&cs=srgb&fm=jpg&q=85&w=800",
    description: "Time-tested formulations, Rasayanas, Bhasmas, and Kwaths crafted per Samhitas.",
    order: 1,
  },
  {
    id: "cat_2",
    name: "Herbal Supplements",
    slug: "herbal-supplements",
    image: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?crop=entropy&cs=srgb&fm=jpg&q=85&w=800",
    description: "Pure single herb extracts including Ashwagandha, Shatavari, and Giloy.",
    order: 2,
  },
  {
    id: "cat_3",
    name: "Digestion & Gut",
    slug: "digestion-and-gut",
    image: "https://images.unsplash.com/photo-1512069772995-ec65ed45afd6?crop=entropy&cs=srgb&fm=jpg&q=85&w=800",
    description: "Ayurvedic Churnas, Aristhas, and Digestive Syrups for daily gut vitality.",
    order: 3,
  },
  {
    id: "cat_4",
    name: "Immunity Boosters",
    slug: "immunity-boosters",
    image: "https://images.unsplash.com/photo-1577401239170-897942555fb3?crop=entropy&cs=srgb&fm=jpg&q=85&w=800",
    description: "Chyawanprash, Kadha, and Vitamin-C enriched herbal formulas.",
    order: 4,
  },
  {
    id: "cat_5",
    name: "Hair & Skin Care",
    slug: "hair-and-skin-care",
    image: "https://images.unsplash.com/photo-1608248597263-00079e9603f2?crop=entropy&cs=srgb&fm=jpg&q=85&w=800",
    description: "Nourishing oils, Kumkumadi gels, and natural herbal face cleansers.",
    order: 5,
  },
  {
    id: "cat_6",
    name: "Wellness Essentials",
    slug: "wellness-essentials",
    image: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?crop=entropy&cs=srgb&fm=jpg&q=85&w=800",
    description: "Daily oils, massage churnas, pain relief tailams, and wellness teas.",
    order: 6,
  },
];

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
      console.warn("Categories API unavailable, using local default categories:", error.message);
    }
    return DEFAULT_CATEGORIES;
  },

  /**
   * Get category by ID
   */
  getCategoryById: async (categoryId) => {
    try {
      const response = await api.get(`/categories/${categoryId}`);
      return { ...response.data, id: response.data._id || response.data.id };
    } catch (error) {
      console.warn("Category by ID API error, searching fallback:", error.message);
      const found = DEFAULT_CATEGORIES.find((c) => c.id === categoryId || c.slug === categoryId);
      if (found) return found;
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

