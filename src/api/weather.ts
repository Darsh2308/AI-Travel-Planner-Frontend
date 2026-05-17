import api from './axios';
import { API_ENDPOINTS } from '@/constants';
import type { DayWeather, WeatherReview } from '@/types';

export const weatherApi = {
  getWeather: async (tripId: string): Promise<DayWeather[]> => {
    const { data } = await api.get(API_ENDPOINTS.TRIP_WEATHER(tripId));
    return data.data || data;
  },

  reviewWeather: async (tripId: string, review: WeatherReview): Promise<void> => {
    await api.post(API_ENDPOINTS.TRIP_WEATHER_REVIEW(tripId), review);
  },

  regenerateWeatherDay: async (tripId: string, payload: { date: string }): Promise<void> => {
    await api.post(API_ENDPOINTS.TRIP_REGENERATE_WEATHER_DAY(tripId), payload);
  },
};
