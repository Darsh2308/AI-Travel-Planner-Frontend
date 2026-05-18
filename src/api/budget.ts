import api from './axios';
import { API_ENDPOINTS } from '@/constants';
import type { BudgetLedger, LedgerEntry, UpdateBudgetPayload, BudgetAllocationPayload } from '@/types';

export const budgetApi = {
  getBudget: async (): Promise<BudgetLedger> => {
    const { data } = await api.get(API_ENDPOINTS.BUDGET);
    const inner = data.data ?? data;
    return inner.budget ?? inner;
  },

  updateBudget: async (payload: UpdateBudgetPayload): Promise<BudgetLedger> => {
    const { data } = await api.put(API_ENDPOINTS.BUDGET, payload);
    const inner = data.data ?? data;
    return inner.budget ?? inner;
  },

  allocateBudget: async (payload: BudgetAllocationPayload): Promise<BudgetLedger> => {
    const { data } = await api.post(API_ENDPOINTS.BUDGET_ALLOCATE, payload);
    const inner = data.data ?? data;
    return inner.budget ?? inner;
  },

  releaseBudget: async (payload: BudgetAllocationPayload): Promise<BudgetLedger> => {
    const { data } = await api.post(API_ENDPOINTS.BUDGET_RELEASE, payload);
    const inner = data.data ?? data;
    return inner.budget ?? inner;
  },

  getLedger: async (): Promise<LedgerEntry[]> => {
    const { data } = await api.get(API_ENDPOINTS.BUDGET_LEDGER);
    const inner = data.data ?? data;
    return inner.ledger ?? inner.budget?.entries ?? [];
  },
};
