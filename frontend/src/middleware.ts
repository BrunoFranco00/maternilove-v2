import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { PUBLIC_ROUTES } from '@/lib/auth/constants';

/** Rotas que não exigem autenticação (inclui / para homepage) */
const ALL_PUBLIC = ['/', ...PUBLIC_ROUTES];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname.startsWith('/api') || pathname.startsWith('/_next')) {
    return NextResponse.next();
  }

  const isPublic = ALL_PUBLIC.some((r) => pathname === r);
  if (isPublic) {
    return NextResponse.next();
  }

  const userRoleCookie = request.cookies.get('user_role')?.value;
  if (!userRoleCookie) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|icons|images|manifest.json|sw.js|workbox-.*\\.js|fallback-.*\\.js).*)',
  ],
};
