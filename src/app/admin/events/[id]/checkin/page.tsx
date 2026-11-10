import { createClient } from '@/lib/supabase/server';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import CheckinScanner from './CheckinScanner';

export const metadata = { title: 'Event Check-in Scanner — Admin Console' };

export default async function CheckinPage({
  params,
}: {
  params: { id: string };
}) {
  const supabase = createClient();

  const { data: event } = await supabase
    .from('events')
    .select('id, title, venue, start_date')
    .eq('id', params.id)
    .single();

  if (!event) notFound();

  return (
    <div>
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-1">
          <Link href="/admin/events" className="text-xs font-mono text-gray-400 hover:text-white">
            ← Events
          </Link>
          <span className="text-gray-600">/</span>
          <span className="text-xs font-mono text-lime">{event.title}</span>
        </div>
        <h1 className="font-display text-3xl font-bold text-white tracking-tight">
          Gate Scanner &amp; Verification
        </h1>
        <p className="text-xs font-mono text-gray-400 mt-1">
          Venue: {event.venue || 'IGDTUW Campus'} | Real-time HMAC authentication &amp; duplicate entry prevention.
        </p>
      </div>

      <CheckinScanner eventId={event.id} eventTitle={event.title} />
    </div>
  );
}
