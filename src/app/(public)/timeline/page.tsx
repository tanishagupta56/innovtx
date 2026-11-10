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
    <div className="pt-28 pb-20 px-6">
      <div className="max-w-4xl mx-auto">
        <div className="mb-12">
          <p className="text-cobalt-300 font-mono text-sm tracking-widest uppercase mb-3">
            Origins &amp; Milestones
          </p>
          <h1 className="section-heading text-white">Society Timeline</h1>
          <p className="text-gray-400 mt-3 max-w-2xl">
            A chronological progression of our hackathons, flagship initiatives, and major breakthroughs.
          </p>
        </div>

        <TimelineClient items={items || []} />
      </div>
    </div>
  );
}
