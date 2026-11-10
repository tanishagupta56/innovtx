'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Command } from 'cmdk';

export default function CommandPalette() {
  const [open, setOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((prev) => !prev);
      }
    };

    document.addEventListener('keydown', down);
    return () => document.removeEventListener('keydown', down);
  }, []);

  const navigateTo = (path: string) => {
    setOpen(false);
    router.push(path);
  };

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[9999] bg-black/80 backdrop-blur-sm flex items-start justify-center pt-24 px-4"
      onClick={() => setOpen(false)}
    >
      <div
        className="w-full max-w-xl bg-[#050814] border border-cobalt/40 shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <Command label="TechNeeds Global Command Menu" className="w-full">
          <div className="border-b border-cobalt/20 px-4 py-3 flex items-center gap-3">
            <span className="text-lime font-mono text-sm">⌘</span>
            <Command.Input
              autoFocus
              placeholder="Type a page, command, or feature..."
              className="w-full bg-transparent text-sm text-white placeholder-gray-500 outline-none font-mono"
            />
            <span className="text-[10px] font-mono text-gray-500 uppercase px-1.5 py-0.5 border border-cobalt/20">
              ESC
            </span>
          </div>

          <Command.List className="max-h-72 overflow-y-auto p-2 font-mono text-xs text-gray-300">
            <Command.Empty className="py-6 text-center text-gray-500 font-mono">
              No matching commands found.
            </Command.Empty>

            <Command.Group heading="Navigation" className="text-[10px] uppercase text-gray-500 px-2 py-1.5 font-bold">
              <Command.Item
                onSelect={() => navigateTo('/')}
                className="flex items-center justify-between p-2 hover:bg-cobalt/20 hover:text-white cursor-pointer select-none"
              >
                <span>🏠 Home</span>
                <span className="text-[10px] text-gray-500">/</span>
              </Command.Item>
              <Command.Item
                onSelect={() => navigateTo('/events')}
                className="flex items-center justify-between p-2 hover:bg-cobalt/20 hover:text-white cursor-pointer select-none"
              >
                <span>⚡ Events &amp; Hackathons</span>
                <span className="text-[10px] text-gray-500">/events</span>
              </Command.Item>
              <Command.Item
                onSelect={() => navigateTo('/opportunities')}
                className="flex items-center justify-between p-2 hover:bg-cobalt/20 hover:text-white cursor-pointer select-none"
              >
                <span>💼 Opportunities &amp; Careers</span>
                <span className="text-[10px] text-gray-500">/opportunities</span>
              </Command.Item>
              <Command.Item
                onSelect={() => navigateTo('/about')}
                className="flex items-center justify-between p-2 hover:bg-cobalt/20 hover:text-white cursor-pointer select-none"
              >
                <span>ℹ️ About Society</span>
                <span className="text-[10px] text-gray-500">/about</span>
              </Command.Item>
              <Command.Item
                onSelect={() => navigateTo('/faq')}
                className="flex items-center justify-between p-2 hover:bg-cobalt/20 hover:text-white cursor-pointer select-none"
              >
                <span>❓ FAQ &amp; Support</span>
                <span className="text-[10px] text-gray-500">/faq</span>
              </Command.Item>
            </Command.Group>

            <Command.Group heading="Student Portal" className="text-[10px] uppercase text-gray-500 px-2 py-1.5 font-bold mt-2">
              <Command.Item
                onSelect={() => navigateTo('/dashboard')}
                className="flex items-center justify-between p-2 hover:bg-cobalt/20 hover:text-white cursor-pointer select-none"
              >
                <span>📊 Dashboard Overview</span>
                <span className="text-[10px] text-gray-500">/dashboard</span>
              </Command.Item>
              <Command.Item
                onSelect={() => navigateTo('/dashboard/registrations')}
                className="flex items-center justify-between p-2 hover:bg-cobalt/20 hover:text-white cursor-pointer select-none"
              >
                <span>🎟️ My Event Passes (QR)</span>
                <span className="text-[10px] text-gray-500">/dashboard/registrations</span>
              </Command.Item>
              <Command.Item
                onSelect={() => navigateTo('/dashboard/tickets')}
                className="flex items-center justify-between p-2 hover:bg-cobalt/20 hover:text-white cursor-pointer select-none"
              >
                <span>💬 My Support Tickets</span>
                <span className="text-[10px] text-gray-500">/dashboard/tickets</span>
              </Command.Item>
            </Command.Group>

            <Command.Group heading="Admin Restricted" className="text-[10px] uppercase text-gray-500 px-2 py-1.5 font-bold mt-2">
              <Command.Item
                onSelect={() => navigateTo('/admin')}
                className="flex items-center justify-between p-2 hover:bg-cobalt/20 hover:text-white cursor-pointer select-none text-lime"
              >
                <span>⚙️ Ops Console</span>
                <span className="text-[10px] text-gray-500">/admin</span>
              </Command.Item>
            </Command.Group>
          </Command.List>

          <div className="border-t border-cobalt/15 px-4 py-2 flex items-center justify-between text-[10px] font-mono text-gray-500">
            <span>TechNeeds Global QuickNav</span>
            <span>Use ↑↓ to navigate, ENTER to select</span>
          </div>
        </Command>
      </div>
    </div>
  );
}
