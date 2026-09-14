import React, { createContext, useContext, useEffect, useState } from 'react';
import api from '../api/client';
import { IUser } from '../types';

interface AuthContextType {
  user: IUser | null;
  token: string | null;
  isLoading: boolean;
  login: (token: string, user: IUser) => void;
  logout: () => void;
  updateUser: (user: IUser) => void;
  loadDemoMode: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<IUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const initAuth = async () => {
      const savedToken = localStorage.getItem('jobflow_token');
      const savedUser = localStorage.getItem('jobflow_user');

      if (savedToken && savedUser) {
        setToken(savedToken);
        setUser(JSON.parse(savedUser));
        try {
          // Verify with backend
          const res = await api.get('/auth/me');
          if (res.data?.data) {
            setUser(res.data.data);
            localStorage.setItem('jobflow_user', JSON.stringify(res.data.data));
          }
        } catch (e) {
          // Token expired or server unreachable
        }
      }
      setIsLoading(false);
    };

    initAuth();
  }, []);

  const login = (newToken: string, newUser: IUser) => {
    setToken(newToken);
    setUser(newUser);
    localStorage.setItem('jobflow_token', newToken);
    localStorage.setItem('jobflow_user', JSON.stringify(newUser));
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('jobflow_token');
    localStorage.removeItem('jobflow_user');
  };

  const updateUser = (updatedUser: IUser) => {
    setUser(updatedUser);
    localStorage.setItem('jobflow_user', JSON.stringify(updatedUser));
  };

  const loadDemoMode = async () => {
    setIsLoading(true);
    try {
      const res = await api.post('/demo/seed');
      if (res.data?.data) {
        login(res.data.data.token, res.data.data.user);
      }
    } catch (e) {
      // Mock instant offline demo if backend database is offline
      const mockUser: IUser = {
        _id: 'demo_user_123',
        name: 'Alex Chen',
        email: 'alex.chen@jobflow.ai',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
        preferences: {
          theme: 'dark',
          targetRoles: ['Staff Frontend Engineer'],
          targetLocations: ['San Francisco, CA', 'Remote'],
          expectedSalary: 195000,
          currency: 'USD',
          workPreference: 'remote',
          emailSyncEnabled: true,
          notificationsEnabled: true,
        },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      login('demo_token_xyz', mockUser);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isLoading,
        login,
        logout,
        updateUser,
        loadDemoMode,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
