# FRONTEND CORE EMOTIONAL AUDIT

## 1. Estrutura

### app/

```
src/app/
  layout.tsx
  page.tsx
  error.tsx
  loading.tsx
  (auth)/
    layout.tsx
    login/
      page.tsx
    register/
      page.tsx
  (private)/
    layout.tsx
    dashboard/
      page.tsx
  (public)/
    layout.tsx
  (user)/
    layout.tsx
    dashboard/
  (testers)/
    layout.tsx
    experiments/
      page.tsx
  (core-emotional)/
    layout.tsx
    check-in/
      page.tsx
    relief/
      page.tsx
    core.store.ts
  admin/
    layout.tsx
    page.tsx
    overview/
    flags/
    users/
```

### app/(core-emotional)/

```
src/app/(core-emotional)/
  layout.tsx
  check-in/
    page.tsx
  relief/
    page.tsx
  core.store.ts
```

### lib/

```
src/lib/
  api/
    client.ts
    endpoints.ts
  flags/
    featureFlags.ts
    flagResolver.ts
  auth/
    roles.ts
    constants.ts
    permissions.ts
  observability/
    logger.ts
    metrics.ts
  i18n.ts
  normalizeRole.ts
```

### services/

```
src/services/
  api.ts
  authService.ts
  httpClient.ts
```

### hooks/

```
src/hooks/
  useAuth.ts
  usePWAInstall.ts
```

### context/ e contexts/

Não existe pasta `context/`. Existe `contexts/`:

```
src/contexts/
  AuthContext.tsx
```

### middleware.ts

Existe em `src/middleware.ts`.

### Pastas relacionadas a auth ou api

```
src/components/auth/
  ProtectedRoute.tsx

src/providers/
  AuthProvider.tsx
  ApiProvider.tsx
  ToastProvider.tsx
  Providers.tsx

src/store/
  auth.store.ts (não verificado neste audit)
  flags.store.ts

src/lib/auth/
  roles.ts
  constants.ts
  permissions.ts
```

---

## 2. Check-in Page

### Conteúdo completo de app/(core-emotional)/check-in/page.tsx

```tsx
"use client";

export const dynamic = 'force-dynamic';

export default function CheckInPage() {
  return (
    <main style={{ padding: 40 }}>
      <h1>CHECK-IN CARREGOU</h1>
    </main>
  );
}
```

### Conteúdo completo de app/(core-emotional)/layout.tsx

```tsx
'use client';

import { FeatureFlagGuard } from '@/components/guards/FeatureFlagGuard';

export default function CoreEmotionalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <FeatureFlagGuard
      flag="CORE_EMOTIONAL_ENABLED"
      fallback={<div className="p-8 text-center">Módulo em manutenção</div>}
    >
      <div className="min-h-screen bg-gradient-to-b from-primary-50 to-white">
        {children}
      </div>
    </FeatureFlagGuard>
  );
}
```

### Explicação

- **Server Component ou Client Component:** Client Component (diretiva `"use client"`).
- **Se possui fetch:** Não. A página não faz nenhuma chamada à API.
- **Se possui estado:** Não. Não usa useState, useReducer ou hooks de estado.
- **Se possui integração real ou apenas mock:** Apenas placeholder. A página é estática e exibe apenas "CHECK-IN CARREGOU". Existe `core.store.ts` com `checkIn()` que chama `apiClient.post(API_ENDPOINTS.CORE.CHECK_IN, data)`, mas a página check-in **não utiliza** esse store.

**IMPORTANTE - Inconsistência com backend:** O `core.store` e `API_ENDPOINTS.CORE` apontam para `/core/check-in` e a assinatura do DTO (`emotions[]`, `notes`, `mood`) difere do backend real, que espera `mood` (obrigatório) e `note` (opcional) em `/api/v1/checkin`.

---

## 3. Relief Page

### Conteúdo completo de app/(core-emotional)/relief/page.tsx

