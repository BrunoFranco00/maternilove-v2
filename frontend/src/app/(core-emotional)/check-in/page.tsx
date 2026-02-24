import { redirect } from 'next/navigation';

export const dynamic = 'force-dynamic';

export default function CheckInRedirect() {
  redirect('/app/check-in');
}
