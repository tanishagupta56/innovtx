import { createClient } from '@/lib/supabase/server';
import { notFound } from 'next/navigation';
import { getEventTiming, getRegistrationStatus, formatDateTime } from '@/lib/utils';
import Link from 'next/link';
import RegisterButton from './RegisterButton';

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const supabase = createClient();
  const { data: event } = await supabase
    .from('events')
    .select('title, short_description')
    .eq('slug', params.slug)
    .eq('status', 'published')
    .single();

  if (!event) return { title: 'Event Not Found' };
  return { title: `${event.title} — TechNeeds IGDTUW`, description: event.short_description };
}

export default async function EventDetailPage({ params }: { params: { slug: string } }) {
  const supabase = createClient();

  const { data: event } = await supabase
    .from('events')
    .select('*')
    .eq('slug', params.slug)
    .eq('status', 'published')
    .single();

  if (!event) notFound();

  const { count: regCount } = await supabase
    .from('event_registrations')
    .select('*', { count: 'exact', head: true })
    .eq('event_id', event.id);

  const timing = getEventTiming(event.start_date, event.end_date);
  const regStatus = getRegistrationStatus(
    event.registration_start,
    event.registration_end,
    regCount || 0,
    event.max_participants
  );

  // Check if current user is registered
  const { data: { user } } = await supabase.auth.getUser();
  let isRegistered = false;
  if (user) {
    const { data: reg } = await supabase
      .from('event_registrations')
      .select('id')
      .eq('event_id', event.id)
      .eq('user_id', user.id)
      .single();
    isRegistered = !!reg;
  }

  return (
    <div className="pt-28 pb-20 px-6">
      <div className="max-w-4xl mx-auto">
        <Link href="/events" className="text-cobalt-300 hover:text-lime text-sm mb-6 inline-block transition-colors">
          ← Back to events
        </Link>

        {event.poster_url && (
          <div className="aspect-[21/9] mb-8 overflow-hidden bg-charcoal border border-cobalt/10">
            <img src={event.poster_url} alt={event.title} className="w-full h-full object-cover" />
          </div>
        )}

        <div className="flex items-center gap-3 mb-4">
          <span className={`text-xs font-mono px-2 py-0.5 ${
            timing === 'upcoming' ? 'bg-lime/10 text-lime' :
            timing === 'ongoing' ? 'bg-cobalt/10 text-cobalt-300' :
            'bg-gray-800 text-gray-500'
          }`}>
            {timing.toUpperCase()}
          </span>
          <span className="text-xs text-gray-500 font-mono">{event.category}</span>
        </div>

        <h1 className="font-display text-4xl md:text-5xl font-bold text-white mb-6">
          {event.title}
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <div className="card">
            <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Date</p>
            <p className="text-white text-sm">{formatDateTime(event.start_date)}</p>
            <p className="text-gray-500 text-xs mt-1">to {formatDateTime(event.end_date)}</p>
          </div>
          {event.venue && (
            <div className="card">
              <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Venue</p>
              <p className="text-white text-sm">{event.venue}</p>
            </div>
          )}
          <div className="card">
            <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Registration</p>
            <p className={`text-sm font-medium ${
              regStatus === 'open' ? 'text-lime' : 'text-gray-500'
            }`}>
              {regStatus === 'open' ? 'Open' :
               regStatus === 'closed' ? 'Closed' :
               regStatus === 'not_started' ? 'Not yet open' :
               'Full'}
            </p>
            {regCount !== null && (
              <p className="text-gray-600 text-xs mt-1">
                {regCount} registered{event.max_participants ? ` / ${event.max_participants}` : ''}
              </p>
            )}
          </div>
        </div>

        {/* Registration action */}
        <div className="mb-10">
          <RegisterButton
            eventId={event.id}
            isLoggedIn={!!user}
            isRegistered={isRegistered}
            regStatus={regStatus}
          />
        </div>

        {/* Description */}
        {event.description && (
          <div className="prose prose-invert max-w-none">
            <div className="text-gray-300 leading-relaxed whitespace-pre-wrap">
              {event.description}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
