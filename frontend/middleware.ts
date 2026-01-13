import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

/**
 * Middleware para proteger rotas privadas
 * Redireciona para /login se não autenticado
 * 
 * Nota: No middleware do Next.js, não temos acesso ao localStorage.
 * A verificação de autenticação será feita no lado do cliente.
 * Este middleware apenas redireciona baseado em cookies.
 */

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Rotas públicas (não proteger)
  const publicRoutes = ['/login', '/register', '/'];
  const isPublicRoute = publicRoutes.includes(pathname);

  // Verificar se há access token em cookie (fallback)
  // A verificação principal será feita no cliente via AuthProvider
  const accessToken = request.cookies.get('accessToken')?.value;

  // Se está tentando acessar rota privada sem token em cookie, redirecionar para login
  // (A verificação completa será feita no cliente)
  if (!isPublicRoute && !accessToken && pathname.startsWith('/dashboard')) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (public folder)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
