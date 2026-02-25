# Maternal Profile — Smoke Test (curl)

Execute o backend (`npm run dev`) e use os comandos abaixo substituindo `BASE` e o token.

## Variáveis

```bash
BASE="http://localhost:3000"
# ou produção: BASE="https://seu-backend.railway.app"
```

## 1. Login → obter token

```bash
TOKEN=$(curl -s -X POST "$BASE/api/v1/auth/login" \
  -H "Content-Type: application/json" \
  -d '{"email":"SEU_EMAIL","password":"SUA_SENHA"}' \
  | jq -r '.data.tokens.accessToken // .data.accessToken // .token // empty')

echo "Token: $TOKEN"
```

Se não tiver `jq`:
```bash
curl -X POST "$BASE/api/v1/auth/login" \
  -H "Content-Type: application/json" \
  -d '{"email":"SEU_EMAIL","password":"SUA_SENHA"}'
```
Copie o token da resposta e defina: `TOKEN="cole_aqui"`

## 2. GET status (sem token → 401)

```bash
curl -s -w "\n%{http_code}" "$BASE/api/v1/maternal-profile/status"
# esperado: 401
```

## 3. GET status (com token)

```bash
curl -s -X GET "$BASE/api/v1/maternal-profile/status" \
  -H "Authorization: Bearer $TOKEN" | jq .
```

## 4. PATCH profile (exemplo)

```bash
curl -s -X PATCH "$BASE/api/v1/maternal-profile" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "pregnancy": {"stage": "PREGNANT", "gestationalWeek": 10},
    "personal": {"fullName": "Teste Smoke"}
  }' | jq .
```

## 5. GET context

```bash
curl -s -X GET "$BASE/api/v1/maternal-profile/context" \
  -H "Authorization: Bearer $TOKEN" | jq .
```

---

**Resultado esperado**: 200 em todos os passos 3–5, resposta `{ success: true, data: {...} }`.