```tsx
'use client';

import { useMemo } from 'react';

const RELIEF_RESOURCES = [
  { title: 'Meditação', icon: '🧘', description: 'Exercícios de respiração e relaxamento' },
  { title: 'Música Relaxante', icon: '🎵', description: 'Playlists para acalmar e tranquilizar' },
  { title: 'Exercícios Físicos', icon: '💪', description: 'Atividades suaves para gestantes' },
  { title: 'Comunidade', icon: '👥', description: 'Acesso à comunidade' },
] as const;

export default function ReliefPage() {
  const resources = useMemo(() => RELIEF_RESOURCES, []);

  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-3xl md:text-4xl font-bold text-primary-600">
            Recursos de Suporte
          </h1>
          <p className="text-gray-600">
            Recursos disponíveis
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {resources.map((item, index) => (
            <div
              key={index}
              role="button"
              tabIndex={0}
              aria-label={`Acessar ${item.title}`}
              className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-primary-400 focus:ring-offset-2 transition-shadow cursor-pointer"
            >
              <div className="text-4xl mb-3" aria-hidden="true">{item.icon}</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">{item.title}</h3>
              <p className="text-gray-600 text-sm">{item.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
```

### Explicação

- **Se consome dados:** Não. Usa apenas o array local `RELIEF_RESOURCES`.
- **Se é estático:** Sim. Os dados são constantes hardcoded.
- **Se depende de mood:** Não. A página não usa mood nem dados de check-in. O `core.store` tem `getRelief(id)` que chama `/core/relief/${id}`, mas a página relief **não usa** esse método e não existe endpoint equivalente no backend implementado.

---

## 4. API Layer

### lib/api/client.ts (completo)

```typescript
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
        const cookies = document.cookie.split('; ');
        const tokenCookie = cookies.find(row => row.startsWith('accessToken='));
        if (tokenCookie) {
          token = tokenCookie.split('=')[1];
        }
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
            document.cookie = 'accessToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
            document.cookie = 'refreshToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
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
```

### lib/api/endpoints.ts (completo)

```typescript
export const API_ENDPOINTS = {
  AUTH: {
    SESSION: '/auth/session',
  },
  ADMIN: {
    USERS: '/admin/users',
    USER_ROLE: (userId: string) => `/admin/users/${userId}/role`,
    FLAGS: '/admin/flags',
    FLAG: (key: string) => `/admin/flags/${key}`,
  },
  CORE: {
    CHECK_IN: '/core/check-in',
    RELIEF: (id: string) => `/core/relief/${id}`,
  },
} as const;
```

### services/api.ts (completo)

```typescript
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

  // ... put, delete, patch
}

export const api = new ApiClient(BASE_URL_WITH_API);
export const API_URL = BASE_URL_WITH_API;
```

### services/httpClient.ts (completo - trechos relevantes)

```typescript
const getBaseUrl = (): string => {
  const envUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
  // ...
  return `${cleanUrl}/api/v1`;
};

// BLOQUEIO: Apenas auth endpoints são permitidos
const isAuthEndpoint = 
  endpoint === '/auth/register' || 
  endpoint === '/auth/login' || 
  endpoint === '/auth/refresh' ||
  endpoint === '/auth/logout';

if (!isAuthEndpoint) {
  return {
    ok: false,
    error: {
      status: 503,
      message: 'Integração com backend desabilitada (LOCK FRONTEND 1)',
      raw: { url, method: options.method },
    },
  };
}
// httpClient NÃO adiciona Authorization header - auth usa cookies HttpOnly (credentials: 'include')
```

### core.store.ts (completo)

