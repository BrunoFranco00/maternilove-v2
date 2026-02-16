# Auditoria Técnica - Sistema de Autenticação e Navegação

**Projeto:** MaterniLove Frontend (Next.js 14 App Router)  
**Data:** 2025  
**Objetivo:** Identificar causa de telas brancas e loop de redirecionamento  

---

## Estado Atual do Código (Contexto da Auditoria)

> **IMPORTANTE:** No momento da auditoria, o sistema está com autenticação **desabilitada para teste**:
> - `Providers.tsx`: AuthProvider comentado
> - `middleware.ts`: sempre retorna `NextResponse.next()` (sem proteção)
> - Páginas: sem uso de useAuth, redirects manuais para /check-in
> - ProtectedRoute/RoleGuard: sempre renderizam children
>
> O relatório analisa a **arquitetura de design** (quando auth está habilitada) para identificar riscos.

---

## 1) Mapa do Fluxo de Autenticação Atual (Design Completo)

```
[Usuário] 
    |
    v
[Middleware] -- Edge, roda ANTES da página
    |           - Lê request.cookies.get('user_role')
    |           - NÃO tem acesso a localStorage
    |           - Rotas públicas: /, /login, /register
    |           - /admin/*: exige user_role in ['ADMIN','SUPER_ADMIN']
    |           - Outras: exige user_role
    v
[Root Layout - Server Component]
    |
    v
[Providers (Client)] --> [ToastProvider] --> [ApiProvider] --> [AuthProvider]
                                                                    |
                                                                    v
                                                            [useEffect init]
                                                                    |
                                    +-------------------------------+-------------------------------+
                                    |                               |                               |
                            Sem token/cookie              Com token+cookie                  Refresh falha
                                    |                               |                               |
                                    v                               v                               v
                            setStatus('unauthenticated')    authService.refresh()           clearTokens()
                            setAuthReady(true)                     |                       clearUser()
                                                                    |                       setStatus('unauthenticated')
                                                                    v
                                                            saveTokens() + setUser()
                                                            setStatus('authenticated')
                                                            setAuthReady(true)
```

### Detalhamento do AuthProvider (src/providers/AuthProvider.tsx)

| Função | Armazenamento | Cookie | Throw? |
|--------|---------------|--------|--------|
| login | localStorage (tokens, user) | setUserRoleCookie(role) | Não (try/catch retorna AuthResult) |
| register | idem | idem | Não |
| refresh | - | - | Não (try/catch interno) |
| logout | clearTokens, clearUser | clearUserRoleCookie | Não |
| init (useEffect) | lê localStorage + cookie | lê user_role | Não (try/catch + .catch()) |

### Ponto Crítico: Tripla Dependência

```typescript
// AuthProvider.tsx L279-286
if (!storedRefreshToken || !storedUser || !userRoleCookie) {
  setStatus('unauthenticated');
  setAuthReady(true);
  return;
}
```

**Risco:** Middleware depende APENAS de `user_role` (cookie). AuthProvider exige os TRÊS: token, user no localStorage, cookie. Dessincronia possível:
- Cookie expira (7 dias) mas tokens ainda válidos
- localStorage limpo por SW/usuário mas cookie persiste
- SSR/hidratação: cookie pode existir no request, mas `document.cookie` no client pode diferir em race conditions

---

## 2) Mapa do Fluxo de Redirecionamento (Design com Middleware Ativo)

```
REQUEST /qualquer-rota
        |
        v
   [Middleware]
        |
        +-- pathname in ['/', '/login', '/register']? --> NextResponse.next()
        |
        +-- pathname.startsWith('/admin')?
        |       +-- !userRoleCookie? --> redirect /login
        |       +-- userRole not in ['ADMIN','SUPER_ADMIN']? --> redirect /check-in
        |       +-- else --> NextResponse.next()
        |
        +-- !userRoleCookie? --> redirect /login
        |
        +-- NextResponse.next()
        v
   [Página carrega]
        |
        v
   [AuthProvider hidrata]
        |
        v
   [ProtectedRoute/RoleGuard] (quando presentes)
        |
        +-- status === 'unauthenticated'? --> useEffect(() => router.push('/login'))
        +-- status === 'loading'? --> <LoadingState />
        +-- !userRole? --> "Acesso negado"
```

