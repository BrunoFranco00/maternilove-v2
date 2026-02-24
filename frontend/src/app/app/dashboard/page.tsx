'use client';

export const dynamic = 'force-dynamic';

/**
 * Dashboard - AUTH DESABILITADO PARA TESTE: renderiza sem proteção.
 */

import { t } from '@/lib/i18n';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { RoleGuard } from '@/components/guards/RoleGuard';

function DashboardContent() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-3xl font-bold text-gray-900">
          {t('page.dashboard.title')}
        </h1>
      </div>
      <p className="text-gray-600 mb-8">
        {t('page.dashboard.description')}
      </p>
      <div className="mb-4 p-4 bg-amber-50 rounded-lg">
        <p className="text-sm text-amber-800">
          Auth desabilitado para teste. Sessão não validada.
        </p>
      </div>
      <div className="bg-gray-50 p-8 rounded-lg border border-gray-200">
        <p className="text-sm text-gray-500 text-center">
          Conteúdo em desenvolvimento
        </p>
      </div>
    </div>
  );
}

export default function DashboardPage() {
  return (
    <ProtectedRoute>
      <RoleGuard>
        <DashboardContent />
      </RoleGuard>
    </ProtectedRoute>
  );
}
