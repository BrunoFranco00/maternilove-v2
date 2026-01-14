/**
 * Serviço de Autenticação - LOCK FRONTEND FINAL
 * Funções explícitas para Register, Login, Refresh e Logout
 */

import { getHttpClient } from './httpClient';
import type {
  RegisterRequest,
  RegisterResponse,
  LoginRequest,
  LoginResponse,
  RefreshRequest,
  RefreshResponse,
  LogoutRequest,
} from '@/types/auth';

/**
 * Registrar novo usuário
 */
export async function register(
  payload: RegisterRequest
): Promise<RegisterResponse> {
  const httpClient = getHttpClient();
  const result = await httpClient.post<RegisterResponse, RegisterRequest>(
    '/auth/register',
    payload
  );

  if (!result.ok) {
    const errorMessage = result.error.message || 'Erro ao criar conta';
    console.error('❌ Erro no registro:', result.error);
    throw new Error(errorMessage);
  }

  return result.data;
}

/**
 * Fazer login
 */
export async function login(
  payload: LoginRequest
): Promise<LoginResponse> {
  const httpClient = getHttpClient();
  const result = await httpClient.post<LoginResponse, LoginRequest>(
    '/auth/login',
    payload
  );

  if (!result.ok) {
    const errorMessage = result.error.message || 'Erro ao fazer login';
    console.error('❌ Erro no login:', result.error);
    throw new Error(errorMessage);
  }

  return result.data;
}

/**
 * Refresh token
 */
export async function refresh(
  payload: RefreshRequest
): Promise<RefreshResponse> {
  const httpClient = getHttpClient();
  const result = await httpClient.post<RefreshResponse, RefreshRequest>(
    '/auth/refresh',
    payload
  );

  if (!result.ok) {
    const errorMessage = result.error.message || 'Erro ao renovar sessão';
    console.error('❌ Erro no refresh:', result.error);
    throw new Error(errorMessage);
  }

  return result.data;
}

/**
 * Logout
 */
export async function logout(
  payload: LogoutRequest
): Promise<void> {
  const httpClient = getHttpClient();
  const result = await httpClient.post<{ success: boolean }, LogoutRequest>(
    '/auth/logout',
    payload
  );

  if (!result.ok) {
    // Logout é idempotente, apenas logar erro
    console.error('❌ Erro no logout:', result.error);
  }
}
