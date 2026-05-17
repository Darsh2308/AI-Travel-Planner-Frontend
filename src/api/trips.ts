import api from './axios';
import { API_ENDPOINTS } from '@/constants';
import type { Trip, CreateTripPayload } from '@/types';

export const tripsApi = {
  getTrips: async (): Promise<Trip[]> => {
    const { data } = await api.get(API_ENDPOINTS.TRIPS);
    return data.data || data;
  },

  getTrip: async (tripId: string): Promise<Trip> => {
    const { data } = await api.get(API_ENDPOINTS.TRIP_DETAIL(tripId));
    return data.data || data;
  },

  createTrip: async (payload: CreateTripPayload): Promise<Trip> => {
    const { data } = await api.post(API_ENDPOINTS.TRIPS, payload);
    return data.data || data;
  },

  updateTrip: async (tripId: string, payload: Partial<Trip>): Promise<Trip> => {
    const { data } = await api.patch(API_ENDPOINTS.TRIP_DETAIL(tripId), payload);
    return data.data || data;
  },

  deleteTrip: async (tripId: string): Promise<void> => {
    await api.delete(API_ENDPOINTS.TRIP_DETAIL(tripId));
  },
};
