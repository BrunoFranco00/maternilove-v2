# ENVIRONMENT_GUIDE.md
## Guia de Variáveis de Ambiente

**Versão:** 1.0  
**Data:** 2025-01-09  
**Status:** AUTORITATIVO

---

## ⚠️ PRINCÍPIOS DE SEGURANÇA

**CRÍTICO:**
- ❌ **NUNCA** versionar arquivos `.env` com valores reais
- ❌ **NUNCA** compartilhar secrets ou tokens
- ❌ **NUNCA** usar secrets de produção localmente
- ❌ **NUNCA** commitar arquivos `.env` para Git

**SEMPRE:**
- ✅ Usar `.env.example` como template
- ✅ Rotacionar secrets regularmente
- ✅ Usar secrets diferentes por ambiente
- ✅ Validar variáveis obrigatórias no boot

---

## AMBIENTES

### Desenvolvimento Local

**Backend:** `.env` (não versionado)  
**Frontend:** `.env.local` (não versionado)

**Características:**
- Secrets de desenvolvimento (não usados em produção)
- Banco de dados local ou remoto de dev
- Debug habilitado
- Logs detalhados

### Produção

**Backend:** Railway Dashboard → Variables  
**Frontend:** Vercel Dashboard → Environment Variables

**Características:**
- Secrets fortes e únicos
- Banco de dados de produção
- Debug desabilitado
- Logs estruturados

### Staging

**Não configurado atualmente.**  
Produção é o único ambiente oficial além de desenvolvimento local.

---

## BACKEND: VARIÁVEIS DE AMBIENTE

### Database

**DATABASE_URL** (Obrigatório)
```
postgresql://user:password@host:port/database?sslmode=require
```

**Descrição:**
- URL de conexão do PostgreSQL
- Usado pelo Prisma ORM
- Obrigatório em todos os ambientes

**Local:**
```env
DATABASE_URL="postgresql://postgres:password@localhost:5432/maternilove_dev"
```

**Produção (Railway):**
- Fornecido automaticamente pelo Railway
- Configurado em Railway Dashboard → Variables

**Segurança:**
- ❌ Nunca commitar no Git
- ❌ Nunca compartilhar
- ✅ Rotacionar senhas regularmente

---

### Auth (JWT)

**JWT_SECRET** (Obrigatório em produção)
```
String aleatória segura (mínimo 32 caracteres)
```

**Descrição:**
- Secret usado para assinar Access Tokens
- Obrigatório em produção
- Deve ser único e forte

