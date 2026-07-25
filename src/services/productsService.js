import api from "@/lib/api";

export const DEFAULT_PRODUCTS = [
  {
    id: "prod_1",
    name: "Premium Special Chyawanprash",
    slug: "premium-special-chyawanprash",
    category_slug: "immunity-boosters",
    price: 499,
    mrp: 650,
    short_description: "Fortified with 40+ authentic herbs & Amla for immunity, vitality & daily energy.",
    description: "Prepared according to traditional Ayurvedic methods using fresh Amla, Pure Desi Ghee, Saffron, and over 40 potent herbs. Recommended for daily consumption for all age groups.",
    images: ["https://images.unsplash.com/photo-1577401239170-897942555fb3?crop=entropy&cs=srgb&fm=jpg&q=85&w=800"],
    is_bestseller: true,
    is_featured: true,
    rating: 4.9,
    review_count: 128,
    reviews: [
      { id: "r1", user: "Rohan V.", rating: 5, title: "Excellent quality", body: "Tastes genuine and keeps fatigue away.", date: "2026-05-10" },
    ],
    stock: 200,
    ailment: "Immunity & Cold Protection",
  },
  {
    id: "prod_2",
    name: "Ashwagandha Gold KSM-66 Capsules",
    slug: "ashwagandha-gold-ksm66-capsules",
    category_slug: "herbal-supplements",
    price: 380,
    mrp: 499,
    short_description: "High potency root extract for stress relief, stamina, and deep restorative sleep.",
    description: "Standardized organic Ashwagandha root extract capsules. Helps lower cortisol, improve energy, enhance focus, and support natural sleep cycles.",
    images: ["https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?crop=entropy&cs=srgb&fm=jpg&q=85&w=800"],
    is_bestseller: true,
    is_featured: true,
    rating: 4.8,
    review_count: 94,
    reviews: [
      { id: "r2", user: "Meera K.", rating: 5, title: "Great sleep support", body: "Helps me unwind after long workdays.", date: "2026-06-01" },
    ],
    stock: 150,
    ailment: "Stress & Sleep",
  },
  {
    id: "prod_3",
    name: "Organic Triphala Churna",
    slug: "organic-triphala-churna",
    category_slug: "digestion-and-gut",
    price: 249,
    mrp: 320,
    short_description: "Pure Haritaki, Bibhitaki & Amalaki powder for gentle daily colon detox.",
    description: "100% pure organic triphala powder. Promotes regular bowel movements, cleanses digestive tract, and supports nutrient absorption.",
    images: ["https://images.unsplash.com/photo-1512069772995-ec65ed45afd6?crop=entropy&cs=srgb&fm=jpg&q=85&w=800"],
    is_bestseller: true,
    is_featured: false,
    rating: 4.7,
    review_count: 76,
    reviews: [],
    stock: 180,
    ailment: "Constipation & Digestion",
  },
  {
    id: "prod_4",
    name: "Kumkumadi Glow Facial Oil",
    slug: "kumkumadi-glow-facial-oil",
    category_slug: "hair-and-skin-care",
    price: 599,
    mrp: 799,
    short_description: "Traditional Saffron & Chandan Ayurvedic oil for radiant skin tone.",
    description: "Luxurious blend of Kashmiri Saffron, Sandalwood, Lotus pollen, and 26 precious herbs infused in pure sesame oil. Brightens complexion and fades dark spots.",
    images: ["https://images.unsplash.com/photo-1608248597263-00079e9603f2?crop=entropy&cs=srgb&fm=jpg&q=85&w=800"],
    is_bestseller: false,
    is_featured: true,
    rating: 4.9,
    review_count: 63,
    reviews: [],
    stock: 90,
    ailment: "Skin Brightening",
  },
  {
    id: "prod_5",
    name: "Mahabhringraj Hair Growth Oil",
    slug: "mahabhringraj-hair-growth-oil",
    category_slug: "hair-and-skin-care",
    price: 349,
    mrp: 450,
    short_description: "Cold-pressed sesame oil base with pure Bhringraj, Amla and Sesame for hair strength.",
    description: "Nourishes scalp roots, prevents premature greying, and reduces hair fall. Formulated per classical Kshirapaka Vidhi.",
    images: ["https://images.unsplash.com/photo-1526947425960-945c6e72858f?crop=entropy&cs=srgb&fm=jpg&q=85&w=800"],
    is_bestseller: true,
    is_featured: true,
    rating: 4.8,
    review_count: 110,
    reviews: [],
    stock: 140,
    ailment: "Hair Fall",
  },
  {
    id: "prod_6",
    name: "Pure Shilajit Resin Gold",
    slug: "pure-shilajit-resin-gold",
    category_slug: "wellness-essentials",
    price: 899,
    mrp: 1200,
    short_description: "Purified Himalayan Shilajit rich in 80+ minerals & Fulvic Acid.",
    description: "Authentic soft resin Shilajit extracted from high-altitude Himalayan peaks. Enhances stamina, strength, and cellular metabolism.",
    images: ["https://images.unsplash.com/photo-1506126613408-eca07ce68773?crop=entropy&cs=srgb&fm=jpg&q=85&w=800"],
    is_bestseller: true,
    is_featured: true,
    rating: 4.9,
    review_count: 85,
    reviews: [],
    stock: 80,
    ailment: "Stamina & Energy",
  },
];

const filterLocalProducts = (params = {}) => {
  let list = [...DEFAULT_PRODUCTS];
  const { category, q, sort, bestseller, featured, min_price, max_price, ailment, limit } = params;

  if (category) list = list.filter((p) => p.category_slug === category);
  if (bestseller === "true" || bestseller === true) list = list.filter((p) => p.is_bestseller);
  if (featured === "true" || featured === true) list = list.filter((p) => p.is_featured);
  if (ailment) list = list.filter((p) => p.ailment?.toLowerCase().includes(ailment.toLowerCase()));
  if (min_price) list = list.filter((p) => p.price >= Number(min_price));
  if (max_price) list = list.filter((p) => p.price <= Number(max_price));
  if (q) {
    const search = q.toLowerCase();
    list = list.filter(
      (p) =>
        p.name.toLowerCase().includes(search) ||
        p.short_description.toLowerCase().includes(search) ||
        p.category_slug.toLowerCase().includes(search)
    );
  }

  if (sort === "price_asc") list.sort((a, b) => a.price - b.price);
  else if (sort === "price_desc") list.sort((a, b) => b.price - a.price);
  else if (sort === "popular") list.sort((a, b) => b.rating - a.rating);

  if (limit) list = list.slice(0, Number(limit));

  return list;
};

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
      console.warn("Products API unavailable, using filtered default products:", error.message);
    }
    return filterLocalProducts(params);
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
      console.warn("Featured products API unavailable, using fallback:", error.message);
    }
    return filterLocalProducts({ featured: true, limit });
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
      console.warn("Product slug API error, searching fallback:", error.message);
    }
    const found = DEFAULT_PRODUCTS.find((p) => p.slug === slug || p.id === slug);
    if (found) return found;
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
      console.warn("Related products API unavailable, using fallback:", error.message);
    }
    return DEFAULT_PRODUCTS.filter((p) => p.id !== productId).slice(0, 4);
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
    const prod = DEFAULT_PRODUCTS.find((p) => p.id === productId);
    return prod?.reviews || [];
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

