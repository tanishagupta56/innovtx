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

  // Extract all unique tags
  const allTags = Array.from(new Set(initialResources.flatMap((r) => r.tags || [])));

  return (
    <div>
      {/* Search & Filter Toolbar */}
      <form className="flex flex-wrap gap-3 mb-8">
        <input
          name="search"
          type="text"
          placeholder="Search resources..."
          defaultValue={searchParamSearch || ''}
          className="input-field max-w-xs"
        />

        <select name="difficulty" defaultValue={searchParamDiff || ''} className="input-field max-w-[160px]">
          <option value="">All Levels</option>
          <option value="beginner">Beginner</option>
          <option value="intermediate">Intermediate</option>
          <option value="advanced">Advanced</option>
        </select>

        <select name="tag" defaultValue={searchParamTag || ''} className="input-field max-w-[180px]">
          <option value="">All Topics</option>
          {allTags.map((t) => (
            <option key={t} value={t}>{t}</option>
          ))}
        </select>

        <button type="submit" className="btn-primary py-2 px-5 text-sm">
          Filter
        </button>

        <button
          type="button"
          onClick={() => setShowBookmarksOnly(!showBookmarksOnly)}
          className={`py-2 px-4 text-xs font-mono uppercase tracking-wider border transition-all ${
            showBookmarksOnly
              ? 'bg-lime text-midnight border-lime font-bold'
              : 'btn-ghost'
          }`}
        >
          ★ Bookmarks ({bookmarks.length})
        </button>

        {(searchParamSearch || searchParamDiff || searchParamTag || showBookmarksOnly) && (
          <a href="/resources" className="btn-ghost py-2 px-4 text-sm inline-flex items-center">
            Reset
          </a>
        )}
      </form>

      {/* Grid of resources */}
      {displayedResources && displayedResources.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayedResources.map((res) => {
            const isBookmarked = bookmarks.includes(res.id);
            return (
              <div key={res.id} className="card flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className="text-[10px] font-mono uppercase px-2 py-0.5 bg-cobalt/20 text-cobalt-300 border border-cobalt/40">
                      {res.difficulty || 'GENERAL'}
                    </span>
                    <button
                      onClick={() => toggleBookmark(res.id)}
                      className={`text-sm p-1 hover:scale-110 transition-transform ${
                        isBookmarked ? 'text-lime' : 'text-gray-600 hover:text-gray-300'
                      }`}
                      title={isBookmarked ? 'Remove bookmark' : 'Bookmark resource'}
                    >
                      {isBookmarked ? '★' : '☆'}
                    </button>
                  </div>

                  <h3 className="font-display font-bold text-white text-lg mb-2">
                    {res.title}
                  </h3>

                  {res.description && (
                    <p className="text-sm text-gray-400 line-clamp-3 mb-4 font-body leading-relaxed">
                      {res.description}
                    </p>
                  )}

                  {res.tags && res.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mb-6">
                      {res.tags.map((t) => (
                        <span key={t} className="text-[10px] font-mono text-gray-400 bg-[#0a0f20] px-2 py-0.5 border border-cobalt/15">
                          #{t}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                <div className="pt-4 border-t border-cobalt/10">
                  <a
                    href={res.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-ghost w-full text-center text-xs font-mono uppercase tracking-wider py-2.5 flex items-center justify-center gap-2 hover:bg-cobalt/20"
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
        <div className="card text-center py-16">
          <p className="text-gray-400 text-base">To be added by admin.</p>
          <p className="text-gray-600 text-xs mt-1 font-mono">
            {showBookmarksOnly
              ? 'You have not bookmarked any resources yet. Star resources to access them here.'
              : 'Learning materials and official documentation repositories are being organized.'}
          </p>
        </div>
      )}
    </div>
  );
}
