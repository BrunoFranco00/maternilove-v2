'use client';

/**
 * ProtectedRoute - AUTH DESABILITADO PARA TESTE: sempre renderiza children.
 */

import { ReactNode } from 'react';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: string;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  return <>{children}</>;
}
