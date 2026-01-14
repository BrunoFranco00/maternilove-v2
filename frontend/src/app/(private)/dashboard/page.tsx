'use client';

/**
 * Dashboard - LOCK FRONTEND FINAL
 * Rota privada protegida
 */

import { useRouter } from 'next/navigation';
import { t } from '@/lib/i18n';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/providers/ToastProvider';

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

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-3xl font-bold text-gray-900">
          {t('page.dashboard.title')}
        </h1>
        <button
          onClick={handleLogout}
          className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
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
            Bem-vindo, <strong>{user.name}</strong>! ({user.email})
          </p>
        </div>
      )}
      {/* Placeholder - conteúdo será implementado na Fase 2 */}
      <div className="bg-gray-50 p-8 rounded-lg border border-gray-200">
        <p className="text-sm text-gray-500 text-center">
          Dashboard será implementado na Fase 2
        </p>
      </div>
    </div>
  );
}

export default function DashboardPage() {
  return (
    <ProtectedRoute>
      <DashboardContent />
    </ProtectedRoute>
  );
}
