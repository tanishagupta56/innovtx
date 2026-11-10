'use client';

interface ExportCSVProps {
  data: Array<{
    name: string;
    email: string;
    batch: string | number;
    branch: string;
    registered_at: string;
    attended: boolean;
    checked_in_at: string;
  }>;
  eventTitle: string;
}

export default function ExportCSVButton({ data, eventTitle }: ExportCSVProps) {
  const handleExport = () => {
    if (!data.length) return;

    const headers = ['Name', 'Email', 'Batch', 'Branch', 'Registered At', 'Attended', 'Checked In At'];
    const rows = data.map((d) => [
      `"${(d.name || '').replace(/"/g, '""')}"`,
      `"${(d.email || '').replace(/"/g, '""')}"`,
      `"${d.batch}"`,
      `"${(d.branch || '').replace(/"/g, '""')}"`,
      `"${d.registered_at}"`,
      `"${d.attended ? 'YES' : 'NO'}"`,
      `"${d.checked_in_at}"`,
    ]);

    const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    const safeTitle = eventTitle.toLowerCase().replace(/[^a-z0-9]/g, '-');
    link.download = `attendees-${safeTitle}-${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <button
      onClick={handleExport}
      disabled={!data.length}
      className="btn-ghost text-xs font-mono uppercase tracking-wider py-2.5 px-4 border-cobalt/40 disabled:opacity-40"
    >
      Download CSV ↓
    </button>
  );
}
