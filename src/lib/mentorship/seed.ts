/**
 * Admin seed: ensures at least one admin user exists in mentorship_users.
 * Called lazily on first auth API request.
 * Logs credentials only when NODE_ENV !== 'production'.
 */
import bcrypt from 'bcryptjs';
import { getMentorshipDb } from './db';

let seeded = false;

export async function ensureMentorshipAdminSeeded() {
  if (seeded) return;

  const db = getMentorshipDb();
  const email = process.env.MENTORSHIP_ADMIN_EMAIL || 'mentorship-admin@techneeds.live';
  const password = process.env.MENTORSHIP_ADMIN_PASSWORD || 'MentorAdmin@2026!';

  try {
    const { data: existing } = await db
      .from('mentorship_users')
      .select('id')
      .eq('role', 'admin')
      .limit(1);

    if (existing && existing.length > 0) {
      seeded = true;
      return;
    }

    const passwordHash = await bcrypt.hash(password, 12);
    const { error } = await db.from('mentorship_users').insert({
      name: 'Portal Admin',
      role: 'admin',
      email,
      password_hash: passwordHash,
      program_ids: [],
      tags: [],
    });

    if (!error) {
      seeded = true;
      if (process.env.NODE_ENV !== 'production') {
        console.log(`[Mentorship] Admin seeded — Email: ${email} | Password: ${password}`);
      }
    }

    // Also ensure at least one active cohort and sample deliverables exist
    const { data: existingPrograms } = await db
      .from('mentorship_programs')
      .select('id')
      .limit(1);

    if (!existingPrograms || existingPrograms.length === 0) {
      const now = new Date();
      const in12Hours = new Date(now.getTime() + 12 * 60 * 60 * 1000).toISOString();
      const in5Days = new Date(now.getTime() + 5 * 24 * 60 * 60 * 1000).toISOString();
      const in10Days = new Date(now.getTime() + 10 * 24 * 60 * 60 * 1000).toISOString();

      const { data: prog } = await db.from('mentorship_programs').insert({
        title: 'Full-Stack Web Engineering Cadre',
        description: 'Intensive peer mentorship cohort covering React, Next.js App Router, TypeScript, and Supabase cloud systems.',
        tech_tags: ['Next.js', 'TypeScript', 'Supabase', 'Tailwind CSS'],
        status: 'active',
        start_date: new Date().toISOString(),
      }).select().single();

      if (prog?.id) {
        // Seed Video Lesson
        await db.from('mentorship_resources').insert({
          program_id: prog.id,
          type: 'video',
          title: 'Next.js App Router & Server Components',
          description: 'Comprehensive walkthrough on server vs client components, streaming SSR, and cache revalidation strategies.',
          video_url: 'https://www.youtube.com/watch?v=wm5gMKuwSYk',
          deadline: in5Days,
          max_score: 25,
        });

        // Seed Quiz with < 24h deadline to verify red pulse
        await db.from('mentorship_resources').insert({
          program_id: prog.id,
          type: 'quiz',
          title: 'React Architecture & Server Action Sprint',
          description: 'Timed assessment testing your understanding of React 19 actions, hooks, and async server pipelines.',
          deadline: in12Hours,
          max_score: 50,
          questions: [
            {
              id: 'q1',
              text: 'Which React directive explicitly marks a file for client-side hydration?',
              options: ["'use client'", "'use server'", "'use state'", "'client-only'"],
              correctAnswer: 0,
              points: 25,
            },
            {
              id: 'q2',
              text: 'Where do Server Components execute in Next.js?',
              options: ['On the web browser', 'On the server during request/render', 'Inside a Service Worker', 'On the CDN edge cache only'],
              correctAnswer: 1,
              points: 25,
            },
          ],
        });

        // Seed Project Deliverable
        await db.from('mentorship_resources').insert({
          program_id: prog.id,
          type: 'project',
          title: 'Production Full-Stack SaaS MVP',
          description: 'Ship a full-stack SaaS application with authentication, database persistence, and deployed production URL.',
          problem_statement: 'Design and deploy a full-stack application with Supabase integration, responsive Tailwind UI, and automated CI/CD.',
          guidelines: 'Submit both a public GitHub repository link and a deployed production URL (Vercel/Render).',
          deadline: in10Days,
          max_score: 100,
        });
      }
    }
  } catch (err) {
    console.error('[Mentorship] Seed error:', err);
  }
}
