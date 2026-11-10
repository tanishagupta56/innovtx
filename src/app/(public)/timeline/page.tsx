import { createClient } from '@/lib/supabase/server';
import TimelineClient from './TimelineClient';

export const metadata = { title: 'Timeline & History — TechNeeds IGDTUW' };

export default async function TimelinePage() {
  const supabase = createClient();

  const { data: items } = await supabase
    .from('timeline_items')
    .select('*')
    .eq('is_published', true)
    .order('date', { ascending: false });

  return (
    <div className="pt-32 pb-24 px-6 sm:px-12 bg-midnight min-h-screen text-white">
      <div className="max-w-7xl mx-auto space-y-12">
        {/* Editorial Header */}
        <div className="border-b border-cobalt/25 pb-12">
          <div className="flex items-center gap-3 mb-4">
            <span className="tag-telemetry-lime">CHRONICLE // ARCHIVE</span>
            <span className="font-mono text-xs text-gray-500 uppercase tracking-widest">
              HISTORICAL RECORD
            </span>
          </div>

          <h1 className="editorial-title text-5xl sm:text-7xl xl:text-8xl text-white tracking-tight">
            SOCIETY <br />
            <span className="text-lime">TIMELINE.</span>
          </h1>

          <p className="mt-4 text-gray-300 font-body text-base sm:text-lg max-w-2xl leading-relaxed">
            From early coding meetups to Delhi-wide flagship hackathons. A chronological archive of our milestones, breakthroughs, and leadership cohorts.
          </p>
        </div>

        <TimelineClient items={items || []} />
      </div>
    </div>
  );
}
