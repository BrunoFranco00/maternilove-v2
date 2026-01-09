# CI/CD - MATERNI LOVE V2

**Data:** 2025-01-03  
**Objetivo:** Verificação de workflows e pipelines CI/CD

---

## GITHUB ACTIONS

### Status: **NÃO ENCONTRADO**

**Busca realizada**: `**/.github/workflows/*.yml`

**Resultado**: Nenhum arquivo encontrado

**Conclusão**: **Não há workflows GitHub Actions configurados**

---

## VERIFICAÇÃO DE ARQUIVOS CI/CD

### Possíveis locais verificados:
- `.github/workflows/` - **Não existe**
- `.gitlab-ci.yml` - **Não verificado (fora do escopo)**
- `circle.yml` - **Não verificado (fora do escopo)**
- `jenkinsfile` - **Não verificado (fora do escopo)**

---

## DEPLOY AUTOMÁTICO

### Backend (Railway)

**Configuração detectada**:
- **Arquivo**: `railway.json` (existe em `backend/`)
- **Procfile**: Existe em `backend/Procfile`
- **Build command**: Definido via Railway (não no código)
- **Start command**: Definido via Railway (não no código)

**Scripts package.json relacionados**:
- `prestart`: `prisma migrate deploy` - Executa migrations antes do start
- `postinstall`: `prisma generate` - Gera Prisma Client após npm install
- `start`: `node dist/server.js` - Inicia servidor compilado
- `build`: `tsc` - Compila TypeScript

**Fluxo assumido** (baseado em scripts):
1. Railway detecta mudanças no repo
2. Executa `npm install` (que roda `postinstall` → `prisma generate`)
3. Executa build command (provavelmente `npm run build` → `tsc`)
4. Executa start command (que roda `prestart` → `prisma migrate deploy`, depois `start` → `node dist/server.js`)

**Nota**: Configuração do Railway não está no código (está na plataforma Railway)

---

### Frontend (Vercel)

**Configuração detectada**:
- **Arquivo**: `vercel.json` (existe em `frontend/`)
- **Deploy automático**: Assumido via integração Vercel + Git

**Fluxo assumido**:
1. Vercel detecta mudanças no repo
2. Executa build automático (provavelmente `npm run build`)
3. Deploy automático

**Nota**: Configuração do Vercel não foi auditada (arquivo `vercel.json` existe mas conteúdo não foi lido)

---

## PRISMA MIGRATIONS NO DEPLOY

### Backend

**Migrations automáticas**: **SIM**

**Como funciona**:
- Script `prestart` no `package.json` executa `prisma migrate deploy`
- Isso garante que migrations sejam aplicadas antes do servidor iniciar

**Risco**: Migrations são aplicadas automaticamente em produção sem review manual

---

## GERAÇÃO DO PRISMA CLIENT

### Backend

**Geração automática**: **SIM**

**Como funciona**:
- Script `postinstall` no `package.json` executa `prisma generate`
- Isso garante que Prisma Client seja gerado após `npm install`

---

## LINT E FORMAT NO CI/CD

### Status: **NÃO ENCONTRADO**

**Scripts disponíveis**:
- `lint`: `eslint src --ext .ts`
- `lint:fix`: `eslint src --ext .ts --fix`
- `format`: `prettier --write "src/**/*.{ts,json}"`
- `format:check`: `prettier --check "src/**/*.{ts,json}"`

**Uso em CI/CD**: **Não configurado** (não há workflow que execute esses comandos)

**Risco**: Código pode ser commitado sem passar por lint/format

---

## TESTES NO CI/CD

### Status: **NÃO ENCONTRADO**

**Scripts disponíveis**:
- `test`: `jest`
- `test:watch`: `jest --watch`
- `test:coverage`: `jest --coverage`

**Uso em CI/CD**: **Não configurado** (não há workflow que execute testes)

**Risco**: Código pode ser deployado sem passar por testes

---

## BUILD NO CI/CD

### Status: **IMPLÍCITO (via Railway/Vercel)**

**Backend**:
- Railway executa build (provavelmente `npm run build`)
- Build compila TypeScript para JavaScript

**Frontend**:
- Vercel executa build automático
- Build gera bundle de produção

**Nota**: Build não é executado via GitHub Actions, mas via plataformas de deploy

---

## RESUMO

### ✅ O QUE ESTÁ CONFIGURADO

1. **Deploy automático**: Railway (backend) e Vercel (frontend)
2. **Migrations automáticas**: `prestart` executa `prisma migrate deploy`
3. **Prisma Client generation**: `postinstall` executa `prisma generate`

### ❌ O QUE NÃO ESTÁ CONFIGURADO

1. **GitHub Actions**: Nenhum workflow encontrado
2. **Lint em CI/CD**: Não executa `npm run lint` antes do deploy
3. **Testes em CI/CD**: Não executa `npm test` antes do deploy
4. **Format check em CI/CD**: Não executa `npm run format:check` antes do deploy
5. **Build verificação**: Build não é testado em CI antes do deploy

### 🔄 FLUXO ATUAL

**Backend (Railway)**:
```
Git Push → Railway Detecta → npm install → prisma generate → npm run build → prestart (prisma migrate deploy) → start (node dist/server.js)
```

**Frontend (Vercel)**:
```
Git Push → Vercel Detecta → npm install → npm run build → Deploy
```

### ⚠️ RISCOS

1. **Código sem lint**: Pode ser deployado com problemas de estilo/qualidade
2. **Código sem testes**: Pode ser deployado com bugs
3. **Migrations automáticas**: Migrations são aplicadas sem review manual (risco de breaking changes)
4. **Sem verificação pré-deploy**: Não há etapa de verificação antes do deploy

### 💡 RECOMENDAÇÕES

1. Criar workflow GitHub Actions para:
   - Executar `npm run lint` em PRs
   - Executar `npm test` em PRs
   - Executar `npm run format:check` em PRs
   - Executar `npm run build` para verificar se compila

2. Considerar:
   - Bloquear merge de PRs sem passar em checks
   - Executar migrations manualmente ou com aprovação
   - Adicionar stage de staging antes de produção
