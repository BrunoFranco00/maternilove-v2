# PROJECT_SNAPSHOT.md
## Materni_Love – V2
## Snapshot Técnico Completo e Congelado

**Versão:** 1.0  
**Data do Snapshot:** 2025-01-09  
**Status:** AUTORITATIVO E CONGELADO

---

## ⚠️ DECLARAÇÃO DE SNAPSHOT

**Este é o estado oficial do projeto neste momento.**

Este documento representa um **snapshot congelado** do estado técnico, arquitetural e funcional do projeto Materni_Love – V2. Ele foi criado para:

- Permitir recriação do projeto do zero
- Facilitar auditoria técnica
- Permitir onboarding de novos desenvolvedores
- Documentar estado para stakeholders
- Preservar estado atual para referência histórica

**Qualquer alteração neste snapshot deve refletir mudanças reais no projeto e ser documentada.**

---

## 1. VISÃO GERAL DO PROJETO

### O Que É

Materni_Love – V2 é uma plataforma digital completa e mobile-first focada em apoiar mães durante toda sua jornada de maternidade. Oferece uma experiência integrada que combina comunidade, recursos educacionais, marketplace de produtos relacionados à maternidade e conexão com profissionais de saúde.

### Problema que Resolve

Mães enfrentam dificuldades para encontrar informações confiáveis, comunidade de apoio, produtos adequados e profissionais de saúde qualificados em um único lugar durante sua jornada de maternidade.

**Solução:** Plataforma unificada que centraliza recursos, comunidade, produtos e serviços especializados, oferecendo suporte contínuo desde a gravidez até os primeiros anos da criança.

### Público Prioritário

**PRIMÁRIO:** **MÃES**

O projeto foi desenhado com mães como núcleo central do ecossistema. Todas as decisões de produto, UX e funcionalidades são priorizadas considerando as necessidades e experiências das mães.

**SECUNDÁRIO:**
- Profissionais de saúde (pediatras, obstetras, psicólogos)
- Empresas de produtos para maternidade e infância
- Famílias e apoiadores

### Filosofia do Produto

1. **Mães Primeiro:** Toda decisão de produto coloca mães como prioridade máxima
2. **Mobile-First:** Experiência otimizada para dispositivos móveis
3. **Comunidade Real:** Conexões autênticas e suporte genuíno
4. **Produto Antes de Monetização:** Features de produto vêm antes de features de receita
5. **Escalabilidade Sem Retrabalho:** Arquitetura pensada para crescer sem refatoração
6. **Simplicidade Acima de Complexidade:** Preferir soluções simples e diretas

---

## 2. STACK TECNOLÓGICA

### Backend

**Framework:** Node.js + Express  
**Linguagem:** TypeScript  
**ORM:** Prisma  
**Banco de Dados:** PostgreSQL  
**Autenticação:** JWT (Access Token + Refresh Token)  
**Cookies:** HttpOnly (backend controla)  
**Validação:** Zod  
**Segurança:** Helmet, CORS, Rate Limiting  
**Logging:** Winston  

**Versões Principais:**
- Node.js: 18+ (recomendado 20+)
- TypeScript: ^5.3.3
- Express: ^4.18.2
- Prisma: ^5.7.1
- @prisma/client: ^5.7.1

**Estrutura:**
```
backend/
├── src/
│   ├── modules/          # Módulos da aplicação
│   ├── shared/           # Código compartilhado
│   ├── config/           # Configurações
│   ├── middleware/       # Middlewares Express
│   └── server.ts         # Ponto de entrada
├── prisma/
│   ├── schema.prisma     # Schema do banco
│   └── migrations/       # Migrations versionadas
└── package.json
```

### Frontend

**Framework:** Next.js 14 (App Router)  
**Linguagem:** TypeScript  
**UI:** React 18  
**Estilização:** TailwindCSS  
**Validação:** Zod + React Hook Form  
**PWA:** next-pwa (configurado)  
**Build:** Next.js (otimizado para produção)  

**Versões Principais:**
- Next.js: ^14.2.35
- React: ^18.2.0
- TypeScript: ^5.3.3
- TailwindCSS: ^3.4.1
- next-pwa: ^5.6.0

**Estrutura:**
```
frontend/
├── src/
│   ├── app/              # App Router (Next.js 14)
│   ├── components/       # Componentes React
│   ├── hooks/            # Custom hooks
│   ├── providers/        # Context providers
│   ├── services/         # Serviços (API clients)
│   ├── utils/            # Utilitários
│   └── styles/           # Estilos globais
├── public/               # Assets estáticos
│   ├── manifest.json     # PWA manifest
│   └── icons/            # Ícones PWA
└── package.json
```

