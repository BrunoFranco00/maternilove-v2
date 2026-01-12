# 🔧 Resolver Migration Travada no Railway

## ⚠️ Importante: Railway Removeu a Aba Query

O Railway **não oferece mais** a opção de executar SQL diretamente na interface. Use uma das alternativas abaixo.

---

## ✅ Opção 1: Railway CLI (Recomendado - Mais Rápido)

### Passo a Passo:

1. **Instalar Railway CLI (se não tiver):**
   ```bash
   npm i -g @railway/cli
   ```

2. **Fazer login:**
   ```bash
   railway login
   ```

3. **Conectar ao projeto:**
   ```bash
   cd backend
   railway link
   # Selecione seu projeto e serviço PostgreSQL
   ```

4. **Executar comando para resolver migration:**
   ```bash
   railway run npx prisma migrate resolve --applied 20250109210000_add_mother_role
   ```

   Ou usar psql diretamente:
   ```bash
   railway run psql $DATABASE_URL -c "ALTER TYPE \"UserRole\" ADD VALUE IF NOT EXISTS 'MOTHER';"
   railway run psql $DATABASE_URL -c "INSERT INTO \"_prisma_migrations\" (id, checksum, finished_at, migration_name, logs, started_at, applied_steps_count) SELECT gen_random_uuid(), '', NOW(), '20250109210000_add_mother_role', NULL, NOW(), 1 WHERE NOT EXISTS (SELECT 1 FROM \"_prisma_migrations\" WHERE migration_name = '20250109210000_add_mother_role');"
   ```

**✅ Esta é a opção mais rápida e confiável!**

---

## ✅ Opção 2: Cliente de Banco de Dados Externo

### Clientes Recomendados:

1. **DBeaver** (Gratuito, multiplataforma)
   - Download: https://dbeaver.io/
   - Suporta PostgreSQL, MySQL, etc.

2. **Beekeeper Studio** (Gratuito)
   - Download: https://www.beekeeperstudio.io/

3. **Postico** (macOS, específico para PostgreSQL)
   - Download: https://eggerapps.at/postico/

### Passo a Passo:

1. **Obter credenciais no Railway:**
   - Railway → PostgreSQL → **Variables**
   - Copie a `DATABASE_URL` completa
   - Ou copie individualmente: `PGHOST`, `PGUSER`, `PGPASSWORD`, `PGDATABASE`, `PGPORT`

2. **Conectar no cliente:**
   - Abra o cliente escolhido
   - Crie nova conexão PostgreSQL
   - Use as credenciais do Railway
   - Teste a conexão

3. **Executar SQL:**
   ```sql
   -- Adicionar MOTHER ao enum (se ainda não foi adicionado)
   ALTER TYPE "UserRole" ADD VALUE IF NOT EXISTS 'MOTHER';

   -- Marcar migration como aplicada manualmente
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

## ✅ Opção 3: Deploy dbgate no Railway

O Railway sugere implantar `dbgate` como um serviço separado para ter uma interface web de queries.

1. **Adicionar serviço dbgate:**
   - Railway → **New Service** → **Template**
   - Procure por "dbgate" nos templates da comunidade
   - Configure para conectar ao seu PostgreSQL

2. **Acessar interface web:**
   - Após deploy, acesse a URL do dbgate
   - Execute as queries SQL necessárias

**Nota:** Esta opção é mais complexa e pode levar alguns minutos para configurar.

---

## ✅ Opção 4: Usar Railway Shell (psql)

Se você já tem Railway CLI instalado:

```bash
# Conectar ao shell do PostgreSQL
railway run psql $DATABASE_URL

# Dentro do psql, execute:
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

\q  # Para sair do psql
```

---

## 🎯 Recomendação

**Use a Opção 1 (Railway CLI)** - É a mais rápida e não requer instalar software adicional.

### Comando Rápido (Railway CLI):

```bash
# 1. Instalar (se necessário)
npm i -g @railway/cli

# 2. Login
railway login

# 3. Conectar ao projeto
cd backend
railway link

# 4. Resolver migration
railway run npx prisma migrate resolve --applied 20250109210000_add_mother_role
```

---

## ✅ Após Resolver

Depois de executar qualquer uma das opções acima:

1. A migration estará marcada como aplicada
2. O próximo deploy do Railway funcionará normalmente
3. O enum `MOTHER` estará disponível no banco

---

## 📝 Nota sobre DATABASE_URL

Se precisar da URL completa para cliente externo:
- Railway → PostgreSQL → **Variables** → `DATABASE_URL`
- Use a URL interna (`postgres.railway.internal`) ou pública (se configurada)
- Para cliente externo, você pode precisar da URL pública ou usar as credenciais individuais
