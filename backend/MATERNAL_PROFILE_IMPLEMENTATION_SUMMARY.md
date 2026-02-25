# Maternal Profile Domain — Implementação

## Visão Geral

O Domínio Materno implementa um **perfil materno progressivo** para personalização de conteúdo e suporte. **Não substitui orientação médica.**

## Modelos Adicionados (Prisma)

### Enums
- `PregnancyStage`: TRYING | PREGNANT | POSTPARTUM | HAS_CHILD
- `PregnancyType`: SINGLE | TWINS | MULTIPLE | UNKNOWN
- `ChildSex`: FEMALE | MALE | UNKNOWN
- `ContentFocus`: PREGNANCY | NEWBORN | TODDLER_1_2 | TODDLER_3_5 | POSTPARTUM | GENERAL
- `RiskFlag`: DIABETES | HYPERTENSION | THYROID | ANEMIA | DEPRESSION | ANXIETY | OTHER

### Tabelas (1:1 com User via userId)
| Modelo | Descrição |
|--------|-----------|
| MaternalProfile | Raiz: stage, datas gestacionais, riskFlags, preferredContentFocus |
| MaternalPersonalData | Nome, phone, CPF, birthDate, localização |
| MaternalAddress | Endereço opcional (logística futura) |
| MaternalHealth | Condições, medicamentos, alergias, pré-natal |
| MaternalLifestyle | Sono, atividade, nutrição, suplementos |
| MaternalEmotional | Humor base, stressLevel, supportNetwork |
| ChildProfile | Dados do bebê (opcional) |

## Endpoints

Todos exigem autenticação via JWT (`Authorization: Bearer <token>`).

| Método | Path | Descrição |
|--------|------|-----------|
| GET | /api/v1/maternal-profile/status | Score de completude, missingCritical, stage, flags |
| GET | /api/v1/maternal-profile | Perfil agregado (todas as seções) |
| PATCH | /api/v1/maternal-profile | Upsert parcial por seções |
| GET | /api/v1/maternal-profile/context | Contexto para personalização |

### Exemplos (curl)

#### 1. Login (obter token)
```bash
curl -X POST http://localhost:3000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"sua_senha"}'
```

#### 2. GET status
```bash
curl -X GET http://localhost:3000/api/v1/maternal-profile/status \
  -H "Authorization: Bearer SEU_TOKEN"
```

Resposta:
```json
{
  "success": true,
  "data": {
    "completedScore": 28,
    "missingCritical": ["Estágio gestacional", "Dados pessoais básicos"],
    "stage": "HAS_CHILD",
    "hasChildProfile": false,
    "hasHealth": false,
    "hasLifestyle": false,
    "hasEmotional": false,
    "hasPersonal": false
  },
  "requestId": "..."
}
```

#### 3. PATCH profile
```bash
curl -X PATCH http://localhost:3000/api/v1/maternal-profile \
  -H "Authorization: Bearer SEU_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "pregnancy": {
      "stage": "PREGNANT",
      "dueDate": "2025-08-15",
      "gestationalWeek": 12,
      "pregnancyType": "SINGLE"
    },
    "personal": {
      "fullName": "Maria Silva",
      "phone": "11999999999"
    }
  }'
```

Resposta: perfil agregado atualizado.

#### 4. GET context
```bash
curl -X GET http://localhost:3000/api/v1/maternal-profile/context \
  -H "Authorization: Bearer SEU_TOKEN"
```

Resposta:
```json
{
  "success": true,
  "data": {
    "stage": "PREGNANT",
    "gestationalWeek": 12,
    "gestationalDay": null,
    "contentFocus": ["PREGNANCY", "GENERAL"],
    "riskFlags": [],
    "isHighRisk": false,
    "recommendedTone": "neutro"
  },
  "requestId": "..."
}
```

## Validações

- **CPF**: opcional, formato 11 dígitos (não valida algoritmo)
- **gestationalWeek**: 0–45
- **stressLevel, sleepQuality, activityLevel, supportNetwork**: 1–5
- **dueDate**: ISO date opcional

## Segurança

- Endpoints protegidos por `authenticate` (JWT)
- Sem lógica médica prescritiva
- Apenas organização e personalização

## Postman

1. Criar requisição POST para `/api/v1/auth/login` com body JSON
2. Copiar `token` da resposta
3. Em `Authorization` > Bearer Token, colar o token
4. Testar GET `/api/v1/maternal-profile/status`, GET `/api/v1/maternal-profile`, PATCH `/api/v1/maternal-profile`, GET `/api/v1/maternal-profile/context`

## Migration

```bash
cd backend
npx prisma migrate deploy   # em produção
# ou
npx prisma migrate dev      # em dev (se DATABASE_URL configurado)
```

Migration: `20260225114500_add_maternal_profile_domain`
