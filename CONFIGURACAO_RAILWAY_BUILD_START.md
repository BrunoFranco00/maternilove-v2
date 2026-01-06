# ✅ CONFIGURAÇÃO RAILWAY: Build e Start Command

## Resposta Direta

**NÃO precisa configurar Build Command customizado.**

O Railway com **Nixpacks detecta automaticamente** os scripts do `package.json`.

## Configuração Atual (Correta)

### Package.json
```json
{
  "scripts": {
    "build": "tsc",                    // ✅ Detectado automaticamente
    "postinstall": "prisma generate",  // ✅ Executado automaticamente após npm ci
    "prestart": "prisma migrate deploy", // ✅ Executado automaticamente antes de start
    "start": "node dist/server.js"     // ✅ Detectado automaticamente
  }
}
```

### Railway.json
```json
{
  "build": {
    "builder": "NIXPACKS"  // ✅ Usa Nixpacks (detecta scripts automaticamente)
  }
}
```

## Como Funciona

O **Nixpacks** (builder do Railway) detecta automaticamente:

1. **Install:** `npm ci` (automático)
   - Executa `postinstall`: `prisma generate` ✅

2. **Build:** `npm run build` (automático)
   - Executa `tsc` para compilar TypeScript ✅

3. **Start:** `npm start` (automático)
   - Executa `prestart`: `prisma migrate deploy` ✅
   - Executa `node dist/server.js` ✅

## Start Command

Na imagem que você mostrou, o **Custom Start Command** está configurado como:
```
npm start
```

Isso está **CORRETO** e não precisa mudar.

## Build Command

O **Custom Build Command** deve estar **VAZIO** ou não configurado.

O Nixpacks detecta automaticamente o script `build` do `package.json`.

## Conclusão

✅ **Build Command:** NÃO precisa configurar (deixe vazio)
✅ **Start Command:** `npm start` (já está configurado corretamente)

**O problema do backend cair NÃO está relacionado ao build/start command.**

Pelos logs, o build funciona e o backend inicia, mas **cai depois**.

## O Problema Real

O backend:
- ✅ Compila corretamente
- ✅ Inicia corretamente
- ❌ Cai silenciosamente depois

Isso indica problema de:
- Healthcheck falhando (Railway mata o container)
- Erro não tratado (processo crasha)
- Restart loop
- Limite de recursos

## Próximos Passos

1. ✅ Build/Start Command está OK (não precisa mudar)
2. ❌ Investigar por que backend cai após iniciar
3. Verificar status no Railway (restart loop? métricas?)
4. Verificar healthcheck configuration


