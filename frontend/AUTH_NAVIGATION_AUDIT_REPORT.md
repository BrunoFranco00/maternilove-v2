# Dossiê Técnico - Auditoria Estrutural de Autenticação e Navegação

**Projeto:** MaterniLove Frontend (Next.js 14 App Router)  
**Escopo:** Tree de layouts, pages, providers, middleware, fluxo de rotas  

---

## 1. TREE DE LAYOUTS (APP ROUTER)

| Arquivo | Tipo | useAuth() | router.push/replace | return null condicional | Guards |
|---------|------|-----------|---------------------|-------------------------|--------|
| `src/app/layout.tsx` | **Server** | Não | Não | Não | ErrorBoundary |
| `src/app/(auth)/layout.tsx` | Server | Não | Não | Não | Nenhum |
| `src/app/(private)/layout.tsx` | Server | Não | Não | Não | PrivateLayoutClient (wrapper) |
| `src/app/(testers)/layout.tsx` | **Client** | Não* | Não | Não | RoleGuard |
| `src/app/(user)/layout.tsx` | **Client** | Não* | Não | Não | RoleGuard |
| `src/app/admin/layout.tsx` | Server | Não | Não | Não | AdminLayoutClient (wrapper) |
| `src/app/(core-emotional)/layout.tsx` | **Client** | Não | Não | Não | **FeatureFlagGuard** |
| `src/app/(public)/layout.tsx` | Server | Não | Não | Não | Nenhum |

\* *Em modo auth habilitado, usariam useAuth; atualmente comentado.*

### Detalhamento por layout

**src/app/layout.tsx** (Server Component)
- Sem "use client"
- Estrutura: `ErrorBoundary > Providers > {children}`
- Sempre renderiza children

**src/app/(auth)/layout.tsx** (Server)
```tsx
export const dynamic = 'force-dynamic';
export default function AuthLayout({ children }) {
  return <>{children}</>;
}
```

**src/app/(private)/layout.tsx** (Server)
```tsx
export const dynamic = 'force-dynamic';
return <PrivateLayoutClient>{children}</PrivateLayoutClient>;
```

**src/app/(testers)/layout.tsx** (Client)
```tsx
'use client';
return (
  <RoleGuard>
    <div className="min-h-screen bg-gray-50">{children}</div>
  </RoleGuard>
);
```

**src/app/(core-emotional)/layout.tsx** (Client) ⚠️
```tsx
'use client';
return (
  <FeatureFlagGuard flag="CORE_EMOTIONAL_ENABLED" fallback={null}>
    <div className="min-h-screen ...">{children}</div>
  </FeatureFlagGuard>
);
```
- **CORE_EMOTIONAL_ENABLED** está **false** por padrão em `featureFlags.ts`
- Quando flag desabilitada: `return <>{fallback}</>` com `fallback = null` → **renderiza nada (tela branca)**

---

## 2. TREE DE PAGES

| Rota | Arquivo | useAuth() | redirect() | router.push/replace | force-dynamic | Retorno condicional |
|------|---------|-----------|------------|---------------------|---------------|---------------------|
| `/` | `page.tsx` | Não | Não | Não | Não | Não |
| `/login` | `(auth)/login/page.tsx` | Não | Não | Sim (replace) | Sim | Não |
| `/register` | `(auth)/register/page.tsx` | Não | Não | Sim (replace) | Sim | Não |
| `/check-in` | `(core-emotional)/check-in/page.tsx` | Não | Não | Não | Sim | Não |
| `/relief` | `(core-emotional)/relief/page.tsx` | Não | Não | Não | Não | Não |
| `/dashboard` | `(private)/dashboard/page.tsx` | Não | Não | Não | Sim | Não |
| `/experiments` | `(testers)/experiments/page.tsx` | Não | Não | Não | Sim | Não |
| `/admin` | `admin/page.tsx` | Não | **Sim** | Não | Sim | N/A (redirect) |
| `/admin/overview` | `admin/overview/page.tsx` | Não | Não | Não | Não | Não |
| `/admin/users` | `admin/users/page.tsx` | Não | Não | Não | Não | Não |
| `/admin/flags` | `admin/flags/page.tsx` | Não | Não | Não | Não | Não |

