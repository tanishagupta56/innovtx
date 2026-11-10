'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { createClient } from '@/lib/supabase/client';

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/events', label: 'Events' },
  { href: '/opportunities', label: 'Opportunities' },
  { href: '/resources', label: 'TechBoard' },
  { href: '/timeline', label: 'Timeline' },
  { href: '/team', label: 'Team' },
  { href: '/about', label: 'About' },
  { href: '/faq', label: 'FAQ' },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState<{ id: string } | null>(null);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    try {
      const supabase = createClient();
      supabase.auth.getUser().then(({ data }) => setUser(data?.user || null));
    } catch {
      // client error fallback
    }

    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'glass py-3' : 'bg-transparent py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        {/* Brand Wordmark Logo */}
        <Link href="/" className="font-display text-xl font-bold tracking-tight flex items-center gap-2">
          <span className="text-white">Tech</span>
          <span className="text-lime">Needs</span>
          <span className="text-[10px] font-mono text-gray-500 hidden sm:inline uppercase">
            {'// IGDTUW'}
          </span>
        </Link>

        {/* Desktop links */}
        <div className="hidden lg:flex items-center gap-6">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`text-xs font-mono uppercase tracking-wider transition-colors duration-200 ${
                pathname === link.href
                  ? 'text-lime font-bold'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              {link.label}
            </Link>
          ))}
          <button
            onClick={() => {
              const event = new KeyboardEvent('keydown', {
                key: 'k',
                ctrlKey: true,
                bubbles: true,
              });
              document.dispatchEvent(event);
            }}
            className="flex items-center gap-1.5 px-2 py-1 text-[11px] font-mono text-gray-400 border border-cobalt/25 hover:border-lime hover:text-lime transition-all"
            title="Press Ctrl+K or Cmd+K"
          >
            <span>Search</span>
            <kbd className="bg-black/60 px-1 border border-cobalt/30 text-[10px]">Ctrl+K</kbd>
          </button>
          {user ? (
            <Link href="/dashboard" className="btn-primary text-xs py-2 px-4 uppercase font-mono">
              Dashboard
            </Link>
          ) : (
            <Link href="/login" className="btn-primary text-xs py-2 px-4 uppercase font-mono">
              Sign In
            </Link>
          )}
        </div>

        {/* Mobile controls */}
        <div className="flex items-center gap-3 lg:hidden">
          <button
            onClick={() => {
              const event = new KeyboardEvent('keydown', {
                key: 'k',
                ctrlKey: true,
                bubbles: true,
              });
              document.dispatchEvent(event);
            }}
            className="p-1.5 text-xs font-mono border border-cobalt/25 text-gray-400"
          >
            ⌘K
          </button>

          <button
            onClick={() => setIsOpen(!isOpen)}
            className="relative w-8 h-8 flex flex-col justify-center items-center gap-1.5"
            aria-label="Toggle menu"
          >
            <span className={`block w-6 h-0.5 bg-white transition-all duration-300 ${isOpen ? 'rotate-45 translate-y-1' : ''}`} />
            <span className={`block w-6 h-0.5 bg-white transition-all duration-300 ${isOpen ? 'opacity-0' : ''}`} />
            <span className={`block w-6 h-0.5 bg-white transition-all duration-300 ${isOpen ? '-rotate-45 -translate-y-1' : ''}`} />
          </button>
        </div>
      </div>

      {/* Mobile drawer */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden glass mt-2 mx-4 overflow-hidden border border-cobalt/30"
          >
            <div className="p-6 flex flex-col gap-3 font-mono text-xs uppercase tracking-wider">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`py-1.5 ${
                    pathname === link.href ? 'text-lime font-bold' : 'text-gray-300'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
              <div className="border-t border-cobalt/20 pt-4 mt-2">
                {user ? (
                  <Link href="/dashboard" className="btn-primary w-full text-center py-2.5">
                    Dashboard
                  </Link>
                ) : (
                  <Link href="/login" className="btn-primary w-full text-center py-2.5">
                    Sign In
                  </Link>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
