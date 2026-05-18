import api from './axios';
import { API_ENDPOINTS } from '@/constants';
import type { User, UserPreferences } from '@/types';

export interface UpdateProfilePayload {
  fullName?: string;
  phone?: string;
  country?: string;
  city?: string;
  avatarUrl?: string;
}

export const usersApi = {
  getProfile: async (): Promise<User> => {
    const { data } = await api.get(API_ENDPOINTS.USER_PROFILE);
    const inner = data.data ?? data;
    return inner.profile ?? inner;
  },

  updateProfile: async (payload: UpdateProfilePayload): Promise<User> => {
    const { data } = await api.patch(API_ENDPOINTS.USER_PROFILE, payload);
    const inner = data.data ?? data;
    return inner.profile ?? inner;
  },

  updatePreferences: async (preferences: Partial<UserPreferences>): Promise<User> => {
    const { data } = await api.patch(API_ENDPOINTS.USER_PREFERENCES, { preferences });
    const inner = data.data ?? data;
    return inner.profile ?? inner;
  },
};
