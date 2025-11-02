import { createContext, useContext, ReactNode } from 'react';
import { useCurrentUser } from '../hooks/use-auth';
import { clearToken } from '../lib/api';
import { useNavigate } from '@tanstack/react-router';

interface AuthContextType {
  user: any | null;
  isAuthenticated: boolean;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const navigate = useNavigate();
  const { data: user } = useCurrentUser();

  const logout = () => {
    clearToken();
    navigate({ to: '/login' });
  };

  const value = {
    user: user || null,
    isAuthenticated: !!user,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}

