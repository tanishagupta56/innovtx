import { createClient } from '@/lib/supabase/server';
import Link from 'next/link';
import { formatDate } from '@/lib/utils';

export const metadata = { title: 'Manage Opportunities — Admin Console' };

export default async function AdminOpportunitiesPage() {
  const supabase = createClient();

  const { data: opportunities } = await supabase
    .from('opportunities')
    .select('*')
    .order('created_at', { ascending: false });

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="font-display text-3xl font-bold text-white tracking-tight">
            Opportunities
          </h1>
          <p className="text-xs font-mono text-gray-400 mt-1">
            Post internships, fellowships, hackathons, and jobs for students.
          </p>
        </div>

        <Link
          href="/admin/opportunities/new"
          className="btn-accent text-xs py-2.5 px-5 font-mono uppercase tracking-wider self-start sm:self-auto"
        >
          + Add Opportunity
        </Link>
      </div>

      <div className="border border-cobalt/25 bg-[#050814] overflow-hidden">
        {opportunities && opportunities.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead>
                <tr className="border-b border-cobalt/25 bg-black/40 text-gray-400 uppercase tracking-wider">
                  <th className="py-3 px-4">Title &amp; Company</th>
                  <th className="py-3 px-4">Type</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Deadline</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-cobalt/15">
                {opportunities.map((item) => (
                  <tr key={item.id} className="hover:bg-cobalt/5">
                    <td className="py-3.5 px-4">
                      <p className="font-semibold text-white text-sm">{item.title}</p>
                      <p className="text-[11px] text-gray-400">{item.company || 'Open Organization'}</p>
                    </td>
                    <td className="py-3.5 px-4 uppercase text-gray-300">
                      {item.type}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className={`px-2 py-0.5 text-[10px] uppercase font-mono border ${
                        item.is_published
                          ? 'bg-lime/10 text-lime border-lime/30'
                          : 'bg-gray-800 text-gray-400 border-gray-700'
                      }`}>
                        {item.is_published ? 'Published' : 'Hidden'}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-gray-400">
                      {item.deadline ? formatDate(item.deadline) : 'No deadline'}
                    </td>
                    <td className="py-3.5 px-4 text-right space-x-3">
                      <Link
                        href={`/admin/opportunities/${item.id}/edit`}
                        className="text-cobalt-300 hover:text-white"
                      >
                        Edit
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-12 text-center font-mono text-gray-500">
            No opportunities listed yet. Add one with &quot;+ Add Opportunity&quot;.
          </div>
        )}
      </div>
    </div>
  );
}
