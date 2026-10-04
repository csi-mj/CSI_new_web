import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/app/admin/_components/ui';
import { toast } from 'sonner';

export interface PlatformSettings {
  id: number;
  platform_name: string;
  logo_url: string | null;
  default_payment_qr_url: string | null;
  contact_email: string | null;
  contact_phone: string | null;
  instagram_url: string | null;
  linkedin_url: string | null;
  website_url: string | null;
}

export function useAdminSettings() {
  const queryClient = useQueryClient();

  const {
    data: settings,
    isLoading,
    isError,
    error,
  } = useQuery<PlatformSettings>({
    queryKey: ['admin', 'settings'],
    queryFn: async () => {
      const response = await api('/api/admin/settings', 'GET');
      return response.data || {};
    },
  });

  const { mutate: updateSettings, isPending: isUpdating } = useMutation({
    mutationFn: async (payload: Partial<PlatformSettings>) => {
      return api('/api/admin/settings', 'PUT', payload);
    },
    onSuccess: () => {
      toast.success('Settings updated successfully');
      queryClient.invalidateQueries({
        queryKey: ['admin', 'settings'],
      });
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to update settings');
      console.error('Failed to update settings:', error);
    },
  });

  return {
    settings,
    isLoading,
    isError,
    error,
    updateSettings,
    isUpdating,
  };
}
