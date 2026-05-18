import { useMutation, useQueryClient } from '@tanstack/react-query';
import { tripsApi } from '@/api/trips';
import type { Activity, DayPlan, Trip } from '@/types';
import { toast } from 'sonner';

export function useActivities(tripId: string) {
  const queryClient = useQueryClient();

  const patchItinerary = async (updater: (itinerary: DayPlan[]) => DayPlan[]) => {
    const cached = queryClient.getQueryData<Trip>(['trips', tripId]);
    const itinerary = cached?.itinerary ?? [];
    return tripsApi.updateTrip(tripId, { itinerary: updater(itinerary) as Trip['itinerary'] });
  };

  const createActivityMutation = useMutation({
    mutationFn: ({ dayNumber, payload }: { dayNumber: number; payload: Partial<Activity> }) =>
      patchItinerary((itinerary) =>
        itinerary.map((day) =>
          day.dayNumber === dayNumber
            ? { ...day, activities: [...(day.activities ?? []), payload as Activity] }
            : day,
        ),
      ),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['trips', tripId] });
      toast.success('Activity added');
    },
    onError: () => toast.error('Failed to add activity'),
  });

  const updateActivityMutation = useMutation({
    mutationFn: ({ dayNumber, activityId, payload }: { dayNumber: number; activityId: string; payload: Partial<Activity> }) =>
      patchItinerary((itinerary) =>
        itinerary.map((day) =>
          day.dayNumber === dayNumber
            ? {
                ...day,
                activities: day.activities.map((a) =>
                  a._id === activityId ? { ...a, ...payload } : a,
                ),
              }
            : day,
        ),
      ),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['trips', tripId] });
      toast.success('Activity updated');
    },
    onError: () => toast.error('Failed to update activity'),
  });

  const deleteActivityMutation = useMutation({
    mutationFn: ({ dayNumber, activityId }: { dayNumber: number; activityId: string }) =>
      patchItinerary((itinerary) =>
        itinerary.map((day) =>
          day.dayNumber === dayNumber
            ? { ...day, activities: day.activities.filter((a) => a._id !== activityId) }
            : day,
        ),
      ),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['trips', tripId] });
      toast.success('Activity removed');
    },
    onError: () => toast.error('Failed to remove activity'),
  });

  return {
    createActivity: createActivityMutation.mutateAsync,
    updateActivity: updateActivityMutation.mutateAsync,
    deleteActivity: deleteActivityMutation.mutateAsync,
    isCreating: createActivityMutation.isPending,
    isUpdating: updateActivityMutation.isPending,
    isDeleting: deleteActivityMutation.isPending,
  };
}
