import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/axios';


export const useAuthCheck = () => {
  return useQuery({
    queryKey: ['auth-status'],
    queryFn: async () => {
      const response = await api.get('/api/auth/check');
      console.log("Response from /api/user/status:", response.data);
      return response.data;
    },
  });
};