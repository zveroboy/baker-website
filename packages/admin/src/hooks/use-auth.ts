import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { api, getToken } from '../lib/api';

interface LoginCredentials {
  email: string;
  password: string;
}

interface AuthResponse {
  access_token: string;
  user: {
    id: string;
    email: string;
    name: string;
    role: string;
  };
}

interface User {
  id: string;
  email: string;
  name: string;
  role: string;
  createdAt: string;
  updatedAt: string;
}

// Login mutation
export function useLogin() {
  return useMutation({
    mutationFn: async (credentials: LoginCredentials): Promise<AuthResponse> => {
      return api.post('auth/login', { json: credentials }).json();
    },
  });
}

// Get current user query
export function useCurrentUser() {
  return useQuery({
    queryKey: ['currentUser'],
    queryFn: async (): Promise<User> => {
      return api.get('auth/me').json();
    },
    enabled: !!getToken(), // Only fetch if token exists
    retry: false,
  });
}

// Logout helper
export function useLogout() {
  const queryClient = useQueryClient();

  return () => {
    queryClient.clear();
    localStorage.removeItem('token');
  };
}

