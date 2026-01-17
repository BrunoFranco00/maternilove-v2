# PROJECT_GOVERNANCE.md
## Materni_Love – V2
## Fonte Única da Verdade (Single Source of Truth)

**Versão:** 1.0  
**Data de Criação:** 2025-01-09  
**Última Atualização:** 2025-01-09  
**Status:** AUTORITATIVO E DEFINITIVO

---

## ⚠️ DECLARAÇÃO DE AUTORIDADE

Este documento é a **FONTE ÚNICA DA VERDADE** (Single Source of Truth) sobre o projeto Materni_Love – V2.

**Regras Absolutas:**
- Nenhuma decisão pode contradizer este documento
- Nenhuma evolução pode ignorar este documento
- Todas as mudanças neste documento devem ser explícitas e documentadas
- Qualquer contradição entre este documento e outro material deve ser resolvida a favor deste documento

**Leia este documento ANTES de:**
- Criar um novo chat
- Implementar uma nova feature
- Alterar arquitetura existente
- Fazer decisões de produto
- Modificar código lockado

---

## 1. VISÃO GERAL DO PROJETO

### O que é o Materni_Love – V2

O **Materni_Love – V2** é uma plataforma digital completa e mobile-first focada em apoiar mães durante toda sua jornada de maternidade. O projeto oferece uma experiência integrada que combina comunidade, recursos educacionais, marketplace de produtos relacionados à maternidade e conexão com profissionais de saúde.

### Qual Problema Resolve

**Problema Principal:**
Mães enfrentam dificuldades para encontrar informações confiáveis, comunidade de apoio, produtos adequados e profissionais de saúde qualificados em um único lugar durante sua jornada de maternidade.

**Solução:**
Uma plataforma unificada que centraliza recursos, comunidade, produtos e serviços especializados, oferecendo suporte contínuo desde a gravidez até os primeiros anos da criança.

### Público Prioritário

**Público Primário:** **MÃES**

O projeto foi desenhado com mães como núcleo central do ecossistema. Todas as decisões de produto, UX e funcionalidades são priorizadas considerando as necessidades e experiências das mães.

**Públicos Secundários:**
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

### O que o Projeto NÃO é

- ❌ Marketplace genérico de produtos
- ❌ Rede social genérica
- ❌ Aplicativo focado em profissionais ou empresas
- ❌ Plataforma de e-learning tradicional
- ❌ Sistema de agendamento médico isolado
- ❌ Ferramenta de gestão de clínica

---

## 2. PRINCÍPIOS FUNDAMENTAIS

### Princípios Inegociáveis

Estes princípios **NÃO PODEM** ser violados ou ignorados em nenhuma circunstância:

#### 2.1 Governança Rígida
- **Todas as decisões seguem processos definidos**
- **Locks não podem ser quebrados sem autorização explícita**
- **Redirecionamento entre chats é obrigatório**
- **Documentação é obrigatória e atualizada**

#### 2.2 Produto Antes de Monetização
- Features de produto vêm antes de features de receita
- Monetização não deve comprometer experiência das mães
- Mães nunca devem sentir que são produto ou monetização
- Funcionalidades pagas são claramente identificadas e opcionais

#### 2.3 Mães Como Núcleo do Ecossistema
- Todas as decisões consideram impacto nas mães primeiro
- UX é otimizada para necessidades e contextos das mães
- Feedback de mães tem peso maior que feedback de outros stakeholders
- Produto evolui baseado em necessidades reais das mães

#### 2.4 Escalabilidade Sem Retrabalho
- Arquitetura é pensada para escalar desde o início
- Tecnologias escolhidas suportam crescimento
- Refatorações massivas são evitadas
- Evolução incremental é preferida a revoluções

#### 2.5 Simplicidade Acima de Complexidade
- Soluções simples são preferidas a soluções complexas
- Overengineering é proibido
- Código limpo e direto é valorizado
- Complexidade é justificada apenas quando necessária

#### 2.6 Estabilidade e Previsibilidade
- Sistema lockado não pode ser alterado sem autorização
- Quebras de compatibilidade são evitadas
- Contratos de API são estáveis
- Mudanças são comunicadas e documentadas

#### 2.7 Segurança e Privacidade
- Dados de mães são protegidos com máxima segurança
- Conformidade com LGPD/GDPR é obrigatória
- Autenticação e autorização são robustas
- Dados sensíveis nunca são expostos

---

## 3. STATUS ATUAL DO PROJETO

### Backend

**Status:** ✅ **LOCKADO E EM PRODUÇÃO**

**Tecnologias:**
- Node.js + Express
- TypeScript
- Prisma ORM
- PostgreSQL
- JWT (Access Token + Refresh Token)
- Cookies HttpOnly

**Funcionalidades Implementadas:**
- ✅ Sistema de autenticação completo (register, login, refresh, logout)
- ✅ RBAC no backend (middleware `authorize`)
- ✅ Módulo de onboarding (`POST /api/v1/onboarding/complete`)
- ✅ Rotas de API versionadas (`/api/v1/*`)
- ✅ ErrorCatalog padronizado
- ✅ CORS configurado
- ✅ Health checks

**O que PODE ser alterado:**
- ✅ Novos módulos (journey, social, community, marketplace)
- ✅ Novas rotas dentro de módulos existentes
- ✅ Novas funcionalidades que não quebrem contratos

**O que NÃO PODE ser alterado:**
- ❌ Sistema de autenticação (login, register, refresh, logout)
- ❌ Contratos de API existentes (payloads, respostas)
- ❌ Estrutura de tokens (JWT, cookies)
- ❌ Middleware de autenticação (`authenticate`)
- ❌ ErrorCatalog existente (apenas adições)
- ❌ Versionamento de API (`/api/v1/*`)

