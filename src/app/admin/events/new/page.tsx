import EventForm from '../EventForm';

export const metadata = { title: 'New Event — Admin Console' };

export default function NewEventPage() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="font-display text-3xl font-bold text-white tracking-tight">
          Create New Event
        </h1>
        <p className="text-xs font-mono text-gray-400 mt-1">
          Configure schedule, capacity, registration windows, and upload official poster.
        </p>
      </div>

      <EventForm />
    </div>
  );
}
