import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="border-t border-cobalt/20 bg-midnight">
      <div className="max-w-7xl mx-auto px-6 py-14">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-2">
            <Link href="/" className="font-display text-xl font-bold flex items-center gap-2">
              <span className="text-white">Tech</span>
              <span className="text-lime">Needs</span>
              <span className="text-xs font-mono text-gray-500">{'// IGDTUW'}</span>
            </Link>
            <p className="mt-3 text-gray-400 text-sm max-w-sm leading-relaxed">
              Premier technical society at Indira Gandhi Delhi Technical University for Women. Fostering engineering proficiency, open innovation, and hackathon excellence.
            </p>
            <div className="mt-4 flex gap-4 text-xs font-mono text-gray-500">
              <span>EST. IGDTUW CAMPUS, DELHI</span>
            </div>
          </div>

          <div>
            <h4 className="font-mono text-xs font-semibold text-white mb-4 uppercase tracking-wider">
              Explore
            </h4>
            <div className="flex flex-col gap-2.5 font-mono text-xs">
              <Link href="/events" className="text-gray-400 hover:text-lime transition-colors">Events &amp; Hackathons</Link>
              <Link href="/opportunities" className="text-gray-400 hover:text-lime transition-colors">Career Opportunities</Link>
              <Link href="/resources" className="text-gray-400 hover:text-lime transition-colors">TechBoard Resources</Link>
              <Link href="/timeline" className="text-gray-400 hover:text-lime transition-colors">Society Timeline</Link>
              <Link href="/team" className="text-gray-400 hover:text-lime transition-colors">Team &amp; Alumni</Link>
            </div>
          </div>

          <div>
            <h4 className="font-mono text-xs font-semibold text-white mb-4 uppercase tracking-wider">
              Community &amp; Ops
            </h4>
            <div className="flex flex-col gap-2.5 font-mono text-xs">
              <Link href="/about" className="text-gray-400 hover:text-lime transition-colors">About TechNeeds</Link>
              <Link href="/faq" className="text-gray-400 hover:text-lime transition-colors">FAQ &amp; Helpdesk</Link>
              <Link href="/dashboard" className="text-gray-400 hover:text-lime transition-colors">Student Dashboard</Link>
              <Link href="/admin/login" className="text-cobalt-300 hover:text-lime transition-colors">Admin Console ↗</Link>
            </div>
          </div>
        </div>

        <div className="border-t border-cobalt/15 mt-12 pt-6 flex flex-col md:flex-row justify-between items-center gap-4 text-xs font-mono text-gray-500">
          <p>
            &copy; {new Date().getFullYear()} TechNeeds IGDTUW. Official Technical Society Portal.
          </p>
          <p className="text-gray-600">
            Engineered with Next.js 14, Tailwind &amp; Supabase RLS.
          </p>
        </div>
      </div>
    </footer>
  );
}