**Deploy:**
- Plataforma: Railway
- URL: `https://maternilove-v2-production.up.railway.app`
- Banco: PostgreSQL (Railway)
- Migrations: Aplicadas automaticamente via `prestart`

---

### Auth (Autenticação e Autorização)

**Status:** ✅ **DEFINITIVAMENTE LOCKADO**

**Funcionalidades Existentes:**
- ✅ Register (`POST /api/v1/auth/register`)
- ✅ Login (`POST /api/v1/auth/login`)
- ✅ Refresh Token (`POST /api/v1/auth/refresh`)
- ✅ Logout (`POST /api/v1/auth/logout`)
- ✅ JWT Access Token (short-lived)
- ✅ Refresh Token (long-lived, rotacionado)
- ✅ Sessões persistidas em `AuthSession`
- ✅ Cookies HttpOnly (backend controla)
- ✅ Validação de tokens
- ✅ Revogação de sessões

**Proibições Explícitas:**
- ❌ NÃO alterar fluxo de login
- ❌ NÃO alterar fluxo de register
- ❌ NÃO alterar fluxo de refresh
- ❌ NÃO alterar fluxo de logout
- ❌ NÃO alterar estrutura de tokens
- ❌ NÃO alterar mecanismo de cookies
- ❌ NÃO criar novos endpoints de auth sem autorização
- ❌ NÃO modificar contratos de payload ou resposta

**Backend (Auth):**
- Controller: `backend/src/modules/auth/controllers/auth.controller.ts`
- Service: `backend/src/modules/auth/services/auth.service.ts`
- Repository: `backend/src/modules/auth/repositories/auth.repository.ts`
- Routes: `backend/src/modules/auth/routes.ts`
- Middleware: `backend/src/middleware/auth.middleware.ts`

**Frontend (Auth):**
- AuthProvider: `frontend/src/providers/AuthProvider.tsx`
- AuthService: `frontend/src/services/authService.ts`
- HttpClient: `frontend/src/services/httpClient.ts`

---

### Frontend

**Status:** ✅ **MULTI-LOCK (Fases Concluídas)**

**Stack:**
- Next.js 14 (App Router)
- TypeScript
- TailwindCSS
- React 18

**LOCKs Implementados:**

#### LOCK FRONTEND 1 — Modo Base
**Status:** ✅ FECHADO E TRAVADO

**O que foi implementado:**
- ✅ Estrutura base do Next.js
- ✅ Layout e componentes básicos
- ✅ Páginas públicas (login, register)
- ✅ Integração bloqueada propositalmente

**Documentação:** Disponível em documentação técnica do projeto

---

#### LOCK FRONTEND 2A — Auth Real Isolado
**Status:** ✅ FECHADO E TRAVADO

**O que foi implementado:**
- ✅ Register real (integração com backend)
- ✅ Login real (integração com backend)
- ✅ HttpClient configurado para `/auth/register` e `/auth/login`
- ✅ Feedback visual (loading, erro, sucesso)
- ❌ Sessão ainda não persistente (proposital)

**Documentação:** Disponível em documentação técnica do projeto

---

#### LOCK FRONTEND FINAL — Sistema de Autenticação Completo
**Status:** ✅ FECHADO E TRAVADO

**O que foi implementado:**
- ✅ AuthProvider definitivo (sessão persistente)
- ✅ Refresh automático (valida sessão no mount)
- ✅ ProtectedRoute funcional (guards de rota)
- ✅ Logout limpo (chama backend e redireciona)
- ✅ Sessão persiste após reload (F5)
- ✅ Redirecionamento pós-login funcional

**Documentação:** `AUDITORIA_AUTH_COMPLETA.md`

---

#### LOCK RBAC 1 — RBAC + Onboarding no Frontend
**Status:** ✅ FECHADO E TRAVADO

**O que foi implementado:**
- ✅ Utilitário central de RBAC (`utils/rbac.ts`)
- ✅ AuthProvider estendido (role, onboardingCompleted)
- ✅ ProtectedRoute com verificação de role
- ✅ Páginas de onboarding (mother, professional, company)
- ✅ Redirecionamento baseado em role e onboarding
- ✅ Persistência de onboarding (localStorage, frontend-only)

**Roles Suportados:**
- USER (sem acesso ao dashboard)
- MOTHER (requer onboarding)
- PROFESSIONAL (requer onboarding)
- COMPANY (requer onboarding)
- ADMIN (sem onboarding)
- SUPER_ADMIN (sem onboarding)

**Documentação:** `DOSSIE_TECNICO_LOCK_RBAC_1.md`

---

#### LOCK PWA 1 — Progressive Web App
**Status:** ✅ FECHADO E TRAVADO

**O que foi implementado:**
- ✅ Manifest.json configurado
- ✅ Service Worker registrado (next-pwa)
- ✅ Meta tags mobile (iOS e Android)
- ✅ Cache de assets estáticos (imagens, JS, CSS)
- ✅ APIs NÃO são cacheadas (NetworkOnly)
- ✅ Hook de instalação preparado (`usePWAInstall`)

**Estratégias de Cache:**
- Assets estáticos: CacheFirst
- APIs autenticadas: NetworkOnly (nunca cachear)
- HTML shell: NetworkFirst

**Documentação:** `frontend/PWA_SETUP.md`

---

### RBAC (Backend)

**Status:** ✅ **LOCK RBAC 2 — IMPLEMENTADO**

**Funcionalidades:**
- ✅ Middleware `authorize` (já existia, validado)
- ✅ Endpoint de onboarding (`POST /api/v1/onboarding/complete`)
- ✅ Campos de onboarding no model User (Prisma)
- ✅ Migration aplicada
- ✅ Proteção de rotas por role

**Documentação:** `RELATORIO_LOCK_RBAC_2.md`

