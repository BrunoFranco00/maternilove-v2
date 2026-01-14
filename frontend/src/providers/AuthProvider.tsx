'use client';

/**
 * Auth Provider - LOCK FRONTEND 1: Modo Base
 * Operando SOMENTE com status: "unauthenticated"
 * SEM integração com backend, SEM refresh, SEM sessão
 */

import React, { createContext, useContext, useState, ReactNode } from 'react';
import type {
  AuthStatus,
  User,
  LoginRequest,
  RegisterRequest,
} from '@/types/auth';

interface AuthContextValue {
  status: AuthStatus;
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  register: (data: RegisterRequest) => Promise<void>;
  logout: () => Promise<void>;
  refresh: () => Promise<string | null>;
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
  // LOCK FRONTEND 1: Sempre unauthenticated
  const [status] = useState<AuthStatus>('unauthenticated');
  const [user] = useState<User | null>(null);

  /**
   * Login - bloqueado (LOCK FRONTEND 1)
   */
  const login = async (_email: string, _password: string): Promise<void> => {
    throw new Error('Integração com backend desabilitada (LOCK FRONTEND 1)');
  };

  /**
   * Register - bloqueado (LOCK FRONTEND 1)
   */
  const register = async (_data: RegisterRequest): Promise<void> => {
    throw new Error('Integração com backend desabilitada (LOCK FRONTEND 1)');
  };

  /**
   * Logout - bloqueado (LOCK FRONTEND 1)
   */
  const logout = async (): Promise<void> => {
    // Nada a fazer - sempre unauthenticated
  };

  /**
   * Refresh - bloqueado (LOCK FRONTEND 1)
   */
  const refresh = async (): Promise<string | null> => {
    return null;
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
