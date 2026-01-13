import { t } from '@/lib/i18n';

export default function DashboardPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-4">
        {t('page.dashboard.title')}
      </h1>
      <p className="text-gray-600 mb-8">
        {t('page.dashboard.description')}
      </p>
      {/* Placeholder - conteúdo será implementado na Fase 2 */}
      <div className="bg-gray-50 p-8 rounded-lg border border-gray-200">
        <p className="text-sm text-gray-500 text-center">
          Dashboard será implementado na Fase 2
        </p>
      </div>
    </div>
  );
}
