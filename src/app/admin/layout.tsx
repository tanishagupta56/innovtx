import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { headers } from 'next/headers';
import Link from 'next/link';
import { signOut } from '@/app/(auth)/actions';

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const headerList = headers();
  const pathname = headerList.get('x-pathname') || '';

  // Bypassing protection for admin login route
  if (pathname.includes('/admin/login')) {
    return <>{children}</>;
  }

  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/admin/login');
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('full_name, role, email')
    .eq('id', user.id)
    .single();

  if (!profile || !['admin', 'super_admin'].includes(profile.role)) {
    redirect('/');
  }

  return (
    <div className="min-h-screen bg-[#03060f] text-gray-200">
      {/* Admin header */}
      <header className="border-b border-cobalt/25 bg-[#050917] sticky top-0 z-40 px-6 py-3.5 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/admin" className="font-display font-bold text-lg text-white flex items-center gap-2">
            <span className="text-white">TechNeeds</span>
            <span className="text-lime text-xs px-2 py-0.5 bg-lime/10 border border-lime/30 font-mono uppercase">
              CONSOLE
            </span>
          </Link>
          <span className="text-xs font-mono text-gray-500 hidden sm:inline">
            {'// SOCIETY OPS'}
          </span>
        </div>

        <div className="flex items-center gap-4">
          <div className="text-right hidden sm:block">
            <p className="text-xs font-semibold text-white">{profile.full_name || profile.email}</p>
            <p className="text-[10px] font-mono text-lime uppercase">{profile.role}</p>
          </div>

          <Link href="/" target="_blank" className="text-xs text-gray-400 hover:text-white px-2.5 py-1 border border-cobalt/20">
            View Live Site ↗
          </Link>

          <form action={signOut}>
            <button
              type="submit"
              className="text-xs font-mono text-red-400 hover:text-red-300 px-3 py-1 bg-red-950/40 border border-red-500/30 rounded"
            >
              Sign Out
            </button>
          </form>
        </div>
      </header>

      {/* Admin Subnav */}
      <nav className="border-b border-cobalt/15 bg-[#040814] px-6 py-2.5 flex items-center gap-6 overflow-x-auto text-xs font-mono">
        <Link href="/admin" className="text-gray-300 hover:text-white transition-colors">
          Overview
        </Link>
        <Link href="/admin/events" className="text-gray-300 hover:text-white transition-colors">
          Events Management
        </Link>
        <Link href="/admin/opportunities" className="text-gray-300 hover:text-white transition-colors">
          Opportunities Radar
        </Link>
        <Link href="/admin/tickets" className="text-gray-300 hover:text-white transition-colors">
          Helpdesk Tickets
        </Link>
        <Link href="/admin/audit-logs" className="text-gray-300 hover:text-white transition-colors">
          Audit Logs
        </Link>
      </nav>

      {/* Admin Content */}
      <main className="p-6 max-w-7xl mx-auto">{children}</main>
    </div>
  );
}
