import { PrivateLayoutClient } from '@/components/layout/PrivateLayoutClient';

export const dynamic = 'force-dynamic';

export default function PrivateLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <PrivateLayoutClient>{children}</PrivateLayoutClient>;
}
