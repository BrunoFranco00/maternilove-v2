# ⚡ Instruções para Executar Agora

## ✅ Status Atual

- ✅ Railway CLI instalado (v4.16.1)
- ✅ Você está logado no Railway CLI
- ⚠️ Projeto ainda não está linkado (precisa fazer manualmente)

---

## 🎯 Passos para Resolver a Migration

### 1. Abra seu terminal e execute:

```bash
cd backend
railway link
```

**Quando pedir:**
- Selecione seu workspace: `brunofranco00's Projects`
- Selecione o projeto: `maternilove-v2` (ou o nome do seu projeto)
- Selecione o serviço: **PostgreSQL** (não o backend)

### 2. Depois de fazer o link, execute o script:

```bash
./resolver-migration.sh
```

**OU execute diretamente:**

```bash
railway run npx prisma migrate resolve --applied 20250109210000_add_mother_role
```

---

## ✅ Alternativa: Executar SQL Diretamente

Se preferir executar SQL diretamente:

```bash
railway run psql $DATABASE_URL -c "ALTER TYPE \"UserRole\" ADD VALUE IF NOT EXISTS 'MOTHER';"

railway run psql $DATABASE_URL -c "INSERT INTO \"_prisma_migrations\" (id, checksum, finished_at, migration_name, logs, started_at, applied_steps_count) SELECT gen_random_uuid(), '', NOW(), '20250109210000_add_mother_role', NULL, NOW(), 1 WHERE NOT EXISTS (SELECT 1 FROM \"_prisma_migrations\" WHERE migration_name = '20250109210000_add_mother_role');"
```

---

## 🎉 Após Executar

O próximo deploy do Railway funcionará normalmente!
