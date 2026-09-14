import { createContext, useContext, useState, useEffect, useMemo } from "react";
import { useTranslation } from "react-i18next";
import {
  contentService,
  DEFAULT_CONTENT,
  localizeContent,
} from "@/services/contentService";
import { toast } from "sonner";

const ContentContext = createContext({
  content: DEFAULT_CONTENT,
  loading: true,
  updateContent: async () => { },
  resetContent: async () => { },
});

export function ContentProvider({ children }) {
  // Raw content is kept exactly as returned by the API (may contain localized
  // leaves such as { en, hi, gu }); `content` is the language-resolved view
  // that every consumer renders.
  const [rawContent, setRawContent] = useState(DEFAULT_CONTENT);
  const [loading, setLoading] = useState(true);
  const { t, i18n } = useTranslation();
  const lang = i18n.language || "en";

  // Re-resolve dynamic backend content whenever the language changes so the
  // whole site (including API-driven content) switches instantly.
  const content = useMemo(
    () => localizeContent(rawContent, lang),
    [rawContent, lang]
  );

  const loadContent = async () => {
    try {
      const data = await contentService.getContent();
      setRawContent(data);
    } catch (err) {
      console.error("Failed to load content context:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadContent();
  }, []);

  const handleUpdateContent = async (newContent) => {
    try {
      const updated = await contentService.updateContent(newContent);
      setRawContent(updated);
      toast.success(t("common.siteContentUpdated"));
      return updated;
    } catch (err) {
      toast.error(t("common.siteContentUpdateFailed"));
      throw err;
    }
  };

  const handleResetContent = async () => {
    try {
      const reset = await contentService.resetContent();
      setRawContent(reset);
      toast.success(t("common.siteContentReset"));
      return reset;
    } catch (err) {
      toast.error(t("common.siteContentResetFailed"));
      throw err;
    }
  };

  return (
    <ContentContext.Provider
      value={{
        content,
        loading,
        updateContent: handleUpdateContent,
        resetContent: handleResetContent,
        refreshContent: loadContent,
      }}
    >
      {children}
    </ContentContext.Provider>
  );
}

export function useContent() {
  const context = useContext(ContentContext);
  if (!context) {
    throw new Error("useContent must be used within a ContentProvider");
  }
  return context;
}
