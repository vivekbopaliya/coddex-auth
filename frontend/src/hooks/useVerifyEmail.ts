import { useMutation } from '@tanstack/react-query';
import { api } from '@/lib/axios';

interface VerifyEmailResponse {
  message: string;
}

export const useVerifyEmail = () => {
  return useMutation<VerifyEmailResponse, Error, string>({
    mutationFn: async (token: string) => {
      const response = await api.post(`/api/verify-email/${token}`);
      return response.data;
    },
  });
};