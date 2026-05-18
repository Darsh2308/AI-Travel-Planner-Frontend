import api from './axios';
import { API_ENDPOINTS } from '@/constants';
import type { HotelRecommendation, BookingOption } from '@/types';

export const hotelsApi = {
  getHotels: async (tripId: string): Promise<HotelRecommendation[]> => {
    const { data } = await api.get(API_ENDPOINTS.TRIP_HOTELS(tripId));
    const inner = data.data ?? data;
    return inner.hotels ?? inner;
  },

  getBookingOptions: async (tripId: string, hotelId: string): Promise<BookingOption[]> => {
    const { data } = await api.get(API_ENDPOINTS.HOTEL_BOOKING_OPTIONS(tripId, hotelId));
    const inner = data.data ?? data;
    return inner.bookingOptions ?? inner;
  },
};
