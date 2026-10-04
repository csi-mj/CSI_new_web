import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { FormField } from '../[id]/builder/_components/types';
import { api } from '@/app/admin/_components/ui';
import { toast } from 'sonner';

export function useAdminFormBuilder(eventId: string) {
  const queryClient = useQueryClient();

  const {
    data: fields,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery<FormField[]>({
    queryKey: ['admin', 'events', eventId, 'registration-form'],
    queryFn: async () => {
      const response = await api(`/api/admin/events/${eventId}/registration-form`, 'GET');
      return response.data?.form_fields || [];
    },
  });

  const { mutate: saveForm, isPending: isSaving } = useMutation({
    mutationFn: async (form_fields: FormField[]) => {
      return api(`/api/admin/events/${eventId}/registration-form`, 'PUT', { form_fields });
    },
    onSuccess: () => {
      toast.success('Form saved successfully');
      queryClient.invalidateQueries({
        queryKey: ['admin', 'events', eventId, 'registration-form'],
      });
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to save form');
      console.error('Failed to save form:', error);
    },
  });

  return {
    fields,
    isLoading,
    isError,
    error,
    refetch,
    saveForm,
    isSaving,
  };
}
