'use client';

import { RoleGuard } from '@/components/guards/RoleGuard';
import { useAuth } from '@/hooks/useAuth';

export default function TestersLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user } = useAuth();

  return (
    <RoleGuard
      allowedRoles={['SUPER_ADMIN']}
      userRole={user?.role as any}
    >
      <div className="min-h-screen bg-gray-50">
        {children}
      </div>
    </RoleGuard>
  );
}
