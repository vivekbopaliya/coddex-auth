import { useMutation } from '@tanstack/react-query';
import { api } from '@/lib/axios';
import { toast } from 'sonner';

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
    onSuccess: (data) => {
      toast.success(data.message || 'Login successful');
    },
    onError: (error: unknown) => {
      if (
        error &&
        typeof error === 'object' &&
        'response' in error &&
        error.response &&
        typeof error.response === 'object' &&
        'status' in error.response &&
        error.response.status === 401
      ) {
        return toast.error('Invalid credentials');
      }
      toast.error('An error occurred during login');
    }
  });
};