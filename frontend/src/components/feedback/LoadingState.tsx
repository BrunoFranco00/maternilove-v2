/**
 * Componente de estado de carregamento
 * Skeleton simples sem dependências externas
 */

import { t } from '@/lib/i18n';

interface LoadingStateProps {
  message?: string;
  className?: string;
}

export function LoadingState({ message, className = '' }: LoadingStateProps) {
  return (
    <div className={`flex flex-col items-center justify-center p-8 ${className}`}>
      <div className="animate-pulse space-y-4 w-full max-w-md">
        {/* Skeleton bars */}
        <div className="h-4 bg-gray-200 rounded w-3/4"></div>
        <div className="h-4 bg-gray-200 rounded w-1/2"></div>
        <div className="h-4 bg-gray-200 rounded w-5/6"></div>
      </div>
      {message && (
        <p className="mt-4 text-sm text-gray-600">{message}</p>
      )}
      {!message && (
        <p className="mt-4 text-sm text-gray-600">{t('common.loading')}</p>
      )}
    </div>
  );
}
