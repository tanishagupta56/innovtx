import { createClient } from '@/lib/supabase/server';
import Link from 'next/link';

export const metadata = { title: 'FAQ & Helpdesk — TechNeeds IGDTUW' };

export default async function FAQPage() {
  const supabase = createClient();

  const { data: faqs } = await supabase
    .from('faqs')
    .select('*')
    .eq('is_published', true)
    .order('display_order', { ascending: true });

  return (
    <div className="pt-32 pb-24 px-6 sm:px-12 bg-midnight min-h-screen text-white">
      <div className="max-w-5xl mx-auto space-y-16">
        {/* Editorial Header */}
        <div className="border-b border-cobalt/25 pb-12">
          <div className="flex items-center gap-3 mb-4">
            <span className="tag-telemetry-lime">HELPDESK // INQUIRIES</span>
            <span className="font-mono text-xs text-gray-500 uppercase tracking-widest">
              COMMUNITY SUPPORT
            </span>
          </div>

          <h1 className="editorial-title text-5xl sm:text-7xl xl:text-8xl text-white tracking-tight">
            FAQ &amp; <br />
            <span className="text-lime">INQUIRIES.</span>
          </h1>

          <p className="mt-4 text-gray-300 font-body text-base sm:text-lg max-w-2xl leading-relaxed">
            Everything you need to know regarding hackathon eligibility, cryptographic passes, mentorship cohorts, and community participation.
          </p>
        </div>

        {/* Accordion List */}
        <div className="space-y-4">
          {faqs && faqs.length > 0 ? (
            faqs.map((faq) => (
              <details
                key={faq.id}
                className="p-6 border border-cobalt/20 bg-[#050816] group open:border-lime/50 transition-all cursor-pointer"
              >
                <summary className="list-none flex items-center justify-between text-lg sm:text-xl font-display font-bold text-white select-none">
                  <span>{faq.question}</span>
                  <span className="w-8 h-8 rounded-none border border-cobalt/30 group-open:border-lime group-open:bg-lime/10 flex items-center justify-center text-lime font-mono text-sm transition-transform group-open:rotate-45">
                    +
                  </span>
                </summary>
                <div className="mt-4 pt-4 border-t border-cobalt/15 text-gray-300 font-body text-base leading-relaxed">
                  {faq.answer}
                </div>
              </details>
            ))
          ) : (
            <div className="space-y-4">
              <details className="p-6 border border-cobalt/20 bg-[#050816] group open:border-lime/50 transition-all cursor-pointer">
                <summary className="list-none flex items-center justify-between text-lg sm:text-xl font-display font-bold text-white select-none">
                  <span>Who is eligible to participate in TechNeeds events?</span>
                  <span className="w-8 h-8 rounded-none border border-cobalt/30 group-open:border-lime group-open:bg-lime/10 flex items-center justify-center text-lime font-mono text-sm transition-transform group-open:rotate-45">
                    +
                  </span>
                </summary>
                <div className="mt-4 pt-4 border-t border-cobalt/15 text-gray-300 font-body text-base leading-relaxed">
                  While our core society initiatives are designed for IGDTUW students across all batches and branches, our flagship hackathons such as InnoVortex welcome university and college teams across Delhi-NCR and India.
                </div>
              </details>

              <details className="p-6 border border-cobalt/20 bg-[#050816] group open:border-lime/50 transition-all cursor-pointer">
                <summary className="list-none flex items-center justify-between text-lg sm:text-xl font-display font-bold text-white select-none">
                  <span>How does HMAC entry pass verification operate?</span>
                  <span className="w-8 h-8 rounded-none border border-cobalt/30 group-open:border-lime group-open:bg-lime/10 flex items-center justify-center text-lime font-mono text-sm transition-transform group-open:rotate-45">
                    +
                  </span>
                </summary>
                <div className="mt-4 pt-4 border-t border-cobalt/15 text-gray-300 font-body text-base leading-relaxed">
                  When you register for an event, our system generates an HMAC-SHA256 cryptographically signed pass. The database stores only a SHA-256 hash. At the gate, organizers scan your pass with optical camera verification to record one-time attendance and prevent duplicate entries.
                </div>
              </details>

              <details className="p-6 border border-cobalt/20 bg-[#050816] group open:border-lime/50 transition-all cursor-pointer">
                <summary className="list-none flex items-center justify-between text-lg sm:text-xl font-display font-bold text-white select-none">
                  <span>How can I join the executive or organizing team?</span>
                  <span className="w-8 h-8 rounded-none border border-cobalt/30 group-open:border-lime group-open:bg-lime/10 flex items-center justify-center text-lime font-mono text-sm transition-transform group-open:rotate-45">
                    +
                  </span>
                </summary>
                <div className="mt-4 pt-4 border-t border-cobalt/15 text-gray-300 font-body text-base leading-relaxed">
                  Annual recruitments are conducted following the orientation cycle. We evaluate coding samples, design portfolios, and operational aptitude. Check our Recruitment page and social handles for application release windows.
                </div>
              </details>
            </div>
          )}
        </div>

        {/* Contact & Support Ticket Portal Module */}
        <div className="p-8 sm:p-12 border border-cobalt/30 bg-[#050917] relative overflow-hidden">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
            <div className="space-y-2">
              <span className="tag-telemetry-lime font-bold">DISPATCH // HELPDESK</span>
              <h2 className="font-display font-extrabold text-3xl text-white">
                Require Direct Assistance?
              </h2>
              <p className="font-body text-gray-400 text-sm max-w-lg leading-relaxed">
                Submit an authenticated support ticket directly to our executive triage desk. We track tickets from inquiry to resolution.
              </p>
            </div>

            <Link
              href="/login?redirect=/dashboard/tickets"
              className="btn-magnetic self-start sm:self-auto font-mono text-xs uppercase"
            >
              Submit Support Ticket →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
