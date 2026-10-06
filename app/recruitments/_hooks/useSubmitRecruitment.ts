import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';

export function useSubmitRecruitment() {
  return useMutation({
    mutationFn: async (formData: FormData) => {
      const response = await fetch('/api/recruitments', {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();

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
