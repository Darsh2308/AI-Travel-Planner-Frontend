import { useQuery } from '@tanstack/react-query';
import { analyticsApi } from '@/api/analytics';

export function useAnalytics() {
  const query = useQuery({
    queryKey: ['analytics'],
    queryFn: analyticsApi.getSummary,
    staleTime: 5 * 60 * 1000,
  });

  return {
    analytics: query.data,
    isLoading: query.isLoading,
    isError: query.isError,
  };
}
