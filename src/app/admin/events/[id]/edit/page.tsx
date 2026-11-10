import { createClient } from '@/lib/supabase/server';
import { notFound } from 'next/navigation';
import EventForm from '../../EventForm';

export const metadata = { title: 'Edit Event — Admin Console' };

export default async function EditEventPage({
  params,
}: {
  params: { id: string };
}) {
  const supabase = createClient();

  const { data: event } = await supabase
    .from('events')
    .select('*')
    .eq('id', params.id)
    .single();

  if (!event) notFound();

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-display text-3xl font-bold text-white tracking-tight">
          Edit Event: {event.title}
        </h1>
        <p className="text-xs font-mono text-gray-400 mt-1">
          Update event details, status, or poster.
        </p>
      </div>

      <EventForm initialData={event} />
    </div>
  );
}
