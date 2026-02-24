'use client';

import { RoleGuard } from '@/components/guards/RoleGuard';

/**
 * UserLayout - AUTH DESABILITADO PARA TESTE: sem useAuth.
 */
export default function UserLayout({
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
