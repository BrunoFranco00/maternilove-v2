/**
 * Serviço de Autenticação - LOCK FRONTEND 2A
 * Funções explícitas para Register e Login
 * NÃO contém lógica de sessão, apenas chamada + retorno
 */

import { getHttpClient } from './httpClient';
import type {
  RegisterRequest,
  RegisterResponse,
  LoginRequest,
  LoginResponse,
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
