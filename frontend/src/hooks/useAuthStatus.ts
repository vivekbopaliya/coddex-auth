import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/axios';

interface AuthStatusResponse {
  email: string;
  emailVerified: boolean;
}

export const useAuthStatus = () => {
  return useQuery<AuthStatusResponse, Error>({
    queryKey: ['auth-status'],
    queryFn: async () => {
      const response = await api.get('/api/auth/status');
      return response.data;
    },
    retry: false,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};