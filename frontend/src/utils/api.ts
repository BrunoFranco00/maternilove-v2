/**
 * Configuração da API
 */

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

class ApiClient {
  private baseURL: string;

  constructor(baseURL: string) {
    this.baseURL = baseURL.replace(/\/$/, '');
    this.setupInterceptors();
  }

  private setupInterceptors() {
    // Interceptor para adicionar token
    // TODO: Implementar interceptor do axios quando adicionar
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
        // Token expirado, fazer logout
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        window.location.href = '/login';
      }
      const errorData = await response.json().catch(() => ({ error: { message: response.statusText } }));
      
      // Extrair mensagem de erro do formato { success: false, error: { message: "..." } }
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

export const api = new ApiClient(API_BASE_URL);
export const API_URL = API_BASE_URL;

// Endpoints
export const apiEndpoints = {
  auth: {
    login: (data: { email: string; password: string }) =>
      api.post('/api/auth/login', data),
    register: (data: { name: string; email: string; password: string }) =>
      api.post('/api/auth/register', data),
  },
  health: () => api.get<{ status: string; timestamp: string; database: string }>('/health'),
};

if (import.meta.env?.DEV) {
  console.log('🔗 API URL:', API_BASE_URL);
}
