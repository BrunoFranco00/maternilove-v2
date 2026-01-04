# 🔐 CREDENCIAIS DE ADMINISTRADOR - MATERNI LOVE

**Data de criação:** 3 de Janeiro de 2026  
**Status:** ✅ Usuário criado com sucesso

---

## 👤 USUÁRIO ADMINISTRADOR

### **Credenciais:**

```
Email: suporte@maternilove.com.br
Senha: Materni%2026
```

### **Informações do Usuário:**

- **ID:** `cmjz07luy000043k59fhszur6`
- **Role:** `SUPER_ADMIN`
- **Status:** `ACTIVE`
- **Email Verificado:** `true`
- **Nome:** `Administrador Materni Love`

---

## ✅ COMO USAR

### **1. Login no Frontend**

1. Acesse: `https://maternilove-v2.vercel.app/login`
2. Digite:
   - **Email:** `suporte@maternilove.com.br`
   - **Senha:** `Materni%2026`
3. Clique em "Entrar"

### **2. Login via API**

```bash
curl -X POST https://maternilove-v2-production.up.railway.app/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "suporte@maternilove.com.br",
    "password": "Materni%2026"
  }'
```

**Resposta esperada:**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "cmjz07luy000043k59fhszur6",
      "email": "suporte@maternilove.com.br",
      "name": "Administrador Materni Love",
      "role": "SUPER_ADMIN"
    },
    "tokens": {
      "accessToken": "eyJhbGc...",
      "refreshToken": "eyJhbGc..."
    }
  }
}
```

### **3. Usar Token para Requisições Autenticadas**

```bash
# Substitua YOUR_ACCESS_TOKEN pelo token recebido
curl -X GET https://maternilove-v2-production.up.railway.app/api/users \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

---

## 🔒 PERMISSÕES DO SUPER_ADMIN

Como `SUPER_ADMIN`, você tem acesso a:

- ✅ **100% de controle da plataforma**
- ✅ Editar qualquer usuário
- ✅ Criar posts/comentários em nome de qualquer usuário
- ✅ Gerenciar todo o conteúdo
- ✅ Acessar painel administrativo completo
- ✅ Modificar configurações do site
- ✅ Ver todos os logs
- ✅ Gerenciar permissões

---

## 🛡️ SEGURANÇA

### **⚠️ IMPORTANTE:**

1. **Nunca compartilhe essas credenciais publicamente**
2. **Altere a senha periodicamente**
3. **Use apenas em ambientes seguros**
4. **Não commite essas credenciais no Git**

### **Para Alterar Senha:**

Execute o seed novamente com nova senha ou use o endpoint de alteração de senha (quando implementado).

---

## 🔄 RECRIAR USUÁRIO ADMIN

Se precisar recriar ou atualizar o usuário admin:

```bash
cd backend
npm run prisma:seed
```

O script verifica se o usuário existe e:
- Se existe: atualiza senha e garante que é SUPER_ADMIN
- Se não existe: cria novo usuário admin

---

## 📊 VERIFICAR NO BANCO DE DADOS

### **Via Prisma Studio:**

```bash
cd backend
npm run prisma:studio
```

Acesse: `http://localhost:5555`
- Vá em "User"
- Procure por: `suporte@maternilove.com.br`
- Verifique: `role = SUPER_ADMIN`

### **Via SQL:**

```sql
SELECT id, email, name, role, status, "emailVerified"
FROM "User"
WHERE email = 'suporte@maternilove.com.br';
```

---

## ✅ CHECKLIST

- [x] Usuário admin criado
- [x] Senha hashada com bcrypt
- [x] Role: SUPER_ADMIN
- [x] Status: ACTIVE
- [x] Email verificado: true
- [ ] Testar login no frontend
- [ ] Testar login via API
- [ ] Verificar permissões funcionando

---

**🎉 Usuário administrador configurado com sucesso!**

