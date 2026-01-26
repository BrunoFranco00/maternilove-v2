/**
 * Constantes de autenticação compartilhadas
 * Usado por middleware e AuthProvider
 */

export const PUBLIC_ROUTES = ['/login', '/register'] as const;

export type PublicRoute = (typeof PUBLIC_ROUTES)[number];

export function isPublicRoute(pathname: string): boolean {
  return PUBLIC_ROUTES.some((route) => pathname === route);
}
