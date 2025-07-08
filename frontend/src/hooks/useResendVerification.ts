import { useMutation } from '@tanstack/react-query';
import { api } from '@/lib/axios';
import { toast } from 'sonner';

interface ResendVerificationResponse {
  message: string;
}

export const useResendVerification = () => {
  return useMutation<ResendVerificationResponse, Error, string>({
    mutationFn: async (email: string) => {
      const response = await api.post(`/api/auth/resend-verification?email=${email}`);
      return response.data;
    },
    onSuccess: (data) => {
      toast.success(data.message || 'Verification email sent');
    },
    onError: () => {
      toast.error('An error occurred while resending verification email');
    }
  });
};