---

### Infraestrutura

**Backend (Railway):**
- ✅ Deploy automático (GitHub → Railway)
- ✅ PostgreSQL configurado
- ✅ Variáveis de ambiente configuradas
- ✅ Health checks funcionando
- ✅ Migrations aplicadas automaticamente (`prestart`)

**Frontend (Vercel):**
- ✅ Deploy automático (GitHub → Vercel)
- ✅ Build configurado
- ✅ Variáveis de ambiente configuradas
- ✅ PWA funcionando

**Banco de Dados:**
- ✅ PostgreSQL (Railway)
- ✅ Prisma ORM
- ✅ Migrations versionadas
- ✅ 45+ modelos criados

---

## 4. MODELO DE GOVERNANÇA POR CHATS

Este projeto utiliza um modelo de **governança distribuída por chats especializados**. Cada chat tem um propósito específico e escopo bem definido.

### Regra de Ouro dos Chats

**"Um chat, um propósito, um responsável"**

Cada chat é especializado em uma área específica e não pode invadir outras áreas. Redirecionamento entre chats é obrigatório quando necessário.

---

### 4.1 Chat: 00_MASTER — Visão & Status

**Propósito:**
Chat central de governança, visão estratégica e tomada de decisões finais.

**O que ENTRA neste chat:**
- ✅ Decisões estratégicas finais
- ✅ Aprovação de novos LOCKs
- ✅ Mudanças na governança do projeto
- ✅ Decisões que afetam múltiplos chats
- ✅ Conflitos entre chats que precisam resolução
- ✅ Status geral do projeto
- ✅ Planejamento de roadmap
- ✅ Mudanças de filosofia de produto

**O que NÃO ENTRA neste chat:**
- ❌ Implementação técnica de features
- ❌ Detalhes de código
- ❌ Debug de problemas específicos
- ❌ Configuração de ferramentas

**Tipo de Decisões Permitidas:**
- Aprovar ou rejeitar novos LOCKs
- Definir prioridades estratégicas
- Resolver conflitos entre chats
- Aprovar mudanças na governança
- Decidir sobre evolução do produto

**Tipo de Decisões Proibidas:**
- Implementação direta de código
- Configuração técnica de ferramentas
- Debug de problemas operacionais

**Responsável:** CTO / Product Owner / Líder Técnico

---

### 4.2 Chat: Materni_Love – V2 – Frontend & UX Flows

**Propósito:**
Todas as decisões, implementações e evoluções relacionadas ao frontend e fluxos de UX.

**O que ENTRA neste chat:**
- ✅ Implementação de componentes React
- ✅ Criação de páginas Next.js
- ✅ Fluxos de navegação
- ✅ Estados de UI
- ✅ Integração com APIs (consumo apenas)
- ✅ Responsividade e mobile-first
- ✅ Performance do frontend
- ✅ PWA e service workers
- ✅ Cache no frontend
- ✅ Validações de formulários (frontend)

**O que NÃO ENTRA neste chat:**
- ❌ Decisões de backend
- ❌ Criação ou alteração de endpoints
- ❌ Decisões de banco de dados
- ❌ Lógica de negócio que deve estar no backend
- ❌ Autenticação no backend (apenas consumo)

**Tipo de Decisões Permitidas:**
- Criar novos componentes
- Criar novas páginas
- Modificar fluxos de UX
- Otimizar performance frontend
- Implementar features de UI
- Ajustar estilos e layouts

**Tipo de Decisões Proibidas:**
- Alterar contratos de API
- Criar endpoints no backend
- Alterar lógica de autenticação no backend
- Modificar schemas do banco de dados

**Responsável:** Frontend Developer / UX Designer

**Locks Relacionados:**
- LOCK FRONTEND 1, 2A, FINAL
- LOCK RBAC 1 (frontend)
- LOCK PWA 1

---

### 4.3 Chat: Materni_Love – V2 – Backend

**Propósito:**
Todas as decisões, implementações e evoluções relacionadas ao backend, APIs e lógica de negócio.

**O que ENTRA neste chat:**
- ✅ Criação de novos endpoints
- ✅ Implementação de módulos (journey, social, community, marketplace)
- ✅ Lógica de negócio
- ✅ Validações no backend
- ✅ Queries Prisma
- ✅ Migrations do banco
- ✅ Middleware customizado
- ✅ Integrações externas (APIs, serviços)
- ✅ Performance do backend
- ✅ Escalabilidade

**O que NÃO ENTRA neste chat:**
- ❌ Decisões de frontend
- ❌ Implementação de componentes React
- ❌ Alteração de UI
- ❌ Decisões de produto (exceto aspectos técnicos)
- ❌ Autenticação (já lockado)

**Tipo de Decisões Permitidas:**
- Criar novos módulos
- Criar novos endpoints
- Implementar lógica de negócio
- Criar migrations
- Otimizar queries
- Configurar integrações

**Tipo de Decisões Proibidas:**
- Alterar sistema de autenticação lockado
- Quebrar contratos de API existentes
- Modificar ErrorCatalog sem adições
- Alterar estrutura de tokens

**Responsável:** Backend Developer / Software Architect

**Locks Relacionados:**
- Auth (LOCKADO)
- LOCK RBAC 2

---

### 4.4 Chat: Materni_Love – V2 – Infra & DevOps

**Propósito:**
Decisões e configurações relacionadas a infraestrutura, deploy, CI/CD e operações.

**O que ENTRA neste chat:**
- ✅ Configuração de Railway
- ✅ Configuração de Vercel
- ✅ Configuração de PostgreSQL
- ✅ Variáveis de ambiente
- ✅ CI/CD pipelines
- ✅ Deploy automático
- ✅ Monitoramento e logs
- ✅ Backup e disaster recovery
- ✅ Performance de infraestrutura
- ✅ Escalabilidade de infraestrutura

