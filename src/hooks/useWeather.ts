import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { weatherApi } from '@/api/weather';
import type { WeatherReview } from '@/types';
import { toast } from 'sonner';

export function useWeather(tripId: string) {
  const queryClient = useQueryClient();

  const weatherQuery = useQuery({
    queryKey: ['weather', tripId],
    queryFn: () => weatherApi.getWeather(tripId),
    enabled: !!tripId,
    staleTime: 10 * 60 * 1000,
  });

  const reviewWeatherMutation = useMutation({
    mutationFn: (payload: WeatherReview) => weatherApi.reviewWeather(tripId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['weather', tripId] });
      queryClient.invalidateQueries({ queryKey: ['trips', tripId] });
      toast.success('Weather review submitted');
    },
    onError: (error: { message: string }) => {
      toast.error('Failed to submit weather review', { description: error.message });
    },
  });

  const regenerateDayMutation = useMutation({
    mutationFn: (affectedDay: number) =>
      weatherApi.regenerateWeatherDay(tripId, { affectedDay }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['weather', tripId] });
      queryClient.invalidateQueries({ queryKey: ['trips', tripId] });
      toast.success('Day plan regenerated for weather');
    },
    onError: (error: { message: string }) => {
      toast.error('Failed to regenerate day', { description: error.message });
    },
  });

  return {
    weather: weatherQuery.data,
    isLoading: weatherQuery.isLoading,
    reviewWeather: reviewWeatherMutation.mutate,
    regenerateDay: regenerateDayMutation.mutate,
    isRegenerating: regenerateDayMutation.isPending,
  };
}