### Infraestrutura

**Backend Hosting:** Railway  
**Frontend Hosting:** Vercel  
**Banco de Dados:** PostgreSQL (Railway)  
**Deploy:** Automático via GitHub  
**Migrations:** Aplicadas automaticamente via `prestart` (Railway)  

---

## 3. AMBIENTES

### Produção

**Backend:**
- URL: `https://maternilove-v2-production.up.railway.app`
- Ambiente: Production
- Banco: PostgreSQL (Railway)
- Migrations: Automáticas via `prestart`

**Frontend:**
- URL: `https://maternilove-v2.vercel.app`
- Ambiente: Production
- Build: Next.js (otimizado)

### Local (Desenvolvimento)

**Backend:**
- Porta: `3000` (default)
- Variáveis: `.env` (não versionado)
- Banco: PostgreSQL local ou remoto

**Frontend:**
- Porta: `3000` (default, Next.js)
- Variáveis: `.env.local` (não versionado)
- Proxy: `/api` → `http://localhost:3000`

### Staging

**Não configurado atualmente.**  
Produção é o único ambiente oficial além de desenvolvimento local.

---

## 4. SISTEMA DE AUTENTICAÇÃO

**Status:** ✅ **DEFINITIVAMENTE LOCKADO**

### Funcionalidades

- ✅ Register (`POST /api/v1/auth/register`)
- ✅ Login (`POST /api/v1/auth/login`)
- ✅ Refresh Token (`POST /api/v1/auth/refresh`)
- ✅ Logout (`POST /api/v1/auth/logout`)
- ✅ JWT Access Token (short-lived, 15min)
- ✅ Refresh Token (long-lived, 30 dias, rotacionado)
- ✅ Sessões persistidas em `AuthSession`
- ✅ Cookies HttpOnly (backend controla)
- ✅ Validação de tokens
- ✅ Revogação de sessões

### O Que NÃO Pode Ser Alterado

- ❌ Fluxo de login
- ❌ Fluxo de register
- ❌ Fluxo de refresh
- ❌ Fluxo de logout
- ❌ Estrutura de tokens
- ❌ Mecanismo de cookies
- ❌ Contratos de API (payloads, respostas)

### Requisitos para Quebra de Lock

Aprovação obrigatória do chat **00_MASTER**.

---

## 5. RBAC (ROLE-BASED ACCESS CONTROL)

### Backend (LOCK RBAC 2)

**Status:** ✅ **IMPLEMENTADO**

**Funcionalidades:**
- ✅ Middleware `authorize` (valida roles)
- ✅ Endpoint de onboarding (`POST /api/v1/onboarding/complete`)
- ✅ Campos de onboarding no model User (Prisma)
- ✅ Migration aplicada
- ✅ Proteção de rotas por role

**Roles Suportados:**
- `USER` - Usuário básico (sem acesso ao dashboard)
- `MOTHER` - Mãe (requer onboarding)
- `PROFESSIONAL` - Profissional (requer onboarding)
- `COMPANY` - Empresa (requer onboarding)
- `ADMIN` - Administrador (sem onboarding)
- `SUPER_ADMIN` - Super Administrador (sem onboarding)

**Campos de Onboarding (User model):**
- `onboardingCompleted` (Boolean, default: false)
- `onboardingRole` (UserRole?, nullable)
- `onboardingAt` (DateTime?, nullable)

### Frontend (LOCK RBAC 1)

**Status:** ✅ **FECHADO E TRAVADO**

**Funcionalidades:**
- ✅ Utilitário central de RBAC (`utils/rbac.ts`)
- ✅ AuthProvider estendido (role, onboardingCompleted)
- ✅ ProtectedRoute com verificação de role
- ✅ Páginas de onboarding (mother, professional, company)
- ✅ Redirecionamento baseado em role e onboarding
- ✅ Persistência de onboarding (localStorage, frontend-only)

---

## 6. PWA (PROGRESSIVE WEB APP)

**Status:** ✅ **LOCK PWA 1 - FECHADO E TRAVADO**

### Funcionalidades

- ✅ Manifest.json configurado
- ✅ Service Worker registrado (next-pwa)
- ✅ Meta tags mobile (iOS e Android)
- ✅ Cache de assets estáticos (imagens, JS, CSS)
- ✅ APIs NÃO são cacheadas (NetworkOnly)
- ✅ Hook de instalação preparado (`usePWAInstall`)

### Estratégias de Cache

