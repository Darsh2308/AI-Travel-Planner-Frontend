import api from './axios';
import { API_ENDPOINTS } from '@/constants';
import type { TripScore, OptimizationResult, ConflictResult, AlternativeResult } from '@/types';

export const assistantApi = {
  optimizeTrip: async (tripId: string): Promise<OptimizationResult> => {
    const { data } = await api.post(API_ENDPOINTS.ASSISTANT_OPTIMIZE, { tripId });
    return data.data || data;
  },

  checkConflicts: async (tripId: string): Promise<ConflictResult> => {
    const { data } = await api.post(API_ENDPOINTS.ASSISTANT_CONFLICTS, { tripId });
    return data.data || data;
  },

  recommendAlternatives: async (tripId: string): Promise<AlternativeResult> => {
    const { data } = await api.post(API_ENDPOINTS.ASSISTANT_ALTERNATIVES, { tripId });
    return data.data || data;
  },

  getTripScore: async (tripId: string): Promise<TripScore> => {
    const { data } = await api.get(API_ENDPOINTS.ASSISTANT_SCORE(tripId));
    return data.data || data;
  },
};
