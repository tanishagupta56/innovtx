import { createClient } from '@/lib/supabase/server';
import { formatDate } from '@/lib/utils';
import Link from 'next/link';

export const metadata = { title: 'Certificate Verification — TechNeeds IGDTUW' };

export default async function VerifyCertificatePage({
  params,
}: {
  params: { id: string };
}) {
  const supabase = createClient();
  const verificationId = decodeURIComponent(params.id).trim();

  const { data: cert } = await supabase
    .from('certificates')
    .select(`
      id, verification_id, title, issued_at, template_data,
      profiles:user_id (full_name, email, batch_year, branch),
      events:event_id (title, slug, start_date)
    `)
    .eq('verification_id', verificationId)
    .maybeSingle();

  const student = (cert?.profiles as any) || {};
  const event = (cert?.events as any) || {};

  return (
    <div className="pt-28 pb-20 px-6">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-10">
          <p className="text-cobalt-300 font-mono text-sm tracking-widest uppercase mb-2">
            Credential Authenticity Check
          </p>
          <h1 className="font-display text-3xl sm:text-4xl font-bold text-white tracking-tight">
            Certificate Verification
          </h1>
          <p className="text-xs font-mono text-gray-500 mt-2">
            ID: {verificationId}
          </p>
        </div>

        {cert ? (
          <div className="border-2 border-lime/40 bg-[#050814] p-8 sm:p-12 shadow-2xl relative overflow-hidden">
            {/* Watermark / Badge */}
            <div className="flex items-center justify-between pb-6 border-b border-cobalt/20 mb-8">
              <div className="flex items-center gap-2">
                <span className="h-3 w-3 bg-lime rounded-full animate-pulse" />
                <span className="font-mono text-xs text-lime uppercase font-bold tracking-wider">
                  VERIFIED AUTHENTIC RECORD
                </span>
              </div>
              <span className="text-xs font-mono text-gray-500">
                TechNeeds IGDTUW
              </span>
            </div>

            <div className="space-y-6">
              <div>
                <p className="text-xs font-mono text-gray-400 uppercase tracking-wider">
                  Awarded To
                </p>
                <h2 className="font-display text-2xl sm:text-3xl font-bold text-white mt-1">
                  {student.full_name || 'IGDTUW Scholar'}
                </h2>
                {student.branch && (
                  <p className="text-xs font-mono text-gray-400 mt-0.5">
                    Branch: {student.branch} {student.batch_year ? `(${student.batch_year})` : ''}
                  </p>
                )}
              </div>

              <div>
                <p className="text-xs font-mono text-gray-400 uppercase tracking-wider">
                  Certificate Title &amp; Recognition
                </p>
                <p className="font-display text-xl text-lime font-semibold mt-1">
                  {cert.title}
                </p>
              </div>

              {event.title && (
                <div>
                  <p className="text-xs font-mono text-gray-400 uppercase tracking-wider">
                    Associated Society Event
                  </p>
                  <p className="text-sm font-semibold text-white mt-1">
                    {event.title}
                  </p>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-6 border-t border-cobalt/20 text-xs font-mono">
                <div>
                  <span className="text-gray-500 uppercase">Issued Date: </span>
                  <span className="text-gray-300">{formatDate(cert.issued_at)}</span>
                </div>
                <div>
                  <span className="text-gray-500 uppercase">Verification Hash: </span>
                  <span className="text-gray-300">{cert.verification_id}</span>
                </div>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-cobalt/20 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs font-mono text-gray-500">
              <p>Cryptographically validated against TechNeeds IGDTUW Registry.</p>
              <Link href="/events" className="text-cobalt-300 hover:text-lime underline">
                Browse society events →
              </Link>
            </div>
          </div>
        ) : (
          <div className="border border-red-500/30 bg-red-950/20 p-8 sm:p-12 text-center">
            <span className="text-3xl">⚠️</span>
            <h2 className="font-display text-xl font-bold text-red-400 mt-4">
              Certificate Record Not Found
            </h2>
            <p className="text-xs font-mono text-gray-400 max-w-md mx-auto mt-2 leading-relaxed">
              No matching certificate was found for identifier &quot;{verificationId}&quot;. The credential may have been entered incorrectly, revoked, or is pending admin publication.
            </p>
            <div className="mt-8">
              <Link href="/" className="btn-ghost text-xs py-2 px-4">
                Return Home
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
