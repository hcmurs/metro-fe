import React, { createContext, useContext, useState, useEffect } from 'react';
import type { User } from '../types/user.type';
import { getUser } from '../apis/user.api';
import { logoutUser } from '../apis/auth.api';
import type { ApiResponse } from '../types/api.type';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (user: User) => void;
  logout: () => void;
  setUser: (user: User | null) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  const isAuthenticated = !!user;

  const login = (userData: User) => {
    setUser(userData);
  };

  const logout = () => {
    logoutUser()
      .then(() => {
        setUser(null);
      })
      .catch(() => {
        setUser(null);
      });
  };

  useEffect(() => {
    getUser()
      .then((response: ApiResponse<User> | null) => {
        if (response?.status === 200) {
          setUser(response.data as User);
        } else {
          setUser(null);
        }
      })
      .catch(() => {
        setUser(null);
      });
  }, []);

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, login, logout, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};
