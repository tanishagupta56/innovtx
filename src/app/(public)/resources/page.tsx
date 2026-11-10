import { createClient } from '@/lib/supabase/server';
import ResourcesClient from './ResourcesClient';

export const metadata = { title: 'TechBoard Resources — TechNeeds IGDTUW' };

export default async function ResourcesPage({
  searchParams,
}: {
  searchParams: { search?: string; tag?: string; difficulty?: string };
}) {
  const supabase = createClient();

  let query = supabase
    .from('resources')
    .select('*')
    .eq('is_published', true)
    .order('created_at', { ascending: false });

  if (searchParams.tag) {
    query = query.contains('tags', [searchParams.tag]);
  }

  if (searchParams.difficulty) {
    query = query.eq('difficulty', searchParams.difficulty);
  }

  if (searchParams.search) {
    query = query.or(`title.ilike.%${searchParams.search}%,description.ilike.%${searchParams.search}%`);
  }

  const { data: resources } = await query;

  return (
    <div className="pt-28 pb-20 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-12">
          <p className="text-cobalt-300 font-mono text-sm tracking-widest uppercase mb-3">
            Knowledge Repository
          </p>
          <h1 className="section-heading text-white">TechBoard Resources</h1>
          <p className="text-gray-400 mt-3 max-w-2xl">
            Curated roadmaps, documentation, open-source kits, and learning paths compiled by society leads.
          </p>
        </div>

        <ResourcesClient
          initialResources={resources || []}
          searchParamTag={searchParams.tag}
          searchParamDiff={searchParams.difficulty}
          searchParamSearch={searchParams.search}
        />
      </div>
    </div>
  );
}
