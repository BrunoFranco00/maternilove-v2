'use client';

import { RoleGuard } from '@/components/guards/RoleGuard';
import { useAuth } from '@/hooks/useAuth';
import { UserRole, normalizeRole } from '@/lib/auth/roles';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user } = useAuth();
  const userRole = user?.role ? normalizeRole(user.role) as UserRole : undefined;

  return (
    <RoleGuard
      allowedRoles={['ADMIN', 'SUPER_ADMIN']}
      userRole={userRole}
    >
      <div className="min-h-screen bg-gray-50">
        <nav className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex space-x-8">
              <a href="/admin/overview" className="border-b-2 border-primary-600 py-4 px-1 text-sm font-medium text-primary-600">
                Visão Geral
              </a>
              <a href="/admin/users" className="border-b-2 border-transparent py-4 px-1 text-sm font-medium text-gray-500 hover:text-gray-700 hover:border-gray-300">
                Usuários
              </a>
              <a href="/admin/flags" className="border-b-2 border-transparent py-4 px-1 text-sm font-medium text-gray-500 hover:text-gray-700 hover:border-gray-300">
                Feature Flags
              </a>
              <a href="/admin/logs" className="border-b-2 border-transparent py-4 px-1 text-sm font-medium text-gray-500 hover:text-gray-700 hover:border-gray-300">
                Logs
              </a>
            </div>
          </div>
        </nav>
        {children}
      </div>
    </RoleGuard>
  );
}
