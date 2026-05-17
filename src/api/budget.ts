import api from './axios';
import { API_ENDPOINTS } from '@/constants';
import type { Budget, LedgerEntry } from '@/types';

export const budgetApi = {
  getBudget: async (): Promise<Budget> => {
    const { data } = await api.get(API_ENDPOINTS.BUDGET);
    return data.data || data;
  },

  updateBudget: async (payload: Partial<Budget>): Promise<Budget> => {
    const { data } = await api.patch(API_ENDPOINTS.BUDGET, payload);
    return data.data || data;
  },

  getLedger: async (): Promise<LedgerEntry[]> => {
    const { data } = await api.get(API_ENDPOINTS.BUDGET_LEDGER);
    return data.data || data;
  },
};
