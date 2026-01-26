import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Permitir acesso a APIs e assets do Next.js
  if (pathname.startsWith('/api') || pathname.startsWith('/_next')) {
    return NextResponse.next();
  }

  // Rotas públicas - permitir acesso sem autenticação
  const publicRoutes = ['/', '/login', '/register'];
  const isPublicRoute = publicRoutes.some(route => pathname === route || pathname.startsWith(route));

  if (isPublicRoute) {
    return NextResponse.next();
  }

  // Verificar se há indicador de autenticação (user_role cookie)
  // O AuthProvider seta este cookie quando o usuário faz login
  const userRoleCookie = request.cookies.get('user_role')?.value;
  
  // Se não houver cookie de autenticação, redirecionar para login
  if (!userRoleCookie) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // Se houver cookie de autenticação, permitir acesso
  // RBAC e decisões de rota serão feitas no client (RoleGuard, AuthProvider)
  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|icons|images|manifest.json|sw.js|workbox-.*\\.js|fallback-.*\\.js).*)',
  ],
};
