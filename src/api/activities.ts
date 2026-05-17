import api from './axios';
import { API_ENDPOINTS } from '@/constants';
import type { Activity } from '@/types';

export const activitiesApi = {
  getBookingOptions: async (tripId: string, activityId: string) => {
    const { data } = await api.get(API_ENDPOINTS.ACTIVITY_BOOKING(tripId, activityId));
    return data.data || data;
  },

  createActivity: async (tripId: string, payload: Partial<Activity>): Promise<Activity> => {
    const { data } = await api.post(API_ENDPOINTS.TRIP_ACTIVITIES(tripId), payload);
    return data.data || data;
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
    return data.data || data;
  },

  deleteActivity: async (tripId: string, activityId: string): Promise<void> => {
    await api.delete(API_ENDPOINTS.TRIP_ACTIVITY(tripId, activityId));
  },
};
