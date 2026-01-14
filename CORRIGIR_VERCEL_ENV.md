# 🔧 CORREÇÃO: Configurar VITE_API_URL no Vercel

## ✅ DIAGNÓSTICO

**A API está funcionando perfeitamente!** Os testes mostraram:
- ✅ Health check: OK
- ✅ Registro: Funcionando
- ✅ Login Admin: Funcionando

**O problema:** O frontend no Vercel não sabe qual é a URL do backend!

---

## 🎯 SOLUÇÃO: Configurar Variável de Ambiente no Vercel

### **Passo 1: Acessar Configurações do Vercel**

1. Acesse: https://vercel.com/dashboard
2. Encontre o projeto: **maternilove-v2**
3. Clique no projeto
4. Vá em **Settings** (Configurações)
5. Clique em **Environment Variables** (Variáveis de Ambiente)

---

### **Passo 2: Adicionar Variável de Ambiente**

Clique em **Add New** e adicione:

**Nome da Variável:**
```
VITE_API_URL
```

**Valor:**
```
https://maternilove-v2-production.up.railway.app
```

**Ambientes:** Selecione todos:
- ☑️ Production
- ☑️ Preview
- ☑️ Development

Clique em **Save**

---

### **Passo 3: Fazer Redeploy**

Depois de salvar a variável:

1. Vá para a aba **Deployments**
2. Encontre o último deploy
3. Clique nos **três pontos (...)** ao lado
4. Selecione **Redeploy**
5. Aguarde o deploy terminar (2-3 minutos)

**OU**

1. Faça um pequeno commit (adicionar um espaço em algum arquivo)
2. Faça push para o GitHub
3. O Vercel vai fazer deploy automático

---

## ✅ VERIFICAÇÃO

Depois do redeploy:

1. Abra o console do navegador (F12)
2. Vá na aba **Console**
3. Você deve ver: `🔗 API URL: https://maternilove-v2-production.up.railway.app`

Se não aparecer, a variável não foi configurada corretamente.

---

## 🧪 TESTE FINAL

Após o redeploy:

### **1. Testar Criação de Conta**
- Acesse: https://maternilove-v2.vercel.app/register
- Crie uma conta
- ✅ Deve funcionar!

### **2. Testar Login**
- Acesse: https://maternilove-v2.vercel.app/login
- Faça login
- ✅ Deve funcionar!

### **3. Testar Login Admin**
- Email: `suporte@maternilove.com.br`
- Senha: `Materni%2026`
- ✅ Deve funcionar!

---

## 📝 RESUMO

**O que fazer:**
1. Acessar Vercel Dashboard → Settings → Environment Variables
2. Adicionar: `VITE_API_URL = https://maternilove-v2-production.up.railway.app`
3. Selecionar todos os ambientes
4. Salvar
5. Fazer redeploy

**Por que isso resolve:**
O frontend está usando `import.meta.env.VITE_API_URL || 'http://localhost:3000'` e como a variável não está configurada no Vercel, ele está tentando chamar `http://localhost:3000` que não existe em produção!

---

**Configure a variável e me avise quando terminar! 🚀**



