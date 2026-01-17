#!/bin/bash
# setup.sh
# Script de Setup Inicial - Materni_Love V2
#
# O QUE FAZ:
# - Verifica pré-requisitos (Node.js, npm)
# - Instala dependências (backend e frontend)
# - Copia arquivos .env.example (se não existirem)
# - Valida estrutura do projeto
#
# O QUE NÃO FAZ:
# - Não sobe servidor
# - Não roda migrations
# - Não toca em produção
# - Não modifica código funcional
#
# AVISO: Este script é SEGURO para uso local e NÃO modifica produção.

set -e  # Falhar em qualquer erro

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Função para imprimir mensagens
info() {
    echo -e "${GREEN}✅${NC} $1"
}

error() {
    echo -e "${RED}❌${NC} $1"
    exit 1
}

warning() {
    echo -e "${YELLOW}⚠️${NC} $1"
}

# Diretório raiz (onde está o script)
ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
BACKEND_DIR="$ROOT_DIR/backend"
FRONTEND_DIR="$ROOT_DIR/frontend"

# Navegar para diretório raiz
cd "$ROOT_DIR"

echo ""
echo "=========================================="
echo "  Setup Inicial - Materni_Love V2"
echo "=========================================="
echo ""

# ============================================================================
# 1. VERIFICAR PRÉ-REQUISITOS
# ============================================================================

info "Verificando pré-requisitos..."

# Verificar Node.js
if ! command -v node &> /dev/null; then
    error "Node.js não encontrado. Instale Node.js 18+ antes de continuar."
fi

NODE_VERSION=$(node --version | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    error "Node.js 18+ é obrigatório. Versão atual: $(node --version)"
fi

info "Node.js instalado: $(node --version)"

# Verificar npm
if ! command -v npm &> /dev/null; then
    error "npm não encontrado. Instale npm 9+ antes de continuar."
fi

info "npm instalado: $(npm --version)"

# Verificar estrutura do projeto
if [ ! -d "$BACKEND_DIR" ]; then
    error "Diretório 'backend' não encontrado. Execute este script da raiz do projeto."
fi

if [ ! -d "$FRONTEND_DIR" ]; then
    error "Diretório 'frontend' não encontrado. Execute este script da raiz do projeto."
fi

info "Estrutura do projeto válida"

echo ""

# ============================================================================
# 2. INSTALAR DEPENDÊNCIAS DO BACKEND
# ============================================================================

info "Instalando dependências do backend..."

cd "$BACKEND_DIR"

if [ ! -f "package.json" ]; then
    error "package.json não encontrado no backend"
fi

npm install

if [ $? -ne 0 ]; then
    error "Falha ao instalar dependências do backend"
fi

info "Dependências do backend instaladas"

echo ""

# ============================================================================
# 3. INSTALAR DEPENDÊNCIAS DO FRONTEND
# ============================================================================

info "Instalando dependências do frontend..."

cd "$FRONTEND_DIR"

if [ ! -f "package.json" ]; then
    error "package.json não encontrado no frontend"
fi

npm install

if [ $? -ne 0 ]; then
    error "Falha ao instalar dependências do frontend"
fi

info "Dependências do frontend instaladas"

echo ""

# ============================================================================
# 4. COPIAR ARQUIVOS .env.example (SE NÃO EXISTIREM)
# ============================================================================

info "Verificando arquivos .env..."

# Backend .env
if [ ! -f "$BACKEND_DIR/.env" ]; then
    if [ -f "$ROOT_DIR/bootstrap/backend.env.example" ]; then
        warning "Arquivo backend/.env não encontrado"
        info "Copiando bootstrap/backend.env.example para backend/.env"
        cp "$ROOT_DIR/bootstrap/backend.env.example" "$BACKEND_DIR/.env"
        warning "IMPORTANTE: Edite backend/.env com valores reais (NÃO commite)"
    else
        warning "bootstrap/backend.env.example não encontrado. Crie backend/.env manualmente"
    fi
else
    info "backend/.env já existe (não sobrescrevendo)"
fi

# Frontend .env.local
if [ ! -f "$FRONTEND_DIR/.env.local" ]; then
    if [ -f "$ROOT_DIR/bootstrap/frontend.env.example" ]; then
        warning "Arquivo frontend/.env.local não encontrado"
        info "Copiando bootstrap/frontend.env.example para frontend/.env.local"
        cp "$ROOT_DIR/bootstrap/frontend.env.example" "$FRONTEND_DIR/.env.local"
        warning "IMPORTANTE: Edite frontend/.env.local com valores reais (NÃO commite)"
    else
        warning "bootstrap/frontend.env.example não encontrado. Crie frontend/.env.local manualmente"
    fi
else
    info "frontend/.env.local já existe (não sobrescrevendo)"
fi

echo ""

# ============================================================================
# 5. CONCLUSÃO
# ============================================================================

info "Setup completo!"
echo ""
echo "Próximos passos:"
echo "  1. Edite backend/.env com valores reais"
echo "  2. Edite frontend/.env.local com valores reais"
echo "  3. Configure banco de dados (backend/.env)"
echo "  4. Rode migrations: cd backend && npm run prisma:migrate:deploy"
echo "  5. Inicie servidores:"
echo "     - Backend: cd backend && npm run dev"
echo "     - Frontend: cd frontend && npm run dev"
echo ""
echo "Para mais informações, leia:"
echo "  - bootstrap/SETUP_LOCAL.md"
echo "  - bootstrap/PROJECT_GOVERNANCE.md"
echo ""
