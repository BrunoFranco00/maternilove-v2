'use client';

import { useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { UserRole } from '@/lib/auth/roles';
import { checkRoleAccess } from '@/lib/auth/permissions';

interface RoleGuardProps {
  children: ReactNode;
  allowedRoles: UserRole[];
  fallbackRoute?: string;
  userRole?: UserRole;
}

export function RoleGuard({ children, allowedRoles, fallbackRoute = '/', userRole }: RoleGuardProps) {
  const router = useRouter();

  useEffect(() => {
    if (!userRole) {
      router.push('/login');
      return;
    }

    const hasAccess = checkRoleAccess(userRole, allowedRoles);
    if (!hasAccess) {
      router.push(fallbackRoute);
    }
  }, [userRole, allowedRoles, fallbackRoute, router]);

  if (!userRole) {
    return null;
  }

  const hasAccess = checkRoleAccess(userRole, allowedRoles);
  if (!hasAccess) {
    return null;
  }

  return <>{children}</>;
}
