# 🚀 Comandos Completos para Executar no Terminal

## 📋 Passo a Passo Completo

### 1. Abrir o Terminal

Abra o terminal do seu Mac (Terminal.app ou iTerm).

---

### 2. Navegar até o Diretório do Backend

```bash
cd /Users/bruno/Projetos/maternilove-v2/backend
```

---

### 3. Verificar se Railway CLI está Configurado

```bash
railway whoami
```

**Resultado esperado:** Deve mostrar seu email (ex: `78d7vkp9tg@privaterelay.appleid.com`)

Se não estiver logado, execute:
```bash
railway login
```
(Siga as instruções na tela)

---

### 4. Verificar se o Projeto está Linkado

```bash
railway status
```

**Resultado esperado:** Deve mostrar informações do projeto `Materni_Love-V2`

Se não estiver linkado, execute:
```bash
railway link
```
Quando pedir, selecione:
- Workspace: `brunofranco00's Projects`
- Projeto: `Materni_Love-V2`
- Environment: `production`
- Service: `Postgres`

---

### 5. Abrir Shell do Railway

```bash
railway shell
```

**O que acontece:** Isso abre um shell com todas as variáveis de ambiente do Railway disponíveis, incluindo `$DATABASE_URL` que aponta para o PostgreSQL interno.

**Você verá algo como:**
```
🚂 Railway Shell
Environment: production
Project: Materni_Love-V2
Service: Postgres
```

---

### 6. Executar SQL para Adicionar MOTHER ao Enum

Dentro do shell do Railway, execute:

```bash
psql $DATABASE_URL -c "ALTER TYPE \"UserRole\" ADD VALUE IF NOT EXISTS 'MOTHER';"
```

**Resultado esperado:** Nenhum erro (comando executado com sucesso)

---

### 7. Marcar Migration como Aplicada

Ainda dentro do shell do Railway, execute:

```bash
psql $DATABASE_URL -c "INSERT INTO \"_prisma_migrations\" (id, checksum, finished_at, migration_name, logs, started_at, applied_steps_count) SELECT gen_random_uuid(), '', NOW(), '20250109210000_add_mother_role', NULL, NOW(), 1 WHERE NOT EXISTS (SELECT 1 FROM \"_prisma_migrations\" WHERE migration_name = '20250109210000_add_mother_role');"
```

**Resultado esperado:** `INSERT 0 1` (ou `INSERT 0 0` se já existir)

---

### 8. Verificar se Funcionou

Execute para confirmar:

```bash
psql $DATABASE_URL -c "SELECT migration_name, finished_at FROM \"_prisma_migrations\" WHERE migration_name = '20250109210000_add_mother_role';"
```

**Resultado esperado:** Deve mostrar a migration com `finished_at` preenchido.

---

### 9. Sair do Shell do Railway

```bash
exit
```

---

### 10. Verificar Enum

Para confirmar que o enum foi adicionado:

```bash
railway run psql $DATABASE_URL -c "SELECT unnest(enum_range(NULL::\"UserRole\"));"
```

**Resultado esperado:** Deve listar todos os valores do enum, incluindo `MOTHER`.

---

## ✅ Resumo dos Comandos (Copie e Cole)

```bash
# 1. Ir para o backend
cd /Users/bruno/Projetos/maternilove-v2/backend

# 2. Verificar login
railway whoami

# 3. Verificar link
railway status

# 4. Abrir shell do Railway
railway shell

# 5. Dentro do shell, executar:
psql $DATABASE_URL -c "ALTER TYPE \"UserRole\" ADD VALUE IF NOT EXISTS 'MOTHER';"

psql $DATABASE_URL -c "INSERT INTO \"_prisma_migrations\" (id, checksum, finished_at, migration_name, logs, started_at, applied_steps_count) SELECT gen_random_uuid(), '', NOW(), '20250109210000_add_mother_role', NULL, NOW(), 1 WHERE NOT EXISTS (SELECT 1 FROM \"_prisma_migrations\" WHERE migration_name = '20250109210000_add_mother_role');"

# 6. Verificar
psql $DATABASE_URL -c "SELECT migration_name, finished_at FROM \"_prisma_migrations\" WHERE migration_name = '20250109210000_add_mother_role';"

# 7. Sair
exit
```

---

## 🎉 Pronto!

Depois de executar esses comandos, o próximo deploy do Railway funcionará normalmente!

---

## 🐛 Se Algo Der Errado

### Erro: "No linked project found"
```bash
railway link
```
(Selecione o projeto quando pedir)

### Erro: "psql: command not found"
O Railway Shell deve ter o psql disponível. Se não tiver, use a Opção 2 abaixo.

### Erro: "Can't reach database server"
Isso não deve acontecer dentro do `railway shell`, pois ele usa a conexão interna.

---

## 🔄 Alternativa: Se Railway Shell Não Funcionar

Se o `railway shell` não funcionar, você pode executar os comandos SQL diretamente:

```bash
cd /Users/bruno/Projetos/maternilove-v2/backend

railway run psql $DATABASE_URL <<EOF
ALTER TYPE "UserRole" ADD VALUE IF NOT EXISTS 'MOTHER';

INSERT INTO "_prisma_migrations" (id, checksum, finished_at, migration_name, logs, started_at, applied_steps_count)
SELECT gen_random_uuid(), '', NOW(), '20250109210000_add_mother_role', NULL, NOW(), 1
WHERE NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE migration_name = '20250109210000_add_mother_role');
EOF
```
