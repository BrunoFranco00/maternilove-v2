'use client';

import { useEffect, ReactNode, useState, useRef } from 'react';
import { useRouter, usePathname } from 'next/navigation';
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
 * NUNCA redirect enquanto status === 'loading'.
 * router.replace apenas UMA vez por transição.
 * UI nunca fica presa em "Carregando...": loading só enquanto status === 'loading'.
 */
export function RoleGuard({ children, allowedRoles, fallbackRoute = '/', userRole }: RoleGuardProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { status } = useAuth();
  const hasRedirectedRef = useRef(false);

  useEffect(() => {
    if (status === 'loading') return;

    if (!userRole) {
      if (pathname !== '/login' && !hasRedirectedRef.current) {
        hasRedirectedRef.current = true;
        router.replace('/login');
      }
      return;
    }

    const hasAccess = checkRoleAccess(userRole, allowedRoles);
    if (!hasAccess) {
      if (pathname !== fallbackRoute && !hasRedirectedRef.current) {
        hasRedirectedRef.current = true;
        router.replace(fallbackRoute);
      }
      return;
    }

    hasRedirectedRef.current = false;
  }, [status, userRole, allowedRoles, fallbackRoute, router, pathname]);

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-600">Carregando...</p>
      </div>
    );
  }

  if (!userRole) return null;

  const hasAccess = checkRoleAccess(userRole, allowedRoles);
  if (!hasAccess) return null;

  return <>{children}</>;
}
