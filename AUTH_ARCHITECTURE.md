# Arquitetura de Autenticação — MaterniLove v2

## Regras definitivas

- **Não existe modo demo**
- **Login obrigatório** para qualquer funcionalidade
- **Check-in e Relief** existem apenas em `/app/check-in` e `/app/relief`
- **Sessão** persiste até logout manual (cookie `maternilove-session`)

---

## Rotas

| Rota | Acesso | Comportamento |
|------|--------|---------------|
| `/` | Público | Landing com link para login |
| `/login`, `/register` | Público | Formulários de auth |
| `/app/*` | Autenticado | Exige cookie |
| `/check-in`, `/relief` | — | **Não existem**; middleware redireciona para login |

---

## Fluxo

### Sem login

- `/` → Landing
- `/app/inicio` → redirect `/login?redirect=/app/inicio`
- `/check-in` → redirect `/login?redirect=/app/check-in`

### Com login

- Login → `/app/inicio` (ou `?redirect=` se existir)
- `/app/check-in` → escolher mood → API → `/app/relief`
- Logout → `/` (landing)

---

## Arquivos principais

- `middleware.ts`: /app/* exige cookie; /check-in e /relief redirecionam para login
- `app/app/(core-emotional)/check-in/page.tsx`: check-in autenticado
- `app/app/(core-emotional)/relief/page.tsx`: relief autenticado
- `core.store.ts`: check-in 100% via API