**O que NÃO ENTRA neste chat:**
- ❌ Decisões de código
- ❌ Implementação de features
- ❌ Decisões de produto
- ❌ Configuração de lógica de negócio

**Tipo de Decisões Permitidas:**
- Configurar serviços de deploy
- Ajustar variáveis de ambiente
- Configurar CI/CD
- Otimizar recursos de infraestrutura
- Configurar monitoramento

**Tipo de Decisões Proibidas:**
- Modificar código de aplicação
- Alterar lógica de negócio
- Decidir sobre features de produto

**Responsável:** DevOps Engineer / SRE

---

### 4.5 Chat: Materni_Love – V2 – Automações & Integrações

**Propósito:**
Automações, integrações com serviços externos e processos automatizados.

**O que ENTRA neste chat:**
- ✅ Integrações com APIs externas
- ✅ Webhooks
- ✅ Automações de processo
- ✅ Jobs agendados
- ✅ Notificações automatizadas
- ✅ Sincronização de dados
- ✅ Scripts de manutenção

**O que NÃO ENTRA neste chat:**
- ❌ Decisões de produto core
- ❌ Alteração de lógica de negócio principal
- ❌ Mudanças arquiteturais fundamentais

**Tipo de Decisões Permitidas:**
- Criar novas integrações
- Configurar automações
- Criar scripts de manutenção
- Configurar webhooks

**Tipo de Decisões Proibidas:**
- Modificar core do produto
- Alterar lógica de negócio crítica

**Responsável:** Backend Developer / Automation Engineer

---

### 4.6 Chat: Materni_Love – V2 – Operações & Crescimento

**Propósito:**
Decisões relacionadas a monetização, marketing, crescimento, operações e métricas de negócio.

**O que ENTRA neste chat:**
- ✅ Decisões de monetização
- ✅ Estratégias de marketing
- ✅ Features de receita
- ✅ Parcerias comerciais
- ✅ Métricas de negócio
- ✅ Análise de dados de produto
- ✅ Estratégias de crescimento
- ✅ Operações comerciais

**O que NÃO ENTRA neste chat:**
- ❌ Decisões técnicas de implementação
- ❌ Alteração de código (exceto features de receita)
- ❌ Decisões de produto core (sem impacto em mães)

**Tipo de Decisões Permitidas:**
- Definir estratégias de monetização
- Criar features de receita (com validação técnica)
- Analisar métricas de negócio
- Definir parcerias

**Tipo de Decisões Proibidas:**
- Modificar produto core sem aprovação
- Implementar features que prejudiquem experiência das mães
- Alterar arquitetura técnica

**Responsável:** Product Manager / Business Analyst

**Regra Especial:**
Todas as features de monetização devem ser validadas tecnicamente e não podem comprometer a experiência das mães.

---

### 4.7 Chat: Materni_Love – V2 – Core Product (Mães)

**Propósito:**
Decisões relacionadas ao produto core, experiências das mães, features de produto e evolução da plataforma do ponto de vista do usuário.

**O que ENTRA neste chat:**
- ✅ Decisões de produto core
- ✅ Features para mães
- ✅ Fluxos de UX para mães
- ✅ Jornada do usuário
- ✅ Experiências do produto
- ✅ Priorização de features
- ✅ Feedback de mães
- ✅ Pesquisas e validações

**O que NÃO ENTRA neste chat:**
- ❌ Implementação técnica direta
- ❌ Detalhes de código
- ❌ Decisões de infraestrutura
- ❌ Decisões de monetização (exceto impacto em produto)

**Tipo de Decisões Permitidas:**
- Priorizar features para mães
- Definir fluxos de produto
- Validar hipóteses de produto
- Decidir sobre jornada do usuário
- Analisar feedback de mães

**Tipo de Decisões Proibidas:**
- Implementar código diretamente
- Decidir sobre tecnologias técnicas
- Alterar arquitetura sem validação técnica

**Responsável:** Product Owner / UX Designer / User Researcher

**Regra Especial:**
Este chat tem **prioridade máxima** em conflitos relacionados a experiência das mães. Decisões deste chat podem sobrepor outras áreas quando o foco é melhorar a experiência das mães.

---

## 5. REGRA DE REDIRECIONAMENTO ENTRE CHATS

### Princípio Fundamental

**"Nenhum chat pode invadir o escopo de outro chat. Redirecionamento é obrigatório."**

Quando uma decisão ou tarefa está fora do escopo do chat atual, ela **DEVE** ser redirecionada para o chat apropriado.

### Regras de Redirecionamento

#### Backend → Chat Backend
**Redirecionar quando:**
- Usuário quer criar novo endpoint
- Usuário quer modificar lógica de negócio
- Usuário quer criar migration
- Usuário quer modificar queries Prisma
- Decisão técnica de backend

**Exemplo:**
> "Você está no chat Frontend. Para criar o endpoint `/api/v1/journey`, você precisa fazer isso no chat Backend. Redirecione para: Materni_Love – V2 – Backend"

---

#### Frontend → Chat Frontend
**Redirecionar quando:**
- Usuário quer criar componente React
- Usuário quer criar nova página
- Usuário quer modificar UX
- Usuário quer ajustar estilos
- Decisão de interface

**Exemplo:**
> "Você está no chat Backend. Para criar o componente `JourneyCard`, você precisa fazer isso no chat Frontend. Redirecione para: Materni_Love – V2 – Frontend & UX Flows"

---

#### Produto → Chat Core Product (Mães)
**Redirecionar quando:**
- Usuário quer decidir sobre feature de produto
- Usuário quer priorizar funcionalidades
- Decisão afeta experiência das mães
- Validação de hipótese de produto

