import { createClient } from '@/lib/supabase/server';
import ResourcesClient from './ResourcesClient';
import { VERIFIED_RESOURCES } from '@/data/resourcesData';

export const metadata = {
  title: 'TechBoard Learning Vault & Docs — TechNeeds IGDTUW',
  description: 'Curated technical documentation, CS fundamentals, DSA roadmaps, and Web/AI development resources for IGDTUW students.',
};

export default async function ResourcesPage({
  searchParams,
}: {
  searchParams: { search?: string; tag?: string; difficulty?: string; category?: string };
}) {
  let dbResources: any[] = [];
  try {
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

    const { data } = await query;
    if (data && data.length > 0) {
      dbResources = data;
    }
  } catch {
    // fallback gracefully
  }

  const allResources = dbResources.length > 0 ? dbResources : VERIFIED_RESOURCES;

  // In-memory filter on fallback data if search params are active
  const filteredResources = allResources.filter((r) => {
    const matchesTag = !searchParams.tag || r.tags?.includes(searchParams.tag);
    const matchesDiff = !searchParams.difficulty || r.difficulty?.toLowerCase() === searchParams.difficulty.toLowerCase();
    const matchesCat = !searchParams.category || r.category?.toLowerCase() === searchParams.category.toLowerCase();
    const matchesSearch = !searchParams.search || r.title.toLowerCase().includes(searchParams.search.toLowerCase()) || r.description?.toLowerCase().includes(searchParams.search.toLowerCase());
    return matchesTag && matchesDiff && matchesCat && matchesSearch;
  });

  return (
    <div className="pt-32 pb-24 px-6 sm:px-12 bg-deep-ink min-h-screen text-soft-white relative z-10">
      <div className="max-w-7xl mx-auto space-y-12">
        {/* Editorial Header */}
        <div className="border-b border-charcoal-border pb-12">
          <div className="flex items-center gap-3 mb-4">
            <span className="px-2.5 py-1 text-[11px] font-mono uppercase tracking-widest bg-charcoal border border-charcoal-border text-ice-cyan">
              KNOWLEDGE VAULT // TECHBOARD
            </span>
            <span className="font-mono text-xs text-slate-400 uppercase tracking-widest">
              CURATED TECHNICAL DOCUMENTATION
            </span>
          </div>

          <h1 className="editorial-title text-5xl sm:text-7xl xl:text-8xl text-soft-white tracking-tight uppercase">
            TECHBOARD <br />
            <span className="text-ice-cyan">RESOURCES.</span>
          </h1>

          <p className="mt-4 text-slate-300 font-sans text-base sm:text-lg max-w-2xl leading-relaxed">
            Curated roadmaps, production architectures, DSA guides, and CS fundamentals compiled by TechNeeds leads for university developers.
          </p>
        </div>

        <ResourcesClient
          initialResources={filteredResources}
          searchParamTag={searchParams.tag}
          searchParamDiff={searchParams.difficulty}
          searchParamSearch={searchParams.search}
        />
      </div>
    </div>
  );
}
