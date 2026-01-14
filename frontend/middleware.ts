import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

/**
 * Middleware simplificado
 * Por enquanto, apenas permite todas as rotas
 * A proteção será feita no cliente via AuthProvider
 */

export function middleware(request: NextRequest) {
  // Por enquanto, apenas passar todas as requisições
  // A proteção de rotas será feita no cliente
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
