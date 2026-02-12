'use client';

/**
 * ProtectedRoute - bloqueia acesso por autenticação e role.
 * Redireciona para /login quando não autenticado (evita tela branca).
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
  const router = useRouter();
  const { status, user, isOnboardingCompleted } = useAuth();

  useEffect(() => {
    if (status === 'unauthenticated' || (status !== 'loading' && !user)) {
      router.push('/login');
    }
  }, [status, user, router]);

  if (status === 'loading') {
    return <LoadingState />;
  }

  if (status === 'unauthenticated' || !user) {
    return <LoadingState />;
  }

  if (!canAccessDashboard(user.role)) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Você não tem permissão para acessar esta página.</p>
        </div>
      </div>
    );
  }

  if (requiresOnboarding(user.role) && !isOnboardingCompleted) {
    const onboardingRoute = getOnboardingRoute(user.role);
    if (onboardingRoute) {
      return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <p className="text-gray-600">Complete o onboarding para continuar.</p>
          </div>
        </div>
      );
    }
  }

  if (requiredRole && user.role !== requiredRole) {
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
