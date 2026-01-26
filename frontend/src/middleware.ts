import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { UserRole, normalizeRole } from '@/lib/auth/roles';
import { checkRoleAccess } from '@/lib/auth/permissions';
import { DEFAULT_FEATURE_FLAGS } from '@/lib/flags/featureFlags';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname.startsWith('/api')) {
    return NextResponse.next();
  }

  if (pathname.startsWith('/_next')) {
    return NextResponse.next();
  }

  const publicRoutes = ['/', '/login', '/register'];
  const isPublicRoute = publicRoutes.some(route => pathname === route || pathname.startsWith(route));

  if (isPublicRoute) {
    return NextResponse.next();
  }

  const userRoleCookie = request.cookies.get('user_role');
  const userRoleRaw = userRoleCookie?.value;
  const userRole = userRoleRaw ? normalizeRole(userRoleRaw) as UserRole : undefined;

  if (pathname.startsWith('/core-emotional')) {
    const flagEnabled = DEFAULT_FEATURE_FLAGS.CORE_EMOTIONAL_ENABLED?.enabled ?? false;
    if (!flagEnabled) {
      return NextResponse.redirect(new URL('/', request.url));
    }
    if (!userRole) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
    return NextResponse.next();
  }

  if (pathname.startsWith('/user')) {
    if (!userRole) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
    const hasAccess = checkRoleAccess(userRole, ['MOTHER', 'PROFESSIONAL', 'COMPANY', 'USER']);
    if (!hasAccess) {
      return NextResponse.redirect(new URL('/', request.url));
    }
    return NextResponse.next();
  }

  if (pathname.startsWith('/testers')) {
    if (!userRole) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
    const hasAccess = checkRoleAccess(userRole, ['SUPER_ADMIN']);
    if (!hasAccess) {
      return NextResponse.redirect(new URL('/', request.url));
    }
    return NextResponse.next();
  }

  if (pathname.startsWith('/admin')) {
    if (!userRole) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
    const hasAccess = checkRoleAccess(userRole, ['ADMIN', 'SUPER_ADMIN']);
    if (!hasAccess) {
      return NextResponse.redirect(new URL('/', request.url));
    }
    if (pathname === '/admin') {
      return NextResponse.redirect(new URL('/admin/overview', request.url));
    }
    return NextResponse.next();
  }

  if (pathname.startsWith('/dashboard')) {
    if (!userRole) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|icons|images|manifest.json|sw.js|workbox-.*\\.js|fallback-.*\\.js).*)',
  ],
};
