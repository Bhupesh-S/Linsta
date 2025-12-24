import { createContext, ReactNode, useContext, useMemo, useState } from 'react';

type AuthContextValue = {
  isAuthenticated: boolean;
  isOnboarded: boolean;
  login: () => void;
  logout: () => void;
  completeOnboarding: () => void;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isOnboarded, setIsOnboarded] = useState(false);

  const value = useMemo(
    () => ({
      isAuthenticated,
      isOnboarded,
      login: () => setIsAuthenticated(true),
      logout: () => {
        setIsAuthenticated(false);
        setIsOnboarded(false);
      },
      completeOnboarding: () => setIsOnboarded(true),
    }),
    [isAuthenticated, isOnboarded],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return ctx;
};

