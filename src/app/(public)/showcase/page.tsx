import Link from 'next/link';

export const metadata = { title: 'Project Showcase — TechNeeds IGDTUW' };

export default function ShowcasePage() {
  return (
    <div className="pt-32 pb-24 px-6 sm:px-12 bg-midnight min-h-screen text-white flex items-center justify-center">
      <div className="max-w-2xl mx-auto text-center space-y-8">
        <span className="tag-telemetry-lime font-bold">PROJECT LABS // VAULT</span>
        <h1 className="editorial-title text-5xl sm:text-7xl text-white">
          INNOVATION <br />
          <span className="text-lime">SHOWCASE.</span>
        </h1>
        <p className="text-gray-300 font-body text-base sm:text-lg leading-relaxed">
          An interactive laboratory exhibiting peer-reviewed software projects, hackathon winning submissions, and open-source packages authored by IGDTUW students.
        </p>

        <div className="p-8 border border-cobalt/25 bg-[#050816] font-mono text-xs text-gray-400 space-y-2 text-left">
          <p className="text-lime font-bold">{'// FEATURE TELEMETRY'}</p>
          <p>Submission moderation and interactive demo sandboxes are currently scheduled for Phase 2.</p>
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
