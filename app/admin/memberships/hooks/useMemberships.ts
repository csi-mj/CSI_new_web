import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import type { CsiMembership } from '@/lib/types/memberships';

export function useMemberships() {
  const queryClient = useQueryClient();

  // Fetch all memberships
  const {
    data,
    isLoading,
    isError,
    error,
    refetch
  } = useQuery<{ memberships: CsiMembership[] }>({
    queryKey: ['admin-memberships'],
    queryFn: async () => {
      const res = await fetch(`/api/admin/memberships`);
      const json = await res.json();
      
      if (!res.ok || !json.success) {
        throw new Error(json.error?.message || 'Failed to fetch memberships');
      }
      
      return json.data;
    }
  });

  // Update membership status
  const updateStatusMutation = useMutation({
    mutationFn: async ({ membershipId, status }: { membershipId: string, status: CsiMembership['status'] }) => {
      const res = await fetch(`/api/admin/memberships`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ membership_id: membershipId, status })
      });
      
      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.error?.message || 'Failed to update status');
      }
      
      return json.data;
    },
    onSuccess: () => {
      toast.success('Status updated successfully');
      queryClient.invalidateQueries({ queryKey: ['admin-memberships'] });
    },
    onError: (err: any) => {
      toast.error(err.message || 'Failed to update status');
    }
  });

  const deleteMutation = useMutation({
    mutationFn: async (membershipId: string) => {
      const res = await fetch(`/api/admin/memberships/${membershipId}`, {
        method: 'DELETE',
      });
      
      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.error?.message || 'Failed to delete membership');
      }
      
      return json.data;
    },
    onSuccess: () => {
      toast.success('Membership deleted successfully');
      queryClient.invalidateQueries({ queryKey: ['admin-memberships'] });
    },
    onError: (err: any) => {
      toast.error(err.message || 'Failed to delete membership');
    }
  });

  return {
    memberships: data?.memberships || [],
    isLoading,
    isError,
    error,
    refetch,
    updateStatus: (membershipId: string, status: CsiMembership['status']) => 
      updateStatusMutation.mutate({ membershipId, status }),
    isUpdatingStatus: updateStatusMutation.isPending,
    deleteMembership: (membershipId: string) => deleteMutation.mutate(membershipId),
    isDeletingId: deleteMutation.isPending ? deleteMutation.variables : null,
  };
}
