import { createClient } from '@/lib/supabase/server';
import { formatDate } from '@/lib/utils';

export const metadata = { title: 'Audit Logs — Admin Console' };

export default async function AdminAuditLogsPage() {
  const supabase = createClient();

  const { data: logs } = await supabase
    .from('audit_logs')
    .select(`
      id, action, table_name, record_id, created_at,
      profiles:user_id (id, full_name, email)
    `)
    .order('created_at', { ascending: false })
    .limit(100);

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-display text-3xl font-bold text-white tracking-tight">
          System Audit Trail
        </h1>
        <p className="text-xs font-mono text-gray-400 mt-1">
          Cryptographic attendance records, ticket triage events, and catalog mutations.
        </p>
      </div>

      <div className="border border-cobalt/25 bg-[#050814] overflow-hidden">
        {logs && logs.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead>
                <tr className="border-b border-cobalt/25 bg-black/40 text-gray-400 uppercase tracking-wider">
                  <th className="py-3 px-4">Timestamp</th>
                  <th className="py-3 px-4">Action</th>
                  <th className="py-3 px-4">Entity</th>
                  <th className="py-3 px-4">Actor</th>
                  <th className="py-3 px-4">Record ID</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-cobalt/15">
                {logs.map((log: any) => (
                  <tr key={log.id} className="hover:bg-cobalt/5">
                    <td className="py-3.5 px-4 text-gray-400">
                      {new Date(log.created_at).toLocaleString()}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="px-2 py-0.5 text-[10px] uppercase font-mono bg-cobalt/20 text-cobalt-300 border border-cobalt/40">
                        {log.action}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-gray-300 uppercase">
                      {log.table_name || 'SYSTEM'}
                    </td>
                    <td className="py-3.5 px-4 text-white">
                      {log.profiles?.full_name || log.profiles?.email || 'System'}
                    </td>
                    <td className="py-3.5 px-4 text-gray-500 text-[10px] font-mono">
                      {log.record_id ? String(log.record_id).slice(0, 16) + '...' : '-'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-12 text-center font-mono text-gray-500">
            No audit records logged yet.
          </div>
        )}
      </div>
    </div>
  );
}
