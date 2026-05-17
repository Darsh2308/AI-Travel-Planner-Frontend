import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { tripsApi } from '@/api/trips';
import type { CreateTripPayload, Trip } from '@/types';
import { toast } from 'sonner';

export function useTrips() {
  const queryClient = useQueryClient();

  const tripsQuery = useQuery({
    queryKey: ['trips'],
    queryFn: tripsApi.getTrips,
    staleTime: 2 * 60 * 1000,
  });

  const createTripMutation = useMutation({
    mutationFn: (payload: CreateTripPayload) => tripsApi.createTrip(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['trips'] });
      toast.success('Trip created!', {
        description: 'AI is generating your itinerary...',
      });
    },
    onError: (error: { message: string }) => {
      toast.error('Failed to create trip', { description: error.message });
    },
  });

  const deleteTripMutation = useMutation({
    mutationFn: (tripId: string) => tripsApi.deleteTrip(tripId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['trips'] });
      toast.success('Trip deleted');
    },
    onError: (error: { message: string }) => {
      toast.error('Failed to delete trip', { description: error.message });
    },
  });

  return {
    trips: tripsQuery.data ?? [],
    isLoading: tripsQuery.isLoading,
    isError: tripsQuery.isError,
    createTrip: createTripMutation.mutateAsync,
    isCreating: createTripMutation.isPending,
    deleteTrip: deleteTripMutation.mutate,
    refetch: tripsQuery.refetch,
  };
}

export function useTrip(tripId: string) {
  const queryClient = useQueryClient();

  const tripQuery = useQuery({
    queryKey: ['trips', tripId],
    queryFn: () => tripsApi.getTrip(tripId),
    enabled: !!tripId,
    staleTime: 60 * 1000,
  });

  const updateTripMutation = useMutation({
    mutationFn: (payload: Partial<Trip>) => tripsApi.updateTrip(tripId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['trips', tripId] });
      queryClient.invalidateQueries({ queryKey: ['trips'] });
      toast.success('Trip updated');
    },
    onError: (error: { message: string }) => {
      toast.error('Failed to update trip', { description: error.message });
    },
  });

  return {
    trip: tripQuery.data,
    isLoading: tripQuery.isLoading,
    isError: tripQuery.isError,
    updateTrip: updateTripMutation.mutateAsync,
    isUpdating: updateTripMutation.isPending,
    refetch: tripQuery.refetch,
  };
}
