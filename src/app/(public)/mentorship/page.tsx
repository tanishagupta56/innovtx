import Link from 'next/link';

export const metadata = { title: 'Mentorship Network — TechNeeds IGDTUW' };

export default function MentorshipPage() {
  return (
    <div className="pt-32 pb-24 px-6 sm:px-12 bg-midnight min-h-screen text-white flex items-center justify-center">
      <div className="max-w-2xl mx-auto text-center space-y-8">
        <span className="tag-telemetry-lime font-bold">1-ON-1 // ALUMNI NETWORK</span>
        <h1 className="editorial-title text-5xl sm:text-7xl text-white">
          PEER &amp; ALUMNI <br />
          <span className="text-lime">MENTORSHIP.</span>
        </h1>
        <p className="text-gray-300 font-body text-base sm:text-lg leading-relaxed">
          Connecting junior university engineers with alumni engineers across Google, Microsoft, Atlassian, and breakout YC startups for mock interviews and portfolio audits.
        </p>

        <div className="p-8 border border-cobalt/25 bg-[#050816] font-mono text-xs text-gray-400 space-y-2 text-left">
          <p className="text-lime font-bold">{'// SCHEDULE PIPELINE'}</p>
          <p>Mentor slot allocation and calendar sync modules in active design review.</p>
        </div>

        <div className="pt-4">
          <Link href="/" className="btn-hollow font-mono text-xs uppercase">
            ← Return to Overview
          </Link>
        </div>
      </div>
    </div>
  );
}
