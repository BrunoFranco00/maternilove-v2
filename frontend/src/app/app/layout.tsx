'use client';

import { PremiumLayout } from '@/premium/PremiumLayout';

/**
 * Layout da plataforma logada (/app/*)
 * Premium Visual System — radial gradient, noise, GlassCardV2, LogoPremiumV3
 */
export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <PremiumLayout>{children}</PremiumLayout>;
}
