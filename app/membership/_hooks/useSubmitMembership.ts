import { useMutation } from '@tanstack/react-query';

interface SubmitMembershipOptions {
  onSuccess?: () => void;
  onError?: (error: string) => void;
}

export function useSubmitMembership(options?: SubmitMembershipOptions) {
  return useMutation({
    mutationFn: async (formData: FormData) => {
      const response = await fetch('/api/membership', {
        method: 'POST',
        body: formData,
      });

      // The server can answer with an HTML error page (e.g. a crash), which isn't JSON
      const data = await response.json().catch(() => null);
      if (!data) {
        throw new Error('Something went wrong on our side. Please try again in a few minutes.');
      }

      if (!response.ok) {
        throw new Error(data.error?.message || 'Failed to submit membership registration');
      }

      return data;
    },
    onSuccess: () => {
      options?.onSuccess?.();
    },
    onError: (error: Error) => {
      options?.onError?.(error.message);
    }
  });
}
