import { useMutation } from '@tanstack/react-query';
import { api } from '@/lib/axios';

interface SignupData {
  email: string;
  password: string;
}

interface SignupResponse {
  message: string;
  emailVerified: boolean;
  email: string;
}

export const useSignup = () => {
  return useMutation<SignupResponse, Error, SignupData>({
    mutationFn: async (data: SignupData) => {
      const response = await api.post('/api/signup', data);
      return response.data;
    },
  });
};