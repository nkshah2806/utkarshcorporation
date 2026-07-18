import { useQuery } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";

/**
 * Custom hook for API queries with automatic error handling
 * Shows toast on error if enabled
 */
export function useApiQuery(
  queryKey,
  queryFn,
  options = {}
) {
  const { toast } = useToast();

  const {
    showErrorToast = true,
    errorMessage = "Failed to fetch data",
    ...queryOptions
  } = options;

  return useQuery({
    queryKey,
    queryFn: async () => {
      try {
        return await queryFn();
      } catch (error) {
        if (showErrorToast) {
          const errorMsg =
            error?.response?.data?.message ||
            error?.response?.data?.detail ||
            error?.message ||
            errorMessage;

          toast({
            title: "Error",
            description: errorMsg,
            variant: "destructive",
          });
        }
        throw error;
      }
    },
    ...queryOptions,
  });
}