### Ordem de Execução (Critical Path)

1. **Request** chega ao servidor
2. **Middleware** executa no Edge (Vercel) - SEM acesso a React, localStorage, ou estado do cliente
3. **HTML** é gerado/enviado
4. **Cliente** recebe e hidrata
5. **Providers** montam (ToastProvider → ApiProvider → AuthProvider)
6. **AuthProvider** useEffect init roda (assíncrono)
7. **Children** (layouts, páginas) montam e podem chamar useAuth()

---

## 3) Pontos de Risco Encontrados

### R1. Race: Middleware vs Cookie Write

**Arquivo:** `AuthProvider.tsx` L125-128 (saveUser → setUserRoleCookie)

**Cenário:** Usuário faz login em `/login`. AuthProvider chama `saveUser()` que chama `setUserRoleCookie()`. O cookie é setado via `document.cookie`. Em seguida, a **página** (login/page.tsx) chama `router.replace(targetRoute)` (ex: `/check-in`). A navegação é uma nova request. O middleware dessa request lê `request.cookies`. 

**Risco:** O cookie é síncrono, mas há possibilidade de delay em algumas configurações de browser/cross-origin. **Grau:** Baixo (15%).

### R2. useAuth fora do AuthProvider (DEV)

**Arquivo:** `AuthProvider.tsx` L57-65

```typescript
if (!context) {
  if (process.env.NODE_ENV === 'development') {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return NEUTRAL_AUTH_VALUE;
}
```

**Cenário:** AuthProvider está **comentado** em Providers. Qualquer página/layout que use `useAuth()` em DEV vai **throw**. Erro não capturado → tela branca ou ErrorBoundary. Em PROD retorna NEUTRAL (não quebra, mas fluxo incorreto).

**Risco:** **Causa direta de tela branca em DEV** quando AuthProvider não está no tree. **Grau:** Alto (85%).

### R3. Init exige userRoleCookie

**Arquivo:** `AuthProvider.tsx` L255-262

Se `storedRefreshToken` e `storedUser` existem mas `userRoleCookie` está ausente (cookie expirou ou nunca foi setado em outra aba), o init **não** chama refresh. Define direto `unauthenticated`. Usuário tem tokens válidos mas é tratado como deslogado.

**Risco:** Experiência ruim; pode forçar re-login mesmo com tokens válidos. **Grau:** Médio (40%).

### R4. ProtectedRoute: useEffect redirect + LoadingState

**Arquivo:** `ProtectedRoute.tsx` (versão com auth - da sessão anterior)

```typescript
useEffect(() => {
  if (status === 'unauthenticated' || (status !== 'loading' && !user)) {
    router.push('/login');
  }
}, [status, user, router]);

if (status === 'unauthenticated' || !user) {
  return <LoadingState />;
}
```

Enquanto `status === 'loading'`, retorna LoadingState. Quando vira `unauthenticated`, o useEffect dispara redirect. **Não há loop** por si só: redirect vai para /login que é público. **Grau:** Baixo para loop (10%).

### R5. authService.refresh lança

**Arquivo:** `authService.ts` L71-74

```typescript
if (!result.ok) {
  const errorMessage = result.error.message || 'Erro ao renovar sessão';
  throw new Error(errorMessage);
}
```

AuthProvider.init chama refresh em try/catch. O catch limpa tokens e define unauthenticated. **Não há throw vazando.** **Grau:** Nulo para crash (0%).

### R6. Páginas com force-dynamic

**Arquivos:** login, register, check-in, dashboard, experiments

Todas têm `export const dynamic = 'force-dynamic'` ou estão sob layout com isso. Reduz risco de prerender em Server Component chamando useAuth. **Grau:** Mitigado.

### R7. Layouts Client com useAuth

**Arquivos:** `(testers)/layout.tsx`, `(user)/layout.tsx`, `AdminLayoutClient.tsx`

