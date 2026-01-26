'use client';

import { useEffect, ReactNode, useState, useRef } from 'react';
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
  const hasRedirectedRef = useRef(false);

  useEffect(() => {
    // Resetar flag quando userRole muda
    if (userRole === undefined) {
      hasRedirectedRef.current = false;
      return;
    }

    setHasChecked(true);

    // Se não houver role, redirecionar para login (apenas uma vez)
    if (!userRole) {
      if (pathname !== '/login' && !hasRedirectedRef.current) {
        hasRedirectedRef.current = true;
        router.replace('/login');
      }
      return;
    }

    // Verificar acesso baseado em role
    const hasAccess = checkRoleAccess(userRole, allowedRoles);
    
    // Se não tiver acesso, redirecionar para fallback (apenas uma vez)
    if (!hasAccess) {
      if (pathname !== fallbackRoute && !hasRedirectedRef.current) {
        hasRedirectedRef.current = true;
        router.replace(fallbackRoute);
      }
      return;
    }

    // Se tem acesso, resetar flag para permitir futuros redirects se necessário
    hasRedirectedRef.current = false;
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
