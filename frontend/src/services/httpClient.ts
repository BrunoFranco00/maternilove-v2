/**
 * Cliente HTTP único para todas as chamadas de API
 * Baseado em fetch, com suporte a /api/v1, cookies, requestId e tratamento de erros
 * Com refresh token automático em caso de 401
 */

import type { ApiError, ApiResult } from '@/types/api';
import type { RefreshResponse, RefreshRequest } from '@/types/auth';

const REQUEST_ID_HEADER = process.env.NEXT_PUBLIC_REQUEST_ID_HEADER ?? 'x-request-id';
const DEFAULT_BASE_URL = '/api/v1';

interface HttpClientOptions {
  baseUrl?: string;
  requestId?: string;
  headers?: Record<string, string>;
}

// Callbacks para refresh token
type OnRefreshToken = () => Promise<string | null>; // Retorna novo accessToken ou null
type OnRefreshFailed = () => void; // Callback quando refresh falha

export class HttpClient {
  private baseUrl: string;
  private onRefreshToken: OnRefreshToken | null = null;
  private onRefreshFailed: OnRefreshFailed | null = null;
  private isRefreshing = false;
  private refreshPromise: Promise<string | null> | null = null;

  constructor(options: HttpClientOptions = {}) {
    this.baseUrl = options.baseUrl || DEFAULT_BASE_URL;
  }

  /**
   * Configurar callbacks para refresh token
   */
  setRefreshTokenCallbacks(onRefresh: OnRefreshToken, onFailed: OnRefreshFailed) {
    this.onRefreshToken = onRefresh;
    this.onRefreshFailed = onFailed;
  }

  /**
   * Obter access token do storage
   */
  private getAccessToken(): string | null {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem('accessToken');
  }

  /**
   * Obter refresh token do storage
   */
  private getRefreshToken(): string | null {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem('refreshToken');
  }

  /**
   * Atualizar access token no storage
   */
  private setAccessToken(token: string): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem('accessToken', token);
  }

  /**
   * Atualizar tokens no storage
   */
  private setTokens(accessToken: string, refreshToken: string): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('refreshToken', refreshToken);
  }

  /**
   * Limpar tokens do storage
   */
  private clearTokens(): void {
    if (typeof window === 'undefined') return;
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
  }

  /**
   * Tentar fazer refresh do token
   */
  private async attemptRefresh(): Promise<string | null> {
    // Se já está fazendo refresh, aguardar o mesmo promise
    if (this.isRefreshing && this.refreshPromise) {
      return this.refreshPromise;
    }

    // Se não há callback configurado, tentar refresh direto
    if (!this.onRefreshToken) {
      const refreshToken = this.getRefreshToken();
      if (!refreshToken) {
        return null;
      }

      this.isRefreshing = true;
      this.refreshPromise = this.refreshTokenDirect(refreshToken);
      
      try {
        const result = await this.refreshPromise;
        return result;
      } finally {
        this.isRefreshing = false;
        this.refreshPromise = null;
      }
    }

    // Usar callback configurado
    this.isRefreshing = true;
    this.refreshPromise = this.onRefreshToken();
    
    try {
      const result = await this.refreshPromise;
      return result;
    } finally {
      this.isRefreshing = false;
      this.refreshPromise = null;
    }
  }

  /**
   * Refresh token direto (sem callback)
   */
  private async refreshTokenDirect(refreshToken: string): Promise<string | null> {
    try {
      const result = await this.post<RefreshResponse, RefreshRequest>(
        '/auth/refresh',
        { refreshToken }
      );

      if (result.ok) {
        this.setTokens(result.data.accessToken, result.data.refreshToken);
        return result.data.accessToken;
      }

      return null;
    } catch {
      return null;
    }
  }

  private async request<TResponse, TBody = unknown>(
    endpoint: string,
    options: {
      method: string;
      body?: TBody;
      requestId?: string;
      headers?: Record<string, string>;
      retry?: boolean; // Flag para evitar loop infinito
    }
  ): Promise<ApiResult<TResponse>> {
    const url = `${this.baseUrl}${endpoint}`;
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    // Adicionar access token se disponível (exceto em /auth/*)
    const accessToken = this.getAccessToken();
    if (accessToken && !endpoint.startsWith('/auth/')) {
      headers['Authorization'] = `Bearer ${accessToken}`;
    }

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

      // Se 401 e não é endpoint de auth e não é retry, tentar refresh
      if (response.status === 401 && !endpoint.startsWith('/auth/') && !options.retry) {
        const newAccessToken = await this.attemptRefresh();
        
        if (newAccessToken) {
          // Repetir request com novo token
          return this.request<TResponse, TBody>(endpoint, {
            ...options,
            retry: true,
            headers: {
              ...options.headers,
              'Authorization': `Bearer ${newAccessToken}`,
            },
          });
        } else {
          // Refresh falhou, chamar callback de falha
          if (this.onRefreshFailed) {
            this.onRefreshFailed();
          }
          this.clearTokens();
        }
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

  private extractErrorMessage(data: unknown): string {
    if (typeof data === 'string') {
      return data || 'Erro desconhecido';
    }
    if (data && typeof data === 'object') {
      const obj = data as Record<string, unknown>;
      if (obj.message && typeof obj.message === 'string') {
        return obj.message;
      }
      if (obj.error && typeof obj.error === 'object') {
        const error = obj.error as Record<string, unknown>;
        if (error.message && typeof error.message === 'string') {
          return error.message;
        }
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

    // Tentar extrair do body (defensivo, sem assumir estrutura)
    if (data && typeof data === 'object') {
      const obj = data as Record<string, unknown>;
      if (obj.requestId && typeof obj.requestId === 'string') {
        return obj.requestId;
      }
      if (obj.data && typeof obj.data === 'object') {
        const dataObj = obj.data as Record<string, unknown>;
        if (dataObj.requestId && typeof dataObj.requestId === 'string') {
          return dataObj.requestId;
        }
      }
      if (obj.error && typeof obj.error === 'object') {
        const error = obj.error as Record<string, unknown>;
        if (error.requestId && typeof error.requestId === 'string') {
          return error.requestId;
        }
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
