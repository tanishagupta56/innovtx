import Link from 'next/link';

export const metadata = { title: 'Mentorship — TechNeeds IGDTUW' };

export default function MentorshipPage() {
  return (
    <div className="pt-28 pb-20 px-6">
      <div className="max-w-3xl mx-auto text-center">
        <span className="font-mono text-xs px-2.5 py-1 bg-lime/10 text-lime border border-lime/30 uppercase">
          Phase 2 // Feature
        </span>
        <h1 className="font-display text-4xl font-bold text-white mt-4 mb-4">
          Peer &amp; Alumni Mentorship
        </h1>
        <p className="text-gray-400 text-base max-w-lg mx-auto mb-8">
          1-on-1 mentorship pairings connecting junior students with seniors and industry alumni for mock interviews, career guidance, and project code reviews.
        </p>
        <div className="card text-center py-10 max-w-md mx-auto">
          <p className="text-xs font-mono text-gray-500 uppercase tracking-wider">Status</p>
          <p className="font-display font-semibold text-white mt-1">Coming Soon</p>
          <p className="text-xs text-gray-400 mt-2">Mentor matching algorithms and slot scheduling currently in design phase.</p>
        </div>
        <div className="mt-8">
          <Link href="/" className="btn-ghost text-xs py-2 px-4">
            ← Return to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
