import { useMutation, useQueryClient } from '@tanstack/react-query';
import { activitiesApi } from '@/api/activities';
import type { Activity } from '@/types';
import { toast } from 'sonner';

export function useActivities(tripId: string) {
  const queryClient = useQueryClient();

  const createActivityMutation = useMutation({
    mutationFn: (payload: Partial<Activity>) =>
      activitiesApi.createActivity(tripId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['trips', tripId] });
      toast.success('Activity added');
    },
    onError: (error: { message: string }) => {
      toast.error('Failed to add activity', { description: error.message });
    },
  });

  const updateActivityMutation = useMutation({
    mutationFn: ({ activityId, payload }: { activityId: string; payload: Partial<Activity> }) =>
      activitiesApi.updateActivity(tripId, activityId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['trips', tripId] });
      toast.success('Activity updated');
    },
  });

  const deleteActivityMutation = useMutation({
    mutationFn: (activityId: string) =>
      activitiesApi.deleteActivity(tripId, activityId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['trips', tripId] });
      toast.success('Activity removed');
    },
  });

  return {
    createActivity: createActivityMutation.mutateAsync,
    updateActivity: updateActivityMutation.mutateAsync,
    deleteActivity: deleteActivityMutation.mutate,
    isCreating: createActivityMutation.isPending,
    isUpdating: updateActivityMutation.isPending,
  };
}
