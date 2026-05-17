import api from './axios';
import { API_ENDPOINTS } from '@/constants';
import type { User, UserPreferences } from '@/types';

export const usersApi = {
  getProfile: async (): Promise<User> => {
    const { data } = await api.get(API_ENDPOINTS.USER_PROFILE);
    return data.data || data;
  },

  updateProfile: async (payload: Partial<User & { preferences: UserPreferences }>): Promise<User> => {
    const { data } = await api.patch(API_ENDPOINTS.USER_PROFILE, payload);
    return data.data || data;
  },
};
