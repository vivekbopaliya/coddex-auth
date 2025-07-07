import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/axios';

export const useLogout = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async () => {
      const response = await api.post('/api/auth/logout');
      return response.data;
    },
    onSuccess: () => {
      queryClient.clear();
    },
  });
};