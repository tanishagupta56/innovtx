import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { formatDate } from '@/lib/utils';
import QRDisplay from './QRDisplay';

export const metadata = { title: 'My Registrations — TechNeeds' };

export default async function RegistrationsPage() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  const { data: registrations } = await supabase
    .from('event_registrations')
    .select(`
      id, qr_token_hash, registered_at,
      events:event_id (id, title, slug, start_date, end_date, venue),
      attendance:attendance (id, checked_in_at)
    `)
    .eq('user_id', user.id)
    .order('registered_at', { ascending: false });

  return (
    <div>
      <h1 className="font-display text-3xl font-bold text-white mb-6">My Registrations</h1>

      {registrations && registrations.length > 0 ? (
        <div className="space-y-4">
          {registrations.map((reg) => {
            const event = reg.events as any;
            const attended = Array.isArray(reg.attendance) ? reg.attendance.length > 0 : !!reg.attendance;
            return (
              <div key={reg.id} className="card">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <h3 className="font-display text-lg font-semibold text-white">
                      {event?.title}
                    </h3>
                    <div className="flex items-center gap-3 mt-1 text-sm text-gray-500">
                      <span>{event ? formatDate(event.start_date) : ''}</span>
                      {event?.venue && <span>· {event.venue}</span>}
                    </div>
                    <div className="mt-2">
                      {attended ? (
                        <span className="text-xs font-mono bg-lime/10 text-lime px-2 py-0.5">ATTENDED</span>
                      ) : (
                        <span className="text-xs font-mono bg-cobalt/10 text-cobalt-300 px-2 py-0.5">REGISTERED</span>
                      )}
                    </div>
                  </div>

                  <QRDisplay registrationId={reg.id} eventTitle={event?.title || ''} />
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="card text-center py-12">
          <p className="text-gray-500">No registrations yet.</p>
          <a href="/events" className="text-cobalt-300 hover:text-lime text-sm mt-2 inline-block">
            Browse events →
          </a>
        </div>
      )}
    </div>
  );
}
