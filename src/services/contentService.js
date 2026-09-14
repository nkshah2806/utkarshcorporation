import api from "@/lib/api";

const STORAGE_KEY = "uc_site_dynamic_content";

export const DEFAULT_CONTENT = {
  header: {
    announcement: "",
    searchPlaceholder: "",
  },
  hero: {
    badge: "",
    titleLine1: "",
    titleLine2: "",
    description: "",
    primaryCtaText: "",
    primaryCtaLink: "",
    secondaryCtaText: "",
    secondaryCtaLink: "",
    bgImage: "",
  },
  trustBadges: [],
  mission: {
    badge: "",
    title: "",
    paragraph1: "",
    paragraph2: "",
    image: "",
    stats: []
  },
  testimonials: [],
  distributorCta: {
    badge: "",
    title: "",
    description: "",
    ctaText: "",
    ctaLink: "",
  },
  footer: {
    brandDescription: "",
    phone: "",
    email: "",
    address: "",
    instagramUrl: "",
    facebookUrl: "",
    youtubeUrl: "",
    copyrightText: ""
  },
  about: {
    heroTitleLine1: "",
    heroTitleLine2: "",
    heroDescription: "",
    heroImage: "",
    storyTitle: "",
    values: [],
    certifications: []
  },
  healthCamps: {
    badge: "",
    title: "",
    description: "",
    camps: []
  },
  distributorPage: {
    heroTitle: "",
    heroSubtitle: "",
    benefits: [],
    steps: []
  },
  policies: {
    privacyPolicy: "",
    termsOfService: "",
    shippingPolicy: "",
    returnPolicy: ""
  }
};

const LANGUAGE_KEYS = ["en", "hi", "gu"];

/**
 * True when an object is a localized leaf, i.e. its keys are only language
 * codes (a subset of { en, hi, gu }). Such objects represent one field that has
 * per-language values, e.g. `{ en: "Welcome", hi: "स्वागत", gu: "સ્વાગત" }`.
 */
const isLocalizedLeaf = (value) =>
  value &&
  typeof value === "object" &&
  !Array.isArray(value) &&
  Object.keys(value).length > 0 &&
  Object.keys(value).every((k) => LANGUAGE_KEYS.includes(k));

/**
 * Resolve a localized leaf into a single string for `lang`, falling back to
 * English and then to any available translation so the UI never renders blank.
 */
export const pickLocalizedValue = (value, lang = "en") => {
  if (!value || typeof value !== "object") return value;
  return value[lang] ?? value.en ?? value.hi ?? value.gu ?? "";
};

/**
 * Recursively walk a site-content tree and flatten every localized leaf
 * (`{ en, hi, gu }`) into a plain string for the active language. Plain
 * strings, numbers and structural objects/arrays are preserved. This lets the
 * backend store multilingual dynamic content that the public site can render in
 * any of the supported languages without changing any component.
 */
export const localizeContent = (content, lang = "en") => {
  if (isLocalizedLeaf(content)) {
    return pickLocalizedValue(content, lang);
  }
  if (Array.isArray(content)) {
    return content.map((item) => localizeContent(item, lang));
  }
  if (content && typeof content === "object") {
    const out = {};
    for (const [key, value] of Object.entries(content)) {
      out[key] = localizeContent(value, lang);
    }
    return out;
  }
  return content;
};

const mergeContent = (dbData) => {
  if (!dbData || typeof dbData !== "object") return DEFAULT_CONTENT;
  return {
    header: { ...DEFAULT_CONTENT.header, ...(dbData.header || {}) },
    hero: { ...DEFAULT_CONTENT.hero, ...(dbData.hero || {}) },
    trustBadges: Array.isArray(dbData.trustBadges) && dbData.trustBadges.length > 0 ? dbData.trustBadges : DEFAULT_CONTENT.trustBadges,
    mission: { ...DEFAULT_CONTENT.mission, ...(dbData.mission || {}) },
    testimonials: Array.isArray(dbData.testimonials) && dbData.testimonials.length > 0 ? dbData.testimonials : DEFAULT_CONTENT.testimonials,
    distributorCta: { ...DEFAULT_CONTENT.distributorCta, ...(dbData.distributorCta || {}) },
    footer: { ...DEFAULT_CONTENT.footer, ...(dbData.footer || {}) },
    about: { ...DEFAULT_CONTENT.about, ...(dbData.about || {}) },
    healthCamps: { ...DEFAULT_CONTENT.healthCamps, ...(dbData.healthCamps || {}) },
    distributorPage: { ...DEFAULT_CONTENT.distributorPage, ...(dbData.distributorPage || {}) },
    policies: { ...DEFAULT_CONTENT.policies, ...(dbData.policies || {}) },
  };
};

export const contentService = {
  /**
   * Get dynamic content from backend Mongo API
   */
  getContent: async () => {
    try {
      const res = await api.get("/site-settings");
      if (res.data) {
        const merged = mergeContent(res.data);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(merged));
        return merged;
      }
    } catch (err) {
      console.warn("Backend fetch error for site settings, using fallback cache:", err);
    }
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) return JSON.parse(saved);
    } catch {
      // Corrupted storage
    }
    return DEFAULT_CONTENT;
  },

  /**
   * Update dynamic site content
   */
  updateContent: async (newContent) => {
    try {
      const res = await api.post("/site-settings", newContent);
      const merged = mergeContent(res.data || newContent);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(merged));
      return merged;
    } catch (err) {
      console.error("Error saving site dynamic content:", err);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newContent));
      return newContent;
    }
  },

  /**
   * Reset content to default initial state
   */
  resetContent: async () => {
    try {
      const res = await api.post("/site-settings", DEFAULT_CONTENT);
      const merged = mergeContent(res.data || DEFAULT_CONTENT);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(merged));
      return merged;
    } catch (err) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_CONTENT));
      return DEFAULT_CONTENT;
    }
  }
};
