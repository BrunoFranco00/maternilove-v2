import { redirect } from 'next/navigation';

export const dynamic = 'force-dynamic';

export default function AdminOverviewRedirect() {
  redirect('/app/admin/overview');
}
