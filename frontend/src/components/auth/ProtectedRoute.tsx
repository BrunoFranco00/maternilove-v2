'use client';

/**
 * ProtectedRoute - LOCK RBAC 1
 * Protege rotas privadas, verifica role e onboarding
 */

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { LoadingState } from '@/components/feedback/LoadingState';
import { canAccessDashboard, getOnboardingRoute, requiresOnboarding, getDefaultRoute } from '@/utils/rbac';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: string;
}

export function ProtectedRoute({ children, requiredRole }: ProtectedRouteProps) {
  const { status, user, isOnboardingCompleted } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (status === 'loading') return;
    if (status === 'unauthenticated') {
      router.replace('/login');
      return;
    }

    if (status === 'authenticated' && user) {
      // Verificar se role tem acesso ao dashboard
      if (!canAccessDashboard(user.role)) {
        router.push('/login');
        return;
      }

      // Verificar se role requer onboarding
      if (requiresOnboarding(user.role) && !isOnboardingCompleted) {
        const onboardingRoute = getOnboardingRoute(user.role);
        if (onboardingRoute) {
          router.push(onboardingRoute);
          return;
        }
      }

      // Verificar role específico se fornecido
      if (requiredRole && user.role !== requiredRole) {
        router.push(getDefaultRoute(user.role));
        return;
      }
    }
  }, [status, user, isOnboardingCompleted, router, requiredRole]);

  if (status === 'loading') {
    return <LoadingState />;
  }

  if (status === 'unauthenticated') {
    return null; // Redirecionando
  }

  if (!user) {
    return null; // Redirecionando
  }

  if (!canAccessDashboard(user.role)) {
    return null; // Redirecionando
  }

  if (requiresOnboarding(user.role) && !isOnboardingCompleted) {
    return null; // Redirecionando
  }

  if (requiredRole && user.role !== requiredRole) {
    return null; // Redirecionando
  }

  return <>{children}</>;
}
