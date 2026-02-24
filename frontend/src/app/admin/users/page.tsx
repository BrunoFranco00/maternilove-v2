import { redirect } from 'next/navigation';

export const dynamic = 'force-dynamic';

export default function AdminUsersRedirect() {
  redirect('/app/admin/users');
}
