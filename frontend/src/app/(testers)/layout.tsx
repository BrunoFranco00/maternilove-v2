'use client';

import { RoleGuard } from '@/components/guards/RoleGuard';

/**
 * TestersLayout - AUTH DESABILITADO PARA TESTE: sem useAuth.
 */
export default function TestersLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <RoleGuard>
      <div className="min-h-screen bg-gray-50">{children}</div>
    </RoleGuard>
  );
}
