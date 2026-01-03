# 🚀 INSTRUÇÕES - SCRIPT FINAL COMPLETO

## ✅ O QUE ESTE SCRIPT FAZ

Este script automatiza **100% da configuração inicial** do projeto MaternLove V2:

1. ✅ Verifica pré-requisitos (Node.js, npm, Git)
2. ✅ Cria estrutura completa de pastas
3. ✅ Configura Backend (Express + TypeScript + Prisma)
4. ✅ Cria 45 modelos Prisma (schema completo)
5. ✅ Instala dependências do Backend
6. ✅ **FAZ MIGRATIONS (CRIA TODAS AS TABELAS NO POSTGRESQL)**
7. ✅ Configura Frontend (React + Vite + TailwindCSS)
8. ✅ Configura PWA (manifest + service-worker + botão de instalação)
9. ✅ Configura Design System (cores #D946A6, animações)
10. ✅ Instala dependências do Frontend
11. ✅ Cria .gitignore
12. ✅ Faz commit inicial

**Tempo estimado: 15-20 minutos**

---

## 📋 PRÉ-REQUISITOS

Antes de executar, certifique-se de ter:

- ✅ Node.js 18+ instalado
- ✅ npm instalado
- ✅ Git instalado
- ✅ DATABASE_URL do Railway (opcional, mas recomendado)

---

## 🎯 COMO EXECUTAR

### PASSO 1: Preparar DATABASE_URL (Recomendado)

**Opção A: Configurar antes de executar**

```bash
# No terminal, configure a variável:
export DATABASE_URL="postgresql://postgres:senha@host:porta/database"
```

**Opção B: Obter do Railway**

1. Acesse: https://railway.app
2. Clique em "PostgreSQL"
3. Vá para "Variables"
4. Copie "DATABASE_PUBLIC_URL" (com variáveis expandidas)
5. Configure no terminal:
   ```bash
   export DATABASE_URL="sua-url-copiada-aqui"
   ```

**Opção C: Configurar depois**

O script criará um `.env` com placeholder. Você pode editar depois em `backend/.env`.

### PASSO 2: Tornar Script Executável

```bash
chmod +x SCRIPT_FINAL_COMPLETO_EXECUTAR.sh
```

### PASSO 3: Executar o Script

```bash
./SCRIPT_FINAL_COMPLETO_EXECUTAR.sh
```

**OU** se preferir executar diretamente:

```bash
bash SCRIPT_FINAL_COMPLETO_EXECUTAR.sh
```

---

## ⏱️ O QUE ESPERAR DURANTE A EXECUÇÃO

### Etapas do Script:

1. **Verificação de Pré-requisitos** (~30 segundos)
   - Verifica Node.js, npm, Git

2. **Criação de Estrutura** (~1 minuto)
   - Cria todas as pastas necessárias

3. **Configuração do Backend** (~2 minutos)
   - Cria package.json, tsconfig.json, .env
   - Cria schema Prisma (45 modelos)
   - Cria server.ts

4. **Instalação de Dependências Backend** (~5-10 minutos)
   - `npm install` no backend
   - Pode levar alguns minutos

5. **Migrations (CRÍTICO)** (~2-5 minutos)
   - Gera Prisma Client
   - Cria migration
   - **Aplica no banco de dados (CRIA TABELAS)**

6. **Configuração do Frontend** (~2 minutos)
   - Cria package.json, tsconfig.json
   - Configura Vite, TailwindCSS, PWA
   - Cria componentes React

7. **Instalação de Dependências Frontend** (~5-10 minutos)
   - `npm install` no frontend

8. **Git** (~30 segundos)
   - Cria .gitignore
   - Faz commit inicial

**Total: 15-20 minutos**

---

## ✅ COMO VERIFICAR SE FUNCIONOU

### 1. Verificar Estrutura

```bash
ls -la
# Deve mostrar: backend/, frontend/, docs/
```

### 2. Verificar Backend

```bash
cd backend
ls -la
# Deve mostrar: src/, prisma/, package.json, .env
```

### 3. Verificar Migrations

```bash
cd backend
ls prisma/migrations/
# Deve mostrar pastas de migrations (se aplicadas)
```

### 4. Verificar Frontend

```bash
cd frontend
ls -la
# Deve mostrar: src/, public/, package.json, vite.config.ts
```

### 5. Testar Backend

```bash
cd backend
npm run dev
# Deve iniciar servidor em http://localhost:3000
# Teste: curl http://localhost:3000/health
```

### 6. Testar Frontend

```bash
cd frontend
npm run dev
# Deve iniciar servidor em http://localhost:5173
```

### 7. Visualizar Banco de Dados

```bash
cd backend
npm run prisma:studio
# Abrirá em: http://localhost:5555
# Você verá TODAS as tabelas criadas
```

---

## 🛠️ TROUBLESHOOTING

### Erro: "Node.js não está instalado"

**Solução:**
```bash
# Instalar Node.js em: https://nodejs.org/
# Ou usar nvm:
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
nvm install 18
nvm use 18
```

### Erro: "DATABASE_URL não configurada"

**Solução:**
1. Configure a variável antes de executar:
   ```bash
   export DATABASE_URL="sua-url-aqui"
   ```
2. Ou edite `backend/.env` depois e execute:
   ```bash
   cd backend
   npx prisma migrate dev --name init
   ```

### Erro: "Falha ao aplicar migrations"

**Soluções:**

1. **Verificar conexão com banco:**
   ```bash
   cd backend
   npx prisma db push
   ```

2. **Verificar DATABASE_URL:**
   ```bash
   cat backend/.env
   # Verifique se a URL está correta
   ```

3. **Criar migration manualmente:**
   ```bash
   cd backend
   npx prisma migrate dev --name init
   ```

### Erro: "npm install falhou"

**Soluções:**

1. **Limpar cache:**
   ```bash
   npm cache clean --force
   ```

2. **Usar --legacy-peer-deps:**
   ```bash
   cd backend
   npm install --legacy-peer-deps
   ```

3. **Verificar versão do Node:**
   ```bash
   node --version
   # Deve ser 18+
   ```

### Erro: "Porta já em uso"

**Solução:**
```bash
# Backend usa porta 3000
# Frontend usa porta 5173

# Verificar o que está usando:
lsof -i :3000
lsof -i :5173

# Matar processo:
kill -9 <PID>
```

---

## 🎯 PRÓXIMOS PASSOS (Após o Script)

### 1. Iniciar Desenvolvimento

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```

**Terminal 3 - Prisma Studio (opcional):**
```bash
cd backend
npm run prisma:studio
```

### 2. Testar Endpoints

```bash
# Health check
curl http://localhost:3000/health

# API root
curl http://localhost:3000/api
```

### 3. Abrir no Navegador

- **Frontend:** http://localhost:5173
- **Backend API:** http://localhost:3000/api
- **Prisma Studio:** http://localhost:5555

### 4. Começar a Desenvolver

Agora você pode:
- ✅ Criar rotas de API no backend
- ✅ Criar componentes React no frontend
- ✅ Implementar autenticação
- ✅ Criar páginas do admin panel
- ✅ Adicionar mais funcionalidades

---

## 📚 DOCUMENTAÇÃO

Documentos disponíveis:
- `DESIGN_SYSTEM_MATERNILOVE.md` - Sistema de design (cores, animações)
- `ADMIN_PANEL_COMPLETO.md` - Painel administrativo (50+ funcionalidades)
- `PWA_SETUP_COMPLETO.md` - Progressive Web App (instalação, offline)

---

## 🆘 PRECISA DE AJUDA?

1. Verifique os logs do script
2. Verifique os arquivos de configuração (.env, package.json)
3. Teste as conexões manualmente
4. Consulte a documentação acima

---

## ✅ CHECKLIST FINAL

Após executar o script, verifique:

- [ ] Estrutura de pastas criada
- [ ] Backend configurado (package.json, tsconfig.json)
- [ ] Frontend configurado (package.json, vite.config.ts)
- [ ] Schema Prisma criado (45 modelos)
- [ ] Migrations executadas (tabelas criadas)
- [ ] Dependências instaladas (backend e frontend)
- [ ] .gitignore criado
- [ ] Commit feito
- [ ] Backend roda (`npm run dev`)
- [ ] Frontend roda (`npm run dev`)
- [ ] Banco de dados conectado (Prisma Studio)

---

**🎉 Se todos os itens estão marcados, você está pronto para desenvolver!**

