'use client';

/**
 * Auth Provider - LOCK RBAC 1
 * Implementação completa de autenticação com RBAC e Onboarding
 */

import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import * as authService from '@/services/authService';
import { getOnboardingRoute, getDefaultRoute, requiresOnboarding, isAdmin } from '@/utils/rbac';
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
  isOnboardingCompleted: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (data: RegisterRequest) => Promise<void>;
  logout: () => Promise<void>;
  refresh: () => Promise<void>;
  completeOnboarding: () => void;
  getPostLoginRoute: () => string;
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

const ONBOARDING_STORAGE_KEY = 'onboardingCompleted';

export function AuthProvider({ children }: AuthProviderProps) {
  const router = useRouter();
  const [status, setStatus] = useState<AuthStatus>('unknown');
  const [user, setUser] = useState<User | null>(null);
  const [isOnboardingCompleted, setIsOnboardingCompleted] = useState<boolean>(false);

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
      localStorage.removeItem(ONBOARDING_STORAGE_KEY);
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
      setIsOnboardingCompleted(false);
    } catch (error) {
      console.error('Error clearing user:', error);
    }
  }, []);

  /**
   * Verificar se onboarding está completo (frontend-only)
   */
  const checkOnboardingStatus = useCallback(() => {
    if (typeof window === 'undefined') return false;
    try {
      const completed = localStorage.getItem(ONBOARDING_STORAGE_KEY) === 'true';
      setIsOnboardingCompleted(completed);
      return completed;
    } catch (error) {
      console.error('Error checking onboarding status:', error);
      return false;
    }
  }, []);

  /**
   * Obter rota pós-login baseada em role e onboarding
   */
  const getPostLoginRoute = useCallback((): string => {
    if (!user) return '/login';
    
    // Admin nunca vê onboarding
    if (isAdmin(user.role)) {
      return getDefaultRoute(user.role);
    }

    // Se role requer onboarding
    if (requiresOnboarding(user.role)) {
      const onboardingRoute = getOnboardingRoute(user.role);
      if (onboardingRoute && !isOnboardingCompleted) {
        return onboardingRoute;
      }
    }

    return getDefaultRoute(user.role);
  }, [user, isOnboardingCompleted]);

  /**
   * Completar onboarding
   */
  const completeOnboarding = useCallback(() => {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(ONBOARDING_STORAGE_KEY, 'true');
      setIsOnboardingCompleted(true);
    } catch (error) {
      console.error('Error completing onboarding:', error);
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
          checkOnboardingStatus();
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
  }, [saveTokens, saveUser, clearTokens, clearUser, checkOnboardingStatus]);

  /**
   * Login
   */
  const login = useCallback(async (email: string, password: string): Promise<void> => {
    const request: LoginRequest = { email, password };
    const result: LoginResponse = await authService.login(request);

    saveTokens(result.tokens.accessToken, result.tokens.refreshToken);
    saveUser(result.user);
    checkOnboardingStatus();
    setStatus('authenticated');
  }, [saveTokens, saveUser, checkOnboardingStatus]);

  /**
   * Register
   */
  const register = useCallback(async (data: RegisterRequest): Promise<void> => {
    const result: RegisterResponse = await authService.register(data);

    saveTokens(result.tokens.accessToken, result.tokens.refreshToken);
    saveUser(result.user);
    // Novo registro sempre inicia com onboarding pendente
    setIsOnboardingCompleted(false);
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
              checkOnboardingStatus();
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
    isOnboardingCompleted,
    login,
    register,
    logout,
    refresh,
    completeOnboarding,
    getPostLoginRoute,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
