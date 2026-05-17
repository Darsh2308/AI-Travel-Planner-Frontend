import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { authApi } from '@/api/auth';
import { useAuthStore } from '@/store/authStore';
import type { LoginPayload, RegisterPayload } from '@/types';
import { toast } from 'sonner';

export function useAuth() {
  const { setAuth, logout: storeLogout, setUser, setLoading } = useAuthStore();
  const queryClient = useQueryClient();

  const meQuery = useQuery({
    queryKey: ['auth', 'me'],
    queryFn: authApi.getMe,
    retry: false,
    enabled: !!localStorage.getItem('accessToken'),
    staleTime: 5 * 60 * 1000,
  });

  const loginMutation = useMutation({
    mutationFn: (payload: LoginPayload) => authApi.login(payload),
    onSuccess: (data) => {
      setAuth(data.user, data.accessToken, data.refreshToken);
      queryClient.invalidateQueries({ queryKey: ['auth'] });
      toast.success('Welcome back!', {
        description: `Signed in as ${data.user.name}`,
      });
    },
    onError: (error: { message: string }) => {
      toast.error('Login failed', { description: error.message });
    },
  });

  const registerMutation = useMutation({
    mutationFn: (payload: RegisterPayload) => authApi.register(payload),
    onSuccess: (data) => {
      setAuth(data.user, data.accessToken, data.refreshToken);
      queryClient.invalidateQueries({ queryKey: ['auth'] });
      toast.success('Account created!', {
        description: 'Welcome to Voyageur',
      });
    },
    onError: (error: { message: string }) => {
      toast.error('Registration failed', { description: error.message });
    },
  });

  const logoutMutation = useMutation({
    mutationFn: authApi.logout,
    onSuccess: () => {
      storeLogout();
      queryClient.clear();
      toast.success('Signed out successfully');
    },
    onError: () => {
      storeLogout();
      queryClient.clear();
    },
  });

  // Sync me query with store
  if (meQuery.data && !meQuery.isLoading) {
    setUser(meQuery.data);
    setLoading(false);
  }
  if (meQuery.isError) {
    setLoading(false);
  }

  return {
    meQuery,
    login: loginMutation.mutateAsync,
    register: registerMutation.mutateAsync,
    logout: logoutMutation.mutate,
    isLoginLoading: loginMutation.isPending,
    isRegisterLoading: registerMutation.isPending,
  };
}
