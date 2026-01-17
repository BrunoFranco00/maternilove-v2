# SETUP_LOCAL.md
## Guia Passo a Passo para Executar o Projeto Localmente

**Versão:** 1.0  
**Data:** 2025-01-09  
**Status:** AUTORITATIVO

---

## ⚠️ AVISOS IMPORTANTES

1. **NÃO use variáveis de ambiente de produção localmente**
2. **NÃO rode migrations em banco de produção**
3. **NÃO compartilhe secrets ou tokens**
4. **Siga esta ordem exata de execução**

---

## PRÉ-REQUISITOS

### Software Necessário

**Obrigatório:**
- Node.js 18+ (recomendado 20+)
- npm 9+ (vem com Node.js) ou yarn 1.22+
- PostgreSQL 14+ (local ou acesso a instância remota)
- Git

**Recomendado:**
- VS Code (ou editor de código)
- PostgreSQL client (pgAdmin, DBeaver, ou CLI `psql`)

### Verificar Instalação

```bash
# Verificar Node.js
node --version
# Deve retornar: v18.x.x ou superior

# Verificar npm
npm --version
# Deve retornar: 9.x.x ou superior

# Verificar PostgreSQL (se local)
psql --version
# Deve retornar: psql (PostgreSQL) 14.x ou superior
```

---

## ORDEM DE EXECUÇÃO

**IMPORTANTE:** Execute nesta ordem exata:

1. **Backend primeiro** (configuração e setup)
2. **Frontend depois** (depende do backend funcionando)

---

## PASSO 1: CLONAR O REPOSITÓRIO

```bash
# Clonar repositório
git clone <repository-url>
cd maternilove-v2

# Verificar estrutura
ls -la
# Deve mostrar: backend/, frontend/, bootstrap/, PROJECT_GOVERNANCE.md
```

---

## PASSO 2: CONFIGURAR BACKEND

### 2.1 Criar Arquivo .env

```bash
# Navegar para diretório do backend
cd backend

# Copiar exemplo (se disponível) ou criar manualmente
# O arquivo .env.example está em bootstrap/backend.env.example
```

**Criar arquivo `.env` manualmente:**

```bash
# Criar arquivo .env
touch .env
```

**Editar `.env` com as seguintes variáveis:**

```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/maternilove_dev"

# Auth (JWT)
JWT_SECRET="development-secret-change-in-production"
JWT_REFRESH_SECRET="development-refresh-secret-change-in-production"

# App
NODE_ENV="development"
PORT=3000

# CORS (opcional para dev local)
CORS_ORIGIN="http://localhost:3001"
```

**AVISO CRÍTICO:**
- **NÃO** use secrets de produção
- **NÃO** commite este arquivo
- **NÃO** compartilhe este arquivo

### 2.2 Instalar Dependências

```bash
# No diretório backend/
npm install

# Verificar se instalação foi bem-sucedida
# Deve criar: node_modules/, package-lock.json
```

### 2.3 Configurar Banco de Dados

**Opção A: PostgreSQL Local**

```bash
# Criar banco de dados
createdb maternilove_dev

# OU via psql
psql -U postgres
CREATE DATABASE maternilove_dev;
\q
```

**Opção B: PostgreSQL Remoto (Railway, Supabase, etc)**

```bash
# Atualizar DATABASE_URL no .env com URL remota
# Exemplo:
# DATABASE_URL="postgresql://user:password@host:port/database?sslmode=require"
```

### 2.4 Rodar Migrations

```bash
# Gerar Prisma Client
npm run prisma:generate

# Aplicar migrations
npm run prisma:migrate:deploy

# OU para desenvolvimento (cria nova migration se schema mudou)
npm run prisma:migrate
```

**Verificar:**
```bash
# Verificar se tabelas foram criadas (via Prisma Studio)
npm run prisma:studio
# Abre em http://localhost:5555
```

### 2.5 Verificar Backend

```bash
# Iniciar servidor em modo desenvolvimento
npm run dev

# Verificar logs no terminal
# Deve mostrar:
# - "🔧 Configuração do Servidor:"
# - "PORT: 3000"
# - Servidor rodando em http://localhost:3000
```

**Testar endpoint de health:**
```bash
# Em outro terminal
curl http://localhost:3000/health

# Deve retornar: { "status": "ok" }
```

**Se funcionar:** Backend está pronto. Continue para o frontend.

**Se não funcionar:** Verificar:
- Banco de dados está rodando
- DATABASE_URL está correto
- Porta 3000 está disponível
- Variáveis de ambiente estão corretas

---

## PASSO 3: CONFIGURAR FRONTEND

### 3.1 Criar Arquivo .env.local

```bash
# Navegar para diretório do frontend
cd ../frontend

# Criar arquivo .env.local
touch .env.local
```

**Editar `.env.local` com:**

```env
# API URL (backend local)
NEXT_PUBLIC_API_URL="http://localhost:3000/api/v1"

# Ambiente
NODE_ENV="development"
```

