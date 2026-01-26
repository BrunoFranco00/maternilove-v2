'use client';

/**
 * Auth Provider - estado único de autenticação
 * - authStatus: 'loading' | 'authenticated' | 'unauthenticated'
 * - Validação via refresh (backend)
 * - Redirects centralizados, apenas quando status definitivo
 * - Nunca redirect enquanto loading
 */

import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback, useRef } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import * as authService from '@/services/authService';
import { getOnboardingRoute, getDefaultRoute, requiresOnboarding, isAdmin } from '@/utils/rbac';
import { isPublicRoute } from '@/lib/auth/constants';
import { normalizeRole } from '@/lib/auth/roles';
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
  const pathname = usePathname();
  const [status, setStatus] = useState<AuthStatus>('loading');
  const [user, setUser] = useState<User | null>(null);
  const [isOnboardingCompleted, setIsOnboardingCompleted] = useState<boolean>(false);
  const hasRedirectedRef = useRef(false);

  const saveTokens = useCallback((accessToken: string, refreshTokenValue: string) => {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('refreshToken', refreshTokenValue);
    } catch (error) {
      console.error('Error saving tokens:', error);
    }
  }, []);

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

  const setUserRoleCookie = useCallback((role: string) => {
    if (typeof window === 'undefined') return;
    try {
      const roleUpper = normalizeRole(role);
      const expires = new Date();
      expires.setTime(expires.getTime() + 7 * 24 * 60 * 60 * 1000);
      document.cookie = `user_role=${roleUpper}; expires=${expires.toUTCString()}; path=/; SameSite=Lax`;
    } catch (error) {
      console.error('Error setting user_role cookie:', error);
    }
  }, []);

  const clearUserRoleCookie = useCallback(() => {
    if (typeof window === 'undefined') return;
    try {
      document.cookie = 'user_role=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    } catch (error) {
      console.error('Error clearing user_role cookie:', error);
    }
  }, []);

  /** Salvar usuário: role normalizado em UM único lugar (lib/auth/roles) */
  const saveUser = useCallback((userData: User) => {
    if (typeof window === 'undefined') return;
    try {
      const normalized = { ...userData, role: normalizeRole(userData.role) };
      localStorage.setItem('user', JSON.stringify(normalized));
      setUser(normalized);
      setUserRoleCookie(normalized.role);
    } catch (error) {
      console.error('Error saving user:', error);
    }
  }, [setUserRoleCookie]);

  const clearUser = useCallback(() => {
    if (typeof window === 'undefined') return;
    try {
      localStorage.removeItem('user');
      setUser(null);
      setIsOnboardingCompleted(false);
      clearUserRoleCookie();
    } catch (error) {
      console.error('Error clearing user:', error);
    }
  }, [clearUserRoleCookie]);

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

  const getPostLoginRoute = useCallback((): string => {
    if (!user) return '/login';
    if (isAdmin(user.role)) return getDefaultRoute(user.role);
    if (requiresOnboarding(user.role)) {
      const onboardingRoute = getOnboardingRoute(user.role);
      if (onboardingRoute && !isOnboardingCompleted) return onboardingRoute;
    }
    return getDefaultRoute(user.role);
  }, [user, isOnboardingCompleted]);

  const completeOnboarding = useCallback(() => {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(ONBOARDING_STORAGE_KEY, 'true');
      setIsOnboardingCompleted(true);
    } catch (error) {
      console.error('Error completing onboarding:', error);
    }
  }, []);

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
      saveTokens(result.accessToken, result.refreshToken);
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
      console.error('Refresh token failed:', error);
      clearTokens();
      clearUser();
      setStatus('unauthenticated');
    }
  }, [saveTokens, saveUser, clearTokens, clearUser, checkOnboardingStatus]);

  const login = useCallback(async (email: string, password: string): Promise<void> => {
    const request: LoginRequest = { email, password };
    const result: LoginResponse = await authService.login(request);
    saveTokens(result.tokens.accessToken, result.tokens.refreshToken);
    saveUser(result.user);
    checkOnboardingStatus();
    setStatus('authenticated');
  }, [saveTokens, saveUser, checkOnboardingStatus]);

  const register = useCallback(async (data: RegisterRequest): Promise<void> => {
    const result: RegisterResponse = await authService.register(data);
    saveTokens(result.tokens.accessToken, result.tokens.refreshToken);
    saveUser(result.user);
    setIsOnboardingCompleted(false);
    setStatus('authenticated');
  }, [saveTokens, saveUser]);

  const logout = useCallback(async (): Promise<void> => {
    if (typeof window === 'undefined') return;
    const storedRefreshToken = localStorage.getItem('refreshToken');
    if (storedRefreshToken) {
      try {
        await authService.logout({ refreshToken: storedRefreshToken });
      } catch (e) {
        console.error('Error on logout:', e);
      }
    }
    clearTokens();
    clearUser();
    setStatus('unauthenticated');
    hasRedirectedRef.current = false;
    router.replace('/login');
  }, [clearTokens, clearUser, router]);

  /** Inicialização: validar token no backend (refresh). Status inicia 'loading'. */
  useEffect(() => {
    if (typeof window === 'undefined') {
      setStatus('unauthenticated');
      return;
    }
    const init = async () => {
      const storedRefreshToken = localStorage.getItem('refreshToken');
      const storedUser = localStorage.getItem('user');
      if (!storedRefreshToken || !storedUser) {
        setStatus('unauthenticated');
        return;
      }
      try {
        const request: RefreshRequest = { refreshToken: storedRefreshToken };
        const result = await authService.refresh(request);
        saveTokens(result.accessToken, result.refreshToken);
        const userData = JSON.parse(storedUser) as User;
        saveUser(userData);
        checkOnboardingStatus();
        setStatus('authenticated');
      } catch {
        clearTokens();
        clearUser();
        setStatus('unauthenticated');
      }
    };
    init();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /**
   * Redirect centralizado: APENAS quando status definitivo.
   * NUNCA redirect enquanto status === 'loading'.
   * Rotas públicas: nunca redirecionar para fora; permitir render estável.
   * Se autenticado em /login ou /register → redirect UMA vez para getPostLoginRoute().
   */
  useEffect(() => {
    if (status === 'loading') return;
    if (!isPublicRoute(pathname)) return;
    if (status !== 'authenticated' || !user) return;
    const target = getPostLoginRoute();
    if (pathname === target) return;
    if (hasRedirectedRef.current) return;
    hasRedirectedRef.current = true;
    router.replace(target);
  }, [status, user, pathname, getPostLoginRoute, router]);

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