```typescript
import { create } from 'zustand';
import { apiClient } from '@/lib/api/client';
import { API_ENDPOINTS } from '@/lib/api/endpoints';
import { CheckInRequestDto, CheckInResponseDto } from '@/types/dto/checkin.dto';
import { ReliefResponseDto } from '@/types/dto/relief.dto';

interface CoreState {
  checkIn: (data: CheckInRequestDto) => Promise<CheckInResponseDto | null>;
  getRelief: (id: string) => Promise<ReliefResponseDto | null>;
  isLoading: boolean;
  error: string | null;
}

export const useCoreStore = create<CoreState>((set) => ({
  isLoading: false,
  error: null,

  checkIn: async (data: CheckInRequestDto) => {
    set({ isLoading: true, error: null });
    try {
      const response = await apiClient.post<CheckInResponseDto>(
        API_ENDPOINTS.CORE.CHECK_IN,
        data
      );
      set({ isLoading: false });
      return response;
    } catch {
      set({ isLoading: false, error: null });
      return null;
    }
  },

  getRelief: async (id: string) => {
    set({ isLoading: true, error: null });
    try {
      const response = await apiClient.get<ReliefResponseDto>(
        API_ENDPOINTS.CORE.RELIEF(id)
      );
      set({ isLoading: false });
      return response;
    } catch {
      set({ isLoading: false, error: null });
      return null;
    }
  },
}));
```

### DTOs (types/dto/checkin.dto.ts e relief.dto.ts)

```typescript
// checkin.dto.ts
export interface CheckInRequestDto {
  emotions: string[];
  notes?: string;
  mood?: string;
}

export interface CheckInResponseDto {
  id: string;
  userId: string;
  emotions: string[];
  notes?: string;
  mood?: string;
  createdAt: string;
}

// relief.dto.ts
export interface ReliefResponseDto {
  id: string;
  title: string;
  description: string;
  type: string;
  content: string;
  createdAt: string;
}
```

### Não existe

- `lib/api.ts` — não existe (existe `lib/api/client.ts` e `lib/api/endpoints.ts`).
- `hooks/useApi.ts` — não existe.
- `hooks/useFetch.ts` — não existe.
- Wrapper genérico `fetch` — as chamadas usam `fetch` diretamente dentro de `ApiClient` e `HttpClient`.

### Explicação

**Como as chamadas HTTP são feitas**

- **lib/api/client.ts (apiClient):** Fetch nativo, retry para GET em 5xx/408, lê token de cookie `accessToken`, adiciona `Authorization: Bearer ${token}` quando existe. Usado por `core.store`, `flags.store` e outros módulos.
- **services/api.ts (api):** Fetch nativo, lê token de `localStorage.getItem('accessToken')`, adiciona `Authorization: Bearer ${token}`. Usado por `contexts/AuthContext.tsx` (login/register). Usa `import.meta.env.VITE_API_URL`.
- **services/httpClient.ts:** Usado por `authService` (register, login, refresh, logout). Apenas auth endpoints são permitidos (LOCK FRONTEND 1). Não adiciona Authorization; usa `credentials: 'include'` para cookies.

**BaseURL**

- `apiClient`: `NEXT_PUBLIC_API_BASE_URL` (sem trailing slash) + `/api/v1`. Fallback: `http://localhost:3000/api/v1`.
- `api`: `VITE_API_URL` + `/api`. Fallback: `http://localhost:3000/api`.
- `httpClient`: `NEXT_PUBLIC_API_BASE_URL` + `/api/v1`.

**Variáveis de ambiente**

- `NEXT_PUBLIC_API_BASE_URL` — usada por `lib/api/client` e `services/httpClient`.
- `VITE_API_URL` — usada por `services/api` (Vite).

**Authorization header**

- **apiClient:** Lê `accessToken` do cookie e envia `Authorization: Bearer ${token}`.
- **api:** Lê `accessToken` do localStorage e envia `Authorization: Bearer ${token}`.
- **httpClient:** Não envia Authorization; usa `credentials: 'include'`.

**IMPORTANTE para integração com backend Emotional Checkin**

- Backend expõe: `POST /api/v1/checkin`, `GET /api/v1/checkin/latest`, `GET /api/v1/checkin`.
- Frontend `API_ENDPOINTS.CORE.CHECK_IN` = `/core/check-in` → URL final `{base}/api/v1/core/check-in`. **Incompatível** com `/api/v1/checkin`.
- `CheckInRequestDto` usa `emotions[]`, `notes`, `mood`. Backend espera `mood` (obrigatório), `note` (opcional).
- Para integrar, é necessário: (1) ajustar endpoint em `API_ENDPOINTS` para `/checkin`, (2) alinhar DTO com `{ mood, note? }`, (3) garantir que token (cookie ou localStorage) seja enviado via Authorization conforme o client usado.

