'use client';

import { ErrorState } from '@/components/feedback/ErrorState';
import { t } from '@/lib/i18n';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <ErrorState
      title={t('error.generic')}
      description={t('error.generic.description')}
      onRetry={reset}
    />
  );
}
