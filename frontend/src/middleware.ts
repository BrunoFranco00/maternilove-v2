import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

/** Cookie usado pelo middleware para checagem de sessão (quando auth estiver habilitada) */
const AUTH_COOKIE = 'maternilove-session';

/**
 * Rotas públicas (/, /login, /register, /planos, /profissionais) têm acesso livre.
 * /app/* é protegido quando AUTH_MIDDLEWARE_ENABLED=true (usa cookie maternilove-session).
 */

/** Quando true, protege /app/* e redireciona não autenticados para /login */
const AUTH_MIDDLEWARE_ENABLED = process.env.AUTH_MIDDLEWARE_ENABLED === 'true';
/** Modo demo/dev: bypass de auth para todas as rotas /app/* */
const AUTH_DISABLED = process.env.NEXT_PUBLIC_AUTH_DISABLED === 'true';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (!pathname.startsWith('/app')) {
    return NextResponse.next();
  }

  if (!AUTH_MIDDLEWARE_ENABLED || AUTH_DISABLED) {
    return NextResponse.next();
  }

  const hasAuthCookie = request.cookies.has(AUTH_COOKIE);
  if (!hasAuthCookie) {
    const loginUrl = new URL('/login', request.url);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|images|api).*)',
  ],
};
