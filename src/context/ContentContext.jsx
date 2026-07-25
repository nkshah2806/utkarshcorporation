import { createContext, useContext, useState, useEffect } from "react";
import { contentService, DEFAULT_CONTENT } from "@/services/contentService";
import { toast } from "sonner";

const ContentContext = createContext({
  content: DEFAULT_CONTENT,
  loading: true,
  updateContent: async () => {},
  resetContent: async () => {},
});

export function ContentProvider({ children }) {
  const [content, setContent] = useState(DEFAULT_CONTENT);
  const [loading, setLoading] = useState(true);

  const loadContent = async () => {
    try {
      const data = await contentService.getContent();
      setContent(data);
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
      setContent(updated);
      toast.success("Site dynamic content updated successfully!");
      return updated;
    } catch (err) {
      toast.error("Failed to update site content");
      throw err;
    }
  };

  const handleResetContent = async () => {
    try {
      const reset = await contentService.resetContent();
      setContent(reset);
      toast.success("Site dynamic content reset to defaults!");
      return reset;
    } catch (err) {
      toast.error("Failed to reset site content");
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
