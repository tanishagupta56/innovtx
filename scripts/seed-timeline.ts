import { createClient } from '@supabase/supabase-js';
import { TIMELINE_MILESTONES } from '../src/data/timelineData';

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const secretKey = process.env.SUPABASE_SECRET_KEY;

if (!url || !secretKey) {
  console.log('Skipping Supabase timeline seed: NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SECRET_KEY not set.');
  process.exit(0);
}

const supabase = createClient(url, secretKey, {
  auth: { autoRefreshToken: false, persistSession: false },
});

async function seedTimeline() {
  console.log(`Seeding ${TIMELINE_MILESTONES.length} verified milestones into timeline_items...`);

  for (const m of TIMELINE_MILESTONES) {
    const monthNum = {
      January: '01', February: '02', March: '03', April: '04',
      May: '05', June: '06', July: '07', August: '08',
      September: '09', October: '10', November: '11', December: '12',
    }[m.month] || '01';

    const dateStr = `${m.year}-${monthNum}-15`;

    const { error } = await supabase.from('timeline_items').upsert(
      {
        title: m.title,
        description: m.description,
        date: dateStr,
        year: m.year,
        category: m.category,
        is_published: true,
      },
      { onConflict: 'title' }
    );

    if (error) {
      console.warn(`Warning upserting "${m.title}":`, error.message);
    } else {
      console.log(`✓ Upserted: ${m.year} - ${m.title}`);
    }
  }

  console.log('Timeline database synchronization complete.');
}

seedTimeline();
