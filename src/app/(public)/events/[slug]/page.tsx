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

  // Check if authenticated student has already booked
  const {
    data: { user },
  } = await supabase.auth.getUser();

  let isRegistered = false;
  if (user) {
    const { data: reg } = await supabase
      .from('event_registrations')
      .select('id')
      .eq('event_id', event.id)
      .eq('user_id', user.id)
      .maybeSingle();
    isRegistered = !!reg;
  }

  return (
    <div className="pt-32 pb-24 px-6 sm:px-12 bg-midnight min-h-screen text-white">
      <div className="max-w-5xl mx-auto space-y-12">
        {/* Navigation Breadcrumb */}
        <div className="flex items-center gap-2 font-mono text-xs text-gray-500">
          <Link href="/events" className="text-gray-400 hover:text-lime transition-colors">
            ← ALL EVENTS
          </Link>
          <span>/</span>
          <span className="text-lime">{event.title}</span>
        </div>

        {/* Poster Showcase */}
        {event.poster_url && (
          <div className="aspect-[21/9] w-full border border-cobalt/30 bg-black overflow-hidden relative shadow-[0_10px_40px_rgba(21,88,201,0.2)]">
            <img
              src={event.poster_url}
              alt={event.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-midnight/90 via-transparent to-transparent pointer-events-none" />
          </div>
        )}

        {/* Event Header Block */}
        <div className="space-y-4 border-b border-cobalt/20 pb-8">
          <div className="flex flex-wrap items-center gap-3">
            <span className="tag-telemetry-lime font-bold">
              {timing.toUpperCase()}
            </span>
            <span className="font-mono text-xs text-cobalt-300 uppercase">
              {'// ' + event.category}
            </span>
          </div>

          <h1 className="editorial-title text-4xl sm:text-6xl text-white">
            {event.title}
          </h1>

          {event.short_description && (
            <p className="text-gray-300 font-body text-lg leading-relaxed max-w-3xl">
              {event.short_description}
            </p>
          )}
        </div>

        {/* Event Metadata Dashboard */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 font-mono text-xs">
          <div className="p-6 border border-cobalt/25 bg-[#050816]">
            <span className="text-gray-500 uppercase tracking-widest block mb-1">SCHEDULE</span>
            <p className="text-white font-bold text-sm">{formatDateTime(event.start_date)}</p>
            <p className="text-gray-400 mt-1">to {formatDateTime(event.end_date)}</p>
          </div>

          <div className="p-6 border border-cobalt/25 bg-[#050816]">
            <span className="text-gray-500 uppercase tracking-widest block mb-1">LOCATION</span>
            <p className="text-white font-bold text-sm">{event.venue || 'IGDTUW Campus'}</p>
            <p className="text-lime mt-1 font-mono text-[10px]">ON-SITE GATE SCANNING</p>
          </div>

          <div className="p-6 border border-cobalt/25 bg-[#050816]">
            <span className="text-gray-500 uppercase tracking-widest block mb-1">REGISTRATION STATUS</span>
            <p
              className={`font-bold text-sm ${
                regStatus === 'open' ? 'text-lime' : 'text-gray-400'
              }`}
            >
              {regStatus === 'open'
                ? 'OPEN & ACCEPTING'
                : regStatus === 'closed'
                ? 'REGISTRATION CLOSED'
                : regStatus === 'not_started'
                ? 'UPCOMING WINDOW'
                : 'CAPACITY REACHED'}
            </p>
            <p className="text-gray-500 mt-1 font-mono text-[10px]">
              {regCount || 0} Registered {event.max_participants ? `/ ${event.max_participants}` : ''}
            </p>
          </div>
        </div>

        {/* Pass Booking Module */}
        <div className="p-8 border border-cobalt/30 bg-[#060a1a]">
          <h3 className="font-display font-bold text-2xl text-white mb-2">
            Claim Digital Event Pass
          </h3>
          <p className="font-body text-gray-400 text-sm mb-6 max-w-xl">
            Passes are signed with an HMAC-SHA256 signature containing zero PII. Present your pass QR at the gate during entry.
          </p>

          <RegisterButton
            eventId={event.id}
            isLoggedIn={!!user}
            isRegistered={isRegistered}
            regStatus={regStatus}
          />
        </div>

        {/* Long Description Agenda */}
        {event.description && (
          <div className="p-8 sm:p-12 border border-cobalt/20 bg-[#040714] space-y-4">
            <h3 className="font-mono text-xs uppercase text-lime tracking-widest font-bold">
              {'// AGENDA & PARTICIPATION GUIDELINES'}
            </h3>
            <div className="text-gray-300 font-body text-base leading-relaxed whitespace-pre-wrap">
              {event.description}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
