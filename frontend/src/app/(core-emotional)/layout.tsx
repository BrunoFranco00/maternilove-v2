'use client';

import { FeatureFlagGuard } from '@/components/guards/FeatureFlagGuard';

export default function CoreEmotionalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <FeatureFlagGuard
      flag="CORE_EMOTIONAL_ENABLED"
      fallback={<div className="p-8 text-center">Módulo em manutenção</div>}
    >
      <div className="min-h-screen bg-gradient-to-b from-primary-50 to-white">
        {children}
      </div>
    </FeatureFlagGuard>
  );
}
