import React, { createContext, useContext, useState, useEffect } from 'react';
import type { User } from '../types/user.type';
import { apiFindUser } from '../apis/user.api';
import { apiLogout } from '../apis/auth.api';
import type { ApiResponse } from '../types/api.type';

interface AuthContextType {
  contextUser: User | null;
  isAuthenticated: boolean;
  contextLogin: (user: User) => void;
  contextLogout: () => void;
  setContextUser: (user: User | null) => void;
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
  const [contextUser, setContextUser] = useState<User | null>(null);

  const isAuthenticated = !!contextUser;

  const contextLogin = (userData: User) => {
    setContextUser(userData);
  };

  const contextLogout = () => {
    apiLogout()
      .then(() => {
        setContextUser(null);
      })
      .catch(() => {
        setContextUser(null);
      });
  };

  useEffect(() => {
    apiFindUser()
      .then((response: ApiResponse<User> | null) => {
        if (response?.status === 200) {
          setContextUser(response.data as User);
        } else {
          setContextUser(null);
        }
      })
      .catch(() => {
        setContextUser(null);
      });
  }, []);

  return (
    <AuthContext.Provider value={{ contextUser: contextUser, isAuthenticated, contextLogin: contextLogin, contextLogout: contextLogout, setContextUser: setContextUser }}>
      {children}
    </AuthContext.Provider>
  );
};
