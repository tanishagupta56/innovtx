/**
 * Mentorship credential generation utilities.
 * - Enrollment number: TN-YYYY-XXXX (4-digit zero-padded counter per year)
 * - Random temporary password: 12-char alphanumeric
 */
import { getMentorshipDb } from './db';

export async function generateEnrollmentNo(): Promise<string> {
  const db = getMentorshipDb();
  const year = new Date().getFullYear();
  const { count } = await db
    .from('mentorship_users')
    .select('*', { count: 'exact', head: true })
    .like('enrollment_no', `TN-${year}-%`);
  
  let seq = (count ?? 0) + 1;
  while (seq <= 9999) {
    const candidate = `TN-${year}-${seq.toString().padStart(4, '0')}`;
    const { data } = await db
      .from('mentorship_users')
      .select('id')
      .eq('enrollment_no', candidate)
      .limit(1);
    const existing = Array.isArray(data) ? data[0] : data;
    if (!existing) {
      return candidate;
    }
    seq++;
  }
  return `TN-${year}-${Math.floor(1000 + Math.random() * 9000)}`;
}

/** Generate a random 12-char temporary password */
export function generateTempPassword(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789';
  return Array.from({ length: 12 }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
}
