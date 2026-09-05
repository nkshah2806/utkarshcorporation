import api from "@/lib/api";

export const contactService = {
  /**
   * Submit contact form
   */
  submitContactForm: async (formData) => {
    try {
      const response = await api.post("/contact", formData);
      return response.data;
    } catch (error) {
      console.error("Error submitting contact form:", error);
      throw error;
    }
  },

  /**
   * Submit distributor inquiry
   */
  submitDistributorInquiry: async (inquiryData) => {
    try {
      const response = await api.post("/distributor-inquiries", inquiryData);
      return response.data;
    } catch (error) {
      console.error("Error submitting distributor inquiry:", error);
      throw error;
    }
  },

  /**
   * Get all health camps (public)
   * Backend responds with { success, count, data }, so unwrap to the array.
   */
  getHealthCamps: async () => {
    try {
      const response = await api.get("/health-camps");
      return response.data?.data || [];
    } catch (error) {
      console.error("Error fetching health camps:", error);
      throw error;
    }
  },

  /**
   * Get a single health camp by id (public)
   */
  getHealthCampById: async (campId) => {
    try {
      const response = await api.get(`/health-camps/${campId}`);
      return response.data?.data || null;
    } catch (error) {
      console.error("Error fetching health camp:", error);
      throw error;
    }
  },

  /**
   * Register for a health camp (public)
   */
  registerForHealthCamp: async (campId, registrationData) => {
    try {
      const response = await api.post(`/health-camps/${campId}/register`, registrationData);
      return response.data;
    } catch (error) {
      console.error("Error registering for health camp:", error);
      throw error;
    }
  },
};