Usam `useAuth()` para obter `user` e passar para RoleGuard. Se AuthProvider não estiver no tree (comentado), **throw em DEV**. Esses layouts são filhos de `{children}` em Providers. Se AuthProvider está comentado, **não há AuthProvider no tree** → **throw garantido em DEV**.

**Risco:** **Causa de tela branca** quando AuthProvider desabilitado. **Grau:** Alto (85%).

### R8. Service Worker (PWA)

**Estado:** PWA foi **removido** (next-pwa, sw.js, manifest, icons). Não há SW ativo. **Grau:** Nulo.

### R9. Loop teórico Middleware ↔ AuthProvider

**Cenário:** Usuário em /check-in com cookie válido. Middleware permite. Página carrega. AuthProvider init: refresh falha (sessão revogada) → clearUser (limpa cookie). ProtectedRoute vê unauthenticated → router.push('/login'). Nova navegação para /login. Middleware: /login é público → NextResponse.next(). Login renderiza. **Não há loop:** saímos de /check-in e vamos para /login uma vez. **Grau:** Baixo (5%).

### R10. Conflito Cookie vs localStorage

Middleware só lê **cookie**. AuthProvider usa **localStorage + cookie**. Se usuário limpar cookies mas manter localStorage (ou vice-versa), estados divergem. Middleware pode permitir (tem cookie) enquanto AuthProvider considera unauthenticated (não tem token). Ou o contrário. **Grau:** Médio (35%).

---

## 4) Hipótese Técnica Principal do Bug

| Hipótese | Descrição | Confiança |
|----------|-----------|-----------|
| **H1** | Tela branca em DEV causada por `useAuth must be used within AuthProvider` quando AuthProvider está comentado/fora da árvore. Layouts e páginas que usam useAuth disparam throw → React não renderiza → tela branca ou fallback do ErrorBoundary. | **85%** |
| **H2** | Loop de redirect improvável com a lógica atual. O fluxo middleware → login → AuthProvider tende a convergir (ou para login ou para rota destino). Possível loop apenas em cenário de cookie instável com redirect recíproco entre duas rotas. | **15%** |
| **H3** | Dessincronia cookie/localStorage causa redirect indevido (ex: middleware envia para login mesmo com tokens válidos se cookie expirou, ou permite acesso a rota que AuthProvider bloqueia). | **40%** |
| **H4** | Pré-render/SSR executando useAuth antes da hidratação completa do AuthProvider (componentes client em layout). Com force-dynamic mitigado. | **20%** |

---

## 5) Lista de Correções Necessárias (Sem Aplicar)

1. **Restaurar AuthProvider** em Providers.tsx para que useAuth tenha contexto em todas as rotas.
2. **Restaurar middleware** com lógica de proteção (redirecionar rotas privadas sem cookie para /login).
3. **Revisar tripla dependência** no init: considerar chamar refresh se tiver token+user mesmo sem cookie, e após refresh bem-sucedido re-setar o cookie.
4. **Sincronizar fontes de verdade**: manter cookie como espelho do role após qualquer atualização de user (login, refresh). Garantir que cookie seja setado antes de qualquer redirect pós-login.
5. **ProtectedRoute**: ao redirecionar, usar `router.replace` em vez de `router.push` para evitar histórico de voltar para rota bloqueada.
6. **ErrorBoundary**: garantir fallback com mensagem clara e botão de recarregar para erros não tratados.
7. **Logging**: em init e refresh, logar (dev) quando cookie ausente mas token presente para facilitar debug.

---

## 6) Resumo Executivo

| Item | Conclusão |
|------|-----------|
| **Causa mais provável de tela branca** | useAuth sendo chamado sem AuthProvider no tree (DEV throw) |
| **Loop de redirect** | Improvável com lógica atual; possível em edge cases de cookie inconsistente |
| **PWA** | Removido; não é fator |
| **Middleware** | Atualmente desabilitado; quando ativo, depende exclusivamente de cookie |
| **AuthProvider** | Atualmente comentado; quando ativo, robusto contra throws (try/catch em login/register/refresh/init) |

---

*Relatório gerado por auditoria técnica. Nenhum código foi alterado.*
