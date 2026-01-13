'use client';

/**
 * Auth Provider
 * Estado base de autenticação (sem regras de negócio ainda)
 * Placeholder para Fase 2
 */

import React, { createContext, useContext, useState, ReactNode } from 'react';

type AuthStatus = 'unknown' | 'authenticated' | 'unauthenticated';

interface AuthContextValue {
  status: AuthStatus;
  user: unknown | null;
  // Placeholders para Fase 2
  login: (email: string, password: string) => Promise<void>;
  register: (data: unknown) => Promise<void>;
  logout: () => Promise<void>;
  refresh: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [status, setStatus] = useState<AuthStatus>('unknown');
  const [user, setUser] = useState<unknown | null>(null);

  // Placeholders - serão implementados na Fase 2
  const login = async (_email: string, _password: string): Promise<void> => {
    // TODO: Implementar na Fase 2
    console.log('login placeholder');
  };

  const register = async (_data: unknown): Promise<void> => {
    // TODO: Implementar na Fase 2
    console.log('register placeholder');
  };

  const logout = async (): Promise<void> => {
    // TODO: Implementar na Fase 2
    console.log('logout placeholder');
    setStatus('unauthenticated');
    setUser(null);
  };

  const refresh = async (): Promise<void> => {
    // TODO: Implementar na Fase 2
    console.log('refresh placeholder');
  };

  const value: AuthContextValue = {
    status,
    user,
    login,
    register,
    logout,
    refresh,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
