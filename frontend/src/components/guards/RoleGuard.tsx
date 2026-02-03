'use client';

import { ReactNode } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { normalizeRole, type NormalizedRole } from '@/lib/normalizeRole';

interface RoleGuardProps {
  children: ReactNode;
  /** Roles permitidas para a rota (já normalizadas ou em qualquer casing). Opcional. */
  allowedRoles?: NormalizedRole[];
  /** Role atual do usuário (string crua do backend / estado). */
  userRole?: string;
}

/**
 * RoleGuard: bloqueia acesso por role, sem redirecionar.
 *
 * Regras:
 * - SUPER_ADMIN sempre tem acesso total.
 * - Se allowedRoles não existir → permitir.
 * - Se role normalizada não estiver em allowedRoles → bloquear.
 */
export function RoleGuard({ children, allowedRoles, userRole }: RoleGuardProps) {
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
  const normalized = normalizeRole(userRole);

  // SUPER_ADMIN sempre tem acesso total
  if (normalized === 'SUPER_ADMIN') {
    return <>{children}</>;
  }

  // Se não houver allowedRoles, permitir
  if (!allowedRoles || allowedRoles.length === 0) {
    return <>{children}</>;
  }

  const normalizedAllowed = allowedRoles.map((r) => normalizeRole(r));
  const hasAccess = normalizedAllowed.includes(normalized);

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