---

## 5. Auth

### AuthProvider (providers/AuthProvider.tsx) — trechos relevantes

Tokens são salvos em **localStorage**:

```typescript
const saveTokens = useCallback((accessToken: string, refreshTokenValue: string) => {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('refreshToken', refreshTokenValue);
  } catch (error) { ... }
}, []);
```

Também são usados:

- `localStorage` para `user` e `onboardingCompleted`
- Cookie `user_role` para role normalizada

### useAuth (hooks/useAuth.ts)

```typescript
export { useAuth } from '@/providers/AuthProvider';
```

### AuthProvider — trechos completos sobre token

```typescript
// Login
const result: LoginResponse = await authService.login(request);
saveTokens(result.tokens.accessToken, result.tokens.refreshToken);
saveUser(result.user);

// Logout
clearTokens(); // remove accessToken, refreshToken, user, user_role

// Inicialização: valida via refresh no backend
const result = await authService.refresh(request);
saveTokens(result.accessToken, result.refreshToken);
```

### providers/Providers.tsx (completo)

```tsx
'use client';

import React, { ReactNode } from 'react';
import { ToastProvider } from './ToastProvider';
import { ApiProvider } from './ApiProvider';
// import { AuthProvider } from './AuthProvider';

export function Providers({ children }: ProvidersProps) {
  return (
    <ToastProvider>
      <ApiProvider>
        {/* AuthProvider desabilitado temporariamente para teste */}
        {/* <AuthProvider>{children}</AuthProvider> */}
        {children}
      </ApiProvider>
    </ToastProvider>
  );
}
```

### ProtectedRoute (components/auth/ProtectedRoute.tsx) — completo

```tsx
'use client';

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  return <>{children}</>;
}
```

### middleware.ts (completo)

```typescript
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

/** Middleware desabilitado temporariamente para teste (auth off) */
export function middleware(_request: NextRequest) {
  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|images).*)',
  ],
};
```

### Explicação

**Como o token é salvo**

- `AuthProvider` salva em `localStorage`: `accessToken`, `refreshToken`, `user`.
- Cookie `user_role` é definido para role.
- Não há escrita de cookie `accessToken` pelo AuthProvider.

**Como o token é enviado para a API**

- `lib/api/client` (apiClient): Lê `accessToken` do **cookie** `accessToken=`. Se não houver cookie, não envia Authorization.
- `services/api`: Lê `accessToken` do **localStorage** e envia `Authorization: Bearer ${token}`.

**Inconsistência:** AuthProvider grava apenas em localStorage, mas apiClient usa cookie. Assim, chamadas via apiClient (incluindo core.store) não terão token até que algo passe a definir o cookie `accessToken`.

**Se /check-in exige login**

- Layout de (core-emotional) não usa `ProtectedRoute`.
- Rota `/check-in` não está protegida por auth no frontend.
- O backend exige `authenticate`; sem token válido, a API retorna 401.

**Se o middleware protege a rota**

- Não. O middleware atual sempre retorna `NextResponse.next()` e não faz checagem de auth.

---

## 6. Feature Flags

### featureFlags.ts (completo)

```typescript
export type FeatureFlagKey =
  | 'CORE_EMOTIONAL_ENABLED'
  | 'MARKETPLACE_ENABLED'
  | 'COMMUNITY_ENABLED'
  | 'JOURNEY_ENABLED'
  | 'TESTERS_EXPERIMENTS_ENABLED'
  | 'ADMIN_LOGS_ENABLED';

export interface FeatureFlag {
  key: FeatureFlagKey;
  enabled: boolean;
  description?: string;
}

export const DEFAULT_FEATURE_FLAGS: Record<FeatureFlagKey, FeatureFlag> = {
  CORE_EMOTIONAL_ENABLED: {
    key: 'CORE_EMOTIONAL_ENABLED',
    enabled: true,
    description: 'Habilita o módulo core-emotional (check-in + relief)',
  },
  // ... outros flags
};
```

