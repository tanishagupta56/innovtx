'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { createClient } from '@/lib/supabase/client';

const navItems = [
  { href: '/', label: 'Overview' },
  { href: '/about', label: 'About' },
  { href: '/events', label: 'Events' },
  { href: '/timeline', label: '3D Timeline' },
  { href: '/mentorship', label: 'Mentorship' },
  { href: '/resources', label: 'TechBoard' },
  { href: '/team', label: 'Team' },
  { href: '/community', label: 'Community' },
  { href: '/collaborate', label: 'Partner' },
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
      setScrolled(window.scrollY > 25);
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
        scrolled ? 'py-3 bg-deep-ink/85 backdrop-blur-xl border-b border-charcoal-border shadow-2xl' : 'py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Official Brand Mark with Logo */}
        <Link
          href="/"
          className="group relative flex items-center gap-3 select-none"
        >
          <div className="relative w-9 h-9 sm:w-10 sm:h-10 flex-shrink-0">
            <Image
              src="/brand/techneeds-logo.png"
              alt="TechNeeds IGDTUW Logo"
              fill
              sizes="(max-width: 640px) 36px, 40px"
              className="object-contain group-hover:scale-105 transition-transform duration-300 drop-shadow-[0_0_12px_rgba(117,230,255,0.4)]"
              priority
            />
          </div>
          <div className="flex flex-col">
            <span className="leading-none text-soft-white tracking-tight font-extrabold text-lg sm:text-xl font-display">
              TECH<span className="text-ice-cyan">NEEDS</span>
            </span>
            <span className="font-mono text-[9px] text-slate-400 tracking-widest leading-none mt-1">
              IGDTUW // DEV ARCHITECTURE
            </span>
          </div>
        </Link>

        {/* Floating Navigation Dock (Desktop) */}
        <nav className="hidden xl:flex items-center gap-1 px-4 py-2 bg-charcoal/70 backdrop-blur-md border border-charcoal-border rounded-full shadow-[0_10px_30px_rgba(0,0,0,0.5)]">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`relative px-3.5 py-1 font-mono text-xs uppercase tracking-wider transition-all duration-200 rounded-full ${
                  isActive
                    ? 'text-deep-ink font-bold bg-ice-cyan shadow-[0_0_15px_#75E6FF]'
                    : 'text-slate-300 hover:text-soft-white hover:bg-white/5'
                }`}
              >
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
            className="hidden sm:flex items-center gap-2 px-3 py-1.5 font-mono text-xs text-slate-300 bg-charcoal/80 border border-charcoal-border hover:border-ice-cyan hover:text-ice-cyan transition-all rounded-md"
            title="Search Platform (Ctrl+K)"
          >
            <span>Search</span>
            <kbd className="px-1.5 py-0.5 bg-black/60 border border-charcoal-border text-[10px] text-ice-cyan font-mono rounded">
              ⌘K
            </kbd>
          </button>

          {/* User Sign In / Dashboard */}
          {user ? (
            <Link
              href="/dashboard"
              className="px-4 py-2 bg-electric-blue hover:bg-electric-blue-light text-soft-white font-mono text-xs font-bold uppercase tracking-wider rounded-md transition-all shadow-[0_0_15px_rgba(49,94,255,0.4)]"
            >
              Dashboard
            </Link>
          ) : (
            <Link
              href="/login"
              className="px-4 py-2 bg-ice-cyan hover:bg-cyan-300 text-deep-ink font-mono text-xs font-bold uppercase tracking-wider rounded-md transition-all shadow-[0_0_15px_rgba(117,230,255,0.35)]"
            >
              Sign In
            </Link>
          )}

          {/* Mobile Menu Toggle Button */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="xl:hidden p-2.5 bg-charcoal border border-charcoal-border text-soft-white rounded-md"
            aria-label="Toggle navigation"
          >
            <div className="w-5 h-4 flex flex-col justify-between">
              <span
                className={`w-full h-0.5 bg-white transition-all ${
                  mobileOpen ? 'rotate-45 translate-y-1.5 bg-ice-cyan' : ''
                }`}
              />
              <span
                className={`w-full h-0.5 bg-white transition-all ${
                  mobileOpen ? 'opacity-0' : ''
                }`}
              />
              <span
                className={`w-full h-0.5 bg-white transition-all ${
                  mobileOpen ? '-rotate-45 -translate-y-1.5 bg-ice-cyan' : ''
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
            className="xl:hidden mt-3 mx-2 bg-deep-ink/95 backdrop-blur-xl border border-charcoal-border rounded-xl overflow-hidden shadow-2xl"
          >
            <div className="p-6 flex flex-col gap-2 font-mono text-xs uppercase tracking-wider">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`py-2.5 px-3 rounded-md transition-all ${
                    pathname === item.href
                      ? 'bg-ice-cyan text-deep-ink font-bold'
                      : 'text-slate-300 hover:text-white hover:bg-charcoal'
                  }`}
                >
                  {item.label}
                </Link>
              ))}

              <div className="pt-4 border-t border-charcoal-border flex flex-col gap-3 mt-2">
                <button
                  onClick={triggerCmdK}
                  className="w-full text-left py-2.5 px-3 bg-charcoal border border-charcoal-border text-slate-300 flex justify-between items-center rounded-md"
                >
                  <span>Quick Palette Search</span>
                  <span className="text-ice-cyan">⌘K</span>
                </button>

                {user ? (
                  <Link href="/dashboard" className="w-full text-center py-3 bg-electric-blue text-white rounded-md font-bold">
                    Open Dashboard
                  </Link>
                ) : (
                  <Link href="/login" className="w-full text-center py-3 bg-ice-cyan text-deep-ink rounded-md font-bold">
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
