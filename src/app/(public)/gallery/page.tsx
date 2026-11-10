import React from 'react';
import Link from 'next/link';

export const metadata = {
  title: 'Society Gallery & Vibes — TechNeeds IGDTUW',
  description: 'Moments, sprints, and energy from hackathons, workshops, and cohorts at TechNeeds IGDTUW.',
};

const MOMENTS = [
  {
    title: 'InnoVortex Midnight Code Sprint',
    date: 'September 2023',
    location: 'IGDTUW Campus Innovation Lab',
    tag: 'HACKATHON',
    caption: 'Teams debugging machine learning pipelines at 2:00 AM during our inaugural 36-hour hackathon.',
    aspect: 'aspect-video',
  },
  {
    title: 'SSSC Mentorship Cohort 1 Orientation',
    date: 'August 2024',
    location: 'Auditorium Hall, IGDTUW',
    tag: 'MENTORSHIP',
    caption: 'Over 300 first-year engineering students paired with senior mentors for academic and tech roadmaps.',
    aspect: 'aspect-[4/3]',
  },
  {
    title: 'MLSA Git & Open Source Workshop',
    date: 'March 2024',
    location: 'Computer Science Lab 3',
    tag: 'WORKSHOP',
    caption: 'Live terminal drills on Git merge conflicts and GitHub pull request hygiene with Microsoft Student Ambassadors.',
    aspect: 'aspect-[4/3]',
  },
  {
    title: 'InnoVortex 3.0 Demo Day',
    date: 'September 2025',
    location: 'IIIT Delhi Tech Complex',
    tag: 'FLAGSHIP',
    caption: 'Top 10 finalist teams presenting autonomous AI projects before an esteemed industry jury.',
    aspect: 'aspect-video',
  },
  {
    title: '21-Day CS Fundamentals Sprint Wrap-Up',
    date: 'March 2026',
    location: 'Discord Community Stage',
    tag: 'SPRINT',
    caption: 'Celebrating 400+ participants achieving an 85% completion rate across operating systems and network design.',
    aspect: 'aspect-[4/3]',
  },
  {
    title: 'INNERve Hacks Technical Track',
    date: 'May 2026',
    location: 'IGDTUW Tech Arena',
    tag: 'COLLABORATION',
    caption: 'Hardware demonstration booths and AI track judging during the annual tech festival.',
    aspect: 'aspect-video',
  },
];

export default function GalleryPage() {
  return (
    <div className="pt-32 pb-24 px-6 sm:px-12 min-h-screen text-white relative">
      <div className="max-w-7xl mx-auto space-y-16">
        {/* Header */}
        <div className="border-b border-cobalt/25 pb-10">
          <div className="flex items-center gap-3 mb-4">
            <span className="px-2.5 py-1 text-[11px] font-mono uppercase tracking-widest bg-cobalt/20 border border-cobalt text-cobalt-bright">
              VISUAL CHRONICLE // VIBES
            </span>
            <span className="font-mono text-xs text-electric-lime uppercase tracking-widest">
              CAMPUS CULTURE
            </span>
          </div>

          <h1 className="editorial-title text-5xl sm:text-7xl xl:text-8xl text-white tracking-tight uppercase">
            SOCIETY <br />
            <span className="text-electric-lime">VIBES &amp; GALLERY.</span>
          </h1>

          <p className="mt-4 text-slate-300 font-sans text-base sm:text-lg max-w-2xl leading-relaxed">
            Snapshots of late-night commits, celebratory pitch demos, and collaborative mentorship circles across the journey of TechNeeds IGDTUW.
          </p>
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {MOMENTS.map((m, idx) => (
            <div
              key={idx}
              className="p-6 border border-white/10 bg-midnight-950/80 backdrop-blur-md rounded-xl hover:border-electric-lime transition-all flex flex-col justify-between group"
            >
              <div>
                {/* Visual Placeholder Frame with Gradient Cyber Texture */}
                <div className={`w-full ${m.aspect} rounded-lg bg-gradient-to-br from-electric-cobalt/30 via-midnight-900 to-black border border-white/10 relative overflow-hidden flex flex-col justify-end p-4 mb-4 group-hover:border-electric-lime/50 transition-colors`}>
                  <div className="absolute top-3 left-3 px-2 py-0.5 rounded bg-black/60 backdrop-blur-md text-[10px] font-mono text-electric-lime uppercase border border-white/10">
                    {m.tag}
                  </div>
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-electric-lime/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  <span className="text-xs font-mono text-slate-400 z-10">
                    📸 {m.location}
                  </span>
                </div>

                <div className="flex items-center justify-between text-xs font-mono text-slate-400 mb-2">
                  <span>{m.date}</span>
                </div>

                <h3 className="text-xl font-bold text-white group-hover:text-electric-lime transition-colors mb-2">
                  {m.title}
                </h3>

                <p className="text-xs text-slate-300 leading-relaxed">
                  {m.caption}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-white/5 flex items-center justify-between text-xs font-mono text-slate-500">
                <span>ARCHIVE #0{idx + 1}</span>
                <span className="text-electric-lime">CONFIRMED VIBE</span>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Banner */}
        <div className="p-8 border border-white/10 bg-midnight-900/60 rounded-xl text-center space-y-4">
          <h3 className="text-2xl font-bold text-white">Have photos from our events?</h3>
          <p className="text-xs text-slate-400 max-w-md mx-auto">
            Tag us on Instagram @techneeds_igdtuw or submit high-resolution event media to the Media &amp; Design wing.
          </p>
          <div className="pt-2">
            <Link
              href="/community"
              className="px-6 py-2.5 bg-white/10 hover:bg-white/20 text-white rounded font-mono text-xs uppercase font-bold inline-block"
            >
              Join Media Wing →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
