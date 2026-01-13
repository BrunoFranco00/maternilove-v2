import { t } from '@/lib/i18n';

export default function LoginPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8">
      <div className="max-w-md w-full">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          {t('page.login.title')}
        </h1>
        <p className="text-gray-600 mb-8">
          {t('page.login.description')}
        </p>
        {/* Placeholder - formulário será implementado na Fase 2 */}
        <div className="bg-gray-50 p-8 rounded-lg border border-gray-200">
          <p className="text-sm text-gray-500 text-center">
            Formulário de login será implementado na Fase 2
          </p>
        </div>
      </div>
    </div>
  );
}
