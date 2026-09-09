import api from "@/lib/api";

export const galleryService = {
    /**
     * Get all active gallery items for the public Gallery page.
     * Backend responds with { success, count, data }, so unwrap to the array.
     */
    getActiveGallery: async () => {
        try {
            const response = await api.get("/gallery");
            return response.data?.data || [];
        } catch (error) {
            console.error("Error fetching gallery items:", error);
            throw error;
        }
    },
};
