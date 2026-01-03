/**
 * Configuração da API
 * 
 * Este arquivo centraliza a configuração de chamadas para a API backend.
 * Em desenvolvimento: usa http://localhost:3000
 * Em produção: usa VITE_API_URL do ambiente Vercel
 */

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

/**
 * Classe para fazer requisições HTTP para a API
 */
class ApiClient {
  private baseURL: string;

  constructor(baseURL: string) {
    this.baseURL = baseURL.replace(/\/$/, ''); // Remove trailing slash
  }

  /**
   * Faz uma requisição GET
   */
  async get<T>(endpoint: string, options?: RequestInit): Promise<T> {
    const response = await fetch(`${this.baseURL}${endpoint}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
      credentials: 'include',
      ...options,
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }

    return response.json();
  }

  /**
   * Faz uma requisição POST
   */
  async post<T>(endpoint: string, data?: any, options?: RequestInit): Promise<T> {
    const response = await fetch(`${this.baseURL}${endpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
      credentials: 'include',
      body: data ? JSON.stringify(data) : undefined,
      ...options,
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: response.statusText }));
      throw new Error(error.message || `API Error: ${response.status}`);
    }

    return response.json();
  }

  /**
   * Faz uma requisição PUT
   */
  async put<T>(endpoint: string, data?: any, options?: RequestInit): Promise<T> {
    const response = await fetch(`${this.baseURL}${endpoint}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
      credentials: 'include',
      body: data ? JSON.stringify(data) : undefined,
      ...options,
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: response.statusText }));
      throw new Error(error.message || `API Error: ${response.status}`);
    }

    return response.json();
  }

  /**
   * Faz uma requisição DELETE
   */
  async delete<T>(endpoint: string, options?: RequestInit): Promise<T> {
    const response = await fetch(`${this.baseURL}${endpoint}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
      credentials: 'include',
      ...options,
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }

    return response.json();
  }

  /**
   * Faz uma requisição PATCH
   */
  async patch<T>(endpoint: string, data?: any, options?: RequestInit): Promise<T> {
    const response = await fetch(`${this.baseURL}${endpoint}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
      credentials: 'include',
      body: data ? JSON.stringify(data) : undefined,
      ...options,
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: response.statusText }));
      throw new Error(error.message || `API Error: ${response.status}`);
    }

    return response.json();
  }
}

// Instância singleton da API
export const api = new ApiClient(API_BASE_URL);

// Exportar a URL base também para uso em outros lugares
export const API_URL = API_BASE_URL;

/**
 * Funções de conveniência para endpoints específicos
 */
export const apiEndpoints = {
  // Health Check
  health: () => api.get<{ status: string; timestamp: string; database: string }>('/health'),
  
  // API Info
  info: () => api.get<{ message: string; version: string; endpoints: Record<string, string> }>('/api'),
  
  // Users
  users: {
    list: () => api.get('/api/users'),
    get: (id: string) => api.get(`/api/users/${id}`),
    create: (data: any) => api.post('/api/users', data),
    update: (id: string, data: any) => api.put(`/api/users/${id}`, data),
    delete: (id: string) => api.delete(`/api/users/${id}`),
  },
  
  // Journey
  journey: {
    get: () => api.get('/api/journey'),
    create: (data: any) => api.post('/api/journey', data),
    update: (data: any) => api.put('/api/journey', data),
  },
  
  // Moments
  moments: {
    list: () => api.get('/api/moments'),
    get: (id: string) => api.get(`/api/moments/${id}`),
    create: (data: any) => api.post('/api/moments', data),
    update: (id: string, data: any) => api.put(`/api/moments/${id}`, data),
    delete: (id: string) => api.delete(`/api/moments/${id}`),
  },
  
  // Community
  community: {
    posts: {
      list: () => api.get('/api/community'),
      get: (id: string) => api.get(`/api/community/${id}`),
      create: (data: any) => api.post('/api/community', data),
    },
  },
  
  // Marketplace
  marketplace: {
    products: () => api.get('/api/marketplace'),
    orders: () => api.get('/api/marketplace/orders'),
  },
  
  // Admin
  admin: {
    dashboard: () => api.get('/api/admin'),
  },
};

// Log da URL da API em desenvolvimento (para debug)
if (import.meta.env.DEV) {
  console.log('🔗 API URL:', API_BASE_URL);
}

