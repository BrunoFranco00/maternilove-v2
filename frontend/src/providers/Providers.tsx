'use client';

/**
 * Composição única de providers
 * Ordem: ErrorBoundary -> ToastProvider -> ApiProvider -> AuthProvider -> children
 */

import React, { ReactNode } from 'react';
import { ErrorBoundary } from './ErrorBoundary';
import { ToastProvider } from './ToastProvider';
import { ApiProvider } from './ApiProvider';
import { AuthProvider } from './AuthProvider';

interface ProvidersProps {
  children: ReactNode;
}

export function Providers({ children }: ProvidersProps) {
  return (
    <ErrorBoundary>
      <ToastProvider>
        <ApiProvider>
          <AuthProvider>{children}</AuthProvider>
        </ApiProvider>
      </ToastProvider>
    </ErrorBoundary>
  );
}
