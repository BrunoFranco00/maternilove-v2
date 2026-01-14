'use client';

/**
 * Componente de proteção de rotas privadas
 * Redireciona para /login se não autenticado
 */

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { LoadingState } from '@/components/feedback/LoadingState';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { status } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    }
  }, [status, router]);

  if (status === 'unknown') {
    return <LoadingState />;
  }

  if (status === 'unauthenticated') {
    return null; // Redirecionando
  }

  return <>{children}</>;
}