- **Assets estáticos:** CacheFirst (30 dias para imagens, 7 dias para JS/CSS)
- **APIs autenticadas:** NetworkOnly (nunca cachear)
- **HTML shell:** NetworkFirst com fallback

### Ícones Necessários

Os ícones PWA precisam ser criados e adicionados em `public/icons/`:
- `icon-192x192.png`
- `icon-256x256.png`
- `icon-384x384.png`
- `icon-512x512.png`
- `icon-maskable-512x512.png`

---

## 7. LOCKS EXISTENTES

### Lista Completa de LOCKS

#### Backend

1. **Auth (Autenticação)** - ✅ **DEFINITIVAMENTE LOCKADO**
   - Login, Register, Refresh, Logout
   - Tokens JWT
   - Cookies HttpOnly
   - Contratos de API

2. **ErrorCatalog** - ✅ **LOCKADO** (apenas adições permitidas)
   - Códigos de erro padronizados
   - HTTP status mappings

#### Frontend

1. **LOCK FRONTEND 1** - ✅ **FECHADO E TRAVADO**
   - Modo Base
   - Estrutura base do Next.js

2. **LOCK FRONTEND 2A** - ✅ **FECHADO E TRAVADO**
   - Auth Real Isolado
   - Register e Login reais

3. **LOCK FRONTEND FINAL** - ✅ **FECHADO E TRAVADO**
   - Sistema de Autenticação Completo
   - AuthProvider definitivo
   - ProtectedRoute funcional

4. **LOCK RBAC 1** - ✅ **FECHADO E TRAVADO**
   - RBAC + Onboarding no Frontend
   - Utilitário central de RBAC
   - Páginas de onboarding

5. **LOCK PWA 1** - ✅ **FECHADO E TRAVADO**
   - PWA Completo
   - Service Worker
   - Manifest.json

---

## 8. O QUE ESTÁ PRONTO

### Backend

- ✅ Sistema de autenticação completo e funcional
- ✅ RBAC no backend (middleware `authorize`)
- ✅ Endpoint de onboarding (`POST /api/v1/onboarding/complete`)
- ✅ Módulos estruturais (journey, social, community, marketplace)
- ✅ ErrorCatalog padronizado
- ✅ CORS configurado
- ✅ Rate limiting
- ✅ Health checks
- ✅ Migrations versionadas e funcionais
- ✅ Deploy automático no Railway

### Frontend

- ✅ Estrutura base do Next.js 14 (App Router)
- ✅ Sistema de autenticação completo
- ✅ RBAC no frontend
- ✅ Páginas de onboarding
- ✅ Protected routes
- ✅ PWA configurado
- ✅ Service Worker funcionando
- ✅ Deploy automático no Vercel

### Infraestrutura

- ✅ PostgreSQL configurado (Railway)
- ✅ Backend deploy automático (Railway)
- ✅ Frontend deploy automático (Vercel)
- ✅ Migrations aplicadas automaticamente

---

## 9. O QUE NÃO ESTÁ PRONTO

### Funcionalidades Core (Não Implementadas)

- ❌ Jornada do usuário completa (backend pronto, frontend não integrado)
- ❌ Social feed completo (backend pronto, frontend não integrado)
- ❌ Comunidade completa (backend pronto, frontend não integrado)
- ❌ Marketplace completo (backend pronto, frontend não integrado)
- ❌ Notificações em tempo real
- ❌ Chat direto entre usuários
- ❌ Sistema de avaliações completo
- ❌ Dashboard completo para mães

### Features de Produto (Planejadas)

- ❌ Conteúdo educacional
- ❌ Acompanhamento de gravidez
- ❌ Calendário de vacinação
- ❌ Comunidade de apoio
- ❌ Marketplace de produtos

### Features de Receita (Não Priorizadas)

- ❌ Assinaturas premium
- ❌ Produtos pagos
- ❌ Parcerias comerciais
- ❌ Monetização em geral

**Nota:** Features de receita não são priorizadas conforme filosofia do produto (Produto antes de Monetização).

---

## 10. O QUE É PROPOSITALMENTE NÃO LIBERADO

### Segurança

- **Secrets em produção:** Mantidos apenas no Railway/Vercel
- **Tokens:** Não expostos em logs ou frontend
- **Cookies:** HttpOnly (inacessíveis via JavaScript)

### Funcionalidades

- **APIs cacheadas:** Propositalmente NÃO cacheadas (NetworkOnly)
- **Ícones PWA:** Placeholders até criação de ícones oficiais
- **Ambiente staging:** Não configurado (apenas produção)

---

