import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { weatherApi } from '@/api/weather';
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
    mutationFn: (payload: { approved: boolean; notes?: string }) =>
      weatherApi.reviewWeather(tripId, { tripId, ...payload }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['weather', tripId] });
      toast.success('Weather review submitted');
    },
  });

  const regenerateDayMutation = useMutation({
    mutationFn: (date: string) => weatherApi.regenerateWeatherDay(tripId, { date }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['weather', tripId] });
      queryClient.invalidateQueries({ queryKey: ['trips', tripId] });
      toast.success('Day plan regenerated for weather');
    },
  });

  return {
    weather: weatherQuery.data ?? [],
    isLoading: weatherQuery.isLoading,
    reviewWeather: reviewWeatherMutation.mutate,
    regenerateDay: regenerateDayMutation.mutate,
    isRegenerating: regenerateDayMutation.isPending,
  };
}
