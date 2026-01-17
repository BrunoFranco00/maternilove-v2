# SCRIPTS.md
## Documentação dos Scripts de Bootstrap

**Versão:** 1.0  
**Data:** 2025-01-09  
**Status:** AUTORITATIVO

---

## ⚠️ AVISOS DE SEGURANÇA

**Todos os scripts são SEGUROS para uso local e NÃO modificam produção.**

**Os scripts NÃO:**
- ❌ Modificam código funcional
- ❌ Alteram configurações de produção
- ❌ Rodam em banco de dados de produção
- ❌ Executam deployments
- ❌ Compartilham secrets

---

## ESTRUTURA

```
bootstrap/scripts/
├── setup.sh           # Setup inicial completo
├── check-env.sh       # Validação de variáveis de ambiente
└── reset-local.sh     # Limpeza de ambiente local
```

---

## 1. setup.sh

### O Que Faz

Script de setup inicial que:
- Verifica pré-requisitos (Node.js, npm)
- Instala dependências (backend e frontend)
- Copia arquivos `.env.example` (se não existirem)
- Valida estrutura do projeto

### O Que NÃO Faz

- ❌ Não sobe servidor
- ❌ Não roda migrations
- ❌ Não toca em produção
- ❌ Não modifica código funcional

### Como Usar

```bash
# Tornar executável (primeira vez)
chmod +x bootstrap/scripts/setup.sh

# Executar
bash bootstrap/scripts/setup.sh

# OU
./bootstrap/scripts/setup.sh
```

### Quando Usar

- ✅ Primeira configuração do projeto
- ✅ Após clonar repositório
- ✅ Após limpar ambiente (`reset-local.sh`)

### Quando NÃO Usar

- ❌ Em produção
- ❌ Para fazer deploy
- ❌ Para rodar migrations

### Saída Esperada

```
✅ Node.js instalado: v20.x.x
✅ npm instalado: 9.x.x
✅ Estrutura do projeto válida
✅ Dependências do backend instaladas
✅ Dependências do frontend instaladas
✅ Arquivos .env.example copiados
✅ Setup completo!
```

---

## 2. check-env.sh

### O Que Faz

Script que valida variáveis de ambiente obrigatórias:
- Verifica se arquivos `.env` existem
- Valida se variáveis obrigatórias estão definidas
- NÃO imprime valores (segurança)

### O Que NÃO Faz

- ❌ Não imprime valores das variáveis
- ❌ Não valida valores (apenas existência)
- ❌ Não cria arquivos `.env`

### Como Usar

```bash
# Tornar executável (primeira vez)
chmod +x bootstrap/scripts/check-env.sh

# Executar (do diretório raiz)
bash bootstrap/scripts/check-env.sh

# OU
./bootstrap/scripts/check-env.sh
```

### Quando Usar

- ✅ Antes de iniciar servidor
- ✅ Após configurar `.env`
- ✅ Para validar setup
- ✅ Para troubleshooting

### Quando NÃO Usar

- ❌ Para validar valores (apenas existência)
- ❌ Para criar arquivos `.env`

### Saída Esperada

```
✅ Backend: .env encontrado
✅ Backend: DATABASE_URL definida
✅ Backend: JWT_SECRET definida
✅ Frontend: .env.local encontrado
✅ Frontend: NEXT_PUBLIC_API_URL definida
✅ Todas as variáveis obrigatórias estão configuradas
```

**Se faltar alguma variável:**
```
❌ Backend: JWT_SECRET não encontrada
❌ Configure as variáveis obrigatórias antes de continuar
```

---

## 3. reset-local.sh

### O Que Faz

Script que limpa ambiente local:
- Remove `node_modules/` (backend e frontend)
- Remove builds locais (`.next/`, `dist/`)
- Limpa cache (`package-lock.json`, `.cache/`)
- NÃO toca em banco de dados
- NÃO toca em produção

### O Que NÃO Faz

- ❌ Não remove arquivos `.env`
- ❌ Não remove banco de dados
- ❌ Não toca em produção
- ❌ Não modifica código funcional

### Como Usar

```bash
# Tornar executável (primeira vez)
chmod +x bootstrap/scripts/reset-local.sh

# Executar (do diretório raiz)
bash bootstrap/scripts/reset-local.sh

# OU
./bootstrap/scripts/reset-local.sh

# Confirmar limpeza
# Script pede confirmação antes de limpar
```

### Quando Usar

- ✅ Quando `node_modules` está corrompido
- ✅ Quando há conflitos de dependências
- ✅ Antes de fazer setup limpo
- ✅ Para liberar espaço em disco

### Quando NÃO Usar

- ❌ Quando projeto está funcionando
- ❌ Para fazer deploy
- ❌ Em produção

### Saída Esperada

```
⚠️  Este script irá limpar:
   - node_modules (backend e frontend)
   - Builds locais (.next/, dist/)
   - Cache (package-lock.json)

Deseja continuar? (s/N): s

✅ Limpeza concluída!
✅ Execute 'bash bootstrap/scripts/setup.sh' para reconfigurar
```

---

## USO COMBINADO

### Setup Completo (Primeira Vez)

```bash
# 1. Setup inicial
bash bootstrap/scripts/setup.sh

# 2. Configurar .env (manualmente)
# Editar backend/.env
# Editar frontend/.env.local

# 3. Validar variáveis
bash bootstrap/scripts/check-env.sh

# 4. Rodar migrations (backend)
cd backend
npm run prisma:migrate:deploy

# 5. Iniciar servidores
# Terminal 1: Backend
cd backend && npm run dev

# Terminal 2: Frontend
cd frontend && npm run dev
```

### Reset e Reconfiguração

```bash
# 1. Limpar ambiente
bash bootstrap/scripts/reset-local.sh

# 2. Setup novamente
bash bootstrap/scripts/setup.sh

# 3. Configurar .env (se necessário)

# 4. Validar
bash bootstrap/scripts/check-env.sh
```

---

## TROUBLESHOOTING

### Script Não Executa

**Problema:** Permissão negada

**Solução:**
```bash
chmod +x bootstrap/scripts/nome-do-script.sh
```

### Script Falha Silenciosamente

**Problema:** Erro não visível

**Solução:**
```bash
# Executar com output detalhado
bash -x bootstrap/scripts/nome-do-script.sh
```

### Variáveis Não Validadas

**Problema:** check-env.sh não encontra variáveis

**Solução:**
1. Verificar se arquivos `.env` existem
2. Verificar se nomes das variáveis estão corretos
3. Verificar se script está sendo executado do diretório raiz

---

## CONCLUSÃO

Estes scripts são **SEGUROS** e **DEFENSIVOS**. Eles facilitam setup e validação sem modificar código funcional.

**Lembre-se:**
- ✅ Use apenas localmente
- ✅ Valide antes de usar
- ✅ Leia saída dos scripts
- ✅ Reporte problemas se encontrar

---

**FIM DA DOCUMENTAÇÃO DE SCRIPTS**
