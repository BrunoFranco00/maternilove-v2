import { redirect } from 'next/navigation';

export const dynamic = 'force-dynamic';

export default function AdminLogsRedirect() {
  redirect('/app/admin/audit');
}
