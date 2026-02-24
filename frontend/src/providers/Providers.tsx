'use client';

/**
 * Composição única de providers
 * Ordem: ToastProvider -> ApiProvider -> AuthProvider -> children
 * Redirects centralizados no AuthProvider.
 */

import React, { ReactNode } from 'react';
import { ToastProvider } from './ToastProvider';
import { ApiProvider } from './ApiProvider';
// import { AuthProvider } from './AuthProvider';

interface ProvidersProps {
  children: ReactNode;
}

export function Providers({ children }: ProvidersProps) {
  return (
    <ToastProvider>
      <ApiProvider>
        {/* AuthProvider desabilitado temporariamente para teste */}
        {/* <AuthProvider>{children}</AuthProvider> */}
        {children}
      </ApiProvider>
    </ToastProvider>
  );
}