**AVISO:**
- Next.js usa `NEXT_PUBLIC_*` para variáveis expostas ao cliente
- `NEXT_PUBLIC_API_URL` será exposta no bundle do cliente
- **NÃO** coloque secrets aqui

### 3.2 Instalar Dependências

```bash
# No diretório frontend/
npm install

# Verificar se instalação foi bem-sucedida
# Deve criar: node_modules/, package-lock.json
```

### 3.3 Verificar Frontend

```bash
# Iniciar servidor de desenvolvimento
npm run dev

# Verificar logs no terminal
# Deve mostrar:
# - "Ready in XXXms"
# - Servidor rodando em http://localhost:3000
```

**AVISO:** Frontend e Backend usam porta 3000 por padrão. Se houver conflito:
- Backend: usar porta 3000
- Frontend: Next.js detecta conflito e usa 3001 automaticamente

**Testar no navegador:**
```
http://localhost:3000 (ou 3001)
```

**Se funcionar:** Frontend está pronto.

**Se não funcionar:** Verificar:
- Backend está rodando
- NEXT_PUBLIC_API_URL está correto
- Porta está disponível
- Variáveis de ambiente estão corretas

---

## PASSO 4: VALIDAR SETUP COMPLETO

### 4.1 Backend Funcionando

```bash
# Health check
curl http://localhost:3000/health

# API info
curl http://localhost:3000/api
```

### 4.2 Frontend Funcionando

```bash
# Abrir no navegador
# http://localhost:3000 (ou 3001)

# Verificar:
# - Página inicial carrega
# - Sem erros no console
# - Estilos aplicados
```

### 4.3 Integração Backend-Frontend

```bash
# Testar login/register via interface
# - Criar conta
# - Fazer login
# - Verificar autenticação
```

---

## ERROS COMUNS E SOLUÇÕES

### Erro: "Cannot find module"

**Causa:** Dependências não instaladas

**Solução:**
```bash
# Backend
cd backend
rm -rf node_modules package-lock.json
npm install

# Frontend
cd frontend
rm -rf node_modules package-lock.json
npm install
```

### Erro: "Database connection failed"

**Causa:** DATABASE_URL incorreto ou banco não acessível

**Solução:**
1. Verificar DATABASE_URL no `.env`
2. Verificar se PostgreSQL está rodando (local)
3. Verificar credenciais e host (remoto)
4. Testar conexão:
```bash
psql $DATABASE_URL
```

### Erro: "Port already in use"

**Causa:** Porta 3000 já está em uso

**Solução:**
```bash
# Verificar o que está usando a porta
lsof -i :3000

# Matar processo (substituir PID)
kill -9 <PID>

# OU mudar porta no .env
PORT=3002
```

### Erro: "Prisma Client not generated"

**Causa:** Prisma Client não foi gerado

**Solução:**
```bash
cd backend
npm run prisma:generate
```

### Erro: "Migrations not applied"

**Causa:** Migrations não foram aplicadas

**Solução:**
```bash
cd backend
npm run prisma:migrate:deploy
```

---

## O QUE NÃO TENTAR MUDAR

**Durante setup local, NÃO:**

- ❌ Modificar código funcional lockado
- ❌ Alterar sistema de autenticação
- ❌ Modificar migrations existentes
- ❌ Alterar contratos de API
- ❌ Usar variáveis de ambiente de produção
- ❌ Rodar migrations em banco de produção

**Se precisar fazer alterações:**
1. Validar com `PROJECT_GOVERNANCE.md`
2. Obter aprovação do chat responsável
3. Documentar alterações

---

## PRÓXIMOS PASSOS APÓS SETUP

1. **Ler documentação:**
   - `PROJECT_GOVERNANCE.md`
   - `PROJECT_SNAPSHOT.md`

2. **Explorar código:**
   - Backend: `backend/src/`
   - Frontend: `frontend/src/`

3. **Usar scripts:**
   - Ver `bootstrap/SCRIPTS.md`

4. **Validar com checklist:**
   - Ver `bootstrap/CHECKLIST_AUDIT.md`

---

## COMANDOS ÚTEIS

### Backend

```bash
# Desenvolvimento
npm run dev

# Build
npm run build

# Produção (após build)
npm start

# Prisma
npm run prisma:generate        # Gerar Prisma Client
npm run prisma:migrate         # Criar nova migration
npm run prisma:migrate:deploy  # Aplicar migrations
npm run prisma:studio          # Abrir Prisma Studio
```

### Frontend

```bash
# Desenvolvimento
npm run dev

# Build
npm run build

# Produção (após build)
npm start

# Lint
npm run lint
npm run lint:fix
```

---

## CONCLUSÃO

Se você seguiu todos os passos e não encontrou erros:

✅ **Setup local está completo e funcional.**

Você pode agora:
- Desenvolver localmente
- Testar funcionalidades
- Explorar código
- Contribuir (seguindo governança)

**Lembre-se:** Este é um ambiente de desenvolvimento. Não use para produção.

---

**FIM DO GUIA DE SETUP LOCAL**
