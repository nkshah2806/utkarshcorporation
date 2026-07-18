import { useMutation } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";

/**
 * Custom hook for API mutations with automatic error handling
 * Shows toast on success and error, handles loading states
 */
export function useApiMutation(
  mutationFn,
  options = {}
) {
  const { toast } = useToast();

  const {
    onSuccess,
    onError,
    successMessage = "Operation successful",
    errorMessage = "Operation failed",
    showSuccessToast = true,
    showErrorToast = true,
  } = options;

  return useMutation({
    mutationFn,
    onSuccess: (data, variables, context) => {
      if (showSuccessToast) {
        toast({
          title: "Success",
          description: successMessage,
          variant: "default",
        });
      }
      onSuccess?.(data, variables, context);
    },
    onError: (error, variables, context) => {
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
      onError?.(error, variables, context);
    },
  });
}
