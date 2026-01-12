# ⚡ EXECUTAR NO TERMINAL AGORA

## 🎯 O que fazer

O Railway CLI precisa de interação para fazer o link. Execute este comando no seu terminal:

```bash
cd backend
./resolver-migration-interativo.sh
```

**OU execute manualmente:**

```bash
cd backend

# 1. Fazer link (selecione quando pedir):
#   - Workspace: brunofranco00's Projects
#   - Projeto: Materni_Love-V2  
#   - Serviço: PostgreSQL
railway link

# 2. Resolver migration
railway run npx prisma migrate resolve --applied 20250109210000_add_mother_role
```

---

## ✅ Após executar

O próximo deploy do Railway funcionará normalmente! 🎉
