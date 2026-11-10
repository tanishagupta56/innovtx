import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { signOut } from '@/app/(auth)/actions';

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
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
            View Site ↗
          </Link>

          <form action={signOut}>
            <button
              type="submit"
              className="text-xs font-mono text-red-400 hover:text-red-300 px-2.5 py-1 border border-red-500/20 hover:border-red-500/40"
            >
              Exit
            </button>
          </form>
        </div>
      </header>

      {/* Main layout */}
      <div className="flex min-h-[calc(100vh-57px)]">
        {/* Sidebar */}
        <aside className="w-64 border-r border-cobalt/20 bg-[#040714] p-4 flex-shrink-0 flex flex-col justify-between">
          <nav className="space-y-1">
            <AdminNavLink href="/admin" label="Overview" icon="📊" />
            <AdminNavLink href="/admin/events" label="Events & Check-in" icon="⚡" />
            <AdminNavLink href="/admin/opportunities" label="Opportunities" icon="💼" />
            <AdminNavLink href="/admin/tickets" label="Support Tickets" icon="💬" />
            <AdminNavLink href="/admin/audit-logs" label="Audit Logs" icon="📜" />
          </nav>

          <div className="pt-4 border-t border-cobalt/15 text-[11px] font-mono text-gray-500">
            <p>Admin RLS: ACTIVE</p>
            <p className="text-gray-600 mt-1">Environment: Prototype</p>
          </div>
        </aside>

        {/* Content body */}
        <main className="flex-1 p-8 overflow-y-auto max-w-7xl">
          {children}
        </main>
      </div>
    </div>
  );
}

function AdminNavLink({ href, label, icon }: { href: string; label: string; icon: string }) {
  return (
    <Link
      href={href}
      className="flex items-center gap-3 px-3 py-2.5 text-xs font-mono uppercase tracking-wider text-gray-300 hover:text-white hover:bg-cobalt/20 border border-transparent hover:border-cobalt/40 transition-all"
    >
      <span>{icon}</span>
      <span>{label}</span>
    </Link>
  );
}