**Exemplo:**
> "Para decidir se vamos implementar a feature X ou Y, isso é uma decisão de produto que deve ser feita no chat Core Product (Mães). Redirecione."

---

#### Infra → Chat Infra & DevOps
**Redirecionar quando:**
- Usuário quer configurar deploy
- Usuário quer ajustar variáveis de ambiente
- Usuário quer configurar CI/CD
- Decisão de infraestrutura

**Exemplo:**
> "Para configurar o deploy no Railway, isso é responsabilidade do chat Infra & DevOps. Redirecione."

---

#### Monetização → Chat Operações & Crescimento
**Redirecionar quando:**
- Usuário quer implementar feature de receita
- Decisão de monetização
- Estratégia comercial

**Exemplo:**
> "Para implementar sistema de assinaturas premium, isso é uma decisão de operações e crescimento. Redirecione para o chat apropriado."

---

#### Estratégico → Chat 00_MASTER
**Redirecionar quando:**
- Decisão afeta múltiplos chats
- Conflito entre chats
- Aprovação de novo LOCK
- Mudança na governança

**Exemplo:**
> "Esta decisão afeta tanto Frontend quanto Backend. Isso precisa ser aprovado no chat 00_MASTER primeiro. Redirecione."

---

### Procedimento de Redirecionamento

Quando um redirecionamento é necessário:

1. **Identificar o chat correto** baseado nas regras acima
2. **Explicar claramente** por que o redirecionamento é necessário
3. **Fornecer contexto** que o usuário precisa levar para o novo chat
4. **Indicar o nome exato do chat** para redirecionamento

**Formato Padrão:**
```
⚠️ REDIRECIONAMENTO NECESSÁRIO

Esta tarefa está fora do escopo deste chat.

Chat Correto: [Nome do Chat]

Razão: [Explicação clara]

Contexto para o novo chat:
- [Contexto 1]
- [Contexto 2]
```

---

## 6. MODELO DE LOCKS

### O que é um LOCK

Um **LOCK** é um estado de "travamento" de uma parte específica do sistema, indicando que aquela parte está **estável, testada, validada e não deve ser alterada** sem autorização explícita.

### Tipos de LOCK

#### LOCK FRONTEND
Trava funcionalidades, componentes ou fluxos do frontend.

**Exemplos:**
- LOCK FRONTEND 1 — Modo Base
- LOCK FRONTEND 2A — Auth Real Isolado
- LOCK FRONTEND FINAL — Sistema de Autenticação Completo

**O que significa:**
- Código lockado não pode ser alterado sem autorização
- Funcionalidades lockadas são estáveis e funcionais
- Mudanças requerem validação e aprovação

---

#### LOCK BACKEND
Trava módulos, endpoints ou funcionalidades do backend.

**Exemplos:**
- Auth (autenticação) — DEFINITIVAMENTE LOCKADO
- ErrorCatalog — LOCKADO (apenas adições permitidas)

**O que significa:**
- Endpoints lockados não podem ser alterados
- Contratos de API são imutáveis
- Mudanças requerem nova versão de API

---

#### LOCK RBAC
Trava sistema de controle de acesso baseado em roles.

**Exemplos:**
- LOCK RBAC 1 — RBAC + Onboarding no Frontend
- LOCK RBAC 2 — RBAC Real no Backend

**O que significa:**
- Permissões lockadas são estáveis
- Roles não podem ser alterados sem aprovação
- Sistema de autorização é confiável

---

#### LOCK PWA
Trava configurações e funcionalidades de Progressive Web App.

**Exemplos:**
- LOCK PWA 1 — PWA Completo

**O que significa:**
- Service Worker está configurado e funcionando
- Cache strategies são estáveis
- Manifest está correto

---

#### LOCK PRODUTO
Trava decisões e features de produto.

**Exemplos:**
- Filosofia de produto (Mães primeiro)
- Princípios fundamentais

**O que significa:**
- Decisões de produto são estáveis
- Features lockadas são core do produto
- Mudanças requerem validação de impacto

---

### Quando um LOCK Pode Ser Criado

Um LOCK pode ser criado quando:

1. ✅ **Funcionalidade está completa e funcional**
2. ✅ **Testada e validada**
3. ✅ **Documentada adequadamente**
4. ✅ **Aprovada pelo chat apropriado**
5. ✅ **Não tem dependências pendentes**

**Processo de Criação de LOCK:**
1. Implementação completa
2. Testes e validação
3. Documentação técnica
4. Aprovação (chat técnico + 00_MASTER se necessário)
5. Criação do documento de LOCK
6. Declaração oficial de LOCK

---

### Quando um LOCK Pode Ser Quebrado

Um LOCK **NÃO PODE** ser quebrado sem:

1. ✅ **Justificativa técnica clara**
2. ✅ **Aprovação explícita do chat responsável**
3. ✅ **Aprovação do 00_MASTER se for LOCK crítico**
4. ✅ **Plano de migração documentado**
5. ✅ **Validação de impacto**

**Locks que NUNCA podem ser quebrados sem 00_MASTER:**
- Auth (autenticação)
- Princípios fundamentais
- Governança do projeto

**Processo de Quebra de LOCK:**
1. Justificativa técnica/estratégica
2. Proposta de mudança documentada
3. Aprovação do chat responsável
4. Aprovação do 00_MASTER (se necessário)
5. Implementação controlada
6. Validação pós-mudança
7. Atualização de documentação

---

### Quem Libera LOCK

**Apenas o chat 00_MASTER** pode liberar LOCKs críticos.

**Hierarquia de Aprovação:**

1. **LOCK de funcionalidade específica:**
   - Chat técnico responsável pode aprovar
   - 00_MASTER apenas para confirmação

