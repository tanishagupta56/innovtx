import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import Link from 'next/link';

export const metadata = { title: 'Dashboard — TechNeeds IGDTUW' };

export default async function DashboardPage() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single();

  const { count: regCount } = await supabase
    .from('event_registrations')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', user.id);

  const { count: ticketCount } = await supabase
    .from('tickets')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', user.id);

  return (
    <div>
      <h1 className="font-display text-3xl font-bold text-white mb-2">
        Welcome{profile?.full_name ? `, ${profile.full_name}` : ''}
      </h1>
      <p className="text-gray-500 mb-8">Your TechNeeds dashboard</p>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <div className="card">
          <p className="text-xs text-gray-500 uppercase tracking-wider mb-2">Registrations</p>
          <p className="text-3xl font-display font-bold text-white">{regCount || 0}</p>
        </div>
        <div className="card">
          <p className="text-xs text-gray-500 uppercase tracking-wider mb-2">Tickets</p>
          <p className="text-3xl font-display font-bold text-white">{ticketCount || 0}</p>
        </div>
        <div className="card">
          <p className="text-xs text-gray-500 uppercase tracking-wider mb-2">Role</p>
          <p className="text-lg font-display text-white capitalize">{profile?.role || 'student'}</p>
        </div>
      </div>

      <div className="flex gap-3">
        <Link href="/dashboard/registrations" className="btn-ghost text-sm py-2 px-4">
          View Registrations
        </Link>
        <Link href="/dashboard/tickets" className="btn-ghost text-sm py-2 px-4">
          View Tickets
        </Link>
        <Link href="/events" className="btn-primary text-sm py-2 px-4">
          Browse Events
        </Link>
      </div>
    </div>
  );
}
