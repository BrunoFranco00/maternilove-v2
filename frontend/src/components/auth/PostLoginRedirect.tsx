'use client';

import { useEffect, useRef } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { getDefaultRoute } from '@/utils/rbac';
import { normalizeRole } from '@/lib/auth/roles';

/**
 * Componente de redirecionamento pós-login
 * Centraliza a lógica de redirecionamento baseado em role
 * Executa apenas UMA VEZ por sessão para evitar loops
 * 
 * Mapa de rotas:
 * - SUPER_ADMIN → /admin/overview
 * - ADMIN → /admin/overview
 * - USER → /dashboard
 */
export function PostLoginRedirect() {
  const router = useRouter();
  const pathname = usePathname();
  const { status, user } = useAuth();
  const hasRedirectedRef = useRef(false);
  const lastUserRoleRef = useRef<string | null>(null);

  useEffect(() => {
    // Aguardar status de autenticação estar definido
    if (status === 'unknown') {
      return;
    }

    // Se não autenticado, resetar flags
    if (status !== 'authenticated' || !user) {
      hasRedirectedRef.current = false;
      lastUserRoleRef.current = null;
      return;
    }

    // Se o role mudou, resetar flag
    if (lastUserRoleRef.current !== user.role) {
      hasRedirectedRef.current = false;
      lastUserRoleRef.current = user.role;
    }

    // Rotas públicas onde usuário autenticado deve ser redirecionado
    const publicRoutes = ['/', '/login', '/register'];
    const isPublicRoute = publicRoutes.includes(pathname);
    
    if (isPublicRoute && !hasRedirectedRef.current) {
      const normalizedRole = normalizeRole(user.role);
      const defaultRoute = getDefaultRoute(normalizedRole);
      
      // Verificar se já está na rota correta
      if (pathname !== defaultRoute) {
        hasRedirectedRef.current = true;
        router.replace(defaultRoute);
      }
    }
  }, [status, user, pathname, router]);

  // Componente não renderiza nada
  return null;
}
