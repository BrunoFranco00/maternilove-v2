import { logger } from '@/lib/observability/logger';
import { metrics } from '@/lib/observability/metrics';

const DEFAULT_TIMEOUT = 30000;
const MAX_RETRIES = 2;
const RETRY_DELAY = 1000;
const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000';
const API_BASE_URL = `${BASE_URL.replace(/\/$/, '')}/api/v1`;

export interface ApiClientError {
  status: number;
  message: string;
  data?: unknown;
}

export class ApiClient {
  private baseURL: string;
  private timeout: number;

  constructor(baseURL: string = API_BASE_URL, timeout: number = DEFAULT_TIMEOUT) {
    this.baseURL = baseURL.replace(/\/$/, '');
    this.timeout = timeout;
  }

  private async sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {},
    retryCount: number = 0
  ): Promise<T> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.timeout);
    const method = options.method || 'GET';
    const shouldRetry = method === 'GET' && retryCount < MAX_RETRIES;

    try {
      let token: string | null = null;
      if (typeof window !== 'undefined') {
        token = localStorage.getItem('accessToken');
      }

      const response = await fetch(`${this.baseURL}${endpoint}`, {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          ...(token && { Authorization: `Bearer ${token}` }),
          ...options.headers,
        },
        credentials: 'include',
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({
          error: { message: response.statusText }
        }));

        const error: ApiClientError = {
          status: response.status,
          message: (errorData as any)?.error?.message || (errorData as any)?.message || `API Error: ${response.status}`,
          data: errorData,
        };

        if (response.status === 401) {
          if (typeof window !== 'undefined') {
            localStorage.removeItem('accessToken');
            localStorage.removeItem('refreshToken');
          }
        }

        if (shouldRetry && (response.status >= 500 || response.status === 408)) {
          const delay = RETRY_DELAY * (retryCount + 1);
          logger.warn(`Tentativa ${retryCount + 1} falhou, retry em ${delay}ms`, {
            endpoint,
            status: response.status,
            attempt: retryCount + 1,
          });
          metrics.increment('api.retry');
          await this.sleep(delay);
          return this.request<T>(endpoint, options, retryCount + 1);
        }

        logger.error('Erro na requisição API', {
          endpoint,
          status: response.status,
          method,
        });
        metrics.increment('api.error');
        throw error;
      }

      const data = await response.json();

      if (data && typeof data === 'object' && 'success' in data && data.success === true && 'data' in data) {
        metrics.increment('api.success');
        return data.data as T;
      }

      metrics.increment('api.success');
      return data as T;
    } catch (error) {
      clearTimeout(timeoutId);

      if (error instanceof Error && error.name === 'AbortError') {
        const timeoutError: ApiClientError = {
          status: 408,
          message: 'Request timeout',
        };

        if (shouldRetry) {
          const delay = RETRY_DELAY * (retryCount + 1);
          logger.warn(`Timeout na tentativa ${retryCount + 1}, retry em ${delay}ms`, {
            endpoint,
            attempt: retryCount + 1,
          });
          metrics.increment('api.timeout');
          await this.sleep(delay);
          return this.request<T>(endpoint, options, retryCount + 1);
        }

        logger.error('Timeout na requisição API', {
          endpoint,
          method,
        });
        metrics.increment('api.timeout');
        throw timeoutError;
      }

      if (shouldRetry && error instanceof Error) {
        const delay = RETRY_DELAY * (retryCount + 1);
        logger.warn(`Erro na tentativa ${retryCount + 1}, retry em ${delay}ms`, {
          endpoint,
          error: error.message,
          attempt: retryCount + 1,
        });
        metrics.increment('api.retry');
        await this.sleep(delay);
        return this.request<T>(endpoint, options, retryCount + 1);
      }

      logger.error('Erro na requisição API', {
        endpoint,
        method,
        error: error instanceof Error ? error.message : 'Erro desconhecido',
      });
      metrics.increment('api.error');
      throw error;
    }
  }

  async healthCheck(): Promise<boolean> {
    try {
      const baseUrl = this.baseURL.replace('/api/v1', '');
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000);
      
      const response = await fetch(`${baseUrl}/health`, {
        method: 'GET',
        credentials: 'include',
        signal: controller.signal,
      });
      
      clearTimeout(timeoutId);
      const isHealthy = response.ok;
      metrics.increment(isHealthy ? 'health.check.success' : 'health.check.failure');
      return isHealthy;
    } catch {
      metrics.increment('health.check.failure');
      return false;
    }
  }

  async get<T>(endpoint: string, options?: RequestInit): Promise<T> {
    return this.request<T>(endpoint, { ...options, method: 'GET' });
  }

  async post<T>(endpoint: string, body?: unknown, options?: RequestInit): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      method: 'POST',
      body: body ? JSON.stringify(body) : undefined,
    });
  }

  async patch<T>(endpoint: string, body?: unknown, options?: RequestInit): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      method: 'PATCH',
      body: body ? JSON.stringify(body) : undefined,
    });
  }
}

export const apiClient = new ApiClient();
