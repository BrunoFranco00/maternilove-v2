import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

/** Rotas públicas (não exigem autenticação) */
const ALL_PUBLIC = ['/', '/login', '/register'];

/** Roles que podem acessar /admin/* */
const ADMIN_ROLES = ['ADMIN', 'SUPER_ADMIN'];

function isAdminRole(role: string | undefined): boolean {
  if (!role) return false;
  const upper = role.toUpperCase();
  return ADMIN_ROLES.includes(upper);
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname.startsWith('/api') || pathname.startsWith('/_next')) {
    return NextResponse.next();
  }

  const isPublic = ALL_PUBLIC.some((r) => pathname === r || pathname.startsWith(`${r}/`));
  if (isPublic) {
    return NextResponse.next();
  }

  const userRole = request.cookies.get('user_role')?.value;

  // /admin/*: apenas ADMIN ou SUPER_ADMIN
  if (pathname.startsWith('/admin')) {
    if (!userRole) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
    if (!isAdminRole(userRole)) {
      return NextResponse.redirect(new URL('/check-in', request.url));
    }
    return NextResponse.next();
  }

  // Demais rotas privadas: exigir autenticação
  if (!userRole) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|images).*)',
  ],
};
