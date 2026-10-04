import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/app/admin/_components/ui';
import { toast } from 'sonner';

interface ScanResponse {
  data?: {
    participantName: string;
  };
}

export function useScanner(eventId: string, onSuccessScan: (name: string) => void, onErrorScan: (errorMsg: string) => void) {
  const queryClient = useQueryClient();

  const scanMutation = useMutation<ScanResponse, Error, string>({
    mutationFn: (registrationId: string) =>
      api(`/api/admin/events/${eventId}/scanner`, 'POST', { registration_id: registrationId }),
    onSuccess: (response) => {
      const name = response?.data?.participantName || 'Unknown';
      toast.success(`Checked In: ${name}!`);
      queryClient.invalidateQueries({ queryKey: ['admin-participants', eventId] });
      onSuccessScan(name);
    },
    onError: (error: any) => {
      const errorMsg = error.message || 'Invalid Ticket';
      toast.error(errorMsg);
      onErrorScan(errorMsg);
    },
  });

  return {
    scanTicket: (registrationId: string) => scanMutation.mutate(registrationId),
    isScanning: scanMutation.isPending,
  };
}
