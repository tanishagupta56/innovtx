'use client';

import Link from 'next/link';
import { IS_DEMO_MODE } from '@/lib/mentorship/client-api';
import { resetDemoStore } from '@/lib/mentorship/demo-store';

interface PortalHeaderProps {
  user: {
    id: string;
    name: string;
    role: 'admin' | 'mentor' | 'mentee';
    email?: string;
    enrollment_no?: string;
  } | null;
  onOpenSignIn: () => void;
  onSignOut: () => void;
}

export default function PortalHeader({ user, onOpenSignIn, onSignOut }: PortalHeaderProps) {
  const getRoleTag = (role: string) => {
    switch (role) {
      case 'admin':
        return '01 // ADMIN CONSOLE';
      case 'mentor':
        return '02 // MENTOR WORKSPACE';
      case 'mentee':
        return '03 // MENTEE DASHBOARD';
      default:
        return 'CADRE PORTAL';
    }
  };

  const handleResetDemo = () => {
    if (confirm('Reset demo data to initial seed?')) {
      resetDemoStore();
      window.location.reload();
    }
  };

  return (
    <div className="p-4 sm:p-5 border border-charcoal-border bg-charcoal/80 rounded-2xl flex flex-wrap items-center justify-between gap-4">
      {/* Left: Brand/Status */}
      <div className="flex items-center gap-3 flex-wrap">
        <span className="px-2.5 py-1 text-[11px] font-mono uppercase tracking-widest bg-deep-ink border border-charcoal-border text-lime-green font-bold">
          {user ? getRoleTag(user.role) : 'PORTAL // SSSC CADRE'}
        </span>
        <span className="font-mono text-xs text-slate-400 uppercase tracking-wider hidden sm:inline">
          {user ? `VERIFIED ${user.role.toUpperCase()}` : 'COHORT PLATFORM'}
        </span>

        {IS_DEMO_MODE && (
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase bg-amber-400/20 text-amber-300 border border-amber-400/40">
              DEMO DATA
            </span>
            <button
              type="button"
              onClick={handleResetDemo}
              title="Clear user changes and restore initial seed data"
              className="px-2.5 py-0.5 text-[10px] font-mono text-slate-400 hover:text-white bg-deep-ink border border-charcoal-border hover:border-slate-400 rounded transition-all"
            >
              Reset Demo Data
            </button>
          </div>
        )}
      </div>

      {/* Right: User status or Sign In */}
      <div className="flex items-center gap-3 font-mono text-xs">
        {user ? (
          <>
            <div className="text-right hidden sm:block">
              <span className="text-soft-white font-bold block">{user.name}</span>
              <span className="text-[10px] text-slate-500 uppercase">
                {user.role === 'mentee' ? user.enrollment_no : user.email}
              </span>
            </div>

            {user.role !== 'admin' && (
              <Link
                href={`/mentorship/profile/${user.id}`}
                className="px-3 py-1.5 bg-deep-ink border border-charcoal-border hover:border-lime-green/50 text-slate-300 hover:text-white rounded-md transition-colors"
              >
                04 // AI PROFILE
              </Link>
            )}

            <button
              onClick={onSignOut}
              className="px-3.5 py-1.5 bg-deep-ink hover:bg-burnt-orange/20 border border-charcoal-border hover:border-burnt-orange/50 text-slate-400 hover:text-burnt-orange-light rounded-md transition-all font-bold uppercase"
            >
              Sign Out
            </button>
          </>
        ) : (
          <button
            onClick={onOpenSignIn}
            className="px-5 py-2 bg-electric-blue hover:bg-electric-blue-light text-soft-white rounded-md font-bold uppercase shadow-[0_0_15px_rgba(49,94,255,0.4)] transition-all flex items-center gap-2"
          >
            <span>🔐</span> Portal Sign-In →
          </button>
        )}
      </div>
    </div>
  );
}
