/**
 * Configuração da API - Client centralizado
 */

// API URL Configuration
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';
const BASE_URL_WITH_API = `${API_BASE_URL.replace(/\/$/, '')}/api`;

// Log temporário para debug
console.log('🔗 API URL:', import.meta.env.VITE_API_URL);
console.log('🔗 API Base URL:', API_BASE_URL);
console.log('🔗 API URL com /api:', BASE_URL_WITH_API);

// Validar que variável está configurada em produção
if (!import.meta.env.VITE_API_URL) {
  if (import.meta.env.MODE === 'production') {
    console.error('❌ ERRO: VITE_API_URL não está configurado em produção!');
  } else {
    console.warn('⚠️ VITE_API_URL não configurado, usando localhost');
  }
}

class ApiClient {
  private baseURL: string;

  constructor(baseURL: string) {
    this.baseURL = baseURL.replace(/\/$/, '');
    this.setupInterceptors();
  }

  private setupInterceptors() {
    // Interceptor para adicionar token
  }

  async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const token = localStorage.getItem('accessToken');
    
    const response = await fetch(`${this.baseURL}${endpoint}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
      },
      credentials: 'include',
    });

    if (!response.ok) {
      if (response.status === 401) {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        window.location.href = '/login';
      }
      const errorData = await response.json().catch(() => ({ error: { message: response.statusText } }));
      const errorMessage = errorData.error?.message || errorData.message || `API Error: ${response.status}`;
      const error = new Error(errorMessage);
      (error as any).status = response.status;
      (error as any).data = errorData;
      throw error;
    }

    return response.json();
  }

  async get<T>(endpoint: string, options?: RequestInit): Promise<T> {
    return this.request<T>(endpoint, { ...options, method: 'GET' });
  }

  async post<T>(endpoint: string, data?: any, options?: RequestInit): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async put<T>(endpoint: string, data?: any, options?: RequestInit): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async delete<T>(endpoint: string, options?: RequestInit): Promise<T> {
    return this.request<T>(endpoint, { ...options, method: 'DELETE' });
  }

  async patch<T>(endpoint: string, data?: any, options?: RequestInit): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      method: 'PATCH',
      body: data ? JSON.stringify(data) : undefined,
    });
  }
}

export const api = new ApiClient(BASE_URL_WITH_API);
export const API_URL = BASE_URL_WITH_API;

// Endpoints
export const apiEndpoints = {
  auth: {
    login: (data: { email: string; password: string }) =>
      api.post('/auth/login', data),
    register: (data: { name: string; email: string; password: string }) =>
      api.post('/auth/register', data),
  },
  health: () => {
    const healthUrl = `${API_BASE_URL.replace(/\/$/, '')}/health`;
    return fetch(healthUrl).then(res => res.json());
  },
};
