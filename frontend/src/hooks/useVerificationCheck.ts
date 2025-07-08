import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/axios';


export const useVerificationCheck = () => {
  return useQuery({
    queryKey: ['verification-status'],
    queryFn: async () => {
      const response = await api.get('/api/user/status');
      console.log("Response from /api/user/status:", response.data);
      return response.data;
    },
  });
};