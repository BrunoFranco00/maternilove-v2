// ============================================================================
// CORREÇÃO CORS - ARQUIVO: backend/src/server.ts (linhas 68-128)
// ============================================================================
// 
// PROBLEMA: CORS bloqueia requisições do Frontend (Vercel) porque
// apenas permite domínios específicos, não aceita regex para *.vercel.app
//
// SOLUÇÃO: Adicionar regex /^https:\/\/.*\.vercel\.app$/ para permitir
// todos os domínios do Vercel (produção, preview, branch, etc.)
//
// IMPACTO: ZERO no Frontend, apenas ajuste no Backend (middleware CORS)
//
// ============================================================================

// CORS Configuration - Production Ready
// Whitelist explícita de origens permitidas (agora aceita string ou regex)
const allowedOrigins: (string | RegExp)[] = [];

// 1. Priorizar FRONTEND_URL se configurado
if (process.env.FRONTEND_URL) {
  allowedOrigins.push(process.env.FRONTEND_URL);
}

// 2. Adicionar origens do CORS_ORIGIN (separadas por vírgula)
if (process.env.CORS_ORIGIN) {
  const corsOrigins = process.env.CORS_ORIGIN.split(',').filter(Boolean);
  allowedOrigins.push(...corsOrigins);
}

// 3. Fallback: Adicionar origens padrão de desenvolvimento
if (process.env.NODE_ENV !== 'production') {
  allowedOrigins.push(
    'http://localhost:5173', // Vite dev server
    'http://localhost:3000', // Outro dev server
  );
} else {
  // 4. Em produção, adicionar padrão Vercel (todos os *.vercel.app)
  // Esta regex permite:
  // - https://maternilove-v2.vercel.app
  // - https://maternilove-v2-git-branch.vercel.app
  // - https://maternilove-v2-abc123.vercel.app
  // - Qualquer subdomínio do Vercel
  allowedOrigins.push(/^https:\/\/.*\.vercel\.app$/);
  
  // 5. Se FRONTEND_URL específico foi configurado, adicionar também
  const vercelOrigin = 'https://maternilove-v2.vercel.app';
  if (!allowedOrigins.includes(vercelOrigin)) {
    allowedOrigins.push(vercelOrigin);
  }
}

// Log das origens permitidas
console.log('🌐 CORS - Origens permitidas:');
allowedOrigins.forEach((origin) => {
  if (origin instanceof RegExp) {
    console.log(`   ✅ ${origin.toString()} (regex)`);
  } else {
    console.log(`   ✅ ${origin}`);
  }
});
console.log('');

app.use(cors({
  origin: (origin, callback) => {
    // Permitir requisições sem origin (ex: Postman, curl)
    if (!origin) {
      return callback(null, true);
    }
    
    // Verificar se origin está na lista permitida (string ou regex)
    const isAllowed = allowedOrigins.some(allowed => {
      if (allowed instanceof RegExp) {
        return allowed.test(origin);
      }
      return allowed === origin;
    });
    
    if (isAllowed) {
      callback(null, true);
    } else {
      // Em desenvolvimento, logar mas permitir
      if (process.env.NODE_ENV === 'development') {
        logger.warn(`CORS: Allowing origin in dev: ${origin}`);
        callback(null, true);
      } else {
        logger.warn(`❌ CORS blocked origin: ${origin}`);
        logger.warn(`   Allowed origins: ${allowedOrigins.map(o => o instanceof RegExp ? o.toString() : o).join(', ')}`);
        callback(new Error(`Not allowed by CORS: ${origin}`));
      }
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

// ============================================================================
// MUDANÇAS RESUMIDAS:
// ============================================================================
//
// 1. Linha 70: allowedOrigins: string[] → allowedOrigins: (string | RegExp)[]
// 2. Linha 90: Adicionar allowedOrigins.push(/^https:\/\/.*\.vercel\.app$/);
// 3. Linhas 99-101: Log melhorado para mostrar regex
// 4. Linha 112: Substituir allowedOrigins.includes(origin) por validação
//    com regex usando .some() e .test()
// 5. Linhas 120-121: Log melhorado quando bloqueia
//
// ============================================================================
// TESTES APÓS APLICAR:
// ============================================================================
//
// 1. Verificar logs Railway: deve mostrar regex na lista
// 2. Testar login no frontend Vercel
// 3. Verificar console do navegador: não deve ter erro CORS
// 4. Verificar logs Railway: não deve ter "CORS blocked origin"
//
// ============================================================================


