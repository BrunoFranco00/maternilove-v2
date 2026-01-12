# 🎯 Comandos Manuais Finais - Resolver Migration

## ⚠️ Problema Identificado

O `railway run` não funciona localmente porque tenta usar a URL interna do Railway (`postgres.railway.internal`), que não é acessível da sua máquina.

---

## ✅ Solução: Use Railway Shell (Modo Interativo)

### Passo a Passo:

1. **Abra o terminal e execute:**

```bash
cd /Users/bruno/Projetos/maternilove-v2/backend
```

2. **Abra o Railway Shell:**

```bash
railway shell
```

**Você verá algo como:**
```
🚂 Railway Shell
Environment: production
Project: Materni_Love-V2
Service: Postgres
```

3. **Dentro do Railway Shell, execute os comandos SQL:**

```bash
psql $DATABASE_URL <<EOF
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
EOF
```

4. **Verificar se funcionou:**

```bash
psql $DATABASE_URL -c "SELECT migration_name, finished_at FROM \"_prisma_migrations\" WHERE migration_name = '20250109210000_add_mother_role';"
```

5. **Sair do Railway Shell:**

```bash
exit
```

---

## 🔄 Alternativa: Cliente de Banco Externo (Mais Simples)

Se o Railway Shell não funcionar, use **DBeaver** ou **Postico**:

### 1. Instalar DBeaver:
- Download: https://dbeaver.io/download/

### 2. Criar Conexão PostgreSQL:
- **Host:** `postgres-production-4b5e.up.railway.app`
- **Port:** `5432`
- **Database:** `railway`
- **User:** `postgres`
- **Password:** `IWgiifpoyaFAhZMgZhVkhCsSoiVRIMyE`

### 3. Executar SQL:

```sql
-- Adicionar MOTHER ao enum
ALTER TYPE "UserRole" ADD VALUE IF NOT EXISTS 'MOTHER';

-- Marcar migration como aplicada
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

-- Verificar
SELECT migration_name, finished_at 
FROM "_prisma_migrations" 
WHERE migration_name = '20250109210000_add_mother_role';
```

---

## 🎉 Após Executar

O próximo deploy do Railway funcionará normalmente!

---

## 📝 Resumo Rápido (Railway Shell)

```bash
cd /Users/bruno/Projetos/maternilove-v2/backend
railway shell
# Dentro do shell:
psql $DATABASE_URL -c "ALTER TYPE \"UserRole\" ADD VALUE IF NOT EXISTS 'MOTHER';"
psql $DATABASE_URL -c "INSERT INTO \"_prisma_migrations\" (id, checksum, finished_at, migration_name, logs, started_at, applied_steps_count) SELECT gen_random_uuid(), '', NOW(), '20250109210000_add_mother_role', NULL, NOW(), 1 WHERE NOT EXISTS (SELECT 1 FROM \"_prisma_migrations\" WHERE migration_name = '20250109210000_add_mother_role');"
exit
```
