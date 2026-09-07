import api from "@/lib/api";
import { formatApiError } from "@/lib/api";

export const LEGAL_CONTENT_TYPES = {
    PRIVACY_POLICY: "privacy_policy",
    TERMS_CONDITIONS: "terms_conditions",
};

/**
 * Public legal-content API access (Privacy Policy / Terms & Conditions).
 * The backend returns the single ACTIVE document for the requested type
 * (never hardcoded content on the frontend).
 */
export const legalContentService = {
    /**
     * Get the currently active legal document for a given type.
     * @param {string} type - one of LEGAL_CONTENT_TYPES values
     * @returns {Promise<object|null>} the active document or null when none is active
     */
    getActiveContent: async (type) => {
        try {
            const { data } = await api.get("/v1/legal-content/active", {
                params: { type },
            });
            return data?.data ?? null;
        } catch (error) {
            throw new Error(formatApiError(error));
        }
    },
};

export default legalContentService;
