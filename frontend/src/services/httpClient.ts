/**
 * Cliente HTTP único para todas as chamadas de API
 * LOCK FRONTEND 1: Modo base - valida ENV, NÃO faz chamadas reais
 */

import type { ApiError, ApiResult } from '@/types/api';

const REQUEST_ID_HEADER = process.env.NEXT_PUBLIC_REQUEST_ID_HEADER ?? 'x-request-id';

// Validar se NEXT_PUBLIC_API_BASE_URL está configurada
const getBaseUrl = (): string => {
  const envUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
  
  if (!envUrl) {
    // Em desenvolvimento, permitir fallback (para build)
    if (process.env.NODE_ENV === 'development') {
      return '/api/v1';
    }
    // Em produção, retornar vazio (será validado no request)
    return '';
  }
  
  // Garantir que termina com /api/v1
  const cleanUrl = envUrl.trim().replace(/\/+$/, '');
  return `${cleanUrl}/api/v1`;
};

interface HttpClientOptions {
  baseUrl?: string;
  requestId?: string;
  headers?: Record<string, string>;
}

export class HttpClient {
  private baseUrl: string;

  constructor(options: HttpClientOptions = {}) {
    this.baseUrl = options.baseUrl || getBaseUrl();
  }

  private async request<TResponse, TBody = unknown>(
    endpoint: string,
    options: {
      method: string;
      body?: TBody;
      requestId?: string;
      headers?: Record<string, string>;
    }
  ): Promise<ApiResult<TResponse>> {
    // Validar ENV antes de qualquer chamada
    const envUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
    if (!envUrl) {
      const errorMsg = 'Configuração de ambiente ausente';
      if (typeof window !== 'undefined') {
        console.error('❌ ERRO: NEXT_PUBLIC_API_BASE_URL não configurada!', errorMsg);
      }
      return {
        ok: false,
        error: {
          status: 0,
          message: errorMsg,
          raw: null,
        },
      };
    }

    // LOCK FRONTEND 1: NÃO fazer chamadas reais
    // Apenas montar URL e retornar erro
    const url = endpoint.startsWith('http') 
      ? endpoint 
      : `${this.baseUrl}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;
    
    if (typeof window !== 'undefined') {
      console.warn(`🔒 LOCK FRONTEND 1: Chamada bloqueada - ${options.method} ${url}`);
    }
    
    return {
      ok: false,
      error: {
        status: 503,
        message: 'Integração com backend desabilitada (LOCK FRONTEND 1)',
        raw: { url, method: options.method },
      },
    };
  }

  async get<TResponse>(
    endpoint: string,
    options?: { requestId?: string; headers?: Record<string, string> }
  ): Promise<ApiResult<TResponse>> {
    return this.request<TResponse>(endpoint, {
      method: 'GET',
      requestId: options?.requestId,
      headers: options?.headers,
    });
  }

  async post<TResponse, TBody = unknown>(
    endpoint: string,
    body: TBody,
    options?: { requestId?: string; headers?: Record<string, string> }
  ): Promise<ApiResult<TResponse>> {
    return this.request<TResponse, TBody>(endpoint, {
      method: 'POST',
      body,
      requestId: options?.requestId,
      headers: options?.headers,
    });
  }

  async put<TResponse, TBody = unknown>(
    endpoint: string,
    body: TBody,
    options?: { requestId?: string; headers?: Record<string, string> }
  ): Promise<ApiResult<TResponse>> {
    return this.request<TResponse, TBody>(endpoint, {
      method: 'PUT',
      body,
      requestId: options?.requestId,
      headers: options?.headers,
    });
  }

  async patch<TResponse, TBody = unknown>(
    endpoint: string,
    body: TBody,
    options?: { requestId?: string; headers?: Record<string, string> }
  ): Promise<ApiResult<TResponse>> {
    return this.request<TResponse, TBody>(endpoint, {
      method: 'PATCH',
      body,
      requestId: options?.requestId,
      headers: options?.headers,
    });
  }

  async delete<TResponse>(
    endpoint: string,
    options?: { requestId?: string; headers?: Record<string, string> }
  ): Promise<ApiResult<TResponse>> {
    return this.request<TResponse>(endpoint, {
      method: 'DELETE',
      requestId: options?.requestId,
      headers: options?.headers,
    });
  }
}

// Instância singleton
let httpClientInstance: HttpClient | null = null;

export function createHttpClient(options?: HttpClientOptions): HttpClient {
  if (!httpClientInstance) {
    httpClientInstance = new HttpClient(options);
  }
  return httpClientInstance;
}

export function getHttpClient(): HttpClient {
  if (!httpClientInstance) {
    httpClientInstance = new HttpClient();
  }
  return httpClientInstance;
}

export default getHttpClient();
