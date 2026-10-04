import { useQuery } from '@tanstack/react-query';
import { toast } from 'sonner';
import type { Event, RegistrationForm, ApiResponse } from '@/lib/types/events';

interface EventRegistrationData {
  event: Event;
  formSchema: RegistrationForm;
}

export function useEventRegistration(eventId: string) {
  return useQuery<EventRegistrationData>({
    queryKey: ['event-registration', eventId],
    queryFn: async () => {
      // Fetch both the event details and the dynamic form schema simultaneously
      const [eventRes, formRes] = await Promise.all([
        fetch(`/api/events/${eventId}`),
        fetch(`/api/events/${eventId}/registration-form`)
      ]);

      if (!eventRes.ok) {
        toast.error('Failed to fetch event details');
        throw new Error('Failed to fetch event details');
      }
      
      if (!formRes.ok) {
        toast.error('Failed to fetch registration form schema');
        throw new Error('Failed to fetch registration form schema');
      }

      const eventJson = (await eventRes.json()) as ApiResponse<Event>;
      const formJson = (await formRes.json()) as ApiResponse<RegistrationForm>;

      if (!eventJson.success || !eventJson.data) {
        const errorMsg = eventJson.error?.message || 'Failed to parse event data';
        toast.error(errorMsg);
        throw new Error(errorMsg);
      }

      if (!formJson.success || !formJson.data) {
        const errorMsg = formJson.error?.message || 'Failed to parse form schema';
        toast.error(errorMsg);
        throw new Error(errorMsg);
      }

      return {
        event: eventJson.data,
        formSchema: formJson.data
      };
    },
    // Don't fetch if there's no eventId
    enabled: !!eventId,
    // Keep the data fresh for a reasonable amount of time
    staleTime: 1000 * 60 * 5, 
  });
}
