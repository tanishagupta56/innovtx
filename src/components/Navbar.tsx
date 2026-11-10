'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { createClient } from '@/lib/supabase/client';

const navItems = [
  { href: '/', label: 'Overview' },
  { href: '/timeline', label: '3D Timeline' },
  { href: '/initiatives', label: 'Initiatives' },
  { href: '/events', label: 'Events' },
  { href: '/community', label: 'Community' },
  { href: '/gallery', label: 'Vibes' },
  { href: '/collaborate', label: 'Partner' },
  { href: '/opportunities', label: 'Radar' },
];

export default function Navbar() {
  const [user, setUser] = useState<{ id: string } | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    try {
      const supabase = createClient();
      supabase.auth.getUser().then(({ data }) => setUser(data?.user || null));
    } catch {
      // ignore
    }

    const onScroll = () => {
      setScrolled(window.scrollY > 30);
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  const triggerCmdK = () => {
    const event = new KeyboardEvent('keydown', {
      key: 'k',
      ctrlKey: true,
      bubbles: true,
    });
    document.dispatchEvent(event);
  };

  return (
    <header
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 px-4 sm:px-8 ${
        scrolled ? 'py-3' : 'py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Monogram Brand Mark */}
        <Link
          href="/"
          className="group relative flex items-center gap-2.5 font-display font-black text-xl tracking-tight text-white select-none"
        >
          <span className="w-8 h-8 bg-[#0a1228] border border-cobalt/60 flex items-center justify-center font-mono text-xs text-lime group-hover:border-lime group-hover:shadow-[0_0_15px_#D4FF24] transition-all">
            TN
          </span>
          <div className="flex flex-col">
            <span className="leading-none text-white tracking-tight font-extrabold text-lg">
              TECH<span className="text-lime">NEEDS</span>
            </span>
            <span className="font-mono text-[9px] text-gray-400 tracking-widest leading-none mt-0.5">
              IGDTUW // DEV
            </span>
          </div>
        </Link>

        {/* Floating Glass Navigation Dock (Desktop) */}
        <nav className="hidden lg:flex items-center gap-1 glass-dock px-3 py-1.5 rounded-none shadow-[0_10px_30px_rgba(0,0,0,0.5)]">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`relative px-3.5 py-1.5 font-mono text-xs uppercase tracking-wider transition-all duration-200 ${
                  isActive
                    ? 'text-lime font-bold'
                    : 'text-gray-400 hover:text-white hover:bg-cobalt/15'
                }`}
              >
                {isActive && (
                  <motion.span
                    layoutId="navbar-active-pill"
                    className="absolute inset-0 border-b-2 border-lime bg-lime/5 -z-10"
                    transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                  />
                )}
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Action Tray */}
        <div className="flex items-center gap-3">
          {/* Quick Search Shortcut */}
          <button
            onClick={triggerCmdK}
            className="hidden sm:flex items-center gap-2 px-2.5 py-1.5 font-mono text-xs text-gray-400 bg-[#070b18] border border-cobalt/30 hover:border-lime hover:text-lime transition-all"
            title="Search Platform (Ctrl+K)"
          >
            <span>Search</span>
            <kbd className="px-1 py-0.2 bg-black/60 border border-cobalt/40 text-[10px] text-lime font-mono">
              ⌘K
            </kbd>
          </button>

          {/* User Sign In / Dashboard */}
          {user ? (
            <Link
              href="/dashboard"
              className="px-4 py-2 bg-cobalt hover:bg-cobalt-bright text-white font-mono text-xs font-bold uppercase tracking-wider border border-cobalt/50 transition-all shadow-[0_0_15px_rgba(21,88,201,0.4)]"
            >
              Dashboard
            </Link>
          ) : (
            <Link
              href="/login"
              className="px-4 py-2 bg-lime hover:bg-lime/90 text-midnight font-mono text-xs font-bold uppercase tracking-wider transition-all shadow-[0_0_15px_rgba(212,255,36,0.3)]"
            >
              Sign In
            </Link>
          )}

          {/* Mobile Menu Toggle Button */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="lg:hidden p-2.5 bg-[#050814] border border-cobalt/40 text-white"
            aria-label="Toggle navigation"
          >
            <div className="w-5 h-4 flex flex-col justify-between">
              <span
                className={`w-full h-0.5 bg-white transition-all ${
                  mobileOpen ? 'rotate-45 translate-y-1.5 bg-lime' : ''
                }`}
              />
              <span
                className={`w-full h-0.5 bg-white transition-all ${
                  mobileOpen ? 'opacity-0' : ''
                }`}
              />
              <span
                className={`w-full h-0.5 bg-white transition-all ${
                  mobileOpen ? '-rotate-45 -translate-y-1.5 bg-lime' : ''
                }`}
              />
            </div>
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden mt-3 mx-2 glass-dock border border-cobalt/40 overflow-hidden"
          >
            <div className="p-6 flex flex-col gap-3 font-mono text-xs uppercase tracking-wider">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`py-2 px-3 border-l-2 transition-all ${
                    pathname === item.href
                      ? 'border-lime text-lime bg-lime/5 font-bold'
                      : 'border-transparent text-gray-300 hover:text-white hover:border-cobalt'
                  }`}
                >
                  {item.label}
                </Link>
              ))}

              <div className="pt-4 border-t border-cobalt/20 flex flex-col gap-3">
                <button
                  onClick={triggerCmdK}
                  className="w-full text-left py-2 px-3 bg-[#070b18] border border-cobalt/30 text-gray-400 flex justify-between items-center"
                >
                  <span>Quick Palette Search</span>
                  <span className="text-lime">⌘K</span>
                </button>

                {user ? (
                  <Link href="/dashboard" className="btn-magnetic-cobalt w-full text-center py-3">
                    Open Dashboard
                  </Link>
                ) : (
                  <Link href="/login" className="btn-magnetic w-full text-center py-3">
                    Sign In to Portal
                  </Link>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
