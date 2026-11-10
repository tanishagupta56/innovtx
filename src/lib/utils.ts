export type EventTiming = 'upcoming' | 'ongoing' | 'past';
export type RegistrationStatus = 'open' | 'closed' | 'not_started' | 'full';

export function getEventTiming(startDate: string, endDate: string): EventTiming {
  const now = new Date();
  const start = new Date(startDate);
  const end = new Date(endDate);

  if (now < start) return 'upcoming';
  if (now > end) return 'past';
  return 'ongoing';
}

export function getRegistrationStatus(
  regStart: string | null,
  regEnd: string | null,
  currentCount: number,
  maxParticipants: number | null
): RegistrationStatus {
  const now = new Date();

  if (regStart && now < new Date(regStart)) return 'not_started';
  if (regEnd && now > new Date(regEnd)) return 'closed';
  if (maxParticipants && currentCount >= maxParticipants) return 'full';
  if (!regStart && !regEnd) return 'closed';

  return 'open';
}

export function formatDate(date: string): string {
  return new Date(date).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

export function formatDateTime(date: string): string {
  return new Date(date).toLocaleString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export function cn(...classes: (string | boolean | undefined | null)[]): string {
  return classes.filter(Boolean).join(' ');
}
