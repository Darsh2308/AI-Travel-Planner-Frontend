import api from './axios';
import { API_ENDPOINTS } from '@/constants';
import type { Trip, WeatherReview, RegenerateWeatherDayPayload } from '@/types';

export const weatherApi = {
  getWeather: async (tripId: string): Promise<Trip> => {
    const { data } = await api.get(API_ENDPOINTS.TRIP_WEATHER(tripId));
    const inner = data.data ?? data;
    return inner.trip ?? inner;
  },

  reviewWeather: async (tripId: string, review: WeatherReview): Promise<Trip> => {
    const { data } = await api.post(API_ENDPOINTS.TRIP_WEATHER_REVIEW(tripId), review);
    const inner = data.data ?? data;
    return inner.trip ?? inner;
  },

  regenerateWeatherDay: async (tripId: string, payload: RegenerateWeatherDayPayload): Promise<Trip> => {
    const { data } = await api.post(API_ENDPOINTS.TRIP_REGENERATE_WEATHER_DAY(tripId), payload);
    const inner = data.data ?? data;
    return inner.trip ?? inner;
  },
};
