'use client';

/**
 * Auth Provider - estado único de autenticação
 * - authStatus: 'loading' | 'authenticated' | 'unauthenticated'
 * - Validação via refresh (backend)
 * - Redirects centralizados, apenas quando status definitivo
 * - Nunca redirect enquanto loading
 */

import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';
import * as authService from '@/services/authService';
import { getOnboardingRoute, getDefaultRoute, requiresOnboarding, isAdmin } from '@/utils/rbac';
import { normalizeRole } from '@/lib/normalizeRole';
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

export type AuthResult = { success: true } | { success: false; error: string };

interface AuthContextValue {
  status: AuthStatus;
  user: User | null;
  isOnboardingCompleted: boolean;
  authReady: boolean;
  login: (email: string, password: string) => Promise<AuthResult>;
  register: (data: RegisterRequest) => Promise<AuthResult>;
  logout: () => Promise<void>;
  refresh: () => Promise<void>;
  completeOnboarding: () => void;
  getPostLoginRoute: () => string;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

/** Estado neutro quando useAuth é chamado fora do AuthProvider (apenas PROD) */
const NEUTRAL_AUTH_VALUE: AuthContextValue = {
  status: 'unauthenticated',
  user: null,
  isOnboardingCompleted: false,
  authReady: true,
  login: async () => ({ success: false, error: 'Provider não disponível' }),
  register: async () => ({ success: false, error: 'Provider não disponível' }),
  logout: async () => {},
  refresh: async () => {},
  completeOnboarding: () => {},
  getPostLoginRoute: () => '/login',
};

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    if (process.env.NODE_ENV === 'development') {
      throw new Error('useAuth must be used within AuthProvider');
    }
    return NEUTRAL_AUTH_VALUE;
  }
  return context;
}

interface AuthProviderProps {
  children: ReactNode;
}

const ONBOARDING_STORAGE_KEY = 'onboardingCompleted';
const SESSION_COOKIE = 'maternilove-session';
const SESSION_COOKIE_MAX_AGE_DAYS = 365;

export function AuthProvider({ children }: AuthProviderProps) {
  const router = useRouter();
  const [status, setStatus] = useState<AuthStatus>('loading');
  const [user, setUser] = useState<User | null>(null);
  const [isOnboardingCompleted, setIsOnboardingCompleted] = useState<boolean>(false);
  const [authReady, setAuthReady] = useState<boolean>(false);

  const setSessionCookie = useCallback(() => {
    if (typeof window === 'undefined') return;
    try {
      const expires = new Date();
      expires.setTime(expires.getTime() + SESSION_COOKIE_MAX_AGE_DAYS * 24 * 60 * 60 * 1000);
      document.cookie = `${SESSION_COOKIE}=1; expires=${expires.toUTCString()}; path=/; SameSite=Lax`;
    } catch (error) {
      console.error('Error setting session cookie:', error);
    }
  }, []);

  const clearSessionCookie = useCallback(() => {
    if (typeof window === 'undefined') return;
    try {
      document.cookie = `${SESSION_COOKIE}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
    } catch (error) {
      console.error('Error clearing session cookie:', error);
    }
  }, []);

  const saveTokens = useCallback((accessToken: string, refreshTokenValue: string) => {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('refreshToken', refreshTokenValue);
      setSessionCookie();
    } catch (error) {
      console.error('Error saving tokens:', error);
    }
  }, [setSessionCookie]);

  const clearTokens = useCallback(() => {
    if (typeof window === 'undefined') return;
    try {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem(ONBOARDING_STORAGE_KEY);
      clearSessionCookie();
    } catch (error) {
      console.error('Error clearing tokens:', error);
    }
  }, [clearSessionCookie]);

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

  const login = useCallback(async (email: string, password: string): Promise<AuthResult> => {
    try {
      const request: LoginRequest = { email, password };
      const result: LoginResponse = await authService.login(request);
      saveTokens(result.tokens.accessToken, result.tokens.refreshToken);
      saveUser(result.user);
      checkOnboardingStatus();
      setStatus('authenticated');
      return { success: true };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao fazer login';
      console.error('Login failed:', err);
      clearTokens();
      clearUser();
      setStatus('unauthenticated');
      return { success: false, error: errorMessage };
    }
  }, [saveTokens, saveUser, clearTokens, clearUser, checkOnboardingStatus]);

  const register = useCallback(async (data: RegisterRequest): Promise<AuthResult> => {
    try {
      const result: RegisterResponse = await authService.register(data);
      saveTokens(result.tokens.accessToken, result.tokens.refreshToken);
      saveUser(result.user);
      setIsOnboardingCompleted(false);
      setStatus('authenticated');
      return { success: true };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao criar conta';
      console.error('Register failed:', err);
      clearTokens();
      clearUser();
      setStatus('unauthenticated');
      return { success: false, error: errorMessage };
    }
  }, [saveTokens, saveUser, clearTokens, clearUser]);

  const logout = useCallback(async (): Promise<void> => {
    try {
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
      setAuthReady(true);
      router.replace('/login');
    } catch (e) {
      console.error('Logout error:', e);
      clearTokens();
      clearUser();
      setStatus('unauthenticated');
      setAuthReady(true);
    }
  }, [clearTokens, clearUser, router]);

  /** Inicialização: validar token no backend (refresh). Status inicia 'loading'. Nunca lança. */
  useEffect(() => {
    if (typeof window === 'undefined') {
      setStatus('unauthenticated');
      setAuthReady(true);
      return;
    }
    const init = async () => {
      try {
        const storedRefreshToken = localStorage.getItem('refreshToken');
        const storedUser = localStorage.getItem('user');

        if (!storedRefreshToken || !storedUser) {
          setStatus('unauthenticated');
          setAuthReady(true);
          return;
        }
        const userData = JSON.parse(storedUser) as User;
        const userRoleFromCookie = document.cookie
          .split('; ')
          .find((row) => row.startsWith('user_role='))
          ?.split('=')[1];
        const normalizedCookieRole = userRoleFromCookie
          ? normalizeRole(userRoleFromCookie)
          : normalizeRole(userData.role);
        setUserRoleCookie(normalizedCookieRole);
        const request: RefreshRequest = { refreshToken: storedRefreshToken };
        const result = await authService.refresh(request);
        saveTokens(result.accessToken, result.refreshToken);
        const normalizedUser: User = { ...userData, role: normalizedCookieRole };
        localStorage.setItem('user', JSON.stringify(normalizedUser));
        setUser(normalizedUser);
        checkOnboardingStatus();
        setStatus('authenticated');
        setAuthReady(true);
      } catch {
        clearTokens();
        clearUser();
        setStatus('unauthenticated');
        setAuthReady(true);
      }
    };
    init().catch(() => {
      setStatus('unauthenticated');
      setAuthReady(true);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const value: AuthContextValue = {
    status,
    user,
    isOnboardingCompleted,
    authReady,
    login,
    register,
    logout,
    refresh,
    completeOnboarding,
    getPostLoginRoute,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
