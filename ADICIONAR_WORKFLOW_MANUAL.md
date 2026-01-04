# 🔧 ADICIONAR WORKFLOW CI/CD MANUALMENTE

O arquivo `.github/workflows/ci.yml` não pôde ser adicionado via push porque o token do GitHub não tem permissão `workflow`.

## ✅ SOLUÇÃO: Adicionar Manualmente

### **Opção 1: Via Interface do GitHub (Recomendado)**

1. Acesse: https://github.com/BrunoFranco00/maternilove-v2
2. Clique em "Add file" → "Create new file"
3. Cole o caminho: `.github/workflows/ci.yml`
4. Cole o conteúdo do arquivo `backend/.github/workflows/ci.yml` (ou crie conforme abaixo)
5. Clique em "Commit new file"

### **Opção 2: Atualizar Token do GitHub**

1. Vá para: https://github.com/settings/tokens
2. Edite seu token existente
3. Adicione permissão: `workflow`
4. Salve
5. Faça push novamente: `git push origin master`

### **Opção 3: Usar SSH em vez de HTTPS**

Se você configurar SSH para Git, não precisa de token:
```bash
git remote set-url origin git@github.com:BrunoFranco00/maternilove-v2.git
git push origin master
```

---

## 📋 CONTEÚDO DO WORKFLOW (Para adicionar manualmente)

Crie o arquivo `.github/workflows/ci.yml` com este conteúdo:

```yaml
name: CI

on:
  push:
    branches: [master, main]
  pull_request:
    branches: [master, main]

jobs:
  backend-test:
    runs-on: ubuntu-latest
    defaults:
      run:
        working-directory: ./backend
    
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '20'
          cache: 'npm'
          cache-dependency-path: backend/package-lock.json
      
      - run: npm ci
      - run: npm run lint
      - run: npm run build

  frontend-test:
    runs-on: ubuntu-latest
    defaults:
      run:
        working-directory: ./frontend
    
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '20'
          cache: 'npm'
          cache-dependency-path: frontend/package-lock.json
      
      - run: npm ci
      - run: npm run lint
      - run: npm run build
```

---

## ⚠️ NOTA IMPORTANTE

**O workflow é opcional!** As melhorias de robustez já foram commitadas e enviadas. O CI/CD é uma melhoria adicional que pode ser adicionada depois.

**Por enquanto, o importante é que todas as melhorias de código estão no GitHub! ✅**