2. **LOCK arquitetural:**
   - Chat técnico responsável propõe
   - 00_MASTER aprova

3. **LOCK crítico (Auth, Governança, Princípios):**
   - Apenas 00_MASTER pode aprovar
   - Processo rigoroso de validação

---

## 7. COMO INICIAR UM NOVO CHAT

### Quando Criar um Novo Chat

Um novo chat **deve ser criado** quando:

1. ✅ Nova área de especialização é necessária
2. ✅ Volume de decisões justifica chat dedicado
3. ✅ Separação clara de responsabilidades é necessária
4. ✅ Aprovado pelo 00_MASTER

Um novo chat **não deve ser criado** quando:

1. ❌ Tarefa pode ser resolvida em chat existente
2. ❌ Apenas uma tarefa pontual
3. ❌ Sem volume suficiente de decisões
4. ❌ Cria overlap com chats existentes

---

### Processo de Criação de Novo Chat

#### Passo 1: Definição do Escopo

Antes de criar o chat, defina claramente:

- **Nome do chat:** Claro e descritivo
- **Propósito:** Uma frase curta e direta
- **O que ENTRA:** Lista clara de responsabilidades
- **O que NÃO ENTRA:** Lista clara de exclusões
- **Responsável:** Quem lidera o chat

#### Passo 2: Validação com 00_MASTER

Solicite aprovação no chat **00_MASTER** com:

- Proposta do novo chat
- Justificativa
- Escopo definido
- Relação com chats existentes

#### Passo 3: Criação do Chat

Após aprovação:

1. Criar chat com nome oficial
2. Colar este documento de governança no início
3. Adicionar seção específica do novo chat (se necessário)
4. Comunicar aos envolvidos

#### Passo 4: Atualização da Governança

Atualizar este documento (`PROJECT_GOVERNANCE.md`) com:

- Nova seção na "Modelo de Governança por Chats"
- Regras de redirecionamento relacionadas
- Manter histórico de mudanças

---

### Template de Contexto Inicial para Novo Chat

Ao criar um novo chat, cole no início:

```markdown
# [Nome do Chat]

## Contexto Inicial

Este chat segue a governança definida em `PROJECT_GOVERNANCE.md`.

**Propósito:** [Propósito do chat]

**Escopo:**
- ✅ [O que entra]
- ❌ [O que não entra]

**Responsável:** [Nome/responsável]

**Locks Relacionados:**
- [Lista de locks relevantes]

---

[Começar descrição da tarefa atual]
```

---

## 8. POSTURA ESPERADA DO ASSISTENTE / IA

### Princípios Fundamentais

O assistente deve atuar com a **postura de um CTO / PO / Arquiteto**, não como um executor passivo.

---

### O que o Assistente DEVE Fazer

#### 8.1 Ser Crítico e Imparcial
- ✅ **Questionar decisões que violam governança**
- ✅ **Alertar sobre riscos técnicos**
- ✅ **Sugerir alternativas quando apropriado**
- ✅ **Validar alinhamento com princípios fundamentais**

**Exemplo:**
> "Esta implementação viola o princípio 'Produto antes de Monetização'. Sugiro repensar a abordagem."

---

#### 8.2 Cortar Ideias Fora de Escopo
- ✅ **Identificar quando tarefa está fora do escopo do chat**
- ✅ **Redirecionar para chat correto**
- ✅ **Explicar claramente o motivo do redirecionamento**

**Exemplo:**
> "Esta tarefa está fora do escopo deste chat (Frontend). Para criar o endpoint `/api/v1/journey`, você precisa fazer isso no chat Backend. Redirecione."

---

#### 8.3 Alertar Violações de Governança
- ✅ **Detectar quando decisão viola locks**
- ✅ **Alertar sobre mudanças em código lockado**
- ✅ **Requerer aprovação quando necessário**

**Exemplo:**
> "⚠️ ALERTA: Você está tentando modificar o sistema de autenticação que está DEFINITIVAMENTE LOCKADO. Esta mudança requer aprovação do chat 00_MASTER. Aborte a mudança ou obtenha aprovação primeiro."

---

#### 8.4 Priorizar Estabilidade e Clareza
- ✅ **Prefere soluções simples a complexas**
- ✅ **Evita overengineering**
- ✅ **Garante que código seja legível e documentado**
- ✅ **Valida que mudanças não quebrem funcionalidades existentes**

**Exemplo:**
> "Esta solução parece overengineered. Sugiro uma abordagem mais simples que atende aos mesmos requisitos."

---

#### 8.5 Validar Antes de Implementar
- ✅ **Verifica se tarefa está dentro do escopo**
- ✅ **Confirma que não viola locks**
- ✅ **Valida que segue princípios fundamentais**
- ✅ **Garante que mudanças são compatíveis**

**Exemplo:**
> "Antes de implementar, confirmo:
> - ✅ Está dentro do escopo deste chat
> - ✅ Não viola locks existentes
> - ✅ Segue princípios fundamentais
> - ✅ Compatível com código existente
> 
> Posso prosseguir?"

---

### O que o Assistente NÃO DEVE Fazer

#### 8.6 Não Implementar Cegamente
- ❌ **NÃO implementar sem validar governança**
- ❌ **NÃO aceitar tarefas que violam locks**
- ❌ **NÃO simplificar sem questionar**

**Exemplo ERRADO:**
> "Implementando conforme solicitado..." (sem validar)

**Exemplo CORRETO:**
> "Antes de implementar, preciso alertar que esta mudança viola o LOCK AUTH. Posso prosseguir após sua confirmação ou devo redirecionar?"

---

#### 8.7 Não Ignorar Red Flags
- ❌ **NÃO ignorar sinais de violação de governança**
- ❌ **NÃO aceitar "atalhos" que comprometem estabilidade**
- ❌ **NÃO implementar soluções temporárias sem documentar**

