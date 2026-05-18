import api from './axios';
import { API_ENDPOINTS } from '@/constants';
import type { AuthResponse, LoginPayload, RegisterPayload, User } from '@/types';

// Backend response shape: { user: AuthUser, tokens: { accessToken, refreshToken } }
const normalizeAuthResponse = (raw: {
  user: User;
  tokens?: { accessToken: string; refreshToken: string };
  accessToken?: string;
  refreshToken?: string;
}): AuthResponse => ({
  user: raw.user,
  accessToken: raw.tokens?.accessToken ?? raw.accessToken ?? '',
  refreshToken: raw.tokens?.refreshToken ?? raw.refreshToken ?? '',
});

export const authApi = {
  login: async (payload: LoginPayload): Promise<AuthResponse> => {
    const { data } = await api.post(API_ENDPOINTS.AUTH_LOGIN, payload);
    return normalizeAuthResponse(data.data ?? data);
  },

  register: async (payload: RegisterPayload): Promise<AuthResponse> => {
    const { data } = await api.post(API_ENDPOINTS.AUTH_REGISTER, payload);
    return normalizeAuthResponse(data.data ?? data);
  },

  logout: async (): Promise<void> => {
    const refreshToken = localStorage.getItem('refreshToken');
    await api.post(API_ENDPOINTS.AUTH_LOGOUT, { refreshToken });
  },

  getMe: async (): Promise<User> => {
    const { data } = await api.get(API_ENDPOINTS.AUTH_ME);
    // Backend returns { user: AuthUser } inside data
    const inner = data.data ?? data;
    return inner.user ?? inner;
  },

  refreshToken: async (refreshToken: string): Promise<AuthResponse> => {
    const { data } = await api.post(API_ENDPOINTS.AUTH_REFRESH, { refreshToken });
    return normalizeAuthResponse(data.data ?? data);
  },
};