**Como Gerar:**
```bash
# Opção 1: OpenSSL
openssl rand -base64 32

# Opção 2: Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

**Local:**
```env
JWT_SECRET="development-secret-change-in-production"
```

**Produção:**
- Deve ser gerado e configurado manualmente no Railway
- Deve ser diferente do desenvolvimento
- Deve ser rotacionado periodicamente

**Segurança:**
- ❌ Nunca commitar no Git
- ❌ Nunca compartilhar
- ✅ Rotacionar regularmente (requer invalidação de tokens)

---

**JWT_REFRESH_SECRET** (Opcional)
```
String aleatória segura (mínimo 32 caracteres)
```

**Descrição:**
- Secret usado para assinar Refresh Tokens
- Opcional (usa JWT_SECRET se não fornecido)
- Deve ser diferente de JWT_SECRET (recomendado)

**Local:**
```env
JWT_REFRESH_SECRET="development-refresh-secret-change-in-production"
```

**Produção:**
- Recomendado configurar separadamente
- Deve ser diferente de JWT_SECRET

**Segurança:**
- Mesmas regras de JWT_SECRET

---

### App

**NODE_ENV** (Obrigatório)
```
development | production
```

**Descrição:**
- Define ambiente de execução
- Afeta comportamento da aplicação (debug, logs, validações)

**Local:**
```env
NODE_ENV="development"
```

**Produção:**
```env
NODE_ENV="production"
```

**Comportamento:**
- `development`: Debug habilitado, logs detalhados, validações relaxadas
- `production`: Debug desabilitado, logs estruturados, validações rígidas

---

**PORT** (Opcional, padrão: 3000)
```
Número da porta (ex: 3000)
```

**Descrição:**
- Porta onde servidor escuta
- Opcional (default: 3000)

**Local:**
```env
PORT=3000
```

**Produção (Railway):**
- Fornecido automaticamente via `$PORT`
- Não precisa configurar manualmente

---

### CORS

**CORS_ORIGIN** (Opcional para dev, obrigatório em produção)
```
URL do frontend (ex: https://maternilove-v2.vercel.app)
```

**Descrição:**
- Domínio permitido para requisições CORS
- Deve ser o domínio do frontend

**Local:**
```env
CORS_ORIGIN="http://localhost:3001"
```

**Produção:**
```env
CORS_ORIGIN="https://maternilove-v2.vercel.app"
```

**Segurança:**
- ⚠️ Sem CORS_ORIGIN, CORS pode estar muito permissivo
- ✅ Configure sempre em produção

---

## FRONTEND: VARIÁVEIS DE AMBIENTE

### API

**NEXT_PUBLIC_API_URL** (Obrigatório)
```
URL do backend (ex: https://maternilove-v2-production.up.railway.app/api/v1)
```

**Descrição:**
- URL base do backend para requisições API
- **Público:** Exposto no bundle do cliente (prefixo `NEXT_PUBLIC_`)

**Local:**
```env
NEXT_PUBLIC_API_URL="http://localhost:3000/api/v1"
```

**Produção:**
```env
NEXT_PUBLIC_API_URL="https://maternilove-v2-production.up.railway.app/api/v1"
```

**AVISO CRÍTICO:**
- Variáveis `NEXT_PUBLIC_*` são **expostas no bundle do cliente**
- **NÃO** coloque secrets aqui
- **NÃO** coloque tokens aqui

---

### Ambiente

**NODE_ENV** (Automático)
```
development | production
```

**Descrição:**
- Definido automaticamente pelo Next.js
- Não precisa configurar manualmente

---

## CRIAR ARQUIVOS .env

### Backend

```bash
# 1. Copiar exemplo
cp bootstrap/backend.env.example backend/.env

# 2. Editar .env com valores reais (não commitar)
# Editar backend/.env
```

**Verificar:**
- ✅ `.env` está em `.gitignore`
- ✅ Não commita `.env`
- ✅ Usa valores de desenvolvimento (não produção)

---

### Frontend

```bash
# 1. Copiar exemplo
cp bootstrap/frontend.env.example frontend/.env.local

# 2. Editar .env.local com valores reais (não commitar)
# Editar frontend/.env.local
```

**Verificar:**
- ✅ `.env.local` está em `.gitignore`
- ✅ Não commita `.env.local`
- ✅ Usa valores de desenvolvimento (não produção)

---

## VALIDAÇÃO DE VARIÁVEIS

### Backend

**Validação Automática (server.ts):**
```typescript
const requiredEnvVars = {
  DATABASE_URL: process.env.DATABASE_URL,
  JWT_SECRET: process.env.JWT_SECRET,
};

if (process.env.NODE_ENV === 'production') {
  // Valida variáveis obrigatórias
  // Falha se faltar algo
}
```

**Usar Script:**
```bash
# Validar variáveis
bash bootstrap/scripts/check-env.sh
```

---

### Frontend

**Validação Manual:**
```bash
# Verificar se NEXT_PUBLIC_API_URL está definido
echo $NEXT_PUBLIC_API_URL
```

**Usar Script:**
```bash
# Validar variáveis (se disponível)
bash bootstrap/scripts/check-env.sh
```

---

## ROTAÇÃO DE SECRETS

### Princípio

Secrets devem ser rotacionados:
- **Regularmente** (ex: a cada 3-6 meses)
- **Após comprometimento** (se houver suspeita)
- **Quando funcionário sai** (se tiver acesso)

### Processo Conceitual

**1. Gerar Novo Secret:**
```bash
openssl rand -base64 32
```

**2. Atualizar em Produção:**
- Railway Dashboard → Variables
- Atualizar `JWT_SECRET` (e `JWT_REFRESH_SECRET` se usado)

**3. Invalidação de Tokens:**
- **IMPORTANTE:** Rotacionar secret invalida TODOS os tokens existentes
- Usuários precisarão fazer login novamente
- Notificar usuários se necessário

**4. Validação:**
- Testar login/register após rotação
- Verificar se tokens antigos foram invalidados

---

### Rotação de DATABASE_URL

**CRÍTICO:** Rotação de DATABASE_URL requer:
1. Migração de dados
2. Backup do banco atual
3. Testes extensivos
4. Janela de manutenção

**NÃO fazer sem:**
- Aprovação do chat responsável
- Plano documentado
- Backup validado

---

## VERSIONAMENTO

### O Que Versionar

**✅ Versionar:**
- `.env.example` (templates sem valores reais)
- `bootstrap/backend.env.example`
- `bootstrap/frontend.env.example`

**❌ NÃO Versionar:**
- `.env` (valores reais)
- `.env.local` (valores reais)
- Qualquer arquivo com secrets

### .gitignore

**Backend:**
```
.env
.env.*
!.env.example
```

**Frontend:**
```
.env.local
.env*.local
.env
!.env.example
```

---

## TROUBLESHOOTING

### Variável Não Carregada

**Verificar:**
1. Arquivo `.env` existe?
2. Nome da variável está correto?
3. Sem espaços ou caracteres especiais?
4. Backend: `dotenv.config()` foi chamado?
5. Frontend: Variável começa com `NEXT_PUBLIC_`?

### Secret Comprometido

**Ação Imediata:**
1. Gerar novo secret
2. Atualizar em produção
3. Invalidar tokens (usuários precisam re-login)
4. Investigar comprometimento
5. Rotacionar outros secrets se necessário

---

## CONCLUSÃO

Variáveis de ambiente são **críticas** para segurança e funcionamento.

**Lembre-se:**
- ✅ Use `.env.example` como template
- ✅ NUNCA versionar valores reais
- ✅ NUNCA compartilhar secrets
- ✅ Rotacionar secrets regularmente
- ✅ Validar variáveis obrigatórias

---

**FIM DO GUIA DE VARIÁVEIS DE AMBIENTE**
