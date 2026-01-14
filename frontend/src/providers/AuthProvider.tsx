'use client';

/**
 * Auth Provider - LOCK FRONTEND FINAL
 * Implementação completa de autenticação com integração ao backend
 */

import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import * as authService from '@/services/authService';
import type {
  AuthStatus,
  User,
  LoginRequest,
  RegisterRequest,
  RefreshRequest,
  LogoutRequest,
  LoginResponse,
  RegisterResponse,
} from '@/types/auth';

interface AuthContextValue {
  status: AuthStatus;
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  register: (data: RegisterRequest) => Promise<void>;
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
  const router = useRouter();
  const [status, setStatus] = useState<AuthStatus>('unknown');
  const [user, setUser] = useState<User | null>(null);

  /**
   * Salvar tokens no localStorage
   */
  const saveTokens = useCallback((accessToken: string, refreshTokenValue: string) => {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('refreshToken', refreshTokenValue);
    } catch (error) {
      console.error('Error saving tokens:', error);
    }
  }, []);

  /**
   * Limpar tokens do localStorage
   */
  const clearTokens = useCallback(() => {
    if (typeof window === 'undefined') return;
    try {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
    } catch (error) {
      console.error('Error clearing tokens:', error);
    }
  }, []);

  /**
   * Salvar usuário no localStorage
   */
  const saveUser = useCallback((userData: User) => {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem('user', JSON.stringify(userData));
      setUser(userData);
    } catch (error) {
      console.error('Error saving user:', error);
    }
  }, []);

  /**
   * Limpar usuário do localStorage
   */
  const clearUser = useCallback(() => {
    if (typeof window === 'undefined') return;
    try {
      localStorage.removeItem('user');
      setUser(null);
    } catch (error) {
      console.error('Error clearing user:', error);
    }
  }, []);

  /**
   * Refresh token
   */
  const refresh = useCallback(async (): Promise<void> => {
    if (typeof window === 'undefined') return;
    
    const storedRefreshToken = localStorage.getItem('refreshToken');
    
    if (!storedRefreshToken) {
      setStatus('unauthenticated');
      return;
    }

    try {
      const request: RefreshRequest = { refreshToken: storedRefreshToken };
      const result = await authService.refresh(request);
      
      // Atualizar tokens
      saveTokens(result.accessToken, result.refreshToken);
      
      // Restaurar usuário do localStorage
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        try {
          const userData = JSON.parse(storedUser) as User;
          saveUser(userData);
          setStatus('authenticated');
        } catch {
          setStatus('unauthenticated');
        }
      } else {
        setStatus('unauthenticated');
      }
    } catch (error) {
      // Refresh falhou, logout
      console.error('Refresh token failed:', error);
      clearTokens();
      clearUser();
      setStatus('unauthenticated');
    }
  }, [saveTokens, saveUser, clearTokens, clearUser]);

  /**
   * Login
   */
  const login = useCallback(async (email: string, password: string): Promise<void> => {
    const request: LoginRequest = { email, password };
    const result: LoginResponse = await authService.login(request);

    saveTokens(result.tokens.accessToken, result.tokens.refreshToken);
    saveUser(result.user);
    setStatus('authenticated');
  }, [saveTokens, saveUser]);

  /**
   * Register
   */
  const register = useCallback(async (data: RegisterRequest): Promise<void> => {
    const result: RegisterResponse = await authService.register(data);

    saveTokens(result.tokens.accessToken, result.tokens.refreshToken);
    saveUser(result.user);
    setStatus('authenticated');
  }, [saveTokens, saveUser]);

  /**
   * Logout
   */
  const logout = useCallback(async (): Promise<void> => {
    if (typeof window === 'undefined') return;
    
    const storedRefreshToken = localStorage.getItem('refreshToken');
    
    // Tentar fazer logout no backend (idempotente)
    if (storedRefreshToken) {
      try {
        const request: LogoutRequest = { refreshToken: storedRefreshToken };
        await authService.logout(request);
      } catch (error) {
        // Logout é idempotente, ignorar erros
        console.error('Error on logout:', error);
      }
    }

    clearTokens();
    clearUser();
    setStatus('unauthenticated');
    router.push('/login');
  }, [clearTokens, clearUser, router]);

  /**
   * Carregar estado inicial e validar sessão
   */
  useEffect(() => {
    if (typeof window === 'undefined') {
      setStatus('unauthenticated');
      return;
    }

    const initializeAuth = async () => {
      try {
        const storedRefreshToken = localStorage.getItem('refreshToken');
        const storedUser = localStorage.getItem('user');

        if (storedRefreshToken && storedUser) {
          // Tentar refresh para validar sessão
          try {
            const request: RefreshRequest = { refreshToken: storedRefreshToken };
            const result = await authService.refresh(request);
            
            // Atualizar tokens
            saveTokens(result.accessToken, result.refreshToken);
            
            // Restaurar usuário
            try {
              const userData = JSON.parse(storedUser) as User;
              saveUser(userData);
              setStatus('authenticated');
            } catch {
              setStatus('unauthenticated');
            }
          } catch {
            // Refresh falhou
            clearTokens();
            clearUser();
            setStatus('unauthenticated');
          }
        } else {
          setStatus('unauthenticated');
        }
      } catch (error) {
        console.error('Error initializing auth:', error);
        setStatus('unauthenticated');
      }
    };

    initializeAuth();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Executar apenas uma vez na montagem

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
