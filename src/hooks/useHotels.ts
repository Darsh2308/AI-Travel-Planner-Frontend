import { useQuery } from '@tanstack/react-query';
import { hotelsApi } from '@/api/hotels';

export function useHotels(tripId: string) {
  const hotelsQuery = useQuery({
    queryKey: ['hotels', tripId],
    queryFn: () => hotelsApi.getHotels(tripId),
    enabled: !!tripId,
    staleTime: 10 * 60 * 1000,
  });

  return {
    hotels: hotelsQuery.data ?? [],
    isLoading: hotelsQuery.isLoading,
    isError: hotelsQuery.isError,
  };
}

export function useHotelBookingOptions(tripId: string, hotelId: string) {
  const bookingQuery = useQuery({
    queryKey: ['hotels', tripId, hotelId, 'booking'],
    queryFn: () => hotelsApi.getBookingOptions(tripId, hotelId),
    enabled: !!tripId && !!hotelId,
  });

  return {
    bookingOptions: bookingQuery.data ?? [],
    isLoading: bookingQuery.isLoading,
  };
}
