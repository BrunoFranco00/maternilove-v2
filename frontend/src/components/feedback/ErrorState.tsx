/**
 * Componente de estado de erro
 * Título + descrição + botão "Tentar novamente" opcional
 */

import { t } from '@/lib/i18n';

interface ErrorStateProps {
  title?: string;
  description?: string;
  onRetry?: () => void;
  className?: string;
}

export function ErrorState({
  title,
  description,
  onRetry,
  className = '',
}: ErrorStateProps) {
  return (
    <div className={`flex flex-col items-center justify-center p-8 text-center ${className}`}>
      <div className="max-w-md">
        <h2 className="text-xl font-semibold text-gray-900 mb-2">
          {title || t('error.generic')}
        </h2>
        <p className="text-gray-600 mb-6">
          {description || t('error.generic.description')}
        </p>
        {onRetry && (
          <button
            onClick={onRetry}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            {t('common.retry')}
          </button>
        )}
      </div>
    </div>
  );
}
