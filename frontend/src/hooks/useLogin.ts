import { useMutation } from '@tanstack/react-query';
import { api } from '@/lib/axios';

interface LoginData {
  email: string;
  password: string;
}

interface LoginResponse {
  message: string;
  emailVerified: boolean;
  email: string;
}

export const useLogin = () => {
  return useMutation<LoginResponse, Error, LoginData>({
    mutationFn: async (data: LoginData) => {
      const response = await api.post('/api/auth/login', data);
      return response.data;
    },
  });
};