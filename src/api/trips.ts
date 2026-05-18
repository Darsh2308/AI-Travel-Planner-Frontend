import api from './axios';
import { API_ENDPOINTS } from '@/constants';
import type { Trip, CreateTripPayload } from '@/types';

export const tripsApi = {
  getTrips: async (): Promise<Trip[]> => {
    const { data } = await api.get(API_ENDPOINTS.TRIPS);
    const inner = data.data ?? data;
    return inner.trips ?? inner;
  },

  getTrip: async (tripId: string): Promise<Trip> => {
    const { data } = await api.get(API_ENDPOINTS.TRIP_DETAIL(tripId));
    const inner = data.data ?? data;
    return inner.trip ?? inner;
  },

  createTrip: async (payload: CreateTripPayload): Promise<Trip> => {
    const { data } = await api.post(API_ENDPOINTS.TRIPS, payload);
    const inner = data.data ?? data;
    return inner.trip ?? inner;
  },

  updateTrip: async (tripId: string, payload: Partial<Trip>): Promise<Trip> => {
    const { data } = await api.patch(API_ENDPOINTS.TRIP_DETAIL(tripId), payload);
    const inner = data.data ?? data;
    return inner.trip ?? inner;
  },

  deleteTrip: async (tripId: string): Promise<void> => {
    await api.delete(API_ENDPOINTS.TRIP_DETAIL(tripId));
  },
};
