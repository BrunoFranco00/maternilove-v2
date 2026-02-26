import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

/** Cookie de sessão — setado no login, removido no logout */
const AUTH_COOKIE = 'maternilove-session';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname === '/check-in' || pathname === '/relief') {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('redirect', pathname === '/check-in' ? '/app/check-in' : '/app/relief');
    return NextResponse.redirect(loginUrl);
  }

  if (!pathname.startsWith('/app')) {
    return NextResponse.next();
  }

  const hasAuthCookie = request.cookies.has(AUTH_COOKIE);
  if (!hasAuthCookie) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|images|api).*)',
  ],
};
