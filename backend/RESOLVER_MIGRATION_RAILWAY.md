# 🔧 Resolver Migration Diretamente no Railway

Como a conexão local não está funcionando (domínio pode estar propagando), vamos resolver diretamente no Railway.

## Opção 1: Via Railway SQL Query (Mais Simples) ✅

1. **Acesse o Railway:**
   - https://railway.app
   - Vá no serviço **PostgreSQL**

2. **Abra o Query Editor:**
   - Clique na aba **Query** ou **Data**
   - Ou procure por **"Open Query Editor"** / **"Run SQL"**

3. **Execute este SQL:**
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

4. **Verificar se funcionou:**
   - O próximo deploy do Railway deve funcionar normalmente

## Opção 2: Via Railway CLI (Se Instalado)

1. **Instalar Railway CLI (se não tiver):**
   ```bash
   npm i -g @railway/cli
   railway login
   ```

2. **Conectar ao projeto:**
   ```bash
   cd backend
   railway link
   ```

3. **Executar comando:**
   ```bash
   railway run npx prisma migrate resolve --applied 20250109210000_add_mother_role
   ```

## Opção 3: Esperar Propagação do Domínio (5-10 minutos)

Se preferir usar o script local:

1. Aguarde 5-10 minutos para o domínio propagar
2. Execute novamente:
   ```bash
   export DATABASE_URL="postgresql://postgres:IWgiifpoyaFAhZMgZhVkhCsSoiVRIMyE@postgres-production-4b5e.up.railway.app:5432/railway"
   cd backend
   npm run resolve-migration
   ```

## ✅ Recomendação

Use a **Opção 1 (SQL Query)** - é mais rápida e confiável!

Depois de executar o SQL, a migration estará resolvida e o próximo deploy funcionará normalmente.
