import { useMutation } from '@tanstack/react-query';
import { api } from '@/lib/axios';

interface ResendVerificationResponse {
  message: string;
}

export const useResendVerification = () => {
  return useMutation<ResendVerificationResponse, Error, string>({
    mutationFn: async (email: string) => {
      const response = await api.post(`/api/auth/resend-verification?email=${email}`);
      return response.data;
    },
  });
};