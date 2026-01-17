#!/bin/bash
# reset-local.sh
# Script de Limpeza de Ambiente Local
#
# O QUE FAZ:
# - Remove node_modules (backend e frontend)
# - Remove builds locais (.next/, dist/)
# - Limpa cache (package-lock.json, .cache/)
# - NÃO toca em banco de dados
# - NÃO toca em produção
#
# O QUE NÃO FAZ:
# - Não remove arquivos .env
# - Não remove banco de dados
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
echo "  Limpeza de Ambiente Local"
echo "=========================================="
echo ""

warning "Este script irá limpar:"
echo "  - node_modules (backend e frontend)"
echo "  - Builds locais (.next/, dist/)"
echo "  - Cache (package-lock.json, .cache/)"
echo ""
echo "Arquivos .env NÃO serão removidos"
echo ""

# Confirmar antes de continuar
read -p "Deseja continuar? (s/N): " -n 1 -r
echo ""

if [[ ! $REPLY =~ ^[Ss]$ ]]; then
    info "Operação cancelada"
    exit 0
fi

echo ""

# ============================================================================
# BACKEND: LIMPAR
# ============================================================================

if [ -d "$BACKEND_DIR" ]; then
    cd "$BACKEND_DIR"
    
    # Remover node_modules
    if [ -d "node_modules" ]; then
        info "Removendo backend/node_modules..."
        rm -rf node_modules
    fi
    
    # Remover dist
    if [ -d "dist" ]; then
        info "Removendo backend/dist..."
        rm -rf dist
    fi
    
    # Remover package-lock.json
    if [ -f "package-lock.json" ]; then
        info "Removendo backend/package-lock.json..."
        rm -f package-lock.json
    fi
else
    warning "Diretório backend não encontrado"
fi

echo ""

# ============================================================================
# FRONTEND: LIMPAR
# ============================================================================

if [ -d "$FRONTEND_DIR" ]; then
    cd "$FRONTEND_DIR"
    
    # Remover node_modules
    if [ -d "node_modules" ]; then
        info "Removendo frontend/node_modules..."
        rm -rf node_modules
    fi
    
    # Remover .next
    if [ -d ".next" ]; then
        info "Removendo frontend/.next..."
        rm -rf .next
    fi
    
    # Remover package-lock.json
    if [ -f "package-lock.json" ]; then
        info "Removendo frontend/package-lock.json..."
        rm -f package-lock.json
    fi
    
    # Remover .cache (se existir)
    if [ -d ".cache" ]; then
        info "Removendo frontend/.cache..."
        rm -rf .cache
    fi
else
    warning "Diretório frontend não encontrado"
fi

echo ""

# ============================================================================
# CONCLUSÃO
# ============================================================================

info "Limpeza concluída!"
echo ""
echo "Próximos passos:"
echo "  1. Execute 'bash bootstrap/scripts/setup.sh' para reconfigurar"
echo "  2. Configure arquivos .env se necessário"
echo "  3. Instale dependências novamente"
echo ""
echo "Para mais informações, leia:"
echo "  - bootstrap/SETUP_LOCAL.md"
echo "  - bootstrap/SCRIPTS.md"
echo ""
