# ⚡ Resolver Migration - Guia Rápido

## 🎯 Solução Mais Rápida: Railway CLI

### Comandos (Copie e Cole):

```bash
# 1. Instalar Railway CLI (se não tiver)
npm i -g @railway/cli

# 2. Login
railway login

# 3. Ir para o backend
cd backend

# 4. Conectar ao projeto (primeira vez)
railway link
# Selecione: seu projeto → PostgreSQL

# 5. Resolver migration
railway run npx prisma migrate resolve --applied 20250109210000_add_mother_role
```

**Pronto!** A migration estará resolvida e o próximo deploy funcionará.

---

## 🔄 Alternativa: Se Railway CLI não funcionar

Use um cliente de banco externo (DBeaver, Beekeeper Studio, Postico) e execute:

```sql
ALTER TYPE "UserRole" ADD VALUE IF NOT EXISTS 'MOTHER';

INSERT INTO "_prisma_migrations" (id, checksum, finished_at, migration_name, logs, started_at, applied_steps_count)
SELECT 
  gen_random_uuid(),
  '',
  NOW(),
  '20250109210000_add_mother_role',
  NULL,
  NOW(),
  1
WHERE NOT EXISTS (
  SELECT 1 FROM "_prisma_migrations" 
  WHERE migration_name = '20250109210000_add_mother_role'
);
```

**Credenciais:** Railway → PostgreSQL → Variables → `DATABASE_URL`
