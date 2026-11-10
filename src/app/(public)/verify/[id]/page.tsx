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
    <div className="pt-32 pb-24 px-6 sm:px-12 bg-midnight min-h-screen text-white flex items-center justify-center">
      <div className="w-full max-w-3xl space-y-8">
        <div className="text-center space-y-3">
          <span className="tag-telemetry-lime font-bold">CRYPTOGRAPHIC LEDGER</span>
          <h1 className="editorial-title text-4xl sm:text-5xl text-white">
            CERTIFICATE <span className="text-lime">VERIFICATION.</span>
          </h1>
          <p className="font-mono text-xs text-gray-500">
            RECORD ID: {verificationId}
          </p>
        </div>

        {cert ? (
          <div className="border-2 border-lime/40 bg-[#050917] p-8 sm:p-14 relative overflow-hidden shadow-[0_0_50px_rgba(212,255,36,0.15)]">
            {/* Watermark Seal */}
            <div className="flex items-center justify-between pb-6 border-b border-cobalt/25 mb-8">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 bg-lime rounded-full animate-ping" />
                <span className="font-mono text-xs text-lime uppercase font-bold tracking-wider">
                  AUTHENTICATED SOCIETY RECORD
                </span>
              </div>
              <span className="font-mono text-xs text-gray-400">
                IGDTUW OFFICIAL
              </span>
            </div>

            <div className="space-y-6">
              <div>
                <span className="font-mono text-xs text-gray-500 uppercase tracking-widest block">
                  HONORED RECIPIENT
                </span>
                <h2 className="font-display font-extrabold text-3xl sm:text-4xl text-white mt-1">
                  {student.full_name || 'Verified Scholar'}
                </h2>
                {student.branch && (
                  <p className="font-mono text-xs text-lime mt-1">
                    {student.branch} {student.batch_year ? `// BATCH OF ${student.batch_year}` : ''}
                  </p>
                )}
              </div>

              <div>
                <span className="font-mono text-xs text-gray-500 uppercase tracking-widest block">
                  AWARD &amp; RECOGNITION
                </span>
                <p className="font-display font-bold text-2xl text-white mt-1">
                  {cert.title}
                </p>
              </div>

              {event.title && (
                <div>
                  <span className="font-mono text-xs text-gray-500 uppercase tracking-widest block">
                    EVENT OF ISSUANCE
                  </span>
                  <p className="font-mono text-sm text-cobalt-300 mt-1">
                    {event.title}
                  </p>
                </div>
              )}

              <div className="pt-6 border-t border-cobalt/20 grid grid-cols-1 sm:grid-cols-2 gap-4 font-mono text-xs">
                <div>
                  <span className="text-gray-500 block">ISSUE DATE:</span>
                  <span className="text-white font-bold">{formatDate(cert.issued_at)}</span>
                </div>
                <div>
                  <span className="text-gray-500 block">VERIFICATION HASH:</span>
                  <span className="text-lime font-bold">{cert.verification_id}</span>
                </div>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-cobalt/20 flex flex-col sm:flex-row justify-between items-center gap-4 font-mono text-xs text-gray-500">
              <span>VALIDATED WITH TECHNEEDS IGDTUW SECURITY REGISTRY</span>
              <Link href="/events" className="text-lime hover:underline">
                Explore Events →
              </Link>
            </div>
          </div>
        ) : (
          <div className="border border-red-500/40 bg-red-950/20 p-10 text-center space-y-4">
            <span className="text-4xl">⚠️</span>
            <h2 className="font-display text-2xl font-bold text-red-400">
              Credential Record Unconfirmed
            </h2>
            <p className="font-mono text-xs text-gray-400 max-w-md mx-auto leading-relaxed">
              No matching certificate ledger entry found for identifier &quot;{verificationId}&quot;. Ensure the ID was entered accurately without extra symbols.
            </p>
            <div className="pt-4">
              <Link href="/" className="btn-hollow text-xs font-mono uppercase">
                Return to Home
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
