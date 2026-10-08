import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';

export function useSubmitRecruitment() {
  return useMutation({
    mutationFn: async (formData: FormData) => {
      const response = await fetch('/api/recruitments', {
        method: 'POST',
        body: formData,
      });

      // The server can answer with an HTML error page (e.g. a crash), which isn't JSON
      const result = await response.json().catch(() => null);
      if (!result) {
        throw new Error('Something went wrong on our side. Please try again in a few minutes.');
      }

      if (!response.ok) {
        throw new Error(result.error?.message || 'Failed to submit application');
      }

      return result;
    },
    onSuccess: () => {
      toast.success('Your application has been submitted successfully!', {
        description: 'We will get back to you soon regarding the interview.',
      });
    },
    onError: (error: Error) => {
      toast.error('Submission failed', {
        description: error.message || 'Please try again later.',
      });
    },
  });
}
