/**
 * Cliente HTTP único para todas as chamadas de API
 * LOCK FRONTEND 2A: Chamadas reais para /auth/register, /auth/login, /auth/refresh, /auth/logout
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

    // LOCK FRONTEND 2A: Permitir chamadas reais para endpoints de auth
    const isAuthEndpoint = 
      endpoint === '/auth/register' || 
      endpoint === '/auth/login' || 
      endpoint === '/auth/refresh' ||
      endpoint === '/auth/logout';
    
    if (!isAuthEndpoint) {
      // Bloquear outras chamadas (LOCK FRONTEND 1 ainda ativo para outras rotas)
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

    // Construir URL completa
    const url = endpoint.startsWith('http') 
      ? endpoint 
      : `${this.baseUrl}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;
    
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    // Adicionar requestId se fornecido
    if (options.requestId) {
      headers[REQUEST_ID_HEADER] = options.requestId;
    }

    try {
      const response = await fetch(url, {
        method: options.method,
        headers,
        credentials: 'include', // CRÍTICO: Enviar cookies (HttpOnly)
        body: options.body ? JSON.stringify(options.body) : undefined,
      });

      // Tentar parsear JSON, fallback para texto
      let data: unknown;
      const contentType = response.headers.get('content-type');
      
      if (contentType?.includes('application/json')) {
        try {
          data = await response.json();
        } catch {
          data = await response.text();
        }
      } else {
        data = await response.text();
      }

      if (!response.ok) {
        const error: ApiError = {
          status: response.status,
          message: this.extractErrorMessage(data),
          raw: data,
          requestId: this.extractRequestId(response, data),
        };
        return { ok: false, error };
      }

      // Backend retorna envelope: { success: true, data: {...}, requestId: "..." }
      // Extrair data do envelope
      let responseData = data;
      if (data && typeof data === 'object') {
        const envelope = data as Record<string, unknown>;
        if (envelope.success === true && envelope.data !== undefined) {
          responseData = envelope.data;
        }
      }

      return { ok: true, data: responseData as TResponse };
    } catch (error) {
      const apiError: ApiError = {
        status: 0,
        message: error instanceof Error ? error.message : 'Erro de rede desconhecido',
        raw: error,
      };
      return { ok: false, error: apiError };
    }
  }

  private extractErrorMessage(data: unknown): string {
    if (typeof data === 'string') {
      return data || 'Erro desconhecido';
    }
    if (data && typeof data === 'object') {
      const obj = data as Record<string, unknown>;
      // Backend retorna envelope: { success: false, error: { message, code } }
      if (obj.error && typeof obj.error === 'object') {
        const error = obj.error as Record<string, unknown>;
        if (error.message && typeof error.message === 'string') {
          return error.message;
        }
      }
      // Fallback para message direto
      if (obj.message && typeof obj.message === 'string') {
        return obj.message;
      }
    }
    return 'Erro desconhecido';
  }

  private extractRequestId(response: Response, data: unknown): string | undefined {
    // Tentar extrair do header
    const headerRequestId = response.headers.get(REQUEST_ID_HEADER) || 
                           response.headers.get('x-request-id') ||
                           response.headers.get('request-id');
    
    if (headerRequestId) {
      return headerRequestId;
    }

    // Tentar extrair do body
    if (data && typeof data === 'object') {
      const obj = data as Record<string, unknown>;
      if (obj.requestId && typeof obj.requestId === 'string') {
        return obj.requestId;
      }
    }

    return undefined;
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
