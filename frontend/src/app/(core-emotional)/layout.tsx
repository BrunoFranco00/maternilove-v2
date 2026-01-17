'use client';

import { FeatureFlagGuard } from '@/components/guards/FeatureFlagGuard';

export default function CoreEmotionalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <FeatureFlagGuard flag="CORE_EMOTIONAL_ENABLED">
      <div className="min-h-screen bg-gradient-to-b from-primary-50 to-white">
        {children}
      </div>
    </FeatureFlagGuard>
  );
}
