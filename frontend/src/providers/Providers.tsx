'use client';

/**
 * Composição única de providers
 * Ordem: ToastProvider -> ApiProvider -> AuthProvider -> PostLoginRedirect -> children
 * ErrorBoundary removido temporariamente para evitar erro SSR
 */

import React, { ReactNode } from 'react';
import { ToastProvider } from './ToastProvider';
import { ApiProvider } from './ApiProvider';
import { AuthProvider } from './AuthProvider';
import { PostLoginRedirect } from '@/components/auth/PostLoginRedirect';

interface ProvidersProps {
  children: ReactNode;
}

export function Providers({ children }: ProvidersProps) {
  return (
    <ToastProvider>
      <ApiProvider>
        <AuthProvider>
          <PostLoginRedirect />
          {children}
        </AuthProvider>
      </ApiProvider>
    </ToastProvider>
  );
}
