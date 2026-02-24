'use client';

import { ReactNode } from 'react';

interface RoleGuardProps {
  children: ReactNode;
  allowedRoles?: string[];
  userRole?: string;
}

/**
 * RoleGuard - AUTH DESABILITADO PARA TESTE: sempre renderiza children.
 */
export function RoleGuard({ children }: RoleGuardProps) {
  return <>{children}</>;
}
