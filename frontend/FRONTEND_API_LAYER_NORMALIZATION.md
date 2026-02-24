# Frontend API Layer Normalization

## Resumo Técnico

Normalização da camada de API do frontend MaterniLove V2 para arquitetura limpa e alinhada com Next.js 14.

## Alterações Realizadas

### 1. Remoção do client legado Vite

- **Arquivo removido:** `src/services/api.ts`
- **Motivo:** Era o client legado baseado em Vite (`import.meta.env.VITE_API_URL`), duplicando responsabilidades do `lib/api/client.ts`.

### 2. Client HTTP único

- **Client oficial:** `src/lib/api/client.ts` (ApiClient)
- **Base URL:** `process.env.NEXT_PUBLIC_API_BASE_URL` + `/api/v1`
- **Fallback:** `http://localhost:3000/api/v1` quando a variável não está configurada

### 3. Estratégia de token unificada

**Antes:** ApiClient lia `accessToken` do cookie `accessToken=`.

**Depois:** ApiClient lê `accessToken` exclusivamente de `localStorage.getItem('accessToken')`.

- Leitura: `localStorage.getItem('accessToken')`
- Envio: `Authorization: Bearer ${token}` no header
- `credentials: 'include'` mantido
- Em 401: limpa `accessToken` e `refreshToken` do `localStorage` (antes: cookies)

### 4. Remoção de VITE_API_URL

- Removida referência em `src/vite-env.d.ts` (Interface `ImportMetaEnv`)
- Nenhuma referência restante no código fonte
- Variável de ambiente oficial: `NEXT_PUBLIC_API_BASE_URL`

### 5. Migração de consumidores

Arquivos que usavam `services/api` migrados para `apiClient`:

- `src/contexts/AuthContext.tsx` — login/register
- `src/legacy/pages/Feed.tsx` — social feed
- `src/legacy/pages/Marketplace.tsx` — produtos
- `src/legacy/pages/Community.tsx` — categorias e posts

## Configuração

| Variável                   | Uso                          |
|---------------------------|------------------------------|
| `NEXT_PUBLIC_API_BASE_URL` | Base URL do backend (ex: `http://localhost:3000`) |
| -                         | URL final: `{BASE}/api/v1`   |

## O que não foi alterado

- Estrutura de rotas
- AuthProvider (permanece desabilitado)
- Middleware
- Componentes UI
- Stores
- Feature flags
- Layout
- Backend
- Retry logic, timeout, logger, metrics do ApiClient
