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
   * Get all health camps
   */
  getHealthCamps: async () => {
    try {
      const response = await api.get("/health-camps");
      return response.data;
    } catch (error) {
      console.error("Error fetching health camps:", error);
      throw error;
    }
  },
};
