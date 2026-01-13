/**
 * Cliente HTTP único para todas as chamadas de API
 * Baseado em fetch, com suporte a /api/v1, cookies, requestId e tratamento de erros
 */

import type { ApiError, ApiResult } from '@/types/api';

const REQUEST_ID_HEADER = process.env.NEXT_PUBLIC_REQUEST_ID_HEADER ?? 'x-request-id';
const DEFAULT_BASE_URL = '/api/v1';

interface HttpClientOptions {
  baseUrl?: string;
  requestId?: string;
  headers?: Record<string, string>;
}

export class HttpClient {
  private baseUrl: string;

  constructor(options: HttpClientOptions = {}) {
    this.baseUrl = options.baseUrl || DEFAULT_BASE_URL;
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
    const url = `${this.baseUrl}${endpoint}`;
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
        credentials: 'include', // Suporte a cookies
        body: options.body ? JSON.stringify(options.body) : undefined,
      });

      // Tentar parsear JSON, fallback para texto
      let data: any;
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

      return { ok: true, data: data as TResponse };
    } catch (error) {
      const apiError: ApiError = {
        status: 0,
        message: error instanceof Error ? error.message : 'Erro de rede desconhecido',
        raw: error,
      };
      return { ok: false, error: apiError };
    }
  }

  private extractErrorMessage(data: any): string {
    if (typeof data === 'string') {
      return data || 'Erro desconhecido';
    }
    if (data?.message) {
      return data.message;
    }
    if (data?.error?.message) {
      return data.error.message;
    }
    return 'Erro desconhecido';
  }

  private extractRequestId(response: Response, data: any): string | undefined {
    // Tentar extrair do header
    const headerRequestId = response.headers.get(REQUEST_ID_HEADER) || 
                           response.headers.get('x-request-id') ||
                           response.headers.get('request-id');
    
    if (headerRequestId) {
      return headerRequestId;
    }

    // Tentar extrair do body (defensivo, sem assumir estrutura)
    if (data?.requestId) {
      return data.requestId;
    }
    if (data?.data?.requestId) {
      return data.data.requestId;
    }
    if (data?.error?.requestId) {
      return data.error.requestId;
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
