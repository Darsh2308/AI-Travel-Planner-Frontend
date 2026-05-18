import api from './axios';
import { API_ENDPOINTS } from '@/constants';
import type {
  TripScore,
  OptimizationResult,
  ConflictResult,
  AlternativeResult,
  OptimizationGoal,
  AlternativeReason,
} from '@/types';

export const assistantApi = {
  optimizeTrip: async (
    tripId: string,
    optimizationGoal: OptimizationGoal = 'reduce cost'
  ): Promise<OptimizationResult> => {
    const { data } = await api.post(API_ENDPOINTS.ASSISTANT_OPTIMIZE, {
      tripId,
      optimizationGoal,
    });
    return data.data ?? data;
  },

  checkConflicts: async (tripId: string): Promise<ConflictResult> => {
    const { data } = await api.post(API_ENDPOINTS.ASSISTANT_CONFLICTS, { tripId });
    return data.data ?? data;
  },

  recommendAlternatives: async (
    tripId: string,
    affectedDay: number,
    reason: AlternativeReason = 'user preference change'
  ): Promise<AlternativeResult> => {
    const { data } = await api.post(API_ENDPOINTS.ASSISTANT_ALTERNATIVES, {
      tripId,
      affectedDay,
      reason,
    });
    return data.data ?? data;
  },

  getTripScore: async (tripId: string): Promise<TripScore> => {
    const { data } = await api.get(API_ENDPOINTS.ASSISTANT_SCORE(tripId));
    const inner = data.data ?? data;
    return inner.score ?? inner;
  },
};
