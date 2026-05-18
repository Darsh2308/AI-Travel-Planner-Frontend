import api from './axios';
import { API_ENDPOINTS } from '@/constants';

export interface AnalyticsSummary {
  totalTrips: number;
  totalSpent: number;
  avgPerTrip: number;
  uniqueCountries: number;
  monthlySpending: { month: string; label: string; spent: number; budget: number }[];
  spendingByCategory: { name: string; value: number }[];
  travelFrequency: { month: string; label: string; trips: number }[];
}

export const analyticsApi = {
  getSummary: async (): Promise<AnalyticsSummary> => {
    const { data } = await api.get(API_ENDPOINTS.ANALYTICS);
    const inner = data.data ?? data;
    return inner.analytics ?? inner;
  },
};
