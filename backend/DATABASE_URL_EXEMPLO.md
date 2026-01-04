# ⚠️ IMPORTANTE: Configurar DATABASE_URL no Railway

## Pool e Timeouts Obrigatórios

O `DATABASE_URL` no Railway **DEVE** incluir os seguintes parâmetros:

```
postgresql://user:password@host:port/database?connection_limit=5&pool_timeout=30&connect_timeout=10
```

## Como Configurar no Railway

1. Acesse seu projeto no Railway
2. Vá em **Variables** da service do PostgreSQL
3. Localize `DATABASE_URL` ou `DATABASE_PUBLIC_URL`
4. Adicione os parâmetros de query string:

```
?connection_limit=5&pool_timeout=30&connect_timeout=10
```

**Exemplo completo:**
```
postgresql://postgres:senha@host.railway.app:5432/railway?connection_limit=5&pool_timeout=30&connect_timeout=10
```

## Variáveis de Ambiente no Railway Backend Service

Configure também no serviço do **Backend**:

- `DATABASE_URL`: (copiada do PostgreSQL service, com os parâmetros acima)
- `FRONTEND_URL`: `https://maternilove-v2.vercel.app` (ou seu domínio Vercel)
- `NODE_ENV`: `production`
- `PORT`: (Railway injeta automaticamente)
- `JWT_SECRET`: (sua chave secreta)
- `JWT_REFRESH_SECRET`: (sua chave de refresh)

## Por Que Isso é Importante

- **connection_limit=5**: Limita pool a 5 conexões por instância (evita exaustão)
- **pool_timeout=30**: Timeout de 30s para obter conexão do pool
- **connect_timeout=10**: Timeout de 10s para estabelecer nova conexão

Isso previne:
- ❌ Connection reset errors
- ❌ Pool exhaustion
- ❌ Timeouts indefinidos

