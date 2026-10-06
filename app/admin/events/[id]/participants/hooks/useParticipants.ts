import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/app/admin/_components/ui';
import { toast } from 'sonner';

export interface Participant {
  id: string;
  event_id: string;
  user_name: string;
  user_email: string;
  user_phone: string | null;
  user_college: string | null;
  user_year: string | null;
  is_csi_member: boolean;
  transaction_id: string | null;
  payment_screenshot_url: string | null;
  additional_info: Record<string, any>;
  registration_status: 'pending' | 'confirmed' | 'rejected' | 'waitlisted';
  is_attended?: boolean;
  ticket_sent?: boolean;
  payment_mode?: 'online' | 'cash';
  created_at: string;
  updated_at: string;
}

export function useParticipants(eventId: string) {
  const queryClient = useQueryClient();

  const query = useQuery<{ data: { participants: Participant[] } }>({
    queryKey: ['admin-participants', eventId],
    queryFn: () => api(`/api/admin/events/${eventId}/participants`, 'GET'),
    enabled: !!eventId,
  });

  const updateMutation = useMutation({
    mutationFn: (data: { registration_id: string; status?: Participant['registration_status']; is_attended?: boolean }) =>
      api(`/api/admin/events/${eventId}/participants`, 'PATCH', data),
    onSuccess: (_, variables) => {
      if (variables.status) {
        toast.success(`Participant status updated to ${variables.status}`);
      }
      if (variables.is_attended !== undefined) {
        toast.success(`Participant marked as ${variables.is_attended ? 'attended' : 'not attended'}`);
      }
      queryClient.invalidateQueries({ queryKey: ['admin-participants', eventId] });
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to update participant');
    },
  });

  const sendTicketMutation = useMutation({
    mutationFn: (participantId: string) =>
      api(`/api/admin/events/${eventId}/participants/${participantId}/send-ticket`, 'POST'),
    onSuccess: () => {
      toast.success('Ticket email sent successfully!');
      queryClient.invalidateQueries({ queryKey: ['admin-participants', eventId] });
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to send ticket email');
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (participantId: string) =>
      api(`/api/admin/events/${eventId}/participants/${participantId}`, 'DELETE'),
    onSuccess: () => {
      toast.success('Participant deleted successfully!');
      queryClient.invalidateQueries({ queryKey: ['admin-participants', eventId] });
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to delete participant');
    },
  });

  return {
    participants: query.data?.data?.participants || [],
    isLoading: query.isLoading,
    isMutating: updateMutation.isPending,
    error: query.error || updateMutation.error,
    updateStatus: (registrationId: string, status: Participant['registration_status']) =>
      updateMutation.mutate({ registration_id: registrationId, status }),
    updateAttendance: (registrationId: string, is_attended: boolean) =>
      updateMutation.mutate({ registration_id: registrationId, is_attended }),
    sendTicket: (participantId: string) =>
      sendTicketMutation.mutate(participantId),
    sendingTicketId: sendTicketMutation.isPending ? sendTicketMutation.variables : null,
    deleteParticipant: (participantId: string) => deleteMutation.mutate(participantId),
    isDeletingId: deleteMutation.isPending ? deleteMutation.variables : null,
  };
}