### flagResolver.ts (completo)

```typescript
import { FeatureFlagKey, DEFAULT_FEATURE_FLAGS } from './featureFlags';
import { flagsStore } from '@/store/flags.store';

export function resolveFeatureFlag(flagKey: FeatureFlagKey): boolean {
  const storeValue = flagsStore.getState().flags[flagKey];
  if (storeValue !== undefined) {
    return storeValue.enabled;
  }
  return DEFAULT_FEATURE_FLAGS[flagKey]?.enabled ?? false;
}

export function getFlagValue(flagKey: FeatureFlagKey): boolean {
  return resolveFeatureFlag(flagKey);
}
```

### FeatureFlagGuard (completo)

```typescript
'use client';

import { getFlagValue } from '@/lib/flags/flagResolver';

export function FeatureFlagGuard({ children, flag, fallback = null }: FeatureFlagGuardProps) {
  const isEnabled = getFlagValue(flag);

  if (!isEnabled) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
}
```

### Onde CORE_EMOTIONAL_ENABLED é usado

- `app/(core-emotional)/layout.tsx`: `<FeatureFlagGuard flag="CORE_EMOTIONAL_ENABLED" fallback={...}>` envolve todo o grupo de rotas (check-in, relief).

### Explicação

**Se check-in depende de flag**

- Sim. O layout de (core-emotional) usa `FeatureFlagGuard` com `CORE_EMOTIONAL_ENABLED`. Se a flag estiver desabilitada, mostra "Módulo em manutenção".

**Se a flag está ativa**

- Sim. Valor padrão em `DEFAULT_FEATURE_FLAGS` é `enabled: true`.
- O `flagsStore` pode sobrescrever com valores do backend (`/admin/flags`); se não houver carga, permanece o default.

---

## 7. Configuração

### next.config.js (completo)

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: false,
  },
};

module.exports = nextConfig;
```

### vite.config.ts (completo)

```typescript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
      },
    },
  },
})
```

### middleware.ts

Já incluído na seção 5.

### tsconfig.json (completo)

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [{"name": "next"}],
    "paths": {"@/*": ["./src/*"]}
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules", "src/legacy/**/*", "vite.config.ts"]
}
```

### Explicação

**Rewrite**

- `next.config.js` não define rewrites.

**Proxy**

- `vite.config.ts` define proxy: `/api` → `http://localhost:3000`. Usado quando o app roda com Vite dev server (porta 5173).

**Configuração da URL do backend**

- `NEXT_PUBLIC_API_BASE_URL` — para Next.js; ex.: `http://localhost:3000`.
- `VITE_API_URL` — para Vite; ex.: `http://localhost:3000`.

**Uso de NEXT_PUBLIC_API_BASE_URL**

- Sim. `lib/api/client` e `services/httpClient` usam `NEXT_PUBLIC_API_BASE_URL`.

---

## Resumo para integração Emotional Checkin

| Item | Frontend atual | Backend real | Ação necessária |
|------|----------------|--------------|-----------------|
| Endpoint criar | `/core/check-in` | `POST /checkin` | Alterar em `API_ENDPOINTS` |
| Endpoint latest | — | `GET /checkin/latest` | Adicionar em `API_ENDPOINTS` |
| Endpoint history | — | `GET /checkin` | Adicionar em `API_ENDPOINTS` |
| Body create | `emotions[]`, `notes`, `mood?` | `mood`, `note?` | Ajustar DTO e payload |
| Auth | Token em localStorage; apiClient lê cookie | Bearer no header | Unificar storage e envio de token |
| Proteção rota | Nenhuma | Exige `authenticate` | Opcional: `ProtectedRoute` na check-in |
| Feature flag | `CORE_EMOTIONAL_ENABLED` ativa | — | Nenhuma alteração |