### Detalhes críticos

**admin/page.tsx**
```tsx
import { redirect } from 'next/navigation';
export const dynamic = 'force-dynamic';
export default function AdminRootPage() {
  redirect('/admin/overview');
}
```
- Usa `redirect()` do Next.js (server-side)
- Não retorna JSX; redirect ocorre antes de renderizar

**login/page.tsx**, **register/page.tsx**
- `router.replace('/check-in')` no handleSubmit (após submit do form)
- Não bloqueiam renderização inicial

---

## 3. PROVIDERS ANALYSIS

### src/providers/Providers.tsx

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

| Item | Status |
|------|--------|
| AuthProvider ativo | **NÃO** – Comentado |
| Throw em useAuth | N/A (AuthProvider fora do tree) |
| Retorno null | Não |
| Bloqueia children | Não – children sempre renderizados |

### src/providers/AuthProvider.tsx

**Trechos relevantes:**

```tsx
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    if (process.env.NODE_ENV === 'development') {
      throw new Error('useAuth must be used within AuthProvider');
    }
    return NEUTRAL_AUTH_VALUE;
  }
  return context;
}
```

| Item | Status |
|------|--------|
| AuthProvider ativo | Código existe mas **não está no tree** (comentado em Providers) |
| Throw em useAuth | **SIM** – Em DEV quando context undefined |
| Retorno null | Não – retorna NEUTRAL_AUTH_VALUE em PROD |
| Bloqueia children | Não – sempre `return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>` |
| router.replace | Sim – em `logout()` L263: `router.replace('/login')` |

---

## 4. MIDDLEWARE

### Conteúdo completo (src/middleware.ts)

