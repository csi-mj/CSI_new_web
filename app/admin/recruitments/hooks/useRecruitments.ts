import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import type { Recruitment } from '@/lib/types/recruitments';

export function useRecruitments() {
  const queryClient = useQueryClient();

  // Fetch all recruitments
  const {
    data,
    isLoading,
    isError,
    error,
    refetch
  } = useQuery<{ recruitments: Recruitment[] }>({
    queryKey: ['admin-recruitments'],
    queryFn: async () => {
      const res = await fetch(`/api/admin/recruitments`);
      const json = await res.json();
      
      if (!res.ok || !json.success) {
        throw new Error(json.error?.message || 'Failed to fetch recruitments');
      }
      
      return json.data;
    }
  });

  // Update recruitment (status, interview time, etc.)
  const updateRecruitmentMutation = useMutation({
    mutationFn: async (updates: Partial<Recruitment> & { id: string }) => {
      const res = await fetch(`/api/admin/recruitments`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates)
      });
      
      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.error?.message || 'Failed to update recruitment');
      }
      
      return json.data;
    },
    onSuccess: () => {
      toast.success('Recruitment updated successfully');
      queryClient.invalidateQueries({ queryKey: ['admin-recruitments'] });
    },
    onError: (err: any) => {
      toast.error(err.message || 'Failed to update recruitment');
    }
  });

  // Schedule Interview and Send Email
  const scheduleInterviewMutation = useMutation({
    mutationFn: async ({ id, interview_time, interview_venue }: { id: string, interview_time: string, interview_venue: string }) => {
      const res = await fetch(`/api/admin/recruitments/${id}/schedule`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ interview_time, interview_venue })
      });
      
      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.error?.message || 'Failed to schedule interview');
      }
      
      return json.data;
    },
    onSuccess: () => {
      toast.success('Interview scheduled and email sent!');
      queryClient.invalidateQueries({ queryKey: ['admin-recruitments'] });
    },
    onError: (err: any) => {
      toast.error(err.message || 'Failed to schedule interview');
    }
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`/api/admin/recruitments/${id}`, {
        method: 'DELETE',
      });
      
      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.error?.message || 'Failed to delete application');
      }
      
      return json.data;
    },
    onSuccess: () => {
      toast.success('Application deleted successfully');
      queryClient.invalidateQueries({ queryKey: ['admin-recruitments'] });
    },
    onError: (err: any) => {
      toast.error(err.message || 'Failed to delete application');
    }
  });

  return {
    recruitments: data?.recruitments || [],
    isLoading,
    isError,
    error,
    refetch,
    updateRecruitment: (updates: Partial<Recruitment> & { id: string }) => 
      updateRecruitmentMutation.mutate(updates),
    isUpdating: updateRecruitmentMutation.isPending,
    scheduleInterview: (id: string, interview_time: string, interview_venue: string) => 
      scheduleInterviewMutation.mutateAsync({ id, interview_time, interview_venue }),
    isScheduling: scheduleInterviewMutation.isPending,
    deleteRecruitment: (id: string) => deleteMutation.mutate(id),
    isDeletingId: deleteMutation.isPending ? deleteMutation.variables : null,
  };
}
