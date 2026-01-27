import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { PUBLIC_ROUTES } from '@/lib/auth/constants';

/** Rotas que não exigem autenticação (inclui / para homepage) */
const ALL_PUBLIC = ['/', ...PUBLIC_ROUTES];

/** Rotas privadas que exigem autenticação */
const PRIVATE_ROUTES = ['/admin', '/dashboard'];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Permitir APIs e assets do Next.js
  if (pathname.startsWith('/api') || pathname.startsWith('/_next')) {
    return NextResponse.next();
  }

  // Rotas públicas sempre permitidas
  const isPublic = ALL_PUBLIC.some((r) => pathname === r || pathname.startsWith(`${r}/`));
  if (isPublic) {
    return NextResponse.next();
  }

  // Proteger SOMENTE rotas privadas
  const isPrivate = PRIVATE_ROUTES.some((r) => pathname.startsWith(r));
  if (isPrivate) {
    const userRoleCookie = request.cookies.get('user_role')?.value;
    if (!userRoleCookie) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }

  // Todas as outras rotas passam (middleware não decide destino)
  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|icons|images|manifest.json|sw.js|workbox-.*\\.js|fallback-.*\\.js).*)',
  ],
};
