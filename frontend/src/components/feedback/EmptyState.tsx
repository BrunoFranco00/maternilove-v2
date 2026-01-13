/**
 * Componente de estado vazio
 * Título + descrição + ação opcional
 */

import { t } from '@/lib/i18n';

interface EmptyStateProps {
  title?: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  className?: string;
}

export function EmptyState({
  title,
  description,
  action,
  className = '',
}: EmptyStateProps) {
  return (
    <div className={`flex flex-col items-center justify-center p-8 text-center ${className}`}>
      <div className="max-w-md">
        <h2 className="text-xl font-semibold text-gray-900 mb-2">
          {title || t('common.empty')}
        </h2>
        <p className="text-gray-600 mb-6">
          {description || t('common.empty.description')}
        </p>
        {action && (
          <button
            onClick={action.onClick}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            {action.label}
          </button>
        )}
      </div>
    </div>
  );
}