## 11. O QUE NÃO PODE SER ALTERADO SEM APROVAÇÃO

### Backend

- ❌ Sistema de autenticação (Auth LOCKADO)
- ❌ Contratos de API existentes (payloads, respostas)
- ❌ Estrutura de tokens (JWT, cookies)
- ❌ Middleware de autenticação (`authenticate`)
- ❌ ErrorCatalog existente (apenas adições permitidas)
- ❌ Versionamento de API (`/api/v1/*`)

### Frontend

- ❌ Sistema de autenticação (LOCK FRONTEND FINAL)
- ❌ RBAC no frontend (LOCK RBAC 1)
- ❌ PWA (LOCK PWA 1)
- ❌ Estrutura de rotas existentes

### Infraestrutura

- ❌ Configuração de deploy automático (Railway/Vercel)
- ❌ Processo de migrations automáticas
- ❌ Variáveis de ambiente de produção

### Requisitos para Alteração

**Aprovação obrigatória do chat responsável + 00_MASTER (se crítico).**

---

## 12. BANCO DE DADOS

### Modelos Principais

**Total:** 45+ modelos Prisma

**Principais:**
- `User` - Usuários e autenticação
- `AuthSession` - Sessões de autenticação
- `Journey` - Jornada do usuário
- `Moment` - Momentos da jornada
- `SocialPost` - Posts sociais
- `SocialLike` - Curtidas
- `SocialComment` - Comentários
- `CommunityPost` - Posts da comunidade
- `Professional` - Profissionais de saúde
- `Company` - Empresas parceiras
- `Product` - Produtos do marketplace
- `Order` - Pedidos
- `Notification` - Notificações

### Migrations

- **Total de migrations:** Múltiplas (versionadas)
- **Última migration relevante:** `20250109220000_add_onboarding_fields`
- **Aplicação:** Automática via `prestart` (Railway) ou manual via `prisma migrate deploy`

---

## 13. SEGURANÇA

### Implementado

- ✅ JWT com expiração curta (Access Token: 15min)
- ✅ Refresh Token rotacionado (30 dias)
- ✅ Cookies HttpOnly (não acessíveis via JS)
- ✅ Rate limiting (express-rate-limit)
- ✅ Helmet (headers de segurança)
- ✅ CORS configurado (apenas domínios permitidos)
- ✅ Validação de input (Zod)
- ✅ Senhas hasheadas (bcryptjs)

### Em Produção

- ✅ Variáveis de ambiente protegidas (Railway/Vercel)
- ✅ HTTPS obrigatório
- ✅ Secrets rotacionados quando necessário

---

## 14. PRONTIDÃO

### Para Desenvolvimento Local

✅ **PRONTO**

- Setup local funcional
- Scripts de bootstrap disponíveis
- Documentação completa

### Para Testes Fechados (Beta)

⚠️ **PARCIALMENTE PRONTO**

- Funcionalidades core não implementadas
- UX/UI precisa de refinamento
- Fluxos de produto incompletos

### Para Pré-Cadastro

❌ **NÃO PRONTO**

- Landing page não implementada
- Formulário de pré-cadastro não criado
- Email marketing não configurado

### Para Parceiros

❌ **NÃO PRONTO**

- Dashboard de parceiros não implementado
- Integrações comerciais não criadas
- Documentação de API para parceiros não disponível

### Para Investidores

⚠️ **PARCIALMENTE PRONTO**

- Documentação técnica completa
- Snapshot autoritativo disponível
- Produto funcional mas incompleto
- Funcionalidades core não implementadas

---

## 15. PRÓXIMOS PASSOS (CONFORME ROADMAP)

### Curto Prazo

1. Integração frontend-backend dos módulos existentes
2. Refinamento de UX/UI
3. Criação de conteúdo educacional
4. Testes com usuários beta

### Médio Prazo

1. Funcionalidades core completas
2. Sistema de notificações
3. Chat direto
4. Dashboard completo

### Longo Prazo

1. Marketplace completo
2. Sistema de avaliações
3. Parcerias comerciais
4. Features de receita (conforme priorização)

---

## 16. CONCLUSÃO DO SNAPSHOT

**Este é o estado oficial do projeto Materni_Love – V2 em 2025-01-09.**

Este snapshot é **AUTORITATIVO** e **CONGELADO**. Ele representa a verdade técnica do projeto neste momento.

**Qualquer alteração neste snapshot deve:**
1. Refletir mudanças reais no projeto
2. Ser documentada claramente
3. Manter histórico de versões
4. Ser validada pelo chat responsável

---

**FIM DO SNAPSHOT**
