import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/app/admin/_components/ui';
import { toast } from 'sonner';

export interface EventRow {
  id: string;
  title: string;
  description: string | null;
  poster_url: string | null;
  status: 'upcoming' | 'ongoing' | 'completed' | 'cancelled';
  event_date: string;
  event_end_date: string | null;
  venue: string | null;
  category: string | null;
  is_paid: boolean;
  entry_fee: number | null;
  csi_entry_fee: number | null;
  payment_qr_url: string | null;
  is_registration_open: boolean;
  registration_start_date: string | null;
  registration_end_date: string | null;
  max_participants: number | null;
  current_participants: number;
  tags: string[];
  is_active: boolean;
}

export function useAdminEvents() {
  const queryClient = useQueryClient();

  const query = useQuery<EventRow[]>({
    queryKey: ['admin-events'],
    queryFn: () => api('/api/admin/events', 'GET'),
  });

  const createMutation = useMutation({
    mutationFn: (newEvent: Partial<EventRow>) =>
      api('/api/admin/events', 'POST', { status: 'upcoming', is_active: true, ...newEvent }),
    onSuccess: () => {
      toast.success('Event created successfully');
      queryClient.invalidateQueries({ queryKey: ['admin-events'] });
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to create event');
    },
  });

  const updateMutation = useMutation({
    mutationFn: (updatedEvent: Partial<EventRow>) =>
      api('/api/admin/events', 'PUT', updatedEvent),
    onSuccess: () => {
      toast.success('Event updated successfully');
      queryClient.invalidateQueries({ queryKey: ['admin-events'] });
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to update event');
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => api('/api/admin/events', 'DELETE', { id }),
    onSuccess: () => {
      toast.success('Event deleted successfully');
      queryClient.invalidateQueries({ queryKey: ['admin-events'] });
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to delete event');
    },
  });

  return {
    events: query.data || [],
    isLoading: query.isLoading,
    isMutating: createMutation.isPending || updateMutation.isPending || deleteMutation.isPending,
    isDeletingId: deleteMutation.isPending ? deleteMutation.variables : null,
    isUpdatingId: updateMutation.isPending ? updateMutation.variables?.id : null,
    error: query.error || createMutation.error || updateMutation.error || deleteMutation.error,
    createEvent: createMutation.mutate,
    updateEvent: updateMutation.mutate,
    deleteEvent: deleteMutation.mutate,
  };
}