**Exemplo ERRADO:**
> "Implementando solução temporária conforme solicitado..."

**Exemplo CORRETO:**
> "⚠️ Esta é uma solução temporária que viola arquitetura. Sugiro implementar solução correta ou documentar explicitamente como workaround temporário com prazo para correção."

---

#### 8.8 Não Ser Passivo
- ❌ **NÃO aceitar todas as sugestões sem questionar**
- ❌ **NÃO evitar conflito quando necessário**
- ❌ **NÃO ser apenas um executor**

**Exemplo ERRADO:**
> "Ok, implementando..."

**Exemplo CORRETO:**
> "Entendo o objetivo, mas vejo uma forma melhor de alcançá-lo que é mais alinhada com nossa arquitetura. Posso sugerir uma alternativa?"

---

### Checklist de Validação do Assistente

Antes de aceitar qualquer tarefa, o assistente deve verificar:

- [ ] Tarefa está dentro do escopo deste chat?
- [ ] Não viola nenhum LOCK existente?
- [ ] Segue princípios fundamentais?
- [ ] Compatível com código lockado?
- [ ] Solução não é overengineered?
- [ ] Mudanças são documentadas?

Se qualquer item falhar, o assistente **DEVE** alertar o usuário.

---

## 9. POSTURA ESPERADA DO USUÁRIO

### Princípios Fundamentais

O usuário deve colaborar com o assistente seguindo estas diretrizes:

---

### O que o Usuário DEVE Fazer

#### 9.1 Descrever Objetivos, Não Soluções
- ✅ **Descrever o problema ou objetivo**
- ✅ **Deixar o assistente sugerir a melhor solução técnica**
- ✅ **Validar sugestões do assistente**

**Exemplo CORRETO:**
> "Preciso que usuários possam completar onboarding após login"

**Exemplo ERRADO:**
> "Crie um endpoint POST /onboarding/complete que salva no localStorage"

---

#### 9.2 Respeitar Escopo do Chat
- ✅ **Usar o chat apropriado para cada tarefa**
- ✅ **Aceitar redirecionamentos quando necessário**
- ✅ **Não forçar tarefas fora de escopo**

**Exemplo CORRETO:**
> "Entendo, vou para o chat Backend criar o endpoint primeiro"

**Exemplo ERRADO:**
> "Mas eu quero fazer tudo aqui mesmo"

---

#### 9.3 Não Forçar Atalhos
- ✅ **Aceitar que processos existem por razões**
- ✅ **Não pedir "soluções temporárias" que viram permanentes**
- ✅ **Respeitar locks e governança**

**Exemplo CORRETO:**
> "Entendo, preciso obter aprovação do 00_MASTER primeiro"

**Exemplo ERRADO:**
> "É só uma mudancinha, pode fazer direto?"

---

#### 9.4 Validar LOCKs Antes de Avançar
- ✅ **Verificar se funcionalidade está lockada antes de modificar**
- ✅ **Obter aprovação quando necessário**
- ✅ **Consultar documentação de locks**

**Exemplo CORRETO:**
> "Vou verificar se Auth está lockado antes de modificar"

**Exemplo ERRADO:**
> "Vou modificar o login mesmo assim"

---

#### 9.5 Ser Claro e Específico
- ✅ **Descrever tarefas de forma clara**
- ✅ **Fornecer contexto necessário**
- ✅ **Especificar requisitos e restrições**

**Exemplo CORRETO:**
> "Preciso criar uma página de perfil do usuário que exibe dados do backend. Usuário deve estar autenticado para acessar."

**Exemplo ERRADO:**
> "Faz uma página de perfil"

---

### O que o Usuário NÃO DEVE Fazer

#### 9.6 Não Forçar Violações de Governança
- ❌ **NÃO insistir em violar locks**
- ❌ **NÃO pressionar para "atalhos" perigosos**
- ❌ **NÃO ignorar alertas do assistente**

**Exemplo ERRADO:**
> "Mas eu quero mesmo assim, pode fazer?"

---

#### 9.7 Não Ser Vago ou Ambíguo
- ❌ **NÃO dar instruções vagas**
- ❌ **NÃO assumir que assistente "adivinha" contexto**
- ❌ **NÃO mudar requisitos no meio da implementação**

**Exemplo ERRADO:**
> "Melhora a página" (sem especificar o quê)

---

#### 9.8 Não Ignorar Processos
- ❌ **NÃO pular etapas de aprovação**
- ❌ **NÃO ignorar redirecionamentos**
- ❌ **NÃO fazer "gambiarras" permanentes**

**Exemplo ERRADO:**
> "Vamos fazer direto, depois documenta"

---

## 10. REGRA FINAL DE OURO

### Três Princípios Supremos

Estes três princípios **SOBREPÕEM** qualquer outra regra ou decisão:

---

#### 1. Governança Vem Antes de Velocidade

**Significado:**
Processos de governança, validação e aprovação **NÃO** podem ser pulados em nome de velocidade ou urgência.

**Aplicação:**
- Locks não podem ser quebrados sem aprovação, mesmo que seja "rápido"
- Redirecionamentos não podem ser ignorados, mesmo que seja "mais rápido fazer aqui"
- Documentação não pode ser pulada, mesmo que seja "urgente"

**Exceções:**
- Apenas em situações de emergência crítica (ex: segurança, downtime)
- Com aprovação explícita do 00_MASTER
- Com plano documentado de correção posterior

---

#### 2. Produto Vem Antes de Monetização

**Significado:**
Features de produto que melhoram a experiência das mães têm **prioridade** sobre features de monetização ou receita.

