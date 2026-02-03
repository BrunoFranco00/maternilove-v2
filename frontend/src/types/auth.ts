/**
 * Tipos de autenticação
 */

import type { NormalizedRole } from '@/lib/normalizeRole';
export interface User {
  id: string;
  email: string;
  name: string;
  role: NormalizedRole;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface LoginResponse {
  user: User;
  tokens: AuthTokens;
}

export interface RegisterResponse {
  user: User;
  tokens: AuthTokens;
}

export interface RefreshResponse {
  accessToken: string;
  refreshToken: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  name: string;
}

export interface RefreshRequest {
  refreshToken: string;
}

export interface LogoutRequest {
  refreshToken: string;
}

export type AuthStatus = 'loading' | 'authenticated' | 'unauthenticated';
