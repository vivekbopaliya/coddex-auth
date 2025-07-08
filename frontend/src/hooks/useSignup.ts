import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/axios';
import { toast } from 'sonner';

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
  const queryClient = useQueryClient();
  return useMutation<SignupResponse, Error, SignupData>({
    mutationFn: async (data: SignupData) => {
      const response = await api.post('/api/signup', data);
      return response.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['user'] });
      toast.success(data.message || 'Signup successful');
    },
    onError: (error: unknown) => {
      if (
        error &&
        typeof error === 'object' &&
        'response' in error &&
        error.response &&
        typeof error.response === 'object' &&
        'status' in error.response
      ) {
        if (error.response.status === 400) {
          return toast.error('Invalid credentials');
        }
        if (error.response.status === 401) {
          return toast.error('Email already exists');
        }
      }
      toast.error('An error occurred during signup');
    }
  });
};