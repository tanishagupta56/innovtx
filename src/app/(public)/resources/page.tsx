import { createClient } from '@/lib/supabase/server';
import ResourcesClient from './ResourcesClient';

export const metadata = { title: 'TechBoard Learning Vault — TechNeeds IGDTUW' };

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
    <div className="pt-32 pb-24 px-6 sm:px-12 bg-midnight min-h-screen text-white">
      <div className="max-w-7xl mx-auto space-y-12">
        {/* Editorial Header */}
        <div className="border-b border-cobalt/25 pb-12">
          <div className="flex items-center gap-3 mb-4">
            <span className="tag-telemetry-lime">{'KNOWLEDGE // REPOSITORY'}</span>
            <span className="font-mono text-xs text-gray-500 uppercase tracking-widest">
              {'// CURATED BY SOCIETY LEADS'}
            </span>
          </div>

          <h1 className="editorial-title text-5xl sm:text-7xl xl:text-8xl text-white tracking-tight">
            TECHBOARD <br />
            <span className="text-lime">RESOURCES.</span>
          </h1>

          <p className="mt-4 text-gray-300 font-body text-base sm:text-lg max-w-2xl leading-relaxed">
            Curated roadmaps, production architectures, Web3 protocols, and system design archives compiled for IGDTUW developers.
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