**Aplicação:**
- Features para mães são priorizadas sobre features de receita
- Monetização não pode comprometer experiência das mães
- Decisões de produto (Core Product) podem sobrepor decisões de operações quando foco é mães

**Exceções:**
- Apenas quando monetização é crítica para sustentabilidade do produto
- Com validação clara de que não prejudica experiência das mães
- Com aprovação do 00_MASTER

---

#### 3. Mães Vêm Antes de Todo o Resto

**Significado:**
As necessidades, experiências e bem-estar das mães são a **prioridade máxima** do projeto, acima de qualquer outra consideração.

**Aplicação:**
- Decisões que beneficiam mães são priorizadas
- Features que prejudicam mães são rejeitadas
- Feedback de mães tem peso maior que qualquer outro stakeholder
- Chat Core Product (Mães) tem precedência em conflitos relacionados a experiência das mães

**Exceções:**
- NENHUMA. Este princípio não tem exceções.

---

### Hierarquia de Prioridades

Quando há conflito entre princípios ou decisões:

1. **Primeiro:** Mães vêm antes de todo o resto
2. **Segundo:** Produto vem antes de monetização
3. **Terceiro:** Governança vem antes de velocidade

**Exemplo Prático:**
> Situação: Feature de monetização urgente que melhora experiência das mães, mas requer quebrar um LOCK.
> 
> **Análise:**
> - Mães primeiro: ✅ Feature melhora experiência das mães
> - Produto antes de monetização: ⚠️ É feature de monetização, mas melhora produto
> - Governança antes de velocidade: ❌ Requer quebrar LOCK
> 
> **Decisão:**
> Feature pode ser aprovada, mas:
> 1. Deve passar por processo de quebra de LOCK (governança)
> 2. Aprovação do 00_MASTER obrigatória
> 3. Plano de migração documentado

---

## 11. HISTÓRICO DE MUDANÇAS

Esta seção documenta mudanças significativas na governança do projeto.

### Versão 1.0 — 2025-01-09

**Criação inicial do documento de governança**

**Conteúdo:**
- Estrutura completa de governança definida
- Modelo de chats estabelecido
- Sistema de LOCKs documentado
- Princípios fundamentais definidos
- Regras de redirecionamento criadas

**Status Atual Documentado:**
- Backend: LOCKADO
- Auth: DEFINITIVAMENTE LOCKADO
- Frontend: MULTI-LOCK (FRONTEND 1, 2A, FINAL, RBAC 1, PWA 1)
- RBAC Backend: LOCK RBAC 2 IMPLEMENTADO
- Infra: Funcional (Railway + Vercel)

---

## 12. GLOSSÁRIO

### Termos Técnicos

**LOCK:** Estado de travamento de uma parte do sistema, indicando estabilidade e proibição de alterações sem aprovação.

**Chat Especializado:** Conversa focada em uma área específica do projeto (Frontend, Backend, Produto, etc).

**00_MASTER:** Chat central de governança e decisões estratégicas finais.

**RBAC:** Role-Based Access Control — Sistema de controle de acesso baseado em roles.

**PWA:** Progressive Web App — Aplicativo web com características de app nativo.

**Auth:** Sistema de autenticação e autorização (login, register, refresh, logout).

**Migration:** Alteração estrutural no banco de dados versionada via Prisma.

**Endpoint:** Rota de API no backend (ex: `POST /api/v1/auth/login`).

**Service Worker:** Script que roda em background no navegador, usado para cache e funcionalidades offline.

**Manifest.json:** Arquivo de configuração do PWA que define como o app aparece quando instalado.

---

### Termos de Governança

**Fonte Única da Verdade (SSOT):** Documento ou sistema que é a referência definitiva para informações específicas.

**Redirecionamento:** Processo de mover uma tarefa ou decisão de um chat para outro mais apropriado.

**Escopo:** Área de responsabilidade e limites de um chat ou componente.

**Overengineering:** Criar soluções mais complexas do que o necessário para resolver um problema.

**Lock Quebrado:** Alteração em código ou funcionalidade que estava lockada sem aprovação adequada.

---

## 13. CONTATOS E RESPONSABILIDADES

### Responsáveis por Área

**Governança Geral (00_MASTER):**
- CTO / Product Owner / Líder Técnico

**Frontend & UX:**
- Frontend Developer / UX Designer

**Backend:**
- Backend Developer / Software Architect

**Infra & DevOps:**
- DevOps Engineer / SRE

**Automações & Integrações:**
- Backend Developer / Automation Engineer

**Operações & Crescimento:**
- Product Manager / Business Analyst

**Core Product (Mães):**
- Product Owner / UX Designer / User Researcher

---

### Como Reportar Violações

Se você identificar uma violação desta governança:

1. **Documente a violação** claramente
2. **Identifique o chat responsável**
3. **Reporte no chat 00_MASTER** se for violação crítica
4. **Forneça evidências** (código, decisões, documentação)

---

## 14. CONCLUSÃO

Este documento é **AUTORITATIVO** e serve como referência definitiva para todas as decisões do projeto Materni_Love – V2.

**Lembre-se:**
- ✅ Governança vem antes de velocidade
- ✅ Produto vem antes de monetização
- ✅ Mães vêm antes de todo o resto

**Use este documento para:**
- Validar decisões
- Entender responsabilidades
- Saber qual chat usar
- Resolver conflitos
- Manter consistência

**Este documento deve ser:**
- Lido por novos colaboradores antes de começar
- Referenciado em novos chats
- Atualizado quando houver mudanças significativas
- Respeitado por todos os envolvidos

---

**FIM DO DOCUMENTO DE GOVERNANÇA**

---

**Versão:** 1.0  
**Data:** 2025-01-09  
**Status:** AUTORITATIVO E DEFINITIVO  
**Próxima Revisão:** Quando necessário (mudanças significativas)
