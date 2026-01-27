'use client';

/**
 * Dashboard - LOCK RBAC 1
 * Rota privada protegida com exibição de role
 */

import { useRouter } from 'next/navigation';
import { t } from '@/lib/i18n';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { RoleGuard } from '@/components/guards/RoleGuard';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/providers/ToastProvider';

const ROLE_LABELS: Record<string, string> = {
  USER: 'Usuário',
  MOTHER: 'Mãe',
  PROFESSIONAL: 'Profissional',
  COMPANY: 'Empresa',
  ADMIN: 'Administrador',
  SUPER_ADMIN: 'Super Administrador',
};

function DashboardContent() {
  const router = useRouter();
  const { user, logout } = useAuth();
  const { showToast } = useToast();

  const handleLogout = async () => {
    try {
      await logout();
      showToast('Logout realizado com sucesso!', 'success');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao fazer logout';
      showToast(errorMessage, 'error');
      console.error('Erro no logout:', err);
    }
  };

  const roleLabel = user?.role ? ROLE_LABELS[user.role] || user.role : '';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-3xl font-bold text-gray-900">
          {t('page.dashboard.title')}
        </h1>
        <button
          onClick={handleLogout}
          aria-label="Sair da conta"
          className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-colors"
        >
          Sair
        </button>
      </div>
      <p className="text-gray-600 mb-8">
        {t('page.dashboard.description')}
      </p>
      {user && (
        <div className="mb-4 p-4 bg-blue-50 rounded-lg">
          <p className="text-sm text-blue-800">
            Usuário: <strong>{user.name}</strong> ({user.email})
          </p>
          {roleLabel && (
            <p className="text-sm text-blue-700 mt-1">
              Perfil: <strong>{roleLabel}</strong>
            </p>
          )}
        </div>
      )}
      <div className="bg-gray-50 p-8 rounded-lg border border-gray-200">
        <p className="text-sm text-gray-500 text-center">
          Conteúdo em desenvolvimento
        </p>
      </div>
    </div>
  );
}

export default function DashboardPage() {
  const { user } = useAuth();

  return (
    <ProtectedRoute>
      <RoleGuard allowedRoles={['USER', 'ADMIN', 'SUPER_ADMIN']} userRole={user?.role}>
        <DashboardContent />
      </RoleGuard>
    </ProtectedRoute>
  );
}
