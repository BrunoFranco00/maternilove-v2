'use client';

/**
 * Auth Provider
 * Implementação completa de autenticação com integração ao backend
 */

import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { getHttpClient } from '@/services/httpClient';
import type {
  AuthStatus,
  User,
  LoginRequest,
  RegisterRequest,
  LoginResponse,
  RegisterResponse,
  RefreshResponse,
  RefreshRequest,
  LogoutRequest,
} from '@/types/auth';

interface AuthContextValue {
  status: AuthStatus;
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  register: (data: RegisterRequest) => Promise<void>;
  logout: () => Promise<void>;
  refresh: () => Promise<string | null>; // Retorna novo accessToken ou null
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
  const [user, setUser] = useState<User | null>(null);
  const httpClient = getHttpClient();

  /**
   * Salvar tokens no localStorage
   */
  const saveTokens = useCallback((accessToken: string, refreshToken: string) => {
    if (typeof window === 'undefined') return;
    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('refreshToken', refreshToken);
  }, []);

  /**
   * Limpar tokens do localStorage
   */
  const clearTokens = useCallback(() => {
    if (typeof window === 'undefined') return;
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
  }, []);

  /**
   * Salvar usuário no localStorage
   */
  const saveUser = useCallback((userData: User) => {
    if (typeof window === 'undefined') return;
    localStorage.setItem('user', JSON.stringify(userData));
  }, []);

  /**
   * Limpar usuário do localStorage
   */
  const clearUser = useCallback(() => {
    if (typeof window === 'undefined') return;
    localStorage.removeItem('user');
  }, []);

  /**
   * Refresh token
   */
  const refresh = useCallback(async (): Promise<string | null> => {
    const storedRefreshToken = localStorage.getItem('refreshToken');
    
    if (!storedRefreshToken) {
      return null;
    }

    const request: RefreshRequest = { refreshToken: storedRefreshToken };
    const result = await httpClient.post<RefreshResponse, RefreshRequest>('/auth/refresh', request);

    if (!result.ok) {
      return null;
    }

    const { accessToken, refreshToken: newRefreshToken } = result.data;
    saveTokens(accessToken, newRefreshToken);
    
    return accessToken;
  }, [httpClient, saveTokens]);

  /**
   * Logout
   */
  const handleLogout = useCallback(async (): Promise<void> => {
    const storedRefreshToken = localStorage.getItem('refreshToken');
    
    // Tentar fazer logout no backend (idempotente)
    if (storedRefreshToken) {
      const request: LogoutRequest = { refreshToken: storedRefreshToken };
      await httpClient.post('/auth/logout', request).catch(() => {
        // Ignorar erros no logout (idempotente)
      });
    }

    clearTokens();
    clearUser();
    setUser(null);
    setStatus('unauthenticated');
  }, [httpClient, clearTokens, clearUser]);

  /**
   * Carregar estado inicial e validar sessão ativa
   */
  useEffect(() => {
    if (typeof window === 'undefined') {
      setStatus('unauthenticated');
      return;
    }

    const validateSession = async () => {
      try {
        const storedUser = localStorage.getItem('user');
        const storedAccessToken = localStorage.getItem('accessToken');
        const storedRefreshToken = localStorage.getItem('refreshToken');

        // Se não há tokens, não autenticado
        if (!storedRefreshToken) {
          setStatus('unauthenticated');
          return;
        }

        // Validar refresh token para confirmar que a sessão está ativa
        const request: RefreshRequest = { refreshToken: storedRefreshToken };
        const result = await httpClient.post<RefreshResponse, RefreshRequest>('/auth/refresh', request);

        if (result.ok && storedUser) {
          try {
            const userData = JSON.parse(storedUser) as User;
            // Atualizar tokens com os novos recebidos
            saveTokens(result.data.accessToken, result.data.refreshToken);
            setUser(userData);
            setStatus('authenticated');
          } catch {
            // Dados inválidos, limpar
            clearTokens();
            clearUser();
            setStatus('unauthenticated');
          }
        } else {
          // Refresh falhou, sessão inválida
          clearTokens();
          clearUser();
          setStatus('unauthenticated');
        }
      } catch (error) {
        // Erro ao validar sessão, considerar não autenticado
        console.error('Error validating session:', error);
        clearTokens();
        clearUser();
        setStatus('unauthenticated');
      }
    };

    validateSession();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Executar apenas uma vez na montagem

  /**
   * Configurar callbacks do httpClient para refresh token
   */
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    try {
      httpClient.setRefreshTokenCallbacks(refresh, handleLogout);
    } catch (error) {
      console.error('Error setting refresh token callbacks:', error);
    }
  }, [httpClient, refresh, handleLogout]);

  /**
   * Login
   */
  const login = async (email: string, password: string): Promise<void> => {
    const request: LoginRequest = { email, password };
    const result = await httpClient.post<LoginResponse, LoginRequest>('/auth/login', request);

    if (!result.ok) {
      throw new Error(result.error.message);
    }

    const { user: userData, tokens } = result.data;
    
    saveTokens(tokens.accessToken, tokens.refreshToken);
    saveUser(userData);
    setUser(userData);
    setStatus('authenticated');
  };

  /**
   * Register
   */
  const register = async (data: RegisterRequest): Promise<void> => {
    const result = await httpClient.post<RegisterResponse, RegisterRequest>('/auth/register', data);

    if (!result.ok) {
      throw new Error(result.error.message);
    }

    const { user: userData, tokens } = result.data;
    
    saveTokens(tokens.accessToken, tokens.refreshToken);
    saveUser(userData);
    setUser(userData);
    setStatus('authenticated');
  };

  const value: AuthContextValue = {
    status,
    user,
    login,
    register,
    logout: handleLogout,
    refresh,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
