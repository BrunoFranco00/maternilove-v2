'use client';

import { ReactNode } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { UserRole } from '@/lib/auth/roles';
import { checkRoleAccess } from '@/lib/auth/permissions';

interface RoleGuardProps {
  children: ReactNode;
  allowedRoles: UserRole[];
  fallbackRoute?: string;
  userRole?: UserRole;
}

/**
 * RoleGuard: bloqueia acesso por role.
 * NUNCA redireciona - apenas bloqueia renderização.
 * Se user inexistente → render null.
 * Se role inválida → render AccessDenied.
 */
export function RoleGuard({ children, allowedRoles, fallbackRoute = '/', userRole }: RoleGuardProps) {
  const { status } = useAuth();

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-600">Carregando...</p>
      </div>
    );
  }

  if (!userRole) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Acesso negado. Faça login para continuar.</p>
        </div>
      </div>
    );
  }

  const hasAccess = checkRoleAccess(userRole, allowedRoles);
  if (!hasAccess) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Você não tem permissão para acessar esta página.</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
