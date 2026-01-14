'use client';

/**
 * ProtectedRoute - LOCK FRONTEND 1: Modo Base
 * NÃO bloqueia rotas, apenas renderiza children
 */

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  // LOCK FRONTEND 1: Não bloquear, apenas renderizar
  return <>{children}</>;
}
