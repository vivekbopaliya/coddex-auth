import { useMutation } from '@tanstack/react-query';
import { api } from '@/lib/axios'; 

interface VerifyEmailResponse {
  message: string;
}

export const useVerifyEmail = () => {
  return useMutation<VerifyEmailResponse, Error, string>({
    mutationFn: async (token: string) => {
      console.log('Making API call with token:', token);
      
      try {
        const response = await api.post(`/api/verify-email/${token}`);
        console.log('API response:', response);
        return response.data;
      } catch (error) {
        console.error('API error:', error);
        throw error;
      }
    },
  });
};