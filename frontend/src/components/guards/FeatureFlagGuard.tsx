'use client';

import { ReactNode } from 'react';
import { FeatureFlagKey } from '@/lib/flags/featureFlags';
import { getFlagValue } from '@/lib/flags/flagResolver';

interface FeatureFlagGuardProps {
  children: ReactNode;
  flag: FeatureFlagKey;
  fallback?: ReactNode;
}

export function FeatureFlagGuard({ children, flag, fallback = null }: FeatureFlagGuardProps) {
  const isEnabled = getFlagValue(flag);

  if (!isEnabled) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
}
