'use client';

import { useState, useEffect } from 'react';

interface Resource {
  id: string;
  title: string;
  description: string | null;
  url: string;
  tags: string[];
  difficulty: string | null;
  category: string | null;
}

export default function ResourcesClient({
  initialResources,
  searchParamTag,
  searchParamDiff,
  searchParamSearch,
}: {
  initialResources: Resource[];
  searchParamTag?: string;
  searchParamDiff?: string;
  searchParamSearch?: string;
}) {
  const [bookmarks, setBookmarks] = useState<string[]>([]);
  const [showBookmarksOnly, setShowBookmarksOnly] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem('tn_bookmarked_resources');
      if (stored) {
        setBookmarks(JSON.parse(stored));
      }
    } catch {
      // ignore
    }
  }, []);

  const toggleBookmark = (id: string) => {
    const next = bookmarks.includes(id)
      ? bookmarks.filter((b) => b !== id)
      : [...bookmarks, id];
    setBookmarks(next);
    localStorage.setItem('tn_bookmarked_resources', JSON.stringify(next));
  };

  const displayedResources = showBookmarksOnly
    ? initialResources.filter((r) => bookmarks.includes(r.id))
    : initialResources;

  const allTags = Array.from(new Set(initialResources.flatMap((r) => r.tags || [])));

  return (
    <div>
      {/* Search & Filter Toolbar */}
      <form className="flex flex-wrap items-center gap-3 mb-12 font-mono text-xs">
        <input
          name="search"
          type="text"
          placeholder="Search topics, roadmaps..."
          defaultValue={searchParamSearch || ''}
          className="px-4 py-2 bg-charcoal border border-charcoal-border rounded-md text-soft-white placeholder:text-slate-500 w-full sm:w-64 focus:outline-none focus:border-electric-blue/50"
        />

        <select
          name="difficulty"
          defaultValue={searchParamDiff || ''}
          className="px-4 py-2 bg-charcoal border border-charcoal-border rounded-md text-soft-white focus:outline-none focus:border-electric-blue/50"
        >
          <option value="">All Difficulties</option>
          <option value="Beginner">Beginner</option>
          <option value="Intermediate">Intermediate</option>
          <option value="Advanced">Advanced</option>
        </select>

        <select
          name="tag"
          defaultValue={searchParamTag || ''}
          className="px-4 py-2 bg-charcoal border border-charcoal-border rounded-md text-soft-white focus:outline-none focus:border-electric-blue/50"
        >
          <option value="">All Topics</option>
          {allTags.map((t) => (
            <option key={t} value={t}>
              #{t}
            </option>
          ))}
        </select>

        <button
          type="submit"
          className="px-5 py-2 bg-electric-blue hover:bg-electric-blue-light text-soft-white font-mono text-xs uppercase font-bold rounded-md transition-colors"
        >
          Filter
        </button>

        <button
          type="button"
          onClick={() => setShowBookmarksOnly(!showBookmarksOnly)}
          className={`px-4 py-2 font-mono text-xs uppercase tracking-wider rounded-md border transition-all ${
            showBookmarksOnly
              ? 'bg-electric-blue text-deep-ink border-electric-blue/50 font-bold shadow-[0_0_15px_#315EFF]'
              : 'bg-charcoal border-charcoal-border text-slate-300 hover:text-white'
          }`}
        >
          ★ Bookmarks ({bookmarks.length})
        </button>

        {(searchParamSearch || searchParamDiff || searchParamTag || showBookmarksOnly) && (
          <a
            href="/resources"
            className="px-4 py-2 bg-charcoal border border-charcoal-border text-slate-400 hover:text-white rounded-md font-mono text-xs uppercase"
          >
            Reset
          </a>
        )}
      </form>

      {/* Grid of Resources */}
      {displayedResources && displayedResources.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {displayedResources.map((res) => {
            const isBookmarked = bookmarks.includes(res.id);
            return (
              <div
                key={res.id}
                className="p-8 border border-charcoal-border bg-charcoal/70 rounded-2xl hover:border-electric-blue/50 transition-all flex flex-col justify-between group relative overflow-hidden"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-4">
                    <span className="px-2 py-0.5 rounded bg-charcoal border border-charcoal-border text-lime-green uppercase font-bold text-[10px] font-mono">
                      {res.difficulty || 'GENERAL'}
                    </span>
                    <button
                      onClick={() => toggleBookmark(res.id)}
                      className={`text-lg p-1 transition-transform hover:scale-125 ${
                        isBookmarked ? 'text-lime-green' : 'text-slate-600 hover:text-slate-300'
                      }`}
                      title={isBookmarked ? 'Remove bookmark' : 'Bookmark this resource'}
                    >
                      {isBookmarked ? '★' : '☆'}
                    </button>
                  </div>

                  <h3 className="font-display font-bold text-2xl text-soft-white mb-3 group-hover:text-lime-green transition-colors">
                    {res.title}
                  </h3>

                  {res.description && (
                    <p className="text-slate-300 font-sans text-sm line-clamp-3 mb-6 leading-relaxed">
                      {res.description}
                    </p>
                  )}

                  {res.tags && res.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mb-6">
                      {res.tags.map((t) => (
                        <span
                          key={t}
                          className="font-mono text-[10px] text-slate-400 bg-deep-ink px-2 py-0.5 border border-charcoal-border rounded"
                        >
                          #{t}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                <div className="pt-6 border-t border-charcoal-border">
                  <a
                    href={res.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full text-center text-xs py-2.5 font-mono uppercase tracking-wider flex items-center justify-center gap-2 bg-charcoal border border-charcoal-border rounded-md hover:bg-electric-blue hover:text-deep-ink hover:border-electric-blue/50 transition-all font-bold"
                  >
                    <span>Launch Resource</span>
                    <span>↗</span>
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="p-16 border border-charcoal-border bg-charcoal/40 rounded-2xl text-center font-mono text-slate-400">
          <p className="text-soft-white text-lg font-display mb-2">No Matching Resources Found</p>
          <p className="text-xs">Adjust your search parameters or filter criteria above.</p>
        </div>
      )}
    </div>
  );
}
