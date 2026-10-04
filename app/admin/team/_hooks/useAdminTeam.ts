import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../../_components/ui';

export interface Member {
  id: string;
  sno: number | null;
  name: string;
  position: string | null;
  role: 'gb' | 'core' | 'execom';
  image_url: string | null;
  linkedin: string | null;
  github: string | null;
  mail: string | null;
  portfolio: string | null;
  gb_position: string | null;
  team_year: string | null;
  is_active: boolean;
}

export const useAdminTeam = () => {
  const queryClient = useQueryClient();

  const teamQuery = useQuery({
    queryKey: ['admin', 'team'],
    queryFn: async (): Promise<Member[]> => {
      return api('/api/admin/team', 'GET');
    },
  });

  const saveMutation = useMutation({
    mutationFn: async (member: Partial<Member>) => {
      if (member.id) {
        return api('/api/admin/team', 'PUT', member);
      } else {
        return api('/api/admin/team', 'POST', member);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'team'] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => api('/api/admin/team', 'DELETE', { id }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin', 'team'] }),
  });

  const toggleActiveMutation = useMutation({
    mutationFn: async (m: Member) => api('/api/admin/team', 'PUT', { id: m.id, is_active: !m.is_active }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin', 'team'] }),
  });

  return {
    members: teamQuery.data || [],
    isLoading: teamQuery.isLoading,
    isError: teamQuery.isError,
    saveMember: saveMutation.mutateAsync,
    isSaving: saveMutation.isPending,
    deleteMember: deleteMutation.mutateAsync,
    isDeleting: deleteMutation.isPending,
    toggleActive: toggleActiveMutation.mutateAsync,
  };
};
