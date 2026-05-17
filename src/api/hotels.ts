import api from './axios';
import { API_ENDPOINTS } from '@/constants';
import type { Hotel, BookingOption } from '@/types';

export const hotelsApi = {
  getHotels: async (tripId: string): Promise<Hotel[]> => {
    const { data } = await api.get(API_ENDPOINTS.TRIP_HOTELS(tripId));
    return data.data || data;
  },

  getBookingOptions: async (tripId: string, hotelId: string): Promise<BookingOption[]> => {
    const { data } = await api.get(API_ENDPOINTS.HOTEL_BOOKING_OPTIONS(tripId, hotelId));
    return data.data || data;
  },
};
