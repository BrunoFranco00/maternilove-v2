# Arquitetura de Autenticação — MaterniLove v2

## Visão geral

- **Rotas públicas** (sem sessão): `/`, `/login`, `/register`, `/check-in`, `/relief`
- **Rotas protegidas**: todas em `/app/*` exigem cookie `maternilove-session`
- **Check-in**: sempre público em `/check-in` → salva em localStorage (streak, pontos)
- **Sessão**: persiste até logout manual (cookie com validade longa)

---

## Fluxo

### 1. Check-in sem login

1. Usuário acessa `/` ou `/check-in`
2. Escolhe um mood → engine local gera resposta
3. Dados salvos em `localStorage` (streak, pontos)
4. Redireciona para `/relief` com resposta imediata
5. **Nenhum redirect para login**

### 2. Acesso bloqueado em /app/*

1. Usuário sem sessão tenta `/app/inicio`
2. Middleware verifica cookie `maternilove-session`
3. Não encontrado → redirect para `/login?redirect=/app/inicio`
4. Após login → redirect para a rota original

### 3. Login e sessão

1. Login/Register chama API `/auth/login` ou `/auth/register`
2. Em sucesso: salva `accessToken` e `refreshToken` em `localStorage`
3. Define cookie `maternilove-session=1` (validade 365 dias)
4. `migrateLocalCheckinOnLogin()` é chamado (TODO: enviar dados locais ao backend)
5. Usuário permanece autenticado até clicar em "Sair"

### 4. Migração pós-login

- `getLocalCheckinForMigration()` retorna streak/pontos do localStorage
- `migrateLocalCheckinOnLogin()` é chamado após login/register
- TODO: endpoint backend para receber e consolidar dados

---

## Arquivos modificados

| Arquivo | Alteração |
|---------|-----------|
| `frontend/src/middleware.ts` | Removido AUTH_DISABLED; /app/* sempre exige cookie |
| `frontend/src/app/(core-emotional)/check-in/page.tsx` | Página pública em /check-in (sem ProtectedRoute) |
| `frontend/src/app/(core-emotional)/relief/page.tsx` | Página pública em /relief |
| `frontend/src/app/app/(core-emotional)/check-in/page.tsx` | Redirect para /check-in |
| `frontend/src/app/app/(core-emotional)/relief/page.tsx` | Redirect para /relief |
| `frontend/src/app/app/(core-emotional)/core.store.ts` | isAuthenticated() → usa local se sem accessToken |
| `frontend/src/providers/AuthProvider.tsx` | setSessionCookie/clearSessionCookie; migrateLocalCheckinOnLogin |
| `frontend/src/providers/Providers.tsx` | AuthProvider reativado |
| `frontend/src/app/(auth)/login/page.tsx` | Wire para useAuth().login |
| `frontend/src/app/(auth)/register/page.tsx` | Wire para useAuth().register |
| `frontend/src/components/auth/ProtectedRoute.tsx` | Redireciona para /login se unauthenticated |
| `frontend/src/components/layout/PrivateLayoutClient.tsx` | Logout via useAuth(); link Check-in |
| `frontend/src/app/app/perfil/page.tsx` | Removido AUTH_DISABLED |
| `frontend/src/lib/checkin/migrateLocalCheckin.ts` | **Novo** — migração pós-login |
| `frontend/.env.example` | Removido NEXT_PUBLIC_AUTH_DISABLED |
| Links (inicio, FeedHero, JourneyHeroCard) | /app/check-in → /check-in |
| `frontend/src/app/page.tsx` | Botão "Check-in emocional" |

---

## Como testar

### 1. Check-in sem login

1. Abra `/check-in` (ou `/` e clique em "Check-in emocional")
2. Escolha um mood (ex: Ansiosa)
3. Deve navegar para `/relief` com resposta imediata
4. **Não** deve redirecionar para `/login`
5. Verifique `localStorage` → chave `maternilove-checkin-local`

### 2. Acesso bloqueado em /app/*

1. Sem estar logado, acesse diretamente `/app/inicio`
2. Deve redirecionar para `/login?redirect=/app/inicio`
3. Após login, deve voltar para `/app/inicio`

### 3. Login funcionando

1. Acesse `/login`
2. Insira email e senha válidos (backend precisar estar rodando)
3. Deve redirecionar para `/app/inicio` ou rota de onboarding
4. Cookie `maternilove-session` deve estar presente
5. Acesse `/app/perfil` → deve carregar
6. Clique em "Sair" → deve redirecionar para `/login` e limpar sessão

### 4. Variáveis de ambiente

- `NEXT_PUBLIC_API_BASE_URL`: URL do backend para auth e API
- Não use mais `NEXT_PUBLIC_AUTH_DISABLED`
