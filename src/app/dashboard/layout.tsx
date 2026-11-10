import { createClient } from '@/lib/supabase/server';
import { getStudentSession } from '@/lib/auth/session';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { signOut } from '@/app/(auth)/actions';

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getStudentSession();

  let userEmail = session?.email || '';
  let userName = session?.name || '';
  let userRole = session?.role || 'student';

  if (!session) {
    const supabase = createClient();
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        redirect('/login');
      }
      userEmail = user.email || '';
      const { data: profile } = await supabase
        .from('profiles')
        .select('full_name, role')
        .eq('id', user.id)
        .single();
      userName = profile?.full_name || user.email || '';
      userRole = profile?.role || 'student';
    } catch {
      redirect('/login');
    }
  }

  return (
    <div className="min-h-screen bg-transparent">
      {/* Dashboard nav */}
      <nav className="border-b border-cobalt/10 bg-midnight/90 backdrop-blur-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <Link href="/" className="font-display text-xl font-bold">
              <span className="text-white">Tech</span>
              <span className="text-lime">Needs</span>
            </Link>
            <span className="text-gray-600 text-sm hidden md:inline">Dashboard</span>
          </div>

          <div className="flex items-center gap-4">
            <span className="text-gray-400 text-sm hidden md:inline">
              {userName || userEmail}
            </span>
            {userRole && ['admin', 'super_admin'].includes(userRole) && (
              <Link href="/admin" className="text-xs text-cobalt-300 hover:text-lime transition-colors">
                Admin Panel
              </Link>
            )}
            <form action={signOut}>
              <button type="submit" className="text-sm text-gray-500 hover:text-red-400 transition-colors">
                Sign Out
              </button>
            </form>
          </div>
        </div>
      </nav>

      {/* Dashboard sidebar + content */}
      <div className="max-w-7xl mx-auto px-6 py-8 flex gap-8">
        <aside className="hidden md:block w-56 flex-shrink-0">
          <nav className="space-y-1 sticky top-24">
            <DashLink href="/dashboard" label="Overview" />
            <DashLink href="/dashboard/registrations" label="My Registrations" />
            <DashLink href="/dashboard/tickets" label="My Tickets" />
          </nav>
        </aside>

        <main className="flex-1 min-w-0">{children}</main>
      </div>
    </div>
  );
}

function DashLink({ href, label }: { href: string; label: string }) {
  return (
    <Link
      href={href}
      className="block px-4 py-2 text-sm text-gray-400 hover:text-white hover:bg-cobalt/5 transition-all"
    >
      {label}
    </Link>
  );
}
