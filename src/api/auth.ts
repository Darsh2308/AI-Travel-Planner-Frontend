import api from './axios';
import { API_ENDPOINTS } from '@/constants';
import type { AuthResponse, LoginPayload, RegisterPayload, User } from '@/types';

export const authApi = {
  login: async (payload: LoginPayload): Promise<AuthResponse> => {
    const { data } = await api.post(API_ENDPOINTS.AUTH_LOGIN, payload);
    return data.data || data;
  },

  register: async (payload: RegisterPayload): Promise<AuthResponse> => {
    const { data } = await api.post(API_ENDPOINTS.AUTH_REGISTER, payload);
    return data.data || data;
  },

  logout: async (): Promise<void> => {
    await api.post(API_ENDPOINTS.AUTH_LOGOUT);
  },

  getMe: async (): Promise<User> => {
    const { data } = await api.get(API_ENDPOINTS.AUTH_ME);
    return data.data || data;
  },

  refreshToken: async (refreshToken: string): Promise<AuthResponse> => {
    const { data } = await api.post(API_ENDPOINTS.AUTH_REFRESH, { refreshToken });
    return data.data || data;
  },
};
