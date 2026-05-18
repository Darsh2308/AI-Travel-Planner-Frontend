import api from './axios';
import { API_ENDPOINTS } from '@/constants';
import type { Activity, BookingOption } from '@/types';

export const activitiesApi = {
  getBookingOptions: async (tripId: string, activityId: string): Promise<BookingOption[]> => {
    const { data } = await api.get(API_ENDPOINTS.ACTIVITY_BOOKING(tripId, activityId));
    const inner = data.data ?? data;
    return inner.bookingOptions ?? inner;
  },

  createActivity: async (tripId: string, payload: Partial<Activity>): Promise<Activity> => {
    const { data } = await api.post(API_ENDPOINTS.TRIP_ACTIVITIES(tripId), payload);
    const inner = data.data ?? data;
    return inner.trip ?? inner;
  },

  updateActivity: async (
    tripId: string,
    activityId: string,
    payload: Partial<Activity>
  ): Promise<Activity> => {
    const { data } = await api.patch(
      API_ENDPOINTS.TRIP_ACTIVITY(tripId, activityId),
      payload
    );
    const inner = data.data ?? data;
    return inner.trip ?? inner;
  },

  deleteActivity: async (tripId: string, activityId: string): Promise<void> => {
    await api.delete(API_ENDPOINTS.TRIP_ACTIVITY(tripId, activityId));
  },
};
