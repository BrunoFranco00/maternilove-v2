'use client';

/**
 * ProtectedRoute - Redireciona para login quando não autenticado.
 * O middleware já protege /app/*; este componente é fallback para fluxos client-side.
 */

import { ReactNode, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/providers/AuthProvider';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: string;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const router = useRouter();
  const { status, authReady } = useAuth();

  useEffect(() => {
    if (!authReady) return;
    if (status === 'unauthenticated') {
      router.replace('/login');
    }
  }, [status, authReady, router]);

  if (!authReady || status === 'unauthenticated') {
    return null;
  }

  return <>{children}</>;
}
