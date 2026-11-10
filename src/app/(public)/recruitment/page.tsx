import Link from 'next/link';

export const metadata = { title: 'Recruitment Desk — TechNeeds IGDTUW' };

export default function RecruitmentPage() {
  return (
    <div className="pt-32 pb-24 px-6 sm:px-12 bg-midnight min-h-screen text-white flex items-center justify-center">
      <div className="max-w-2xl mx-auto text-center space-y-8">
        <span className="tag-telemetry-lime font-bold">CYCLE 2025 // ENROLLMENT</span>
        <h1 className="editorial-title text-5xl sm:text-7xl text-white">
          SOCIETY <br />
          <span className="text-lime">RECRUITMENT.</span>
        </h1>
        <p className="text-gray-300 font-body text-base sm:text-lg leading-relaxed">
          The induction window for development, design, and operations cohorts will commence following seasonal orientation. Prepare your GitHub repositories and sprint portfolios.
        </p>

        <div className="p-8 border border-cobalt/25 bg-[#050816] text-left font-mono text-xs space-y-4">
          <div className="flex justify-between items-center text-lime border-b border-cobalt/20 pb-2">
            <span>TRACKS AVAILABLE</span>
            <span>STATUS: DRAFTING</span>
          </div>
          <div className="grid grid-cols-2 gap-3 text-gray-300">
            <div>▸ Full-Stack &amp; Systems</div>
            <div>▸ Smart Contracts &amp; Web3</div>
            <div>▸ UI/UX &amp; Creative Motion</div>
            <div>▸ Hackathon Operations</div>
          </div>
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
