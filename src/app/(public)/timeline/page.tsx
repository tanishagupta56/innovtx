import { createClient } from '@/lib/supabase/server';
import { TIMELINE_MILESTONES } from '@/data/timelineData';
import TimelineClient from './TimelineClient';

export const metadata = { title: 'Spatial Timeline & Society Archives — TechNeeds IGDTUW' };

export default async function TimelinePage() {
  let dbItems: any[] = [];
  try {
    const supabase = createClient();
    const { data } = await supabase
      .from('timeline_items')
      .select('*')
      .eq('is_published', true)
      .order('date', { ascending: false });
    if (data && data.length > 0) {
      dbItems = data;
    }
  } catch (err) {
    // Graceful fallback to verified local milestones
  }

  // Merge or map with verified 14 milestones
  const displayItems = dbItems.length > 0
    ? dbItems.map((db) => {
        const found = TIMELINE_MILESTONES.find((m) => m.title.toLowerCase() === db.title.toLowerCase());
        return {
          id: db.id,
          year: db.year || new Date(db.date).getFullYear(),
          month: found?.month || 'Annual',
          title: db.title,
          category: (db.category?.toLowerCase() || 'workshop') as any,
          description: db.description || found?.description || '',
          venue: found?.venue || 'IGDTUW Campus',
          metrics: found?.metrics || {},
          highlights: found?.highlights || [],
          sourceUrl: found?.sourceUrl || 'https://www.techneeds.live/',
          verified: true,
          status: 'completed' as const,
        };
      })
    : TIMELINE_MILESTONES;

  return (
    <div className="pt-32 pb-24 px-6 sm:px-12 bg-transparent min-h-screen text-soft-white relative z-10">
      <div className="max-w-7xl mx-auto space-y-12">
        {/* Editorial Header */}
        <div className="border-b border-charcoal-border pb-10">
          <div className="flex items-center gap-3 mb-4">
            <span className="px-2.5 py-1 text-[11px] font-mono uppercase tracking-widest bg-charcoal border border-charcoal-border text-lime-green">
              SPATIAL ARCHIVE // CHRONICLE
            </span>
            <span className="font-mono text-xs text-lime-green uppercase tracking-widest flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-electric-blue animate-ping" />
              14 VERIFIED NODES
            </span>
          </div>

          <h1 className="editorial-title text-5xl sm:text-7xl xl:text-8xl text-soft-white tracking-tight uppercase">
            CHRONOLOGICAL <br />
            <span className="text-lime-green">3D TIMELINE.</span>
          </h1>

          <p className="mt-4 text-slate-300 font-sans text-base sm:text-lg max-w-2xl leading-relaxed">
            Traverse the living history of TechNeeds IGDTUW. From our first 2-day campus ideathon in 2023 to regional hackathon partnerships at IIIT Delhi and university-wide digital platforms.
          </p>
        </div>

        {/* Client Interactive 3D & Stream View */}
        <TimelineClient initialMilestones={displayItems} />
      </div>
    </div>
  );
}
