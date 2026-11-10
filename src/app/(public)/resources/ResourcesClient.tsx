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
      <form className="flex flex-wrap gap-3 mb-12 font-mono text-xs">
        <input
          name="search"
          type="text"
          placeholder="Search topics, roadmaps..."
          defaultValue={searchParamSearch || ''}
          className="input-field max-w-xs font-mono text-xs"
        />

        <select
          name="difficulty"
          defaultValue={searchParamDiff || ''}
          className="input-field max-w-[160px] font-mono text-xs"
        >
          <option value="">All Difficulty Levels</option>
          <option value="beginner">Beginner</option>
          <option value="intermediate">Intermediate</option>
          <option value="advanced">Advanced</option>
        </select>

        <select
          name="tag"
          defaultValue={searchParamTag || ''}
          className="input-field max-w-[180px] font-mono text-xs"
        >
          <option value="">All Tech Topics</option>
          {allTags.map((t) => (
            <option key={t} value={t}>
              #{t}
            </option>
          ))}
        </select>

        <button type="submit" className="btn-magnetic-cobalt py-2.5 px-6 font-mono text-xs uppercase">
          Apply Filters
        </button>

        <button
          type="button"
          onClick={() => setShowBookmarksOnly(!showBookmarksOnly)}
          className={`py-2.5 px-5 font-mono text-xs uppercase tracking-wider border transition-all ${
            showBookmarksOnly
              ? 'bg-lime text-midnight border-lime font-bold shadow-[0_0_15px_rgba(212,255,36,0.3)]'
              : 'btn-hollow'
          }`}
        >
          ★ Bookmarks ({bookmarks.length})
        </button>

        {(searchParamSearch || searchParamDiff || searchParamTag || showBookmarksOnly) && (
          <a href="/resources" className="btn-hollow py-2.5 px-4 font-mono text-xs uppercase flex items-center">
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
                className="p-8 border border-cobalt/25 bg-[#050816] hover:border-lime/40 transition-all flex flex-col justify-between group relative overflow-hidden"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-4">
                    <span className="tag-telemetry text-lime uppercase font-bold text-[10px]">
                      {res.difficulty || 'GENERAL'}
                    </span>
                    <button
                      onClick={() => toggleBookmark(res.id)}
                      className={`text-lg p-1 transition-transform hover:scale-125 ${
                        isBookmarked ? 'text-lime' : 'text-gray-600 hover:text-gray-300'
                      }`}
                      title={isBookmarked ? 'Remove bookmark' : 'Bookmark this resource'}
                    >
                      {isBookmarked ? '★' : '☆'}
                    </button>
                  </div>

                  <h3 className="font-display font-bold text-2xl text-white mb-3 group-hover:text-lime transition-colors">
                    {res.title}
                  </h3>

                  {res.description && (
                    <p className="text-gray-400 font-body text-sm line-clamp-3 mb-6 leading-relaxed">
                      {res.description}
                    </p>
                  )}

                  {res.tags && res.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mb-6">
                      {res.tags.map((t) => (
                        <span
                          key={t}
                          className="font-mono text-[10px] text-gray-400 bg-[#090e1f] px-2 py-0.5 border border-cobalt/20"
                        >
                          #{t}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                <div className="pt-6 border-t border-cobalt/15">
                  <a
                    href={res.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-hollow w-full text-center text-xs py-2.5 font-mono uppercase tracking-wider flex items-center justify-center gap-2 hover:bg-lime hover:text-midnight hover:border-lime transition-all"
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
        <div className="p-20 border border-cobalt/25 bg-[#050814] text-center font-mono">
          <p className="text-white text-lg font-display mb-2">No Resources Found</p>
          <p className="text-gray-500 text-xs">
            {showBookmarksOnly
              ? 'You have not saved any bookmarks yet. Star items to access them here.'
              : 'Learning materials and documentation repositories are being organized by leads.'}
          </p>
        </div>
      )}
    </div>
  );
}
