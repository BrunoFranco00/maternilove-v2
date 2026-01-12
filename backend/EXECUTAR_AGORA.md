# ⚡ EXECUTAR AGORA - Resolver Migration

## ✅ Railway CLI Já Está Instalado!

Você pode resolver a migration agora mesmo usando o Railway CLI.

### Comandos para Executar:

```bash
# 1. Ir para o backend
cd backend

# 2. Fazer login (se necessário)
railway login

# 3. Conectar ao projeto (primeira vez - selecione PostgreSQL)
railway link

# 4. Resolver migration
railway run npx prisma migrate resolve --applied 20250109210000_add_mother_role
```

---

## 🔄 Alternativa: Se Railway CLI não estiver conectado

Use um cliente de banco externo:

### Opção A: DBeaver (Recomendado - Gratuito)

1. **Download:** https://dbeaver.io/download/
2. **Instalar e abrir**
3. **Criar nova conexão PostgreSQL:**
   - Host: `postgres-production-4b5e.up.railway.app`
   - Port: `5432`
   - Database: `railway`
   - User: `postgres`
   - Password: `IWgiifpoyaFAhZMgZhVkhCsSoiVRIMyE`

4. **Executar SQL:**
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

### Opção B: Postico (macOS - Específico PostgreSQL)

1. **Download:** https://eggerapps.at/postico/
2. **Conectar com as mesmas credenciais acima**
3. **Executar o mesmo SQL**

---

## ✅ Após Resolver

O próximo deploy do Railway funcionará normalmente! 🎉
