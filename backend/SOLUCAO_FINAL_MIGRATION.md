# ✅ Solução Final - Resolver Migration

## 🎯 Status Atual

- ✅ Railway CLI instalado e logado
- ✅ Projeto linkado: `Materni_Love-V2`
- ⚠️ Conexão local ao PostgreSQL não está funcionando (timeout)

---

## 🔧 Soluções Disponíveis

### Opção 1: Cliente de Banco Externo (Recomendado) ⭐

Use **DBeaver** ou **Postico** para conectar diretamente ao PostgreSQL:

1. **Download DBeaver:** https://dbeaver.io/download/
2. **Criar conexão PostgreSQL:**
   - Host: `postgres-production-4b5e.up.railway.app`
   - Port: `5432`
   - Database: `railway`
   - User: `postgres`
   - Password: `IWgiifpoyaFAhZMgZhVkhCsSoiVRIMyE`

3. **Executar SQL:**
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
   ```

---

### Opção 2: Railway Shell (Via Terminal)

Execute no seu terminal (não via Cursor):

```bash
cd backend

# Abrir shell do Railway com variáveis de ambiente
railway shell

# Dentro do shell, execute:
psql $DATABASE_URL -c "ALTER TYPE \"UserRole\" ADD VALUE IF NOT EXISTS 'MOTHER';"

psql $DATABASE_URL -c "INSERT INTO \"_prisma_migrations\" (id, checksum, finished_at, migration_name, logs, started_at, applied_steps_count) SELECT gen_random_uuid(), '', NOW(), '20250109210000_add_mother_role', NULL, NOW(), 1 WHERE NOT EXISTS (SELECT 1 FROM \"_prisma_migrations\" WHERE migration_name = '20250109210000_add_mother_role');"
```

---

### Opção 3: Deploy Temporário com Script

Crie um script que executa o SQL e faça deploy temporário no Railway.

---

## ✅ Recomendação

**Use a Opção 1 (DBeaver)** - É a mais simples e confiável!

Depois de executar o SQL, o próximo deploy do Railway funcionará normalmente.

---

## 📝 Nota

O projeto já está linkado no Railway CLI. Se a conexão pública do PostgreSQL começar a funcionar, você pode executar:

```bash
railway run psql $DATABASE_URL -c "ALTER TYPE \"UserRole\" ADD VALUE IF NOT EXISTS 'MOTHER';"
```

Mas por enquanto, use um cliente de banco externo.
