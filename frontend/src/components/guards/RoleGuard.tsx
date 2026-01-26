'use client';

import { useEffect, ReactNode, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
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
  const pathname = usePathname();
  const [hasChecked, setHasChecked] = useState(false);

  useEffect(() => {
    // Aguardar um pouco para garantir que o user foi carregado
    if (userRole === undefined) {
      return;
    }

    setHasChecked(true);

    if (!userRole) {
      if (pathname !== '/login') {
        router.replace('/login');
      }
      return;
    }

    const hasAccess = checkRoleAccess(userRole, allowedRoles);
    if (!hasAccess) {
      if (pathname !== fallbackRoute) {
        router.replace(fallbackRoute);
      }
    }
  }, [userRole, allowedRoles, fallbackRoute, router, pathname]);

  // Aguardar verificação antes de renderizar
  if (!hasChecked || userRole === undefined) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Carregando...</p>
        </div>
      </div>
    );
  }

  if (!userRole) {
    return null;
  }

  const hasAccess = checkRoleAccess(userRole, allowedRoles);
  if (!hasAccess) {
    return null;
  }

  return <>{children}</>;
}
