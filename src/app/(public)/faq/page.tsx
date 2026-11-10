import { createClient } from '@/lib/supabase/server';
import Link from 'next/link';

export const metadata = { title: 'FAQ & Contact — TechNeeds IGDTUW' };

export default async function FAQPage() {
  const supabase = createClient();

  const { data: faqs } = await supabase
    .from('faqs')
    .select('*')
    .eq('is_published', true)
    .order('display_order', { ascending: true });

  return (
    <div className="pt-28 pb-20 px-6">
      <div className="max-w-4xl mx-auto">
        <p className="text-cobalt-300 font-mono text-sm tracking-widest uppercase mb-3">Help</p>
        <h1 className="section-heading text-white mb-8">FAQ &amp; Contact</h1>

        {/* FAQs */}
        {faqs && faqs.length > 0 ? (
          <div className="space-y-4 mb-16">
            {faqs.map((faq) => (
              <details key={faq.id} className="card group">
                <summary className="cursor-pointer list-none flex items-center justify-between">
                  <h3 className="font-display text-white pr-4">{faq.question}</h3>
                  <span className="text-cobalt-300 group-open:rotate-45 transition-transform text-xl flex-shrink-0">
                    +
                  </span>
                </summary>
                <p className="text-gray-400 text-sm mt-4 leading-relaxed">{faq.answer}</p>
              </details>
            ))}
          </div>
        ) : (
          <div className="card text-center py-12 mb-16">
            <p className="text-gray-500">FAQs will be added soon.</p>
          </div>
        )}

        {/* Contact / Ticket */}
        <div className="border-t border-cobalt/10 pt-12">
          <h2 className="font-display text-3xl font-bold text-white mb-4">Contact Us</h2>
          <p className="text-gray-400 mb-6">
            Have a question or need help? Submit a support ticket and we&apos;ll get back to you.
          </p>
          <Link href="/login?redirect=/dashboard/tickets" className="btn-primary">
            Submit a Ticket
          </Link>
        </div>
      </div>
    </div>
  );
}