```ts
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

| Item | Status |
|------|--------|
| Ativo | **Parcial** – Roda em todas as requests matched, mas **sem lógica de proteção** |
| Matcher | Sim – exclui _next/static, _next/image, favicon.ico, images |
| Redirect condicional | **Não** – Sempre `NextResponse.next()` |

---

## 5. ROUTING FLOW MAP

### Fluxo ao acessar `/`

1. **Middleware:** `NextResponse.next()` → passa
2. **Layout:** RootLayout (Server) → Providers (Client) → children
3. **Providers:** ToastProvider → ApiProvider → {children} (sem AuthProvider)
4. **Página:** `page.tsx` (Client) – home com links Login/Register
5. **Resultado:** Renderiza normalmente

### Fluxo ao acessar `/login`

1. **Middleware:** `NextResponse.next()`
2. **Layout:** RootLayout → Providers → (auth)/layout → children
3. **Página:** login/page.tsx – formulário; submit → `router.replace('/check-in')`
4. **Resultado:** Renderiza normalmente

### Fluxo ao acessar `/register`

1. **Middleware:** `NextResponse.next()`
2. **Layout:** RootLayout → Providers → (auth)/layout → children
3. **Página:** register/page.tsx – formulário; submit → `router.replace('/check-in')`
4. **Resultado:** Renderiza normalmente

### Fluxo ao acessar `/check-in` ⚠️

1. **Middleware:** `NextResponse.next()`
2. **Layout:** RootLayout → Providers → **(core-emotional)/layout**
3. **(core-emotional)/layout:** FeatureFlagGuard com `flag="CORE_EMOTIONAL_ENABLED"`
4. **FeatureFlagGuard:** `getFlagValue('CORE_EMOTIONAL_ENABLED')` → **false** (default)
5. **Retorno:** `return <>{fallback}</>` com `fallback = null` → **TELA BRANCA**
6. **Página check-in:** Nunca é renderizada (fica acima no tree)

### Fluxo ao acessar `/relief` ⚠️

1. Idêntico a `/check-in` – mesmo layout (core-emotional)
2. FeatureFlagGuard bloqueia → **TELA BRANCA**

### Fluxo ao acessar `/dashboard`

1. **Middleware:** `NextResponse.next()`
2. **Layout:** RootLayout → Providers → (private)/layout → PrivateLayoutClient
3. **PrivateLayoutClient:** Renderiza header + children
4. **Página:** dashboard com ProtectedRoute → RoleGuard → DashboardContent
5. **Guards (auth off):** Ambos sempre renderizam children
6. **Resultado:** Renderiza normalmente

### Fluxo ao acessar `/admin`

1. **Middleware:** `NextResponse.next()`
2. **Layout:** RootLayout → Providers → admin/layout → AdminLayoutClient
3. **admin/page.tsx:** `redirect('/admin/overview')` – redirect server-side
4. **Nova request:** /admin/overview
5. **admin/overview/page.tsx:** Renderiza painel
6. **Resultado:** Redirect explícito, sem tela branca

---

## 6. POSSÍVEIS CAUSAS DE TELA BRANCA

| # | Local | Condição | Efeito |
|---|--------|-----------|--------|
| 1 | **FeatureFlagGuard** | `flag="CORE_EMOTIONAL_ENABLED"` desabilitada (default) | `return <>{null}</>` → **tela branca em /check-in e /relief** |
| 2 | **useAuth** (quando AuthProvider habilitado) | Chamado fora do AuthProvider em DEV | `throw new Error(...)` → crash → tela branca ou ErrorBoundary |
| 3 | **ProtectedRoute** (versão com auth) | `status === 'loading'` | Retorna `<LoadingState />` – não é tela branca |
| 4 | **ProtectedRoute** (versão com auth) | `status === 'unauthenticated'` | Retorna `<LoadingState />` + useEffect redirect – loading visível |
| 5 | **RoleGuard** (versão com auth) | `status === 'loading'` | Retorna div "Carregando..." – não é tela branca |
| 6 | **RoleGuard** (versão com auth) | `!userRole` | Retorna "Acesso negado" – não é tela branca |
| 7 | **ErrorBoundary** | Erro não capturado | Mostra UI de erro com botão recarregar – não deveria ser tela totalmente branca |

### Causa principal identificada

**FeatureFlagGuard em (core-emotional)/layout.tsx** com `CORE_EMOTIONAL_ENABLED = false`:
- Rotas afetadas: `/check-in`, `/relief`
- `fallback = null` → `return <>{null}</>` → **nada é renderizado**

---

## 7. SERVICE WORKER CHECK

| Item | Existe? | Local |
|------|---------|-------|
| sw.js | **Não** | - |
| next-pwa | **Não** | Removido de package.json |
| Registro de SW | **Não** | Nenhum |
| workbox | **Não** | - |

**package.json** – devDependencies: sem next-pwa, sem workbox.

---

## 8. CONCLUSÃO TÉCNICA

### Existe algum ponto que pode causar tela branca?

**Sim.** O **FeatureFlagGuard** no layout `(core-emotional)` retorna `null` quando a flag `CORE_EMOTIONAL_ENABLED` está desabilitada. Essa flag é **false** por padrão. As rotas `/check-in` e `/relief` ficam sob esse layout e exibem tela branca.

### Existe algum loop potencial?

**Não identificado** no estado atual. O middleware está desativado (sempre `NextResponse.next()`). Com auth habilitado e middleware ativo, o desenho atual não indica loop óbvio.

### Existe algum return condicional problemático?

**Sim.** `FeatureFlagGuard`: quando `!isEnabled`, retorna `fallback` que é `null`, gerando renderização vazia.

### A arquitetura atual é consistente?

**Parcialmente.** Há inconsistência entre:
- Auth desabilitado para teste (AuthProvider comentado, middleware neutro)
- Guards (ProtectedRoute, RoleGuard) sempre renderizando children
- FeatureFlagGuard bloqueando /check-in e /relief com fallback null

**Recomendação:** Habilitar `CORE_EMOTIONAL_ENABLED` por padrão ou fornecer fallback não-nulo (ex.: mensagem "Módulo em manutenção") para evitar tela branca.

---

*Relatório gerado por auditoria técnica. Nenhum código de produção foi alterado.*
