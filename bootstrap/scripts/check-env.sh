#!/bin/bash
# check-env.sh
# Script de Validação de Variáveis de Ambiente
#
# O QUE FAZ:
# - Verifica se arquivos .env existem
# - Valida se variáveis obrigatórias estão definidas
# - NÃO imprime valores (segurança)
#
# O QUE NÃO FAZ:
# - Não imprime valores das variáveis
# - Não valida valores (apenas existência)
# - Não cria arquivos .env
#
# AVISO: Este script é SEGURO e NÃO expõe secrets.

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
echo "  Validação de Variáveis de Ambiente"
echo "=========================================="
echo ""

ERRORS=0

# ============================================================================
# BACKEND: VALIDAR VARIÁVEIS
# ============================================================================

echo "Backend:"

# Verificar se .env existe
if [ ! -f "$BACKEND_DIR/.env" ]; then
    error "Backend: .env não encontrado"
    warning "Crie backend/.env a partir de bootstrap/backend.env.example"
    ERRORS=$((ERRORS + 1))
else
    info "Backend: .env encontrado"
    
    # Carregar variáveis (sem exportar)
    set +e
    source "$BACKEND_DIR/.env" 2>/dev/null
    set -e
    
    # Verificar variáveis obrigatórias
    if [ -z "$DATABASE_URL" ]; then
        error "Backend: DATABASE_URL não encontrada"
        ERRORS=$((ERRORS + 1))
    else
        info "Backend: DATABASE_URL definida"
    fi
    
    if [ -z "$JWT_SECRET" ]; then
        error "Backend: JWT_SECRET não encontrada"
        ERRORS=$((ERRORS + 1))
    else
        info "Backend: JWT_SECRET definida"
    fi
    
    if [ -z "$NODE_ENV" ]; then
        warning "Backend: NODE_ENV não definida (usará default)"
    else
        info "Backend: NODE_ENV definida"
    fi
fi

echo ""

# ============================================================================
# FRONTEND: VALIDAR VARIÁVEIS
# ============================================================================

echo "Frontend:"

# Verificar se .env.local existe
if [ ! -f "$FRONTEND_DIR/.env.local" ]; then
    error "Frontend: .env.local não encontrado"
    warning "Crie frontend/.env.local a partir de bootstrap/frontend.env.example"
    ERRORS=$((ERRORS + 1))
else
    info "Frontend: .env.local encontrado"
    
    # Carregar variáveis (sem exportar)
    set +e
    source "$FRONTEND_DIR/.env.local" 2>/dev/null
    set -e
    
    # Verificar variáveis obrigatórias
    if [ -z "$NEXT_PUBLIC_API_URL" ]; then
        error "Frontend: NEXT_PUBLIC_API_URL não encontrada"
        ERRORS=$((ERRORS + 1))
    else
        info "Frontend: NEXT_PUBLIC_API_URL definida"
    fi
fi

echo ""

# ============================================================================
# CONCLUSÃO
# ============================================================================

if [ $ERRORS -eq 0 ]; then
    info "Todas as variáveis obrigatórias estão configuradas"
    echo ""
    exit 0
else
    error "Configure as variáveis obrigatórias antes de continuar"
    echo ""
    echo "Para mais informações, leia:"
    echo "  - bootstrap/ENVIRONMENT_GUIDE.md"
    echo "  - bootstrap/SETUP_LOCAL.md"
    echo ""
    exit 1
fi
