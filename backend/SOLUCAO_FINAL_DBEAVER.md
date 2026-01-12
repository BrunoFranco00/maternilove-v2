# ✅ Solução Final - Usar DBeaver (Cliente de Banco)

## 🎯 Por que DBeaver?

A conexão pública do Railway está com timeout. DBeaver é um cliente de banco de dados visual que funciona melhor com conexões externas.

---

## 📥 Passo 1: Instalar DBeaver

1. **Acesse:** https://dbeaver.io/download/
2. **Baixe a versão Community Edition** (gratuita)
3. **Instale** seguindo as instruções do instalador

---

## 🔌 Passo 2: Criar Conexão PostgreSQL

1. **Abra o DBeaver**
2. **Clique em "Nova Conexão"** (ícone de plugue) ou `File → New → Database Connection`
3. **Selecione "PostgreSQL"** na lista
4. **Clique em "Next"**

### Configurações da Conexão:

- **Host:** `postgres-production-4b5e.up.railway.app`
- **Port:** `5432`
- **Database:** `railway`
- **Username:** `postgres`
- **Password:** `IWgiifpoyaFAhZMgZhVkhCsSoiVRIMyE`
- **Show all databases:** ✅ (opcional)

5. **Clique em "Test Connection"** para verificar
6. **Se funcionar, clique em "Finish"**

---

## 📝 Passo 3: Executar SQL

1. **Clique com botão direito** na conexão criada
2. **Selecione "SQL Editor" → "New SQL Script"**
3. **Cole o seguinte SQL:**

```sql
-- Adicionar MOTHER ao enum UserRole
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

-- Verificar resultado
SELECT migration_name, finished_at 
FROM "_prisma_migrations" 
WHERE migration_name = '20250109210000_add_mother_role';
```

4. **Execute o SQL:**
   - Pressione `Ctrl+Enter` (Windows/Linux) ou `Cmd+Enter` (Mac)
   - Ou clique no botão "Execute SQL Script" (▶️)

5. **Verifique o resultado:**
   - Deve mostrar `ALTER TYPE` executado com sucesso
   - Deve mostrar `INSERT 0 1` (ou `INSERT 0 0` se já existir)
   - Deve mostrar a migration na última query

---

## ✅ Passo 4: Verificar

Execute esta query para confirmar:

```sql
-- Verificar se MOTHER está no enum
SELECT unnest(enum_range(NULL::"UserRole")) AS role_value;

-- Verificar migration
SELECT migration_name, finished_at, applied_steps_count
FROM "_prisma_migrations" 
WHERE migration_name = '20250109210000_add_mother_role';
```

**Resultado esperado:**
- Enum deve incluir `MOTHER`
- Migration deve estar marcada como aplicada com `finished_at` preenchido

---

## 🎉 Pronto!

Depois de executar o SQL no DBeaver:
- ✅ O enum `MOTHER` foi adicionado
- ✅ A migration está marcada como aplicada
- ✅ O próximo deploy do Railway funcionará normalmente!

---

## 🐛 Troubleshooting

### Erro: "Connection refused" ou "Timeout"

**Solução:**
1. Verifique se o **Public Networking** está ativado no Railway:
   - Railway → PostgreSQL → Settings → Networking
   - Ative "Public Networking" se não estiver ativo
2. Aguarde alguns minutos para propagação
3. Tente novamente

### Erro: "Authentication failed"

**Solução:**
- Verifique se a senha está correta: `IWgiifpoyaFAhZMgZhVkhCsSoiVRIMyE`
- Verifique se o usuário está correto: `postgres`

### DBeaver não conecta

**Alternativa:** Use **Postico** (macOS):
- Download: https://eggerapps.at/postico/
- Use as mesmas credenciais
- Execute o mesmo SQL

---

## 📝 Resumo Rápido

1. ✅ Instalar DBeaver
2. ✅ Criar conexão PostgreSQL com as credenciais do Railway
3. ✅ Executar SQL para adicionar MOTHER e marcar migration
4. ✅ Verificar resultado
5. 🎉 Pronto!

---

## 🔗 Links Úteis

- **DBeaver:** https://dbeaver.io/download/
- **Postico (macOS):** https://eggerapps.at/postico/
- **Documentação Railway:** https://docs.railway.app/
