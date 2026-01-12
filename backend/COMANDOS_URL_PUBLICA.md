# 🎯 Comandos com URL Pública - Resolver Migration

## ⚠️ Problema

O `railway shell` também está usando a URL interna (`postgres.railway.internal`), que não funciona localmente.

---

## ✅ Solução: Usar URL Pública Diretamente

### Opção 1: Executar Script Automatizado

```bash
cd /Users/bruno/Projetos/maternilove-v2/backend
./executar-com-url-publica.sh
```

---

### Opção 2: Comandos Manuais (Copie e Cole)

```bash
# Definir URL pública
export DATABASE_PUBLIC_URL="postgresql://postgres:IWgiifpoyaFAhZMgZhVkhCsSoiVRIMyE@postgres-production-4b5e.up.railway.app:5432/railway"

# Adicionar MOTHER ao enum
psql "$DATABASE_PUBLIC_URL" -c "ALTER TYPE \"UserRole\" ADD VALUE IF NOT EXISTS 'MOTHER';"

# Marcar migration como aplicada
psql "$DATABASE_PUBLIC_URL" -c "INSERT INTO \"_prisma_migrations\" (id, checksum, finished_at, migration_name, logs, started_at, applied_steps_count) SELECT gen_random_uuid(), '', NOW(), '20250109210000_add_mother_role', NULL, NOW(), 1 WHERE NOT EXISTS (SELECT 1 FROM \"_prisma_migrations\" WHERE migration_name = '20250109210000_add_mother_role');"

# Verificar
psql "$DATABASE_PUBLIC_URL" -c "SELECT migration_name, finished_at FROM \"_prisma_migrations\" WHERE migration_name = '20250109210000_add_mother_role';"
```

---

### Opção 3: Se a Conexão Pública Não Funcionar

Use um **cliente de banco externo** (DBeaver ou Postico):

1. **Instalar DBeaver:** https://dbeaver.io/download/
2. **Criar conexão:**
   - Host: `postgres-production-4b5e.up.railway.app`
   - Port: `5432`
   - Database: `railway`
   - User: `postgres`
   - Password: `IWgiifpoyaFAhZMgZhVkhCsSoiVRIMyE`
3. **Executar SQL:**

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

---

## 🎉 Após Executar

O próximo deploy do Railway funcionará normalmente!

---

## 📝 Nota

Se a conexão pública também não funcionar (timeout), você precisa:
1. Verificar se o **Public Networking** está ativado no Railway PostgreSQL
2. Ou usar um cliente de banco externo (DBeaver) que pode ter melhor suporte a conexões